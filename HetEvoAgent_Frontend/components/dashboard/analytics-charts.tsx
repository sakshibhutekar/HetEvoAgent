"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { ChartCard, ChartTooltip } from "./chart-kit"
import { usePrediction } from "@/components/prediction-provider"

const axisProps = {
  stroke: "#94a3b8",
  fill: "#cbd5e1",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const

export function AnalyticsCharts() {
  const {
    prediction,
    selectedZone,
    isLoading,
    error,
  } = usePrediction()

  if (isLoading && !prediction) {
    return (
      <section aria-label="Analytics" className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-xl border bg-muted/30" />
          <div className="h-72 animate-pulse rounded-xl border bg-muted/30" />
        </div>
      </section>
    )
  }

  if (error && !prediction) {
    return (
      <section aria-label="Analytics">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Unable to load analytics data: {error}
        </div>
      </section>
    )
  }

  if (!prediction) {
    return (
      <section aria-label="Analytics">
        <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
          No analytics data available.
        </div>
      </section>
    )
  }

  const weather = prediction.weather

  /*
   * Real weather values from the backend.
   *
   * Pressure and precipitation are kept in the model
   * input cards below instead of mixing their scales
   * with temperature / humidity / wind speed.
   */
  const weatherData = weather
    ? [
      {
        parameter: "Temperature",
        value: weather.T2M,
        unit: "°C",
      },
      {
        parameter: "Humidity",
        value: weather.RH2M,
        unit: "%",
      },
      {
        parameter: "Wind Speed",
        value: weather.WS10M,
        unit: "m/s",
      },
    ]
    : []

  return (
    <section
      aria-label="Analytics"
      className="space-y-4"
    >
      {/* =================================================
          Current AQI + Weather
          ================================================= */}

      <div className="grid gap-4 lg:grid-cols-3">

        {/* Current AQI */}

        <ChartCard
          title="Current AQI"
          description={`Live prediction for ${selectedZone?.zone_name ?? "selected zone"
            }`}
          className="lg:col-span-2"
        >
          <div className="flex h-72 items-center justify-center">
            <div className="text-center">

              <p className="text-6xl font-bold tracking-tight">
                {prediction.predicted_aqi.toFixed(2)}
              </p>

              <div className="mt-4">
                <Badge className="bg-success/15 text-[color:var(--success)]">
                  {prediction.aqi_category}
                </Badge>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                AI-predicted AQI
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {selectedZone?.zone_name}
              </p>

            </div>
          </div>
        </ChartCard>


        {/* Weather Conditions */}

        <ChartCard
          title="Weather Conditions"
          description="Temperature, humidity and wind"
          delay={0.05}
        >
          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={weatherData}
                layout="vertical"
                margin={{
                  left: 10,
                  right: 20,
                  top: 20,
                  bottom: 20,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148, 163, 184, 0.15)"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  {...axisProps}
                />

                <YAxis
                  type="category"
                  dataKey="parameter"
                  {...axisProps}
                  width={85}
                />

                <Tooltip
                  content={<ChartTooltip />}
                />

                <Bar
                  dataKey="value"
                  name="Value"
                  radius={[0, 6, 6, 0]}
                  fill="#a78bfa"
                  maxBarSize={28}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* Real pressure + precipitation */}

          <div className="mt-2 grid grid-cols-2 gap-2">

            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Pressure
              </p>

              <p className="mt-1 text-sm font-semibold">
                {weather?.PS !== undefined
                  ? `${weather.PS.toFixed(2)} hPa`
                  : "—"}
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Precipitation
              </p>

              <p className="mt-1 text-sm font-semibold">
                {weather?.PRECTOTCORR !== undefined
                  ? `${weather.PRECTOTCORR.toFixed(2)} mm`
                  : "—"}
              </p>
            </div>

          </div>
        </ChartCard>

      </div>


      {/* =================================================
          Real model inputs
          ================================================= */}

      <ChartCard
        title="Model Input Parameters"
        description="Real weather values received from the backend"
        delay={0.1}
      >

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">

          <Metric
            label="Temperature"
            value={weather?.T2M}
            unit="°C"
          />

          <Metric
            label="Humidity"
            value={weather?.RH2M}
            unit="%"
          />

          <Metric
            label="Wind Speed"
            value={weather?.WS10M}
            unit="m/s"
          />

          <Metric
            label="Pressure"
            value={weather?.PS}
            unit="hPa"
          />

          <Metric
            label="Precipitation"
            value={weather?.PRECTOTCORR}
            unit="mm"
          />

        </div>

      </ChartCard>

    </section>
  )
}


/* =========================================================
   Small metric component
   ========================================================= */

function Metric({
  label,
  value,
  unit,
}: {
  label: string
  value: number | undefined
  unit: string
}) {
  return (
    <div className="rounded-xl border bg-card p-4">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <div className="mt-2 flex items-baseline gap-1">

        <span className="text-xl font-semibold">
          {value !== undefined
            ? value.toFixed(2)
            : "—"}
        </span>

        <span className="text-xs text-muted-foreground">
          {unit}
        </span>

      </div>

    </div>
  )
}