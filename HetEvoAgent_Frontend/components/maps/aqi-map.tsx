"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "400px",
}

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
}

export interface AQISensor {
  id: string
  location: string
  lat: number
  lng: number
  aqi: number
  pm25: number
  pm10: number
  temp: number
  humidity: number
  windSpeed: number
  lastUpdated: string
}

interface AQIMapProps {
  sensors?: AQISensor[]
  showHeatmap?: boolean
  className?: string
}

const AQI_COLOR_MAP: Record<number, string> = {
  0: "#10B981", // Good (Green)
  50: "#F59E0B", // Moderate (Yellow)
  100: "#F97316", // Unhealthy for Sensitive Groups (Orange)
  150: "#EF4444", // Unhealthy (Red)
  200: "#8B5CF6", // Very Unhealthy (Purple)
  300: "#7C2D12", // Hazardous (Maroon)
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return AQI_COLOR_MAP[0]
  if (aqi <= 100) return AQI_COLOR_MAP[50]
  if (aqi <= 150) return AQI_COLOR_MAP[100]
  if (aqi <= 200) return AQI_COLOR_MAP[150]
  if (aqi <= 300) return AQI_COLOR_MAP[200]
  return AQI_COLOR_MAP[300]
}

function getAQIStatus(aqi: number): string {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "Unhealthy for Sensitive Groups"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very Unhealthy"
  return "Hazardous"
}

export function AQIMap({ sensors = [], showHeatmap = false, className }: AQIMapProps) {
  const [selectedSensor, setSelectedSensor] = useState<AQISensor | null>(null)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [loadError, setLoadError] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  const handleMarkerClick = useCallback((sensor: AQISensor) => {
    setSelectedSensor(sensor)
    setMapCenter({ lat: sensor.lat, lng: sensor.lng })
  }, [])

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedSensor(null)
  }, [])

  // Check if API key is valid
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const hasValidApiKey = apiKey && apiKey !== "your_google_maps_api_key_here" && apiKey.length > 10

  // Sample data if no sensors provided
  const displaySensors = sensors.length > 0 ? sensors : [
    {
      id: "1",
      location: "Connaught Place, Delhi",
      lat: 28.6315,
      lng: 77.2167,
      aqi: 185,
      pm25: 95,
      pm10: 120,
      temp: 32,
      humidity: 65,
      windSpeed: 12,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      location: "India Gate, Delhi",
      lat: 28.6129,
      lng: 77.2295,
      aqi: 142,
      pm25: 72,
      pm10: 98,
      temp: 31,
      humidity: 68,
      windSpeed: 10,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      location: "Nehru Place, Delhi",
      lat: 28.5485,
      lng: 77.2508,
      aqi: 210,
      pm25: 110,
      pm10: 145,
      temp: 33,
      humidity: 62,
      windSpeed: 8,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "4",
      location: "Rajouri Garden, Delhi",
      lat: 28.6458,
      lng: 77.1153,
      aqi: 95,
      pm25: 48,
      pm10: 65,
      temp: 30,
      humidity: 70,
      windSpeed: 14,
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "5",
      location: "Saket, Delhi",
      lat: 28.5254,
      lng: 77.2066,
      aqi: 165,
      pm25: 85,
      pm10: 110,
      temp: 32,
      humidity: 66,
      windSpeed: 11,
      lastUpdated: new Date().toISOString(),
    },
  ]

  // Show fallback if no valid API key
  if (!hasValidApiKey) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Google Maps API Key Required</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            To view the interactive map, please add your Google Maps API key to the <code className="bg-muted px-2 py-1 rounded">.env.local</code> file:
          </p>
          <code className="bg-muted px-4 py-2 rounded text-sm">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
          </code>
          <p className="text-sm text-muted-foreground mt-4">
            Get your API key from{' '}
            <a 
              href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={["places", "visualization"]}
        onError={() => setLoadError(true)}
      >
        {loadError ? (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="size-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to Load Google Maps</h3>
            <p className="text-muted-foreground">
              Please check your API key and try again.
            </p>
          </div>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#6b7280" }],
                },
                {
                  featureType: "administrative",
                  elementType: "geometry",
                  stylers: [{ color: "#e5e7eb" }],
                },
                {
                  featureType: "landscape",
                  elementType: "geometry",
                  stylers: [{ color: "#f9fafb" }],
                },
                {
                  featureType: "poi",
                  elementType: "geometry",
                  stylers: [{ color: "#e5e7eb" }],
                },
                {
                  featureType: "road",
                  elementType: "geometry",
                  stylers: [{ color: "#ffffff" }],
                },
                {
                  featureType: "road",
                  elementType: "geometry.stroke",
                  stylers: [{ color: "#e5e7eb" }],
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#bfdbfe" }],
                },
              ],
              disableDefaultUI: false,
              zoomControl: true,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
            }}
          >
            {displaySensors.map((sensor) => (
              <Marker
                key={sensor.id}
                position={{ lat: sensor.lat, lng: sensor.lng }}
                onClick={() => handleMarkerClick(sensor)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 12,
                  fillColor: getAQIColor(sensor.aqi),
                  fillOpacity: 0.8,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                }}
              />
            ))}

            {selectedSensor && (
              <InfoWindow
                position={{ lat: selectedSensor.lat, lng: selectedSensor.lng }}
                onCloseClick={handleCloseInfoWindow}
              >
                <div className="p-4 min-w-[280px]">
                  <h3 className="font-semibold text-lg mb-2">{selectedSensor.location}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AQI:</span>
                      <span className="font-semibold" style={{ color: getAQIColor(selectedSensor.aqi) }}>
                        {selectedSensor.aqi} - {getAQIStatus(selectedSensor.aqi)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PM2.5:</span>
                      <span>{selectedSensor.pm25} µg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PM10:</span>
                      <span>{selectedSensor.pm10} µg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temperature:</span>
                      <span>{selectedSensor.temp}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Humidity:</span>
                      <span>{selectedSensor.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wind Speed:</span>
                      <span>{selectedSensor.windSpeed} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{new Date(selectedSensor.lastUpdated).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </Card>
  )
}
