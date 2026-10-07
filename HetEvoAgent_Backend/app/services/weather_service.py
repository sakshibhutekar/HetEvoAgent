from datetime import datetime

from app.integrations.api_collector import openweather_collector
from app.integrations.era5_collector import era5_collector
from app.utils.weather_adapter import adapt_openweather_to_model


class WeatherService:

    def get_weather_for_prediction(
        self,
        latitude: float,
        longitude: float,
        date: str
    ):

        # ==================================================
        # 1. Get CURRENT weather from OpenWeather
        # ==================================================

        openweather_data = (
            openweather_collector.get_current_weather(
                latitude,
                longitude
            )
        )

        openweather_features = (
            adapt_openweather_to_model(
                openweather_data
            )
        )

        # ==================================================
        # 2. Convert requested date to Python date object
        # ==================================================

        try:
            requested_date = datetime.strptime(
                date,
                "%Y-%m-%d"
            ).date()

        except ValueError:
            raise ValueError(
                f"Invalid date format: {date}. "
                f"Expected YYYY-MM-DD."
            )

        # ==================================================
        # 3. Get latest ERA5 date available
        # ==================================================

        latest_era5_date = (
            era5_collector.get_available_date()
        )

        # Convert ERA5 date to Python date object
        # if necessary.

        if isinstance(
            latest_era5_date,
            datetime
        ):
            latest_era5_date = (
                latest_era5_date.date()
            )

        elif isinstance(
            latest_era5_date,
            str
        ):
            latest_era5_date = datetime.strptime(
                latest_era5_date,
                "%Y-%m-%d"
            ).date()

        # ==================================================
        # 4. Select ERA5 date
        # ==================================================

        if requested_date > latest_era5_date:

            era5_date = latest_era5_date

            print(
                f"[WARNING] Requested ERA5 date "
                f"{requested_date.isoformat()} "
                f"is not available yet."
            )

            print(
                f"[INFO] Using latest available ERA5 date: "
                f"{era5_date.isoformat()}"
            )

        else:

            era5_date = requested_date

        # ==================================================
        # 5. Fetch ERA5 weather
        # ==================================================

        era5_features = (
            era5_collector.fetch_daily_weather(
                latitude=latitude,
                longitude=longitude,
                date=era5_date.isoformat()
            )
        )

        # ==================================================
        # 6. Combine OpenWeather + ERA5
        # ==================================================

        weather = {

            # OpenWeather
            "T2M":
                openweather_features["T2M"],

            "T2M_MAX":
                openweather_features["T2M_MAX"],

            "T2M_MIN":
                openweather_features["T2M_MIN"],

            "RH2M":
                openweather_features["RH2M"],

            "WS10M":
                openweather_features["WS10M"],

            "WD10M":
                openweather_features["WD10M"],

            "PS":
                openweather_features["PS"],

            # ERA5
            "PRECTOTCORR":
                era5_features["PRECTOTCORR"],

            "T2MDEW":
                era5_features["T2MDEW"],
        }

        # ==================================================
        # 7. Return weather information
        # ==================================================

        return {

            "weather": weather,

            "sources": {

                "temperature":
                    "OpenWeather",

                "temperature_max":
                    "OpenWeather",

                "temperature_min":
                    "OpenWeather",

                "humidity":
                    "OpenWeather",

                "wind":
                    "OpenWeather",

                "pressure":
                    "OpenWeather",

                "dew_point":
                    f"ERA5 ({era5_date.isoformat()})",

                "precipitation":
                    f"ERA5 ({era5_date.isoformat()})",
            },

            "era5_requested_date":
                requested_date.isoformat(),

            "era5_used_date":
                era5_date.isoformat(),

            "era5_latest_available_date":
                latest_era5_date.isoformat()
        }


weather_service = WeatherService()