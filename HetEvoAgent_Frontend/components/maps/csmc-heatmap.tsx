"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.heat"

import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Layers,
  Thermometer,
  Maximize2,
  Minimize2,
  MapPin,
} from "lucide-react"

/* -------------------------------------------------------------------------- */
/*                              PROJECT ZONES                                 */
/* -------------------------------------------------------------------------- */

interface ProjectZone {
  zone_id: string
  zone_name: string
  zone_type: string
  latitude: number
  longitude: number
  aqi: number
  pm25: number
  pm10: number
  temperature: number
  humidity: number
  windSpeed: number
}

const PROJECT_ZONES: ProjectZone[] = [
  {
    zone_id: "Z1",
    zone_name: "Chikalthana MIDC",
    zone_type: "Industrial",
    latitude: 19.864981,
    longitude: 75.411001,
    aqi: 142,
    pm25: 68,
    pm10: 96,
    temperature: 31,
    humidity: 64,
    windSpeed: 12,
  },
  {
    zone_id: "Z2",
    zone_name: "Waluj / More Chowk",
    zone_type: "Industrial + Urban",
    latitude: 19.84093,
    longitude: 75.24189,
    aqi: 178,
    pm25: 86,
    pm10: 121,
    temperature: 32,
    humidity: 61,
    windSpeed: 10,
  },
  {
    zone_id: "Z3",
    zone_name: "Gulmandi / Central City",
    zone_type: "Commercial",
    latitude: 19.885817,
    longitude: 75.331858,
    aqi: 126,
    pm25: 59,
    pm10: 87,
    temperature: 30,
    humidity: 67,
    windSpeed: 13,
  },
  {
    zone_id: "Z4",
    zone_name: "CIDCO",
    zone_type: "Residential + Urban",
    latitude: 19.892808,
    longitude: 75.363114,
    aqi: 96,
    pm25: 44,
    pm10: 68,
    temperature: 29,
    humidity: 70,
    windSpeed: 15,
  },
  {
    zone_id: "Z5",
    zone_name: "Shendra",
    zone_type: "Industrial + Developing",
    latitude: 19.873282,
    longitude: 75.491805,
    aqi: 165,
    pm25: 79,
    pm10: 113,
    temperature: 32,
    humidity: 62,
    windSpeed: 11,
  },
  {
    zone_id: "Z6",
    zone_name: "Deolai",
    zone_type: "Peripheral Residential",
    latitude: 19.842209,
    longitude: 75.365579,
    aqi: 82,
    pm25: 37,
    pm10: 59,
    temperature: 28,
    humidity: 73,
    windSpeed: 16,
  },
]

/* -------------------------------------------------------------------------- */
/*                              AQI HELPERS                                   */
/* -------------------------------------------------------------------------- */

function getAQIColor(aqi: number) {
  if (aqi <= 50) return "#10B981"
  if (aqi <= 100) return "#F59E0B"
  if (aqi <= 150) return "#F97316"
  if (aqi <= 200) return "#EF4444"
  if (aqi <= 300) return "#8B5CF6"
  return "#7C2D12"
}

function getAQICategory(aqi: number) {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Satisfactory"
  if (aqi <= 150) return "Moderate"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very Unhealthy"
  return "Hazardous"
}

function getMetricValue(zone: ProjectZone, metric: "aqi" | "pm25" | "pm10") {
  if (metric === "pm25") return zone.pm25
  if (metric === "pm10") return zone.pm10
  return zone.aqi
}

/* -------------------------------------------------------------------------- */
/*                              MAP BOUNDS                                    */
/* -------------------------------------------------------------------------- */

function MapBounds() {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds(
      PROJECT_ZONES.map((zone) => [zone.latitude, zone.longitude] as [number, number])
    )

    map.fitBounds(bounds.pad(0.15))
  }, [map])

  return null
}

/* -------------------------------------------------------------------------- */
/*                              HEATMAP LAYER                                 */
/* -------------------------------------------------------------------------- */

function HeatmapLayer({
  points,
  options,
}: {
  points: [number, number, number][]
  options: any
}) {
  const map = useMap()
  const heatLayerRef = useRef<any>(null)

  useEffect(() => {
    if (!map || !(L as any).heatLayer) return

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current)
      heatLayerRef.current = null
    }

    const heatLayer = (L as any).heatLayer(points, options)

    heatLayer.addTo(map)
    heatLayerRef.current = heatLayer

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current)
        heatLayerRef.current = null
      }
    }
  }, [map, points, options])

  return null
}

/* -------------------------------------------------------------------------- */
/*                           ZONE BOUNDARY LAYER                              */
/* -------------------------------------------------------------------------- */

function ZoneBoundary({
  zone,
  selected,
  onSelect,
}: {
  zone: ProjectZone
  selected: boolean
  onSelect: () => void
}) {
  const color = getAQIColor(zone.aqi)

  /*
   * These are visualization boundaries around the project-zone coordinate.
   * They are intentionally not presented as official administrative
   * boundaries because the current dataset contains zone center coordinates,
   * not GeoJSON polygons for Z1-Z6.
   */
  return (
    <>
      <Circle
        center={[zone.latitude, zone.longitude]}
        radius={selected ? 1500 : 1200}
        pathOptions={{
          color: selected ? "#FFFFFF" : color,
          weight: selected ? 3 : 2,
          opacity: 1,
          fillColor: color,
          fillOpacity: 0.08,
        }}
        eventHandlers={{
          click: onSelect,
        }}
      />

      <CircleMarker
        center={[zone.latitude, zone.longitude]}
        radius={selected ? 9 : 6}
        pathOptions={{
          color: "#FFFFFF",
          weight: 2,
          fillColor: color,
          fillOpacity: 1,
        }}
        eventHandlers={{
          click: onSelect,
        }}
      >
        <Tooltip
          direction="top"
          offset={[0, -8]}
          permanent
          className="zone-label"
        >
          <strong>{zone.zone_id}</strong> · {zone.zone_name}
        </Tooltip>

        <Popup>
          <div className="min-w-[220px]">
            <div className="mb-2">
              <div className="text-xs font-semibold text-gray-500">
                {zone.zone_id}
              </div>

              <div className="text-base font-bold">
                {zone.zone_name}
              </div>

              <div className="text-xs text-gray-500">
                {zone.zone_type}
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="text-xs text-gray-500">Current AQI</div>

              <div
                className="text-3xl font-bold"
                style={{ color }}
              >
                {zone.aqi}
              </div>

              <div className="text-sm font-medium">
                {getAQICategory(zone.aqi)}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">PM2.5</span>
                <div className="font-semibold">{zone.pm25}</div>
              </div>

              <div>
                <span className="text-gray-500">PM10</span>
                <div className="font-semibold">{zone.pm10}</div>
              </div>

              <div>
                <span className="text-gray-500">Temperature</span>
                <div className="font-semibold">{zone.temperature}°C</div>
              </div>

              <div>
                <span className="text-gray-500">Humidity</span>
                <div className="font-semibold">{zone.humidity}%</div>
              </div>

              <div>
                <span className="text-gray-500">Wind</span>
                <div className="font-semibold">{zone.windSpeed} km/h</div>
              </div>
            </div>
          </div>
        </Popup>
      </CircleMarker>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

interface CSMCHeatmapProps {
  className?: string
  initialWardId?: string
}

export function CSMCHeatmap({
  className,
  initialWardId,
}: CSMCHeatmapProps) {
  const [heatmapEnabled, setHeatmapEnabled] = useState(true)
  const [heatmapOpacity, setHeatmapOpacity] = useState([0.7])
  const [heatmapRadius, setHeatmapRadius] = useState([45])
  const [heatmapBlur, setHeatmapBlur] = useState([30])

  const [isDarkMode, setIsDarkMode] = useState(false)

  const [selectedZone, setSelectedZone] = useState<string>(
    initialWardId || "all"
  )

  const [metric, setMetric] = useState<"aqi" | "pm25" | "pm10">("aqi")

  const [showBoundaries, setShowBoundaries] = useState(true)

  const [isFullscreen, setIsFullscreen] = useState(false)

  const mapWrapperRef = useRef<HTMLDivElement>(null)

  /* ---------------------------------------------------------------------- */
  /*                            SELECTED ZONES                              */
  /* ---------------------------------------------------------------------- */

  const visibleZones = useMemo(() => {
    if (selectedZone === "all") {
      return PROJECT_ZONES
    }

    return PROJECT_ZONES.filter(
      (zone) => zone.zone_id === selectedZone
    )
  }, [selectedZone])

  /* ---------------------------------------------------------------------- */
  /*                           HEATMAP POINTS                               */
  /* ---------------------------------------------------------------------- */

  const heatmapPoints = useMemo(() => {
    const points: [number, number, number][] = []

    visibleZones.forEach((zone) => {
      const value = getMetricValue(zone, metric)

      const maxValue =
        metric === "aqi"
          ? 300
          : metric === "pm25"
            ? 180
            : 250

      const intensity = Math.min(1, value / maxValue)

      /*
       * Create a small cluster around each zone center.
       * This produces a smoother heat surface instead of six tiny dots.
       */
      const offsets = [
        [0, 0],
        [0.004, 0],
        [-0.004, 0],
        [0, 0.004],
        [0, -0.004],
        [0.003, 0.003],
        [-0.003, -0.003],
        [0.003, -0.003],
        [-0.003, 0.003],
      ]

      offsets.forEach(([latOffset, lngOffset], index) => {
        const multiplier =
          index === 0
            ? 1
            : Math.max(0.55, 0.9 - index * 0.04)

        points.push([
          zone.latitude + latOffset,
          zone.longitude + lngOffset,
          intensity * multiplier,
        ])
      })
    })

    return points
  }, [visibleZones, metric])

  /* ---------------------------------------------------------------------- */
  /*                           HEATMAP OPTIONS                              */
  /* ---------------------------------------------------------------------- */

  const heatmapOptions = useMemo(
    () => ({
      radius: heatmapRadius[0],
      blur: heatmapBlur[0],
      maxZoom: 14,
      minOpacity: 0.25,
      max: 1,

      gradient: {
        0.0: "#10B981",
        0.25: "#F59E0B",
        0.45: "#F97316",
        0.65: "#EF4444",
        0.82: "#8B5CF6",
        1.0: "#7C2D12",
      },
    }),
    [heatmapRadius, heatmapBlur]
  )

  /* ---------------------------------------------------------------------- */
  /*                            TILE LAYER                                  */
  /* ---------------------------------------------------------------------- */

  const tileLayerUrl = isDarkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  const tileLayerAttribution = isDarkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  /* ---------------------------------------------------------------------- */
  /*                            FULLSCREEN                                  */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(
        document.fullscreenElement === mapWrapperRef.current
      )
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen
    )

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen
      )
  }, [])

  async function toggleFullscreen() {
    if (!mapWrapperRef.current) return

    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await mapWrapperRef.current.requestFullscreen()
    }
  }

  /* ---------------------------------------------------------------------- */
  /*                              RENDER                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <Card className={`overflow-hidden ${className || ""}`}>
      {/* ---------------------------------------------------------------- */}
      {/* CONTROLS                                                        */}
      {/* ---------------------------------------------------------------- */}

      <div className="border-b p-4 space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <Thermometer className="size-5 text-primary" />

              <h3 className="font-semibold">
                HetEvoAgent AQI Heatmap
              </h3>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Six-zone air quality visualization for Chhatrapati Sambhajinagar
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <Button
              size="sm"
              variant={metric === "aqi" ? "default" : "outline"}
              onClick={() => setMetric("aqi")}
            >
              <Layers className="mr-2 size-4" />
              AQI
            </Button>

            <Button
              size="sm"
              variant={metric === "pm25" ? "default" : "outline"}
              onClick={() => setMetric("pm25")}
            >
              PM2.5
            </Button>

            <Button
              size="sm"
              variant={metric === "pm10" ? "default" : "outline"}
              onClick={() => setMetric("pm10")}
            >
              PM10
            </Button>

            <Button
              size="sm"
              variant={heatmapEnabled ? "default" : "outline"}
              onClick={() =>
                setHeatmapEnabled((value) => !value)
              }
            >
              {heatmapEnabled ? "Heatmap On" : "Heatmap Off"}
            </Button>

            <Button
              size="sm"
              variant={showBoundaries ? "default" : "outline"}
              onClick={() =>
                setShowBoundaries((value) => !value)
              }
            >
              <MapPin className="mr-2 size-4" />
              Boundaries
            </Button>

            <Button
              size="icon"
              variant="outline"
              aria-label={
                isFullscreen
                  ? "Exit fullscreen"
                  : "Enter fullscreen"
              }
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Zone selector */}

        <div className="grid gap-4 md:grid-cols-[280px_1fr]">

          <label className="space-y-1 text-sm">
            <span className="font-medium">
              Prediction Zone
            </span>

            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3"
              value={selectedZone}
              onChange={(event) =>
                setSelectedZone(event.target.value)
              }
            >
              <option value="all">
                All 6 zones
              </option>

              {PROJECT_ZONES.map((zone) => (
                <option
                  key={zone.zone_id}
                  value={zone.zone_id}
                >
                  {zone.zone_id} · {zone.zone_name}
                </option>
              ))}
            </select>
          </label>

          {/* Sliders */}

          <div className="grid gap-4 md:grid-cols-3">

            <div className="space-y-2">
              <Label>
                Opacity: {heatmapOpacity[0].toFixed(1)}
              </Label>

              <Slider
                value={heatmapOpacity}
                onValueChange={setHeatmapOpacity}
                min={0.2}
                max={1}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Radius: {heatmapRadius[0]}px
              </Label>

              <Slider
                value={heatmapRadius}
                onValueChange={setHeatmapRadius}
                min={20}
                max={60}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Blur: {heatmapBlur[0]}px
              </Label>

              <Slider
                value={heatmapBlur}
                onValueChange={setHeatmapBlur}
                min={10}
                max={40}
                step={1}
              />
            </div>

          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* MAP                                                             */}
      {/* ---------------------------------------------------------------- */}

      <div
        ref={mapWrapperRef}
        className="relative h-[600px] min-h-[500px] bg-background"
      >

        {/* Dark / Light */}

        <Button
          size="sm"
          variant="outline"
          className="absolute right-4 top-4 z-[1000] bg-background/90 backdrop-blur"
          onClick={() =>
            setIsDarkMode((value) => !value)
          }
        >
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </Button>

        {/* Legend */}

        <div className="absolute bottom-4 left-4 z-[1000] w-[220px] rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur">

          <div className="mb-2 text-xs font-semibold">
            {metric === "aqi"
              ? "AQI Heatmap"
              : metric === "pm25"
                ? "PM2.5 Heatmap"
                : "PM10 Heatmap"}
          </div>

          <div
            className="h-3 w-full rounded"
            style={{
              background:
                "linear-gradient(to right, #10B981, #F59E0B, #F97316, #EF4444, #8B5CF6, #7C2D12)",
            }}
          />

          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>

          <div className="mt-3 space-y-1 text-[11px] text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>● Zone center</span>
              <span>Click for details</span>
            </div>

            <div>
              Boundaries remain visible over the heatmap.
            </div>
          </div>
        </div>

        <MapContainer
          center={[19.87, 75.34]}
          zoom={12}
          className="h-full w-full"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <MapBounds />

          <TileLayer
            url={tileLayerUrl}
            attribution={tileLayerAttribution}
          />

          {/* HEATMAP */}

          {heatmapEnabled && (
            <HeatmapLayer
              points={heatmapPoints}
              options={{
                ...heatmapOptions,
                opacity: heatmapOpacity[0],
              }}
            />
          )}

          {/* ZONE BOUNDARIES */}

          {showBoundaries &&
            PROJECT_ZONES.map((zone) => (
              <ZoneBoundary
                key={zone.zone_id}
                zone={zone}
                selected={
                  selectedZone === zone.zone_id
                }
                onSelect={() =>
                  setSelectedZone(zone.zone_id)
                }
              />
            ))}
        </MapContainer>
      </div>
    </Card>
  )
}