"use client"

import { useEffect, useMemo, useState } from "react"
import { Calendar, Loader2, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAQIColor, getAQICategory } from "@/lib/csmc-ward-data"
import { useLocation } from "@/components/location-provider"
import { aqiTrend } from "@/lib/aqi-data"

export function PredictionControls() {
  const { areas, selectedArea, selectArea } = useLocation()
  const [location, setLocation] = useState(selectedArea.id)
  const [duration, setDuration] = useState("24")
  const [pollutant, setPollutant] = useState("aqi")
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [error, setError] = useState("")
  useEffect(() => { setLocation(selectedArea.id) }, [selectedArea.id])
  const ward = areas.find((item) => item.id === location) ?? selectedArea
  const points = useMemo(() => aqiTrend.slice(0, Math.max(1, Math.ceil(Number(duration) / 2))).map((point) => ({ ...point, aqi: Math.round(point.aqi * ward.aqi / 185), forecast: Math.round(point.forecast * ward.aqi / 185) })), [duration, ward.aqi])
  const forecast = points[points.length - 1]?.forecast ?? ward.aqi
  const trend = forecast > ward.aqi ? "Rising" : forecast < ward.aqi ? "Improving" : "Stable"

  async function generate() {
    if (!location || Number(duration) < 2 || Number(duration) > 48) {
      setError("Choose a location and a duration between 2 and 48 hours.")
      return
    }
    setError("")
    setLoading(true)
    await Promise.resolve()
    setGenerated(true)
    setLoading(false)
  }

  return (
    <Card className="border-primary/20">
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="size-5 text-primary" />Custom Forecast</CardTitle><CardDescription>Generate a forecast from the project&apos;s available ward readings and forecast series.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm"><span className="font-medium">Location</span><select className="h-10 w-full rounded-md border border-input bg-background px-3" value={location} onChange={(event) => { setLocation(event.target.value); selectArea(event.target.value) }}>{areas.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label className="space-y-1 text-sm"><span className="font-medium">Duration (hours)</span><input className="h-10 w-full rounded-md border border-input bg-background px-3" type="number" min="2" max="48" value={duration} onChange={(event) => setDuration(event.target.value)} /></label>
          <label className="space-y-1 text-sm"><span className="font-medium">Metric</span><select className="h-10 w-full rounded-md border border-input bg-background px-3" value={pollutant} onChange={(event) => setPollutant(event.target.value)}><option value="aqi">AQI</option><option value="pm25">PM2.5</option><option value="pm10">PM10</option></select></label>
        </div>
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <Button onClick={generate} disabled={loading} className="gap-2">{loading && <Loader2 className="size-4 animate-spin" />}{loading ? "Generating..." : "Generate custom forecast"}</Button>
        {generated && <div className="space-y-4 rounded-lg border border-border p-4"><div className="grid gap-4 sm:grid-cols-3"><div><p className="text-sm text-muted-foreground">Predicted {pollutant.toUpperCase()}</p><p className="text-2xl font-bold">{pollutant === "pm25" ? ward.pm25 : pollutant === "pm10" ? ward.pm10 : forecast}</p></div><div><p className="text-sm text-muted-foreground">Category</p><Badge style={{ backgroundColor: getAQIColor(forecast), color: "white" }}>{getAQICategory(forecast)}</Badge></div><div><p className="text-sm text-muted-foreground">Trend</p><p className="flex items-center gap-1 font-semibold"><TrendingUp className="size-4" />{trend}</p></div></div><div><p className="mb-2 text-sm font-medium">Forecast chart · next {duration} hours</p><div className="flex h-24 items-end gap-1">{points.map((point) => <div key={point.time} className="flex-1 rounded-t bg-primary/70" style={{ height: `${Math.max(12, Math.min(100, point.forecast / 3))}%` }} title={`${point.time}: ${point.forecast}`} />)}</div></div></div>}
      </CardContent>
    </Card>
  )
}
