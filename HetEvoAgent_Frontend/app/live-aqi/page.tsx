"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LiveAqiClient } from "@/components/maps/live-aqi-client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, MapPin, Clock } from "lucide-react"

import {
  getZones,
  predictAQI,
  type Zone,
  type Prediction,
} from "@/lib/api"

function getAQIColor(aqi: number) {
  if (aqi <= 50) return "#10b981"
  if (aqi <= 100) return "#84cc16"
  if (aqi <= 200) return "#f59e0b"
  if (aqi <= 300) return "#f97316"
  if (aqi <= 400) return "#ef4444"
  return "#8b5cf6"
}

function getAQICategory(aqi: number) {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Satisfactory"
  if (aqi <= 200) return "Moderate"
  if (aqi <= 300) return "Poor"
  if (aqi <= 400) return "Very Poor"
  return "Severe"
}

function getTodayDate(): string {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export default function LiveAqiPage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [predictions, setPredictions] = useState<
    Record<string, Prediction>
  >({})

  const [loading, setLoading] = useState(true)
  const [predictionLoading, setPredictionLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const predictionDate = getTodayDate()

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)

        // Load the actual six HetEvoAgent prediction zones
        const zoneData = await getZones()

        setZones(zoneData)

        // Generate AQI prediction for every real zone
        setPredictionLoading(true)

        const results = await Promise.allSettled(
          zoneData.map(async (zone) => {
            const prediction = await predictAQI(
              zone.zone_name,
              predictionDate
            )

            return {
              zoneName: zone.zone_name,
              prediction,
            }
          })
        )

        const predictionMap: Record<string, Prediction> = {}

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            predictionMap[result.value.zoneName] =
              result.value.prediction
          }
        })

        setPredictions(predictionMap)
      } catch (err) {
        console.error("Failed to load live AQI:", err)

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load live AQI data."
        )
      } finally {
        setLoading(false)
        setPredictionLoading(false)
      }
    }

    loadData()
  }, [predictionDate])

  const predictedValues = zones
    .map((zone) => predictions[zone.zone_name]?.predicted_aqi)
    .filter(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value)
    )

  const overallAQI =
    predictedValues.length > 0
      ? Math.round(
        predictedValues.reduce(
          (sum, value) => sum + value,
          0
        ) / predictedValues.length
      )
      : null

  const overallColor =
    overallAQI !== null
      ? getAQIColor(overallAQI)
      : "#64748b"

  const overallCategory =
    overallAQI !== null
      ? getAQICategory(overallAQI)
      : "Unavailable"

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              CSN Live AQI Monitoring
            </h1>

            <p className="mt-2 text-muted-foreground">
              Real-time air quality monitoring across all
              HetEvoAgent prediction zones
            </p>
          </div>
        </div>

        {/* ===================================================== */}
        {/* OVERALL STATUS */}
        {/* ===================================================== */}

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-cyan/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="size-5 text-primary" />

              CSN City-wide AQI Status
            </CardTitle>

            <CardDescription>
              Aggregated AQI across all six HetEvoAgent
              prediction zones in Chhatrapati Sambhajinagar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-8">

              <div>
                <p
                  className="text-5xl font-bold tabular-nums"
                  style={{ color: overallColor }}
                >
                  {overallAQI ?? "—"}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Overall AQI
                </p>
              </div>

              <Badge
                className="px-4 py-2 text-sm text-white"
                style={{
                  backgroundColor: overallColor,
                }}
              >
                {overallCategory}
              </Badge>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" />

                {predictionLoading
                  ? "Updating..."
                  : "Latest prediction"}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* ===================================================== */}
        {/* LIVE MAP */}
        {/* ===================================================== */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />

              HetEvoAgent Prediction Zone Map
            </CardTitle>

            <CardDescription>
              AQI monitoring across the six defined prediction
              zones of Chhatrapati Sambhajinagar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LiveAqiClient className="h-[500px]" />
          </CardContent>
        </Card>

        {/* ===================================================== */}
        {/* ERROR */}
        {/* ===================================================== */}

        {error && (
          <Card className="border-destructive/30">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">
                Unable to load AQI data: {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* ===================================================== */}
        {/* SIX PREDICTION ZONE CARDS */}
        {/* ===================================================== */}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="animate-pulse"
              >
                <CardContent className="h-40" />
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {zones.map((zone) => {
              const prediction =
                predictions[zone.zone_name]

              const aqi =
                prediction?.predicted_aqi ?? null

              const category =
                aqi !== null
                  ? prediction?.aqi_category ??
                  getAQICategory(aqi)
                  : "Unavailable"

              const color =
                aqi !== null
                  ? getAQIColor(aqi)
                  : "#64748b"

              return (
                <Card
                  key={zone.zone_name}
                  className="transition-shadow hover:shadow-lg"
                >

                  <CardHeader className="pb-3">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <CardTitle className="text-lg">
                          {zone.zone_name}
                        </CardTitle>

                        <CardDescription className="mt-1 flex items-center gap-1">
                          <MapPin className="size-3" />

                          {zone.zone_type}
                        </CardDescription>
                      </div>

                      <Badge
                        style={{
                          backgroundColor:
                            `${color}20`,
                          color,
                        }}
                      >
                        {category}
                      </Badge>

                    </div>
                  </CardHeader>

                  <CardContent>

                    <div className="flex items-end justify-between">

                      <div>

                        <p
                          className="text-4xl font-bold tabular-nums"
                          style={{
                            color,
                          }}
                        >
                          {aqi !== null
                            ? Math.round(aqi)
                            : "—"}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Predicted AQI
                        </p>

                      </div>

                      <div className="text-right text-xs text-muted-foreground">

                        <p>
                          Zone ID:{" "}
                          {zone.zone_id ??
                            zone.zone_name}
                        </p>

                        <p>
                          Lat:{" "}
                          {zone.latitude.toFixed(4)}
                        </p>

                        <p>
                          Lng:{" "}
                          {zone.longitude.toFixed(4)}
                        </p>

                      </div>

                    </div>

                  </CardContent>
                </Card>
              )
            })}

          </div>
        )}

      </div>
    </DashboardShell>
  )
}