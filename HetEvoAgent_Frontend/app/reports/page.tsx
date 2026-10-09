"use client"

import { useEffect, useMemo, useState } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { getZones, predictAQI, type Prediction, type Zone } from "@/lib/api"

import {
  FileText,
  Download,
  RefreshCw,
  MapPin,
  CalendarDays,
  Gauge,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  GaugeCircle,
  CloudRain,
  Activity,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

/* -------------------------------------------------------------------------- */
/*                              DATE HELPERS                                  */
/* -------------------------------------------------------------------------- */

function getTodayDate(): string {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number)

  const date = new Date(year, month - 1, day)

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

/* -------------------------------------------------------------------------- */
/*                              AQI HELPERS                                   */
/* -------------------------------------------------------------------------- */

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "#10b981"
  if (aqi <= 100) return "#f59e0b"
  if (aqi <= 150) return "#f97316"
  if (aqi <= 200) return "#ef4444"
  if (aqi <= 300) return "#8b5cf6"

  return "#7c2d12"
}

function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Satisfactory"
  if (aqi <= 150) return "Moderate"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very Unhealthy"

  return "Hazardous"
}

/* -------------------------------------------------------------------------- */
/*                              PAGE                                          */
/* -------------------------------------------------------------------------- */

export default function ReportsPage() {
  const [zones, setZones] = useState<Zone[]>([])
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)

  const [predictionDate, setPredictionDate] =
    useState(getTodayDate())

  const [prediction, setPrediction] =
    useState<Prediction | null>(null)

  const [loadingZones, setLoadingZones] =
    useState(true)

  const [loadingPrediction, setLoadingPrediction] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  /* ---------------------------------------------------------------------- */
  /*                         LOAD ZONES                                     */
  /* ---------------------------------------------------------------------- */

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
          "Failed to load prediction zones:",
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

  /* ---------------------------------------------------------------------- */
  /*                       GENERATE REPORT                                  */
  /* ---------------------------------------------------------------------- */

  async function generateReport() {
    if (!selectedZone) {
      setError("Please select a prediction zone.")
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
        "Report generation failed:",
        err
      )

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate prediction report."
      )
    } finally {
      setLoadingPrediction(false)
    }
  }

  /* ---------------------------------------------------------------------- */
  /*                       AQI VALUES                                       */
  /* ---------------------------------------------------------------------- */

  const aqiValue =
    prediction?.predicted_aqi ?? null

  const aqiCategory = useMemo(() => {
    if (prediction?.aqi_category) {
      return prediction.aqi_category
    }

    if (aqiValue !== null) {
      return getAQICategory(aqiValue)
    }

    return "Waiting"
  }, [prediction, aqiValue])

  const weather = prediction?.weather

  /* ---------------------------------------------------------------------- */
  /*                         EXPORT CSV                                     */
  /* ---------------------------------------------------------------------- */

  function exportPredictionCSV() {
    if (!selectedZone || !prediction) {
      return
    }

    const rows = [
      [
        "Zone ID",
        "Zone Name",
        "Zone Type",
        "Prediction Date",
        "Predicted AQI",
        "AQI Category",
        "Temperature",
        "Humidity",
        "Wind Speed",
        "Wind Direction",
        "Pressure",
        "Precipitation",
        "Latitude",
        "Longitude",
      ],

      [
        selectedZone.zone_id,
        selectedZone.zone_name,
        selectedZone.zone_type,
        predictionDate,
        prediction.predicted_aqi,
        prediction.aqi_category,
        weather?.T2M ?? "",
        weather?.RH2M ?? "",
        weather?.WS10M ?? "",
        weather?.WD10M ?? "",
        weather?.PS ?? "",
        weather?.PRECTOTCORR ?? "",
        selectedZone.latitude,
        selectedZone.longitude,
      ],
    ]

    const csv = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n")

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    })

    const url = URL.createObjectURL(blob)

    const anchor = document.createElement("a")

    anchor.href = url

    anchor.download =
      `hetevoagent-report-${selectedZone.zone_id}-${predictionDate}.csv`

    document.body.appendChild(anchor)

    anchor.click()

    document.body.removeChild(anchor)

    URL.revokeObjectURL(url)
  }

  /* ---------------------------------------------------------------------- */
  /*                             RENDER                                     */
  /* ---------------------------------------------------------------------- */

  return (
    <DashboardShell>

      <div className="space-y-6">

        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}

        <div>
          <div className="flex items-center gap-3">

            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="size-6 text-primary" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                AQI Reports
              </h1>

              <p className="mt-1 text-muted-foreground">
                Generate and export zone-level HetEvoAgent prediction reports
              </p>
            </div>

          </div>
        </div>

        {/* ================================================================ */}
        {/* REPORT CONFIGURATION                                             */}
        {/* ================================================================ */}

        <Card>

          <CardHeader>

            <CardTitle className="flex items-center gap-2">
              <Gauge className="size-5 text-primary" />
              Report Configuration
            </CardTitle>

            <CardDescription>
              Select a prediction zone and date to generate a report from the HetEvoAgent backend.
            </CardDescription>

          </CardHeader>

          <CardContent>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Zone */}

              <div className="space-y-2">

                <label
                  htmlFor="report-zone"
                  className="text-sm font-medium"
                >
                  Prediction Zone
                </label>

                <select
                  id="report-zone"
                  value={selectedZone?.zone_id ?? ""}
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
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >

                  {loadingZones ? (
                    <option>
                      Loading prediction zones...
                    </option>
                  ) : (
                    zones.map((zone) => (
                      <option
                        key={zone.zone_id}
                        value={zone.zone_id}
                      >
                        {zone.zone_id} · {zone.zone_name}
                      </option>
                    ))
                  )}

                </select>

              </div>

              {/* Date */}

              <div className="space-y-2">

                <label
                  htmlFor="report-date"
                  className="text-sm font-medium"
                >
                  Prediction Date
                </label>

                <div className="relative">

                  <CalendarDays className="absolute left-3 top-3 size-4 text-muted-foreground" />

                  <input
                    id="report-date"
                    type="date"
                    value={predictionDate}
                    onChange={(event) => {
                      setPredictionDate(
                        event.target.value
                      )
                      setPrediction(null)
                    }}
                    className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm"
                  />

                </div>

              </div>

            </div>

            {/* Zone info */}

            {selectedZone && (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <InfoItem
                  label="Zone ID"
                  value={selectedZone.zone_id}
                />

                <InfoItem
                  label="Zone Type"
                  value={selectedZone.zone_type}
                />

                <InfoItem
                  label="Location"
                  value={selectedZone.zone_name}
                />

              </div>
            )}

            {/* Actions */}

            <div className="mt-5 flex flex-wrap gap-3">

              <Button
                onClick={generateReport}
                disabled={
                  loadingPrediction ||
                  loadingZones ||
                  !selectedZone
                }
                className="gap-2"
              >

                <RefreshCw
                  className={`size-4 ${loadingPrediction
                      ? "animate-spin"
                      : ""
                    }`}
                />

                {loadingPrediction
                  ? "Generating Report..."
                  : "Generate Report"}

              </Button>

              <Button
                variant="outline"
                onClick={exportPredictionCSV}
                disabled={!prediction}
                className="gap-2"
              >

                <Download className="size-4" />

                Export Prediction CSV

              </Button>

            </div>

            {/* Error */}

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            )}

          </CardContent>

        </Card>

        {/* ================================================================ */}
        {/* REPORT RESULT                                                    */}
        {/* ================================================================ */}

        {prediction && selectedZone && (

          <>

            {/* AQI SUMMARY */}

            <Card>

              <CardHeader>

                <CardTitle>
                  Prediction Report
                </CardTitle>

                <CardDescription>
                  Generated for {selectedZone.zone_name} on{" "}
                  {formatDate(predictionDate)}
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <MetricCard
                    label="Predicted AQI"
                    value={prediction.predicted_aqi.toFixed(2)}
                    icon={
                      <Gauge className="size-4" />
                    }
                    valueColor={getAQIColor(
                      prediction.predicted_aqi
                    )}
                  />

                  <MetricCard
                    label="AQI Category"
                    value={aqiCategory}
                    icon={
                      <Activity className="size-4" />
                    }
                  />

                  <MetricCard
                    label="Temperature"
                    value={
                      weather?.T2M !== undefined
                        ? `${weather.T2M.toFixed(2)}°C`
                        : "—"
                    }
                    icon={
                      <Thermometer className="size-4" />
                    }
                  />

                  <MetricCard
                    label="Humidity"
                    value={
                      weather?.RH2M !== undefined
                        ? `${weather.RH2M.toFixed(0)}%`
                        : "—"
                    }
                    icon={
                      <Droplets className="size-4" />
                    }
                  />

                </div>

              </CardContent>

            </Card>

            {/* WEATHER */}

            <Card>

              <CardHeader>

                <CardTitle>
                  Model Weather Inputs
                </CardTitle>

                <CardDescription>
                  Environmental values returned with the prediction
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  <WeatherCard
                    icon={
                      <Wind className="size-4" />
                    }
                    label="Wind Speed"
                    value={
                      weather?.WS10M !== undefined
                        ? `${weather.WS10M.toFixed(2)} m/s`
                        : "—"
                    }
                  />

                  <WeatherCard
                    icon={
                      <Compass className="size-4" />
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
                      <GaugeCircle className="size-4" />
                    }
                    label="Pressure"
                    value={
                      weather?.PS !== undefined
                        ? `${weather.PS.toFixed(0)} hPa`
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
                        ? `${weather.PRECTOTCORR.toFixed(3)} mm`
                        : "—"
                    }
                  />

                </div>

              </CardContent>

            </Card>

            {/* PREDICTION INFORMATION */}

            <Card>

              <CardHeader>

                <CardTitle>
                  Prediction Information
                </CardTitle>

              </CardHeader>

              <CardContent>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                  <InfoItem
                    label="Zone"
                    value={selectedZone.zone_name}
                  />

                  <InfoItem
                    label="Zone Type"
                    value={selectedZone.zone_type}
                  />

                  <InfoItem
                    label="Prediction Date"
                    value={formatDate(
                      predictionDate
                    )}
                  />

                  <InfoItem
                    label="Latitude"
                    value={selectedZone.latitude.toFixed(6)}
                  />

                  <InfoItem
                    label="Longitude"
                    value={selectedZone.longitude.toFixed(6)}
                  />

                  <InfoItem
                    label="AQI Category"
                    value={aqiCategory}
                  />

                </div>

              </CardContent>

            </Card>

            {/* ABOUT REPORT */}

            <Card className="border-primary/20 bg-primary/5">

              <CardContent className="pt-6">

                <div className="flex gap-3">

                  <FileText className="mt-0.5 size-5 shrink-0 text-primary" />

                  <div>

                    <h3 className="font-semibold">
                      About this report
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      This report contains the AQI prediction and
                      associated weather values returned by the
                      HetEvoAgent prediction backend for the selected
                      prediction zone and date.
                    </p>

                  </div>

                </div>

              </CardContent>

            </Card>

          </>

        )}

      </div>

    </DashboardShell>
  )
}

/* ========================================================================= */
/*                              COMPONENTS                                   */
/* ========================================================================= */

function MetricCard({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div className="rounded-xl border bg-card p-4">

      <div className="flex items-center gap-2 text-primary">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p
        className="mt-2 text-2xl font-semibold"
        style={
          valueColor
            ? { color: valueColor }
            : undefined
        }
      >
        {value}
      </p>

    </div>
  )
}

function WeatherCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border bg-card p-4">

      <div className="flex items-center gap-2 text-primary">

        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>

      </div>

      <p className="mt-2 text-lg font-semibold">
        {value}
      </p>

    </div>
  )
}

function InfoItem({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium">
        {value}
      </p>

    </div>
  )
}