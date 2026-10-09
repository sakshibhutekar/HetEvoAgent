"use client"

import { useEffect, useState, useCallback } from "react"
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Layers, MapPin, Home } from "lucide-react"
import {
  CSMC_WARDS,
  CSMC_BOUNDS,
  CSMC_CENTER,
  getAQIColor,
  getAQICategory,
  getRiskLevel,
  getSafetyMeasures,
  type WardData,
} from "@/lib/csmc-ward-data"

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface CSMCAQIMapProps {
  className?: string
  selectedWard?: string
  onWardSelect?: (ward: WardData) => void
  wards?: WardData[]
}

function MapBounds() {
  const map = useMap()

  useEffect(() => {
    map.fitBounds([
      [CSMC_BOUNDS.south, CSMC_BOUNDS.west],
      [CSMC_BOUNDS.north, CSMC_BOUNDS.east],
    ])
  }, [map])

  return null
}

function ResetViewButton() {
  const map = useMap()

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <Button
        size="icon-sm"
        variant="outline"
        onClick={() => {
          map.setView([CSMC_CENTER.lat, CSMC_CENTER.lng], 12)
        }}
      >
        <Home className="size-4" />
      </Button>
    </div>
  )
}

export function CSMCAQIMap({
  className,
  selectedWard,
  onWardSelect,
  wards = CSMC_WARDS,
}: CSMCAQIMapProps) {
  const [activeLayer, setActiveLayer] = useState<
    "aqi" | "heatmap" | "boundaries"
  >("aqi")

  const [selectedWardData, setSelectedWardData] =
    useState<WardData | null>(null)

  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    }

    checkDarkMode()

    const observer = new MutationObserver(checkDarkMode)

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const handleWardClick = useCallback(
    (ward: WardData) => {
      setSelectedWardData(ward)
      onWardSelect?.(ward)
    },
    [onWardSelect]
  )

  /*
   * IMPORTANT:
   * Use OpenStreetMap instead of CARTO.
   * CARTO's dark tiles were returning "API KEY REQUIRED".
   */
  const tileLayerUrl =
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  const tileLayerAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative h-full min-h-[500px]">

        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
          <div className="flex gap-2">

            <Button
              size="sm"
              variant={activeLayer === "aqi" ? "default" : "outline"}
              onClick={() => setActiveLayer("aqi")}
            >
              <Layers className="size-4 mr-2" />
              AQI
            </Button>

            <Button
              size="sm"
              variant={
                activeLayer === "boundaries" ? "default" : "outline"
              }
              onClick={() => setActiveLayer("boundaries")}
            >
              <MapPin className="size-4 mr-2" />
              Boundaries
            </Button>

          </div>

          <Button
            size="sm"
            variant={isDarkMode ? "default" : "outline"}
            onClick={() => {
              document.documentElement.classList.toggle("dark")
              setIsDarkMode(!isDarkMode)
            }}
          >
            {isDarkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <div className="text-xs font-semibold mb-2">
            AQI Legend
          </div>

          <div className="space-y-1">
            {[
              {
                range: "0-50",
                color: "#10B981",
                label: "Good",
              },
              {
                range: "51-100",
                color: "#F59E0B",
                label: "Moderate",
              },
              {
                range: "101-150",
                color: "#F97316",
                label: "Unhealthy (Sensitive)",
              },
              {
                range: "151-200",
                color: "#EF4444",
                label: "Unhealthy",
              },
              {
                range: "201-300",
                color: "#8B5CF6",
                label: "Very Unhealthy",
              },
              {
                range: "300+",
                color: "#7C2D12",
                label: "Hazardous",
              },
            ].map((item) => (
              <div
                key={item.range}
                className="flex items-center gap-2 text-xs"
              >
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color }}
                />

                <span className="text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <MapContainer
          center={[CSMC_CENTER.lat, CSMC_CENTER.lng]}
          zoom={12}
          className="h-full w-full"
          style={{ height: "100%", width: "100%" }}
        >
          <MapBounds />

          <ResetViewButton />

          {/* OpenStreetMap Base Layer */}
          <TileLayer
            url={tileLayerUrl}
            attribution={tileLayerAttribution}
          />

          {/* Ward Polygons */}
          {wards.map((ward) => {
            const isSelected =
              selectedWard === ward.id ||
              selectedWardData?.id === ward.id

            const fillColor =
              activeLayer === "aqi"
                ? getAQIColor(ward.aqi)
                : "#3B82F6"

            return (
              <Polygon
                key={ward.id}
                positions={ward.coordinates}
                pathOptions={{
                  color: isSelected ? "#000000" : "#FFFFFF",
                  weight: isSelected ? 3 : 2,
                  fillColor: fillColor,
                  fillOpacity:
                    activeLayer === "aqi" ? 0.6 : 0.3,
                }}
                eventHandlers={{
                  click: () => handleWardClick(ward),

                  mouseover: (e) => {
                    e.target.setStyle({
                      weight: 4,
                      fillOpacity: 0.8,
                    })
                  },

                  mouseout: (e) => {
                    e.target.setStyle({
                      weight: isSelected ? 3 : 2,
                      fillOpacity:
                        activeLayer === "aqi" ? 0.6 : 0.3,
                    })
                  },
                }}
              >
                {/* Ward Popup */}
                <Popup>
                  <div className="p-2 min-w-[280px]">

                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">
                        {ward.name}
                      </h3>

                      <Badge
                        style={{
                          backgroundColor: getAQIColor(ward.aqi),
                        }}
                        className="text-white"
                      >
                        {ward.aqi}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm">

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Ward:
                        </span>
                        <span>{ward.wardNumber}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Category:
                        </span>

                        <span
                          style={{
                            color: getAQIColor(ward.aqi),
                          }}
                        >
                          {getAQICategory(ward.aqi)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          PM2.5:
                        </span>
                        <span>
                          {ward.pm25} µg/m³
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          PM10:
                        </span>
                        <span>
                          {ward.pm10} µg/m³
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Temperature:
                        </span>
                        <span>
                          {ward.temperature}°C
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Humidity:
                        </span>
                        <span>
                          {ward.humidity}%
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Wind Speed:
                        </span>
                        <span>
                          {ward.windSpeed} km/h
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Population:
                        </span>
                        <span>
                          {ward.population.toLocaleString()}
                        </span>
                      </div>

                    </div>
                  </div>
                </Popup>
              </Polygon>
            )
          })}

          {/* Hospital Markers */}
          {wards
            .filter((w) => w.hospitals > 0)
            .map((ward) => (
              <Marker
                key={`hospital-${ward.id}`}
                position={[
                  ward.coordinates[0][0],
                  ward.coordinates[0][1],
                ]}
                icon={L.divIcon({
                  className: "custom-marker",
                  html: `
                    <div
                      style="
                        background-color: #EF4444;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                      "
                    ></div>
                  `,
                  iconSize: [20, 20],
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold">
                      Hospitals
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      {ward.hospitals} in {ward.name}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

          {/* School Markers */}
          {wards
            .filter((w) => w.schools > 0)
            .map((ward) => (
              <Marker
                key={`school-${ward.id}`}
                position={[
                  ward.coordinates[2][0],
                  ward.coordinates[2][1],
                ]}
                icon={L.divIcon({
                  className: "custom-marker",
                  html: `
                    <div
                      style="
                        background-color: #3B82F6;
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                      "
                    ></div>
                  `,
                  iconSize: [16, 16],
                })}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold">
                      Schools
                    </h4>

                    <p className="text-sm text-muted-foreground">
                      {ward.schools} in {ward.name}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>

        {/* Selected Ward Details Panel */}
        {selectedWardData && (
          <div className="absolute top-4 right-16 z-[1000] w-80 bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">

            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">
                {selectedWardData.name}
              </h3>

              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setSelectedWardData(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-3">

              <div className="flex items-center justify-between">

                <Badge
                  style={{
                    backgroundColor: getAQIColor(
                      selectedWardData.aqi
                    ),
                  }}
                  className="text-white px-3 py-1"
                >
                  AQI: {selectedWardData.aqi}
                </Badge>

                <span className="text-sm text-muted-foreground">
                  {getAQICategory(selectedWardData.aqi)}
                </span>

              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">

                <div>
                  <span className="text-muted-foreground">
                    PM2.5:
                  </span>

                  <span className="ml-1 font-medium">
                    {selectedWardData.pm25} µg/m³
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    PM10:
                  </span>

                  <span className="ml-1 font-medium">
                    {selectedWardData.pm10} µg/m³
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    CO:
                  </span>

                  <span className="ml-1 font-medium">
                    {selectedWardData.co} mg/m³
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    NO₂:
                  </span>

                  <span className="ml-1 font-medium">
                    {selectedWardData.no2} µg/m³
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    SO₂:
                  </span>

                  <span className="ml-1 font-medium">
                    {selectedWardData.so2} µg/m³
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground">
                    O₃:
                  </span>

                  <span className="ml-1 font-medium">
                    {selectedWardData.o3} µg/m³
                  </span>
                </div>

              </div>

              <div className="border-t pt-3">

                <div className="text-sm font-medium mb-2">
                  Risk Level:{" "}
                  {getRiskLevel(selectedWardData.aqi)}
                </div>

                <div className="space-y-1">

                  {getSafetyMeasures(
                    selectedWardData.aqi
                  ).map((measure, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <span className="text-primary">
                        •
                      </span>

                      <span>{measure}</span>
                    </div>
                  ))}

                </div>
              </div>

              <div className="border-t pt-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Population:
                  </span>

                  <span>
                    {selectedWardData.population.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Area:
                  </span>

                  <span>
                    {selectedWardData.area} km²
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Hospitals:
                  </span>

                  <span>
                    {selectedWardData.hospitals}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Schools:
                  </span>

                  <span>
                    {selectedWardData.schools}
                  </span>
                </div>

              </div>

              <div className="border-t pt-3">

                <div className="text-xs text-muted-foreground mb-1">
                  Landmarks:
                </div>

                <div className="flex flex-wrap gap-1">

                  {selectedWardData.landmarks.map(
                    (landmark, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs"
                      >
                        {landmark}
                      </Badge>
                    )
                  )}

                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Last Updated:{" "}
                {new Date(
                  selectedWardData.lastUpdated
                ).toLocaleString()}
              </div>

            </div>
          </div>
        )}
      </div>
    </Card>
  )
} 