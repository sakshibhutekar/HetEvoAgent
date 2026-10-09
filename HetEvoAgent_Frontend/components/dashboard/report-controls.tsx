"use client"

import { useState } from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { usePrediction } from "@/components/prediction-provider"


export function ReportControls() {

  const {
    zones,
    selectedZone,
    prediction,
    isLoading,
    selectZone,
  } = usePrediction()

  const [selectedZoneName, setSelectedZoneName] =
    useState(selectedZone?.zone_name ?? "")


  /* =====================================================
     Change selected prediction zone
     ===================================================== */

  async function handleZoneChange(
    zoneName: string
  ) {

    setSelectedZoneName(zoneName)

    const zone = zones.find(
      (item) =>
        item.zone_name === zoneName
    )

    if (!zone) {
      return
    }

    await selectZone(zone)
  }


  /* =====================================================
     Export real prediction data
     ===================================================== */

  function exportReport() {

    if (!prediction || !selectedZone) {
      return
    }

    const rows = [
      [
        "Zone",
        "Zone Type",
        "Prediction Date",
        "Predicted AQI",
        "AQI Category",
        "Temperature (°C)",
        "Humidity (%)",
        "Wind Speed (m/s)",
        "Wind Direction (°)",
        "Pressure (hPa)",
        "Precipitation (mm)",
        "Dew Point (°C)",
      ],

      [
        selectedZone.zone_name,
        selectedZone.zone_type,
        new Date().toISOString().slice(0, 10),
        prediction.predicted_aqi.toFixed(2),
        prediction.aqi_category,
        prediction.weather?.T2M ?? "",
        prediction.weather?.RH2M ?? "",
        prediction.weather?.WS10M ?? "",
        prediction.weather?.WD10M ?? "",
        prediction.weather?.PS ?? "",
        prediction.weather?.PRECTOTCORR ?? "",
        prediction.weather?.T2MDEW ?? "",
      ],
    ]


    const csv = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n")


    const url = URL.createObjectURL(
      new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8",
        }
      )
    )


    const anchor =
      document.createElement("a")

    anchor.href = url

    anchor.download =
      `HetEvoAgent-${selectedZone.zone_name.replace(
        /\s+/g,
        "-"
      )}-prediction.csv`

    anchor.click()

    URL.revokeObjectURL(url)
  }


  return (

    <div className="space-y-4 rounded-lg border border-border p-4">


      {/* =================================================
          Zone selector
          ================================================= */}

      <div className="grid gap-3 md:grid-cols-2">

        <label className="space-y-1 text-sm">

          <span className="font-medium">
            Prediction Zone
          </span>


          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3"
            value={
              selectedZone?.zone_name ??
              selectedZoneName
            }
            onChange={(event) =>
              handleZoneChange(
                event.target.value
              )
            }
            disabled={isLoading}
          >

            {zones.map((zone) => (

              <option
                key={zone.zone_name}
                value={zone.zone_name}
              >
                {zone.zone_name}
              </option>

            ))}

          </select>

        </label>


        {/* =================================================
            Zone type
            ================================================= */}

        <div className="space-y-1 text-sm">

          <span className="font-medium">
            Zone Type
          </span>

          <div className="flex h-10 items-center rounded-md border border-input bg-muted/30 px-3 text-sm text-muted-foreground">

            {selectedZone?.zone_type ??
              "—"}

          </div>

        </div>

      </div>


      {/* =================================================
          Prediction summary
          ================================================= */}

      {!prediction ? (

        <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">

          No prediction is currently available.

        </div>

      ) : (

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">


          <ReportMetric
            label="Predicted AQI"
            value={prediction.predicted_aqi.toFixed(2)}
          />


          <ReportMetric
            label="AQI Category"
            value={prediction.aqi_category}
          />


          <ReportMetric
            label="Temperature"
            value={
              prediction.weather
                ? `${prediction.weather.T2M.toFixed(2)}°C`
                : "—"
            }
          />


          <ReportMetric
            label="Humidity"
            value={
              prediction.weather
                ? `${prediction.weather.RH2M}%`
                : "—"
            }
          />

        </div>

      )}


      {/* =================================================
          Available real model inputs
          ================================================= */}

      {prediction?.weather && (

        <div>

          <p className="mb-2 text-sm font-medium">
            Model Weather Inputs
          </p>


          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">

            <SmallMetric
              label="Wind Speed"
              value={`${prediction.weather.WS10M.toFixed(2)} m/s`}
            />

            <SmallMetric
              label="Wind Direction"
              value={`${prediction.weather.WD10M.toFixed(0)}°`}
            />

            <SmallMetric
              label="Pressure"
              value={`${prediction.weather.PS.toFixed(0)} hPa`}
            />

            <SmallMetric
              label="Precipitation"
              value={`${prediction.weather.PRECTOTCORR.toFixed(3)} mm`}
            />

            <SmallMetric
              label="Dew Point"
              value={`${prediction.weather.T2MDEW.toFixed(2)}°C`}
            />

            <SmallMetric
              label="Maximum Temperature"
              value={`${prediction.weather.T2M_MAX.toFixed(2)}°C`}
            />

            <SmallMetric
              label="Minimum Temperature"
              value={`${prediction.weather.T2M_MIN.toFixed(2)}°C`}
            />

          </div>

        </div>

      )}


      {/* =================================================
          Export
          ================================================= */}

      <div className="flex flex-wrap gap-2">

        <Button
          variant="outline"
          className="gap-2"
          onClick={exportReport}
          disabled={!prediction || isLoading}
        >

          <Download className="size-4" />

          Export Prediction CSV

        </Button>

      </div>


      {/* =================================================
          Data note
          ================================================= */}

      <p className="text-xs leading-relaxed text-muted-foreground">

        This report contains prediction and weather
        values returned by the HetEvoAgent backend.
        Pollutant measurements such as PM2.5, PM10 and
        NO₂ are not displayed unless they are provided by
        the connected data source.

      </p>

    </div>
  )
}


/* =========================================================
   Report metric
   ========================================================= */

function ReportMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {

  return (

    <div className="rounded-xl border border-border p-3">

      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold">
        {value}
      </p>

    </div>
  )
}


/* =========================================================
   Small metric
   ========================================================= */

function SmallMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {

  return (

    <div className="rounded-lg border border-border bg-muted/20 p-3">

      <p className="text-[11px] text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>

    </div>
  )
}