import pandas as pd

from app.services.model_service import model_service
from app.services.zone_service import zone_service
from app.services.weather_service import weather_service
from app.services.firebase_service import firebase_service

from app.utils.feature_engineering import create_model_features
from app.utils.aqi_utils import get_aqi_category


class PredictionService:

    def __init__(self):

        self.model_service = model_service


    def predict(self, request):

        # ==================================================
        # 1. Find the requested zone
        # ==================================================

        zone = zone_service.get_zone(
            request.zone_name
        )

        if zone is None:

            raise ValueError(
                f"Zone not found: {request.zone_name}"
            )


        latitude = zone["latitude"]

        longitude = zone["longitude"]


        # ==================================================
        # 2. Get weather
        # ==================================================

        if request.weather is not None:

            # ----------------------------------------------
            # Manual weather supplied by caller
            # ----------------------------------------------

            weather_data = (
                request.weather.model_dump()
            )

            weather_source = "manual"


        else:

            # ----------------------------------------------
            # Automatically collect weather
            # ----------------------------------------------

            weather_result = (
                weather_service
                .get_weather_for_prediction(
                    latitude=latitude,
                    longitude=longitude,
                    date=request.date
                )
            )

            weather_data = (
                weather_result["weather"]
            )

            weather_source = (
                weather_result["sources"]
            )


        # ==================================================
        # 3. Create model features
        # ==================================================

        features = create_model_features(

            weather_data=weather_data,

            latitude=latitude,

            longitude=longitude,

            distance_km=request.distance_km,

            date_value=request.date
        )


        # ==================================================
        # 4. Verify required model features
        # ==================================================

        required_features = (
            self.model_service
            .get_features()
        )


        missing_features = [

            feature

            for feature in required_features

            if feature not in features

        ]


        if missing_features:

            raise ValueError(

                f"Missing model features: "
                f"{missing_features}"

            )


        # ==================================================
        # 5. Arrange features in model order
        # ==================================================

        features_df = pd.DataFrame(

            [

                [

                    features[feature]

                    for feature in required_features

                ]

            ],

            columns=required_features

        )


        # ==================================================
        # 6. Predict AQI
        # ==================================================

        prediction = (

            self.model_service
            .predict(features_df)

        )


        predicted_aqi = round(

            float(prediction[0]),

            2

        )


        # ==================================================
        # 7. Determine AQI category
        # ==================================================

        aqi_category = get_aqi_category(

            predicted_aqi

        )


        # ==================================================
        # 8. Prepare prediction result
        # ==================================================

        result = {

    # Zone information
    "zone_id": zone["zone_id"],
    "zone_name": zone["zone_name"],
    "zone_type": zone["zone_type"],

    # Location
    "latitude": latitude,
    "longitude": longitude,

    # Prediction
    "predicted_aqi": predicted_aqi,

    "aqi_category": aqi_category,

    # Prediction metadata
    "prediction_date": request.date,

    "model_version": (
        self.model_service
        .get_model_version()
    ),

    # Input information
    "weather": weather_data,

    "weather_source": weather_source
        }
        # ==================================================
        # 9. Save prediction to Firebase
        # ==================================================

        try:

            firebase_result = (
                firebase_service
                .save_prediction(result)
            )

            print(
                "Firebase prediction saved:",
                firebase_result["document_id"]
            )


        except Exception as e:

            # Firebase failure should NOT
            # stop the AQI prediction.

            print(
                f"Firebase save failed: {e}"
            )


        # ==================================================
        # 10. Return prediction result
        # ==================================================

        return result


# ======================================================
# Prediction service instance
# ======================================================

prediction_service = PredictionService()