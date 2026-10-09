"use client"

import { useCallback, useRef, useState } from "react"
import { GoogleMap, HeatmapLayer, LoadScript } from "@react-google-maps/api"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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

interface PollutionHeatmapProps {
  points?: google.maps.LatLng[]
  className?: string
}

export function PollutionHeatmap({ points = [], className }: PollutionHeatmapProps) {
  const [heatmapEnabled, setHeatmapEnabled] = useState(true)
  const [heatmapOpacity, setHeatmapOpacity] = useState([0.6])
  const [heatmapRadius, setHeatmapRadius] = useState([20])
  const [loadError, setLoadError] = useState(false)
  const mapRef = useRef<google.maps.Map | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
  }, [])

  // Check if API key is valid
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  const hasValidApiKey = apiKey && apiKey !== "your_google_maps_api_key_here" && apiKey.length > 10

  // Sample heatmap data if no points provided
  const displayPoints = points.length > 0 ? points : [
    new google.maps.LatLng(28.6315, 77.2167),
    new google.maps.LatLng(28.6129, 77.2295),
    new google.maps.LatLng(28.5485, 77.2508),
    new google.maps.LatLng(28.6458, 77.1153),
    new google.maps.LatLng(28.5254, 77.2066),
    new google.maps.LatLng(28.5900, 77.2000),
    new google.maps.LatLng(28.6200, 77.1800),
    new google.maps.LatLng(28.5800, 77.2400),
    new google.maps.LatLng(28.6400, 77.2200),
    new google.maps.LatLng(28.5600, 77.1900),
  ]

  const heatmapGradient = [
    "rgba(16, 185, 129, 0)",
    "rgba(16, 185, 129, 1)",
    "rgba(245, 158, 11, 1)",
    "rgba(249, 115, 22, 1)",
    "rgba(239, 68, 68, 1)",
    "rgba(139, 92, 246, 1)",
    "rgba(124, 45, 18, 1)",
  ]

  // Show fallback if no valid API key
  if (!hasValidApiKey) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="size-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Google Maps API Key Required</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            To view the pollution heatmap, please add your Google Maps API key to the <code className="bg-muted px-2 py-1 rounded">.env.local</code> file:
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
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Pollution Heatmap</h3>
          <Button
            variant={heatmapEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setHeatmapEnabled(!heatmapEnabled)}
          >
            {heatmapEnabled ? "Disable" : "Enable"}
          </Button>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Opacity: {heatmapOpacity[0]}</Label>
            <Slider
              value={heatmapOpacity}
              onValueChange={setHeatmapOpacity}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Radius: {heatmapRadius[0]}px</Label>
            <Slider
              value={heatmapRadius}
              onValueChange={setHeatmapRadius}
              min={10}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={["visualization"]}
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
            center={defaultCenter}
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
            {heatmapEnabled && (
              <HeatmapLayer
                data={displayPoints}
                options={{
                  opacity: heatmapOpacity[0],
                  radius: heatmapRadius[0],
                  gradient: heatmapGradient,
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </Card>
  )
}
