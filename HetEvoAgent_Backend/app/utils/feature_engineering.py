import math
from datetime import datetime


def create_temporal_features(date_value):
    """
    Create the same temporal features used during model training.
    """

    if isinstance(date_value, str):
        date_value = datetime.fromisoformat(date_value)

    year = date_value.year
    month = date_value.month
    day = date_value.day
    day_of_week = date_value.weekday()
    day_of_year = date_value.timetuple().tm_yday

    return {
        "year": year,
        "month": month,
        "day": day,
        "day_of_week": day_of_week,
        "day_of_year": day_of_year,

        "month_sin": math.sin(
            2 * math.pi * month / 12
        ),

        "month_cos": math.cos(
            2 * math.pi * month / 12
        ),

        "day_of_year_sin": math.sin(
            2 * math.pi * day_of_year / 365
        ),

        "day_of_year_cos": math.cos(
            2 * math.pi * day_of_year / 365
        )
    }


def create_model_features(
    weather_data,
    latitude,
    longitude,
    distance_km,
    date_value
):
    """
    Combine weather, temporal and spatial
    features required by the AQI model.
    """

    temporal_features = create_temporal_features(date_value)

    features = {
        "T2M": weather_data["T2M"],
        "T2M_MAX": weather_data["T2M_MAX"],
        "T2M_MIN": weather_data["T2M_MIN"],
        "RH2M": weather_data["RH2M"],
        "WS10M": weather_data["WS10M"],
        "WD10M": weather_data["WD10M"],
        "PRECTOTCORR": weather_data["PRECTOTCORR"],
        "PS": weather_data["PS"],
        "T2MDEW": weather_data["T2MDEW"],

        **temporal_features,

        "latitude": latitude,
        "longitude": longitude,
        "distance_km": distance_km
    }

    return features