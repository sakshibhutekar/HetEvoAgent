const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export interface Zone {
  zone_name: string
  zone_type: string
  latitude: number
  longitude: number
}

export interface WeatherInput {
  T2M: number
  T2M_MAX: number
  T2M_MIN: number
  RH2M: number
  WS10M: number
  WD10M: number
  PRECTOTCORR: number
  PS: number
  T2MDEW: number
}

export interface Prediction {
  zone_id: string
  zone_name: string
  zone_type: string
  latitude: number
  longitude: number
  predicted_aqi: number
  aqi_category: string
  weather?: WeatherInput
  weather_source?: {
    temperature: string
    humidity: string
    wind: string
    pressure: string
    dew_point: string
    precipitation: string
  }
}

export async function getZones(): Promise<Zone[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/zones/`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch zones")
  }

  const data = await response.json()
  return data.zones
}

export async function predictAQI(
  zoneName: string,
  date: string,
  distanceKm = 0
): Promise<Prediction> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/predictions/predict`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        zone_name: zoneName,
        date: date,
        distance_km: distanceKm,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Prediction failed: ${error}`)
  }

  const data = await response.json()

  return data.prediction
}