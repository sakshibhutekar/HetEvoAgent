"use client"

import { useEffect } from "react"
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet"
import L from "leaflet"

import "leaflet/dist/leaflet.css"

import type { Zone } from "@/lib/api"
import { usePrediction } from "@/components/prediction-provider"


/* =========================================================
   Leaflet marker
   ========================================================= */

const markerIcon = new L.Icon({
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})


/* =========================================================
   Fit map around all zones
   ========================================================= */

function FitBounds({
    zones,
}: {
    zones: Zone[]
}) {
    const map = useMap()

    useEffect(() => {
        if (zones.length === 0) return

        const bounds = L.latLngBounds(
            zones.map((zone) => [
                zone.latitude,
                zone.longitude,
            ])
        )

        map.fitBounds(bounds, {
            padding: [40, 40],
        })
    }, [zones, map])

    return null
}


/* =========================================================
   Date formatting
   ========================================================= */

function formatDisplayDate(
    dateString: string
): string {
    const [year, month, day] =
        dateString.split("-").map(Number)

    const date = new Date(
        year,
        month - 1,
        day
    )

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    )
}


/* =========================================================
   AQI category styling
   ========================================================= */

function getAQIClass(
    category: string
) {
    switch (category) {
        case "Good":
            return "bg-green-100 text-green-700"

        case "Satisfactory":
            return "bg-blue-100 text-blue-700"

        case "Moderate":
            return "bg-yellow-100 text-yellow-700"

        case "Poor":
            return "bg-orange-100 text-orange-700"

        case "Very Poor":
            return "bg-red-100 text-red-700"

        case "Severe":
            return "bg-purple-100 text-purple-700"

        default:
            return "bg-gray-100 text-gray-700"
    }
}


/* =========================================================
   Main HetEvoAgent map

   IMPORTANT:

   The map uses PredictionProvider.

   When a user selects a zone:

       Map
        ↓
   selectZone()
        ↓
   PredictionProvider
        ↓
   FastAPI prediction
        ↓
   KPI Cards

   Therefore the map and KPI cards use the
   same selected zone and prediction.
   ========================================================= */

export default function HetEvoZoneMap() {

    const {
        zones,
        selectedZone,
        prediction,
        isLoading,
        error,
        predictionDate,
        selectZone,
    } = usePrediction()


    /* =======================================================
       Loading
       ======================================================= */

    if (
        isLoading &&
        zones.length === 0
    ) {
        return (
            <div className="flex h-[500px] items-center justify-center rounded-2xl border bg-white">
                <p className="text-sm text-gray-500">
                    Loading prediction zones...
                </p>
            </div>
        )
    }


    /* =======================================================
       Error
       ======================================================= */

    if (
        error &&
        zones.length === 0
    ) {
        return (
            <div className="flex h-[500px] items-center justify-center rounded-2xl border bg-white">
                <p className="text-sm text-red-500">
                    {error}
                </p>
            </div>
        )
    }


    return (
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">


            {/* ===================================================
          Prediction zone counter
          =================================================== */}

            <div className="absolute left-4 top-4 z-[1000] rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">

                <span className="mr-2">
                    ⊙
                </span>

                {zones.length} Prediction Zones

            </div>


            {/* ===================================================
          Leaflet map
          =================================================== */}

            <MapContainer

                center={[
                    19.876,
                    75.342,
                ]}

                zoom={12}

                scrollWheelZoom={true}

                className="h-[500px] w-full"

            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                <FitBounds
                    zones={zones}
                />


                {/* =================================================
            Real prediction zones
            ================================================= */}

                {zones.map((zone) => {

                    const isSelected =
                        selectedZone?.zone_name ===
                        zone.zone_name


                    return (
                        <Marker

                            key={zone.zone_name}

                            position={[
                                zone.latitude,
                                zone.longitude,
                            ]}

                            icon={markerIcon}

                        >

                            <Popup>

                                <div className="min-w-[270px]">


                                    {/* ========================================
                      Zone name
                      ======================================== */}

                                    <h3 className="mb-3 text-lg font-bold text-gray-900">
                                        {zone.zone_name}
                                    </h3>


                                    {/* ========================================
                      Zone information
                      ======================================== */}

                                    <div className="space-y-1 text-sm">

                                        <p>
                                            <strong>
                                                Type:
                                            </strong>{" "}
                                            {zone.zone_type}
                                        </p>

                                        <p>
                                            <strong>
                                                Latitude:
                                            </strong>{" "}
                                            {zone.latitude}
                                        </p>

                                        <p>
                                            <strong>
                                                Longitude:
                                            </strong>{" "}
                                            {zone.longitude}
                                        </p>

                                    </div>


                                    <div className="my-4 border-t" />


                                    {/* ========================================
                      SELECTED ZONE + PREDICTION
                      ======================================== */}

                                    {isSelected && prediction ? (

                                        <div className="space-y-3">


                                            {/* ==================================
                          AQI
                          ================================== */}

                                            <div>

                                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                                    Predicted AQI
                                                </p>

                                                <div className="mt-1 flex items-center gap-3">

                                                    <span className="text-3xl font-bold text-gray-900">

                                                        {prediction.predicted_aqi.toFixed(
                                                            2
                                                        )}

                                                    </span>


                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getAQIClass(
                                                            prediction.aqi_category
                                                        )}`}
                                                    >
                                                        {prediction.aqi_category}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* ==================================
                          Weather
                          ================================== */}

                                            {prediction.weather && (

                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">


                                                    <div>
                                                        🌡️{" "}
                                                        {prediction.weather.T2M.toFixed(
                                                            1
                                                        )}
                                                        °C
                                                    </div>


                                                    <div>
                                                        💧{" "}
                                                        {prediction.weather.RH2M}
                                                        % humidity
                                                    </div>


                                                    <div>
                                                        💨{" "}
                                                        {prediction.weather.WS10M.toFixed(
                                                            1
                                                        )}
                                                        {" "}m/s
                                                    </div>


                                                    <div>
                                                        🧭{" "}
                                                        {prediction.weather.WD10M.toFixed(
                                                            0
                                                        )}
                                                        °
                                                    </div>


                                                    <div>
                                                        🌧️{" "}
                                                        {prediction.weather.PRECTOTCORR.toFixed(
                                                            2
                                                        )}
                                                        {" "}mm
                                                    </div>


                                                    <div>
                                                        🧭{" "}
                                                        {prediction.weather.PS.toFixed(
                                                            0
                                                        )}
                                                        {" "}hPa
                                                    </div>

                                                </div>

                                            )}


                                            {/* ==================================
                          Date
                          ================================== */}

                                            <p className="text-[11px] text-gray-400">

                                                Prediction date:{" "}

                                                {formatDisplayDate(
                                                    predictionDate
                                                )}

                                            </p>


                                            {/* ==================================
                          Sync confirmation
                          ================================== */}

                                            <p className="text-[11px] font-medium text-purple-600">

                                                ✓ Dashboard data synced with this zone

                                            </p>

                                        </div>

                                    ) : (

                                        /* ======================================
                                           ZONE NOT SELECTED
                                           ====================================== */

                                        <div>

                                            <p className="mb-3 text-xs text-gray-500">

                                                Select this zone to update the
                                                dashboard AQI and weather data.

                                            </p>


                                            <button

                                                type="button"

                                                onClick={() =>
                                                    selectZone(zone)
                                                }

                                                disabled={isLoading}

                                                className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"

                                            >

                                                {isLoading
                                                    ? "Generating AQI..."
                                                    : "Use This Zone"}

                                            </button>

                                        </div>

                                    )}

                                </div>

                            </Popup>

                        </Marker>
                    )
                })}

            </MapContainer>

        </div>
    )
}