"use client"

import { Activity, Droplets, Gauge, Thermometer, Wind, CloudRain, Navigation } from "lucide-react"

import { usePrediction } from "@/components/prediction-provider"

export function KpiCards() {
  const {
    prediction,
    selectedZone,
    isLoading,
    error,
  } = usePrediction()

  if (isLoading && !prediction) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl border bg-muted/30"
          />
        ))}
      </div>
    )
  }

  if (error && !prediction) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Unable to load real-time AQI data: {error}
      </div>
    )
  }

  if (!prediction) {
    return (
      <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        No AQI prediction available.
      </div>
    )
  }

  const weather = prediction.weather

  const cards = [
    {
      title: "Predicted AQI",
      value: prediction.predicted_aqi.toFixed(2),
      unit: "",
      icon: Activity,
    },
    {
      title: "AQI Category",
      value: prediction.aqi_category,
      unit: "",
      icon: Gauge,
    },
    {
      title: "Temperature",
      value: weather?.T2M ?? "—",
      unit: "°C",
      icon: Thermometer,
    },
    {
      title: "Humidity",
      value: weather?.RH2M ?? "—",
      unit: "%",
      icon: Droplets,
    },
    {
      title: "Wind Speed",
      value: weather?.WS10M ?? "—",
      unit: "m/s",
      icon: Wind,
    },
    {
      title: "Pressure",
      value: weather?.PS ?? "—",
      unit: "hPa",
      icon: Gauge,
    },
    {
      title: "Precipitation",
      value: weather?.PRECTOTCORR ?? "—",
      unit: "mm",
      icon: CloudRain,
    },
  ]

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground">
        {selectedZone?.zone_name}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {card.title}
                </span>

                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-semibold">
                  {card.value}
                </span>

                {card.unit && (
                  <span className="text-sm text-muted-foreground">
                    {card.unit}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}