"use client"

import { motion } from "framer-motion"
import {
  CloudSun,
  Droplets,
  Gauge,
  Thermometer,
  Wind,
  CloudRain,
  MapPin,
  CalendarDays,
  Navigation,
  Activity,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AlertsTimeline } from "./alerts-timeline"
import { usePrediction } from "@/components/prediction-provider"

export function RightRail() {
  const {
    selectedZone,
    prediction,
    predictionDate,
    isLoading,
    error,
  } = usePrediction()

  const weather = prediction?.weather

  /* =====================================================
     Loading state
     ===================================================== */

  if (isLoading && !prediction) {
    return (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="h-[300px] animate-pulse rounded-xl border bg-muted/30" />
        <div className="h-[250px] animate-pulse rounded-xl border bg-muted/30" />
        <div className="h-[260px] animate-pulse rounded-xl border bg-muted/30" />
      </div>
    )
  }

  /* =====================================================
     Error state
     ===================================================== */

  if (error && !prediction) {
    return (
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-destructive">
              Unable to load weather data.
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {error}
            </p>
          </CardContent>
        </Card>

        <AlertsTimeline />
      </div>
    )
  }

  /* =====================================================
     Real weather values
     ===================================================== */

  const temperature = weather?.T2M
  const humidity = weather?.RH2M
  const windSpeed = weather?.WS10M
  const windDirection = weather?.WD10M
  const pressure = weather?.PS
  const precipitation = weather?.PRECTOTCORR
  const dewPoint = weather?.T2MDEW

  return (
    <div className="flex flex-col gap-4">

      {/* =================================================
          REAL WEATHER CARD
          ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
      >
        <Card className="overflow-hidden">

          {/* Main weather section */}

          <div className="relative bg-gradient-to-br from-primary to-[color:var(--cyan)] p-5 text-primary-foreground">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm/none opacity-90">
                  {selectedZone?.zone_name ?? "Selected Zone"}
                </p>

                <p className="mt-2 text-4xl font-semibold">
                  {temperature !== undefined
                    ? `${temperature.toFixed(1)}°C`
                    : "—"}
                </p>

                <p className="mt-1 text-sm opacity-90">
                  Current weather conditions
                </p>

              </div>

              <CloudSun className="size-11 opacity-90" />

            </div>

            {/* Current weather details */}

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">

              <div className="flex items-center gap-1.5 opacity-90">
                <Droplets className="size-3.5" />
                <span>
                  Humidity{" "}
                  {humidity !== undefined
                    ? `${humidity}%`
                    : "—"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 opacity-90">
                <Wind className="size-3.5" />
                <span>
                  Wind{" "}
                  {windSpeed !== undefined
                    ? `${windSpeed.toFixed(1)} m/s`
                    : "—"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 opacity-90">
                <Gauge className="size-3.5" />
                <span>
                  Pressure{" "}
                  {pressure !== undefined
                    ? `${pressure.toFixed(0)} hPa`
                    : "—"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 opacity-90">
                <CloudRain className="size-3.5" />
                <span>
                  Rain{" "}
                  {precipitation !== undefined
                    ? `${precipitation.toFixed(2)} mm`
                    : "—"}
                </span>
              </div>

            </div>

          </div>

          {/* Weather metrics */}

          <CardContent className="grid grid-cols-2 gap-2 pt-3">

            <WeatherMetric
              icon={Thermometer}
              label="Temperature"
              value={
                temperature !== undefined
                  ? `${temperature.toFixed(2)}°C`
                  : "—"
              }
            />

            <WeatherMetric
              icon={Droplets}
              label="Humidity"
              value={
                humidity !== undefined
                  ? `${humidity}%`
                  : "—"
              }
            />

            <WeatherMetric
              icon={Wind}
              label="Wind Speed"
              value={
                windSpeed !== undefined
                  ? `${windSpeed.toFixed(2)} m/s`
                  : "—"
              }
            />

            <WeatherMetric
              icon={Gauge}
              label="Pressure"
              value={
                pressure !== undefined
                  ? `${pressure.toFixed(0)} hPa`
                  : "—"
              }
            />

          </CardContent>

        </Card>
      </motion.div>


      {/* =================================================
          QUICK STATISTICS
          ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.05,
        }}
      >
        <Card>

          <CardHeader>
            <CardTitle>
              Quick Statistics
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-2.5">

            <QuickStat
              icon={Wind}
              label="Wind Speed"
              value={
                windSpeed !== undefined
                  ? `${windSpeed.toFixed(2)} m/s`
                  : "—"
              }
            />

            <QuickStat
              icon={Droplets}
              label="Humidity"
              value={
                humidity !== undefined
                  ? `${humidity}%`
                  : "—"
              }
            />

            <QuickStat
              icon={Thermometer}
              label="Dew Point"
              value={
                dewPoint !== undefined
                  ? `${dewPoint.toFixed(2)}°C`
                  : "—"
              }
            />

            <QuickStat
              icon={CloudRain}
              label="Precipitation"
              value={
                precipitation !== undefined
                  ? `${precipitation.toFixed(2)} mm`
                  : "—"
              }
            />

          </CardContent>

        </Card>
      </motion.div>


      {/* =================================================
          PREDICTION DETAILS
          ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.1,
        }}
      >
        <Card>

          <CardHeader className="pb-3">
            <CardTitle>
              Prediction Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* Zone */}

            <div className="flex items-start gap-3">

              <div className="rounded-lg bg-primary/10 p-2">
                <MapPin className="size-4 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  Prediction Zone
                </p>

                <p className="mt-1 truncate text-sm font-semibold">
                  {selectedZone?.zone_name ?? "—"}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {selectedZone?.zone_type ?? "—"}
                </p>
              </div>

            </div>


            {/* AQI */}

            <div className="flex items-start gap-3">

              <div className="rounded-lg bg-primary/10 p-2">
                <Activity className="size-4 text-primary" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Predicted AQI
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <p className="text-xl font-bold tabular-nums">
                    {prediction?.predicted_aqi !== undefined
                      ? prediction.predicted_aqi.toFixed(2)
                      : "—"}
                  </p>

                  <span className="text-xs text-muted-foreground">
                    {prediction?.aqi_category ?? ""}
                  </span>
                </div>
              </div>

            </div>


            {/* Date */}

            <div className="flex items-start gap-3">

              <div className="rounded-lg bg-primary/10 p-2">
                <CalendarDays className="size-4 text-primary" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Prediction Date
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {predictionDate}
                </p>
              </div>

            </div>


            {/* Coordinates */}

            <div className="flex items-start gap-3">

              <div className="rounded-lg bg-primary/10 p-2">
                <Navigation className="size-4 text-primary" />
              </div>

              <div>

                <p className="text-xs text-muted-foreground">
                  Coordinates
                </p>

                <p className="mt-1 text-sm font-semibold tabular-nums">
                  {selectedZone
                    ? `${selectedZone.latitude.toFixed(4)}, ${selectedZone.longitude.toFixed(4)}`
                    : "—"}
                </p>

              </div>

            </div>


            {/* Additional model weather inputs */}

            <div className="grid grid-cols-2 gap-2 border-t pt-3">

              <div className="rounded-lg bg-muted/30 p-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Dew Point
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {dewPoint !== undefined
                    ? `${dewPoint.toFixed(2)}°C`
                    : "—"}
                </p>
              </div>

              <div className="rounded-lg bg-muted/30 p-2.5">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Wind Direction
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {windDirection !== undefined
                    ? `${windDirection.toFixed(0)}°`
                    : "—"}
                </p>
              </div>

            </div>

          </CardContent>

        </Card>
      </motion.div>


      {/* =================================================
          ALERTS / CURRENT STATUS
          ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.15,
        }}
      >
        <AlertsTimeline />
      </motion.div>

    </div>
  )
}


/* =========================================================
   Weather metric
   ========================================================= */

function WeatherMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Thermometer
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-border py-3">

      <Icon className="size-4 text-[color:var(--cyan)]" />

      <span className="text-[11px] text-muted-foreground">
        {label}
      </span>

      <span className="text-xs font-semibold">
        {value}
      </span>

    </div>
  )
}


/* =========================================================
   Quick statistic
   ========================================================= */

function QuickStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Wind
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border p-3">

      <Icon className="size-4 text-primary" />

      <p className="mt-2 text-lg font-semibold tabular-nums">
        {value}
      </p>

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

    </div>
  )
}