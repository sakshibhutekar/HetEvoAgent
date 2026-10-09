"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"

import {
  getZones,
  predictAQI,
  type Zone,
  type Prediction,
} from "@/lib/api"

import {
  Activity,
  CalendarDays,
  CloudRain,
  Droplets,
  Gauge,
  MapPin,
  RefreshCw,
  Thermometer,
  Wind,
  Sparkles,
  Navigation,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"


/* =========================================================
   DATE HELPERS
========================================================= */

function getTodayDate(): string {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}


function formatDate(dateString: string): string {
  if (!dateString) return ""

  const [year, month, day] = dateString
    .split("-")
    .map(Number)

  const date = new Date(year, month - 1, day)

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}


/* =========================================================
   AQI HELPERS
========================================================= */

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "#10b981"
  if (aqi <= 100) return "#84cc16"
  if (aqi <= 200) return "#f59e0b"
  if (aqi <= 300) return "#f97316"
  if (aqi <= 400) return "#ef4444"

  return "#8b5cf6"
}


function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Satisfactory"
  if (aqi <= 200) return "Moderate"
  if (aqi <= 300) return "Poor"
  if (aqi <= 400) return "Very Poor"

  return "Severe"
}


/* =========================================================
   MAIN PAGE
========================================================= */

export default function PredictionPage() {

  const [zones, setZones] = useState<Zone[]>([])

  const [selectedZone, setSelectedZone] =
    useState<Zone | null>(null)

  const [predictionDate, setPredictionDate] =
    useState<string>(getTodayDate())

  const [prediction, setPrediction] =
    useState<Prediction | null>(null)

  const [loadingZones, setLoadingZones] =
    useState(true)

  const [loadingPrediction, setLoadingPrediction] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)


  /* =========================================================
     LOAD ZONES
  ========================================================= */

  useEffect(() => {

    async function loadZones() {

      try {

        setLoadingZones(true)
        setError(null)

        const data = await getZones()

        setZones(data)

        if (data.length > 0) {
          setSelectedZone(data[0])
        }

      } catch (err) {

        console.error(
          "Failed to load zones:",
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load prediction zones."
        )

      } finally {

        setLoadingZones(false)

      }

    }

    loadZones()

  }, [])


  /* =========================================================
     GENERATE PREDICTION
  ========================================================= */

  async function handleGeneratePrediction() {

    if (!selectedZone) {

      setError(
        "Please select a prediction zone."
      )

      return
    }

    try {

      setLoadingPrediction(true)
      setError(null)
      setPrediction(null)

      const result = await predictAQI(
        selectedZone.zone_name,
        predictionDate
      )

      setPrediction(result)

    } catch (err) {

      console.error(
        "Prediction failed:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate AQI prediction."
      )

    } finally {

      setLoadingPrediction(false)

    }

  }


  /* =========================================================
     RESULT VALUES
  ========================================================= */

  const aqiValue =
    prediction?.predicted_aqi ?? null

  const aqiColor =
    aqiValue !== null
      ? getAQIColor(aqiValue)
      : "#8b5cf6"

  const aqiCategory =
    prediction?.aqi_category ??
    (
      aqiValue !== null
        ? getAQICategory(aqiValue)
        : "Awaiting prediction"
    )

  const weather =
    prediction?.weather


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <DashboardShell>

      <div className="space-y-7 pb-8">


        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">

                <Sparkles className="size-5 text-primary" />

              </div>

              <Badge
                variant="secondary"
                className="rounded-full px-3"
              >
                AI Forecast
              </Badge>

            </div>


            <h1 className="text-3xl font-semibold tracking-tight">

              AQI Predictions

            </h1>


            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">

              Generate zone-specific air quality
              forecasts using the HetEvoAgent
              prediction system.

            </p>

          </div>


          {selectedZone && (

            <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 shadow-sm">

              <MapPin className="size-4 text-primary" />

              <div>

                <p className="text-xs text-muted-foreground">
                  Active zone
                </p>

                <p className="text-sm font-medium">
                  {selectedZone.zone_name}
                </p>

              </div>

            </div>

          )}

        </div>


        {/* ================================================= */}
        {/* CONFIGURATION CARD */}
        {/* ================================================= */}

        <Card className="overflow-hidden">

          <CardHeader className="border-b bg-muted/20">

            <div className="flex items-center gap-3">

              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">

                <Gauge className="size-5 text-primary" />

              </div>

              <div>

                <CardTitle className="text-lg">
                  Prediction Configuration
                </CardTitle>

                <p className="mt-1 text-xs text-muted-foreground">

                  Choose a zone and date for the
                  AQI forecast.

                </p>

              </div>

            </div>

          </CardHeader>


          <CardContent className="p-6">

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end">


              {/* ========================================= */}
              {/* ZONE */}
              {/* ========================================= */}

              <div className="space-y-2">

                <label
                  htmlFor="prediction-zone"
                  className="text-sm font-medium"
                >
                  Prediction Zone
                </label>


                <select
                  id="prediction-zone"

                  value={
                    selectedZone?.zone_id ?? ""
                  }

                  onChange={(event) => {

                    const zone = zones.find(
                      (item) =>
                        item.zone_id ===
                        event.target.value
                    )

                    if (zone) {

                      setSelectedZone(zone)
                      setPrediction(null)
                      setError(null)

                    }

                  }}

                  disabled={loadingZones}

                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >

                  {loadingZones ? (

                    <option value="">
                      Loading zones...
                    </option>

                  ) : zones.length === 0 ? (

                    <option value="">
                      No zones available
                    </option>

                  ) : (

                    zones.map((zone) => (

                      <option
                        key={zone.zone_id}
                        value={zone.zone_id}
                      >
                        {zone.zone_name}
                      </option>

                    ))

                  )}

                </select>


                {selectedZone && (

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">

                    <span className="rounded-md bg-muted px-2 py-1 font-medium">

                      {selectedZone.zone_id}

                    </span>

                    <span>
                      {selectedZone.zone_type}
                    </span>

                  </div>

                )}

              </div>


              {/* ========================================= */}
              {/* DATE */}
              {/* ========================================= */}

              <div className="space-y-2">

                <label
                  htmlFor="prediction-date"
                  className="text-sm font-medium"
                >
                  Prediction Date
                </label>


                <div className="relative">

                  <CalendarDays
                    className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground"
                  />

                  <input
                    id="prediction-date"

                    type="date"

                    value={predictionDate}

                    onChange={(event) => {

                      setPredictionDate(
                        event.target.value
                      )

                      setPrediction(null)
                      setError(null)

                    }}

                    className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                </div>


                <p className="text-xs text-muted-foreground">

                  Forecast date:{" "}

                  <span className="font-medium text-foreground">

                    {formatDate(predictionDate)}

                  </span>

                </p>

              </div>


              {/* ========================================= */}
              {/* BUTTON */}
              {/* ========================================= */}

              <Button
                onClick={
                  handleGeneratePrediction
                }

                disabled={
                  !selectedZone ||
                  loadingPrediction ||
                  loadingZones
                }

                className="h-11 gap-2 rounded-xl px-6 lg:min-w-[190px]"
              >

                {loadingPrediction ? (

                  <>
                    <RefreshCw
                      className="size-4 animate-spin"
                    />

                    Generating...

                  </>

                ) : (

                  <>
                    <Activity className="size-4" />

                    Generate Prediction

                  </>

                )}

              </Button>

            </div>


            {/* ========================================= */}
            {/* ERROR */}
            {/* ========================================= */}

            {error && (

              <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">

                {error}

              </div>

            )}

          </CardContent>

        </Card>


        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loadingPrediction && (

          <Card>

            <CardContent className="flex min-h-[280px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">

                  <RefreshCw className="size-7 animate-spin text-primary" />

                </div>


                <h2 className="mt-5 text-lg font-semibold">

                  Generating your forecast

                </h2>


                <p className="mt-2 text-sm text-muted-foreground">

                  Processing environmental data for{" "}

                  <span className="font-medium text-foreground">

                    {selectedZone?.zone_name}

                  </span>

                </p>

              </div>

            </CardContent>

          </Card>

        )}


        {/* ================================================= */}
        {/* EMPTY STATE */}
        {/* ================================================= */}

        {!prediction &&
          !loadingPrediction &&
          !error && (

            <Card className="overflow-hidden">

              <CardContent className="flex min-h-[300px] items-center justify-center">

                <div className="max-w-lg text-center">

                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">

                    <Activity className="size-8 text-primary" />

                  </div>


                  <h2 className="mt-5 text-xl font-semibold">

                    Ready to generate a prediction

                  </h2>


                  <p className="mt-2 text-sm leading-6 text-muted-foreground">

                    Select a prediction zone and
                    forecast date above, then generate
                    an AQI prediction using HetEvoAgent.

                  </p>


                  <div className="mt-6 flex flex-wrap justify-center gap-2">

                    {zones.slice(0, 6).map((zone) => (

                      <button
                        key={zone.zone_id}

                        type="button"

                        onClick={() => {

                          setSelectedZone(zone)
                          setPrediction(null)
                          setError(null)

                        }}

                        className="rounded-full border bg-background px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:bg-primary/5"
                      >

                        {zone.zone_name}

                      </button>

                    ))}

                  </div>

                </div>

              </CardContent>

            </Card>

          )}


        {/* ================================================= */}
        {/* PREDICTION RESULT */}
        {/* ================================================= */}

        {prediction && selectedZone && (

          <div className="space-y-6">


            {/* ============================================= */}
            {/* MAIN RESULT */}
            {/* ============================================= */}

            <Card className="overflow-hidden">

              <CardHeader className="border-b bg-muted/20">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <MapPin className="size-5 text-primary" />

                      <CardTitle className="text-xl">

                        {selectedZone.zone_name}

                      </CardTitle>

                    </div>


                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">

                      <Badge
                        variant="secondary"
                        className="rounded-full"
                      >
                        {selectedZone.zone_id}
                      </Badge>

                      <span>
                        {selectedZone.zone_type}
                      </span>

                      <span>•</span>

                      <span>
                        {formatDate(predictionDate)}
                      </span>

                    </div>

                  </div>


                  <Badge
                    className="w-fit rounded-full px-4 py-1.5"
                    style={{
                      backgroundColor:
                        `${aqiColor}18`,
                      color: aqiColor,
                      borderColor:
                        `${aqiColor}40`,
                    }}
                  >
                    {aqiCategory}
                  </Badge>

                </div>

              </CardHeader>


              <CardContent className="p-6">

                <div className="grid gap-6 lg:grid-cols-[0.9fr_1.5fr]">


                  {/* ======================================= */}
                  {/* AQI SCORE */}
                  {/* ======================================= */}

                  <div
                    className="relative overflow-hidden rounded-2xl border p-7"
                    style={{
                      borderColor:
                        `${aqiColor}35`,
                      background:
                        `linear-gradient(135deg, ${aqiColor}12, transparent)`,
                    }}
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm font-medium text-muted-foreground">

                          Predicted AQI

                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">

                          Air Quality Index

                        </p>

                      </div>


                      <div
                        className="flex size-11 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor:
                            `${aqiColor}18`,
                        }}
                      >

                        <Gauge
                          className="size-5"
                          style={{
                            color: aqiColor,
                          }}
                        />

                      </div>

                    </div>


                    <div className="mt-7 flex items-end gap-3">

                      <span
                        className="text-7xl font-bold tracking-tight tabular-nums"
                        style={{
                          color: aqiColor,
                        }}
                      >

                        {aqiValue !== null
                          ? Math.round(aqiValue)
                          : "—"}

                      </span>


                      <span className="mb-2 text-sm text-muted-foreground">

                        AQI

                      </span>

                    </div>


                    <div className="mt-6">

                      <div className="mb-2 flex justify-between text-xs text-muted-foreground">

                        <span>
                          Good
                        </span>

                        <span>
                          Severe
                        </span>

                      </div>


                      <div className="h-2 overflow-hidden rounded-full bg-muted">

                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                ((aqiValue ?? 0) /
                                  500) *
                                100,
                                3
                              ),
                              100
                            )}%`,
                            backgroundColor:
                              aqiColor,
                          }}
                        />

                      </div>

                    </div>


                    <p className="mt-5 text-xs text-muted-foreground">

                      Forecast for{" "}

                      <span className="font-medium text-foreground">

                        {formatDate(predictionDate)}

                      </span>

                    </p>

                  </div>


                  {/* ======================================= */}
                  {/* WEATHER */}
                  {/* ======================================= */}

                  <div>

                    <div className="mb-4 flex items-center justify-between">

                      <div>

                        <h3 className="font-semibold">
                          Environmental Conditions
                        </h3>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Conditions associated with this forecast
                        </p>

                      </div>

                    </div>


                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                      <WeatherCard
                        icon={
                          <Thermometer className="size-4" />
                        }
                        label="Temperature"
                        value={
                          weather?.T2M !== undefined
                            ? `${weather.T2M.toFixed(1)}°C`
                            : "—"
                        }
                      />


                      <WeatherCard
                        icon={
                          <Droplets className="size-4" />
                        }
                        label="Humidity"
                        value={
                          weather?.RH2M !== undefined
                            ? `${weather.RH2M.toFixed(0)}%`
                            : "—"
                        }
                      />


                      <WeatherCard
                        icon={
                          <Wind className="size-4" />
                        }
                        label="Wind Speed"
                        value={
                          weather?.WS10M !== undefined
                            ? `${weather.WS10M.toFixed(1)} m/s`
                            : "—"
                        }
                      />


                      <WeatherCard
                        icon={
                          <Navigation className="size-4" />
                        }
                        label="Wind Direction"
                        value={
                          weather?.WD10M !== undefined
                            ? `${weather.WD10M.toFixed(0)}°`
                            : "—"
                        }
                      />


                      <WeatherCard
                        icon={
                          <CloudRain className="size-4" />
                        }
                        label="Precipitation"
                        value={
                          weather?.PRECTOTCORR !== undefined
                            ? `${weather.PRECTOTCORR.toFixed(2)} mm`
                            : "—"
                        }
                      />


                      <WeatherCard
                        icon={
                          <Gauge className="size-4" />
                        }
                        label="Pressure"
                        value={
                          weather?.PS !== undefined
                            ? `${weather.PS.toFixed(0)} hPa`
                            : "—"
                        }
                      />

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>


            {/* ============================================= */}
            {/* LOCATION DETAILS */}
            {/* ============================================= */}

            <Card>

              <CardHeader>

                <CardTitle className="text-base">

                  Prediction Details

                </CardTitle>

              </CardHeader>


              <CardContent>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                  <InfoItem
                    label="Zone ID"
                    value={selectedZone.zone_id}
                  />

                  <InfoItem
                    label="Zone Type"
                    value={selectedZone.zone_type}
                  />

                  <InfoItem
                    label="Latitude"
                    value={
                      selectedZone.latitude.toFixed(4)
                    }
                  />

                  <InfoItem
                    label="Longitude"
                    value={
                      selectedZone.longitude.toFixed(4)
                    }
                  />

                </div>

              </CardContent>

            </Card>


            {/* ============================================= */}
            {/* ABOUT */}
            {/* ============================================= */}

            <div className="flex gap-3 rounded-xl border bg-primary/5 p-4">

              <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />

              <div>

                <p className="text-sm font-medium">

                  HetEvoAgent Forecast

                </p>


                <p className="mt-1 text-xs leading-5 text-muted-foreground">

                  This prediction is generated for the
                  selected spatial zone using the
                  HetEvoAgent prediction pipeline and
                  available environmental inputs.

                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardShell>

  )
}


/* =========================================================
   WEATHER CARD
========================================================= */

function WeatherCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {

  return (

    <div className="rounded-xl border bg-card p-4 transition hover:border-primary/30">

      <div className="flex items-center gap-2 text-muted-foreground">

        <span className="text-primary">
          {icon}
        </span>

        <span className="text-xs font-medium">
          {label}
        </span>

      </div>


      <p className="mt-3 text-lg font-semibold">

        {value}

      </p>

    </div>

  )
}


/* =========================================================
   INFORMATION ITEM
========================================================= */

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string
}) {

  return (

    <div className="rounded-xl border bg-muted/20 p-4">

      <p className="text-xs text-muted-foreground">

        {label}

      </p>


      <p className="mt-1.5 text-sm font-medium">

        {value}

      </p>

    </div>

  )
}