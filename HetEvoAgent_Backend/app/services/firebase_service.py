from datetime import datetime, timezone

from firebase.firebase_config import db


class FirebaseService:

    def save_prediction(self, prediction_data):
        """
        Save an AQI prediction to Firestore.
        """

        document = {
            "zone_name": prediction_data["zone_name"],
            "zone_type": prediction_data["zone_type"],

            "latitude": prediction_data["latitude"],
            "longitude": prediction_data["longitude"],

            "predicted_aqi": prediction_data["predicted_aqi"],
            "aqi_category": prediction_data["aqi_category"],

            "weather": prediction_data["weather"],
            "weather_source": prediction_data["weather_source"],

            "zone_id": prediction_data["zone_id"],

            "prediction_date": prediction_data["prediction_date"],

            "model_version": prediction_data["model_version"],

            "source": "HetEvoAgent",

            "created_at": datetime.now(timezone.utc)
        }

        # Create a new document automatically
        doc_ref = (
            db.collection("predictions")
            .add(document)
        )

        return {
            "success": True,
            "document_id": doc_ref[1].id
        }


firebase_service = FirebaseService()