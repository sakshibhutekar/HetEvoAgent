import math


def calculate_dew_point(
    temperature_c: float,
    humidity: float
) -> float:

    a = 17.27
    b = 237.7

    alpha = (
        (a * temperature_c) / (b + temperature_c)
        + math.log(humidity / 100.0)
    )

    dew_point = (
        (b * alpha)
        / (a - alpha)
    )

    return round(dew_point, 2)


def adapt_openweather_to_model(
    openweather_data: dict
) -> dict:

    temperature = openweather_data["temperature"]

    humidity = openweather_data["humidity"]

    dew_point = calculate_dew_point(
        temperature,
        humidity
    )

    return {
        "T2M": temperature,

        "T2M_MAX": openweather_data[
            "temperature_max"
        ],

        "T2M_MIN": openweather_data[
            "temperature_min"
        ],

        "RH2M": humidity,

        "WS10M": openweather_data[
            "wind_speed"
        ],

        "WD10M": openweather_data[
            "wind_direction"
        ],

        "PS": openweather_data[
            "pressure"
        ],

        "T2MDEW": dew_point
    }