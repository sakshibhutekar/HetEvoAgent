from typing import Optional

from pydantic import BaseModel, Field


class WeatherInput(BaseModel):
    T2M: float
    T2M_MAX: float
    T2M_MIN: float
    RH2M: float
    WS10M: float
    WD10M: float
    PRECTOTCORR: float
    PS: float
    T2MDEW: float


class PredictionRequest(BaseModel):
    zone_name: str
    date: str

    # Manual weather input remains optional.
    # If omitted, the backend will fetch weather automatically.
    weather: Optional[WeatherInput] = None

    distance_km: float = Field(
        default=0.0,
        ge=0
    )