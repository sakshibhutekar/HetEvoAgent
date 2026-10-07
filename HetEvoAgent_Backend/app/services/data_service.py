from datetime import datetime


class DataService:
    """
    Handles weather/data retrieval for AQI prediction.

    The live API collector from the teammate will be
    connected here later.
    """

    def __init__(self):
        pass

    def get_weather(self, latitude: float, longitude: float, date: str):
        """
        Return weather data required by the AQI model.

        This is a temporary interface.
        The teammate's API collector will provide the
        actual values.
        """

        raise NotImplementedError(
            "Live weather API collector has not been connected yet."
        )


data_service = DataService()