"use client"

import { useMemo, useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { aqiTrend, particulateCompare } from "@/lib/aqi-data"
import { useLocation } from "@/components/location-provider"

export function AnalyticsControls() {
  const today = new Date().toISOString().slice(0, 10)
  const { areas, selectedArea, selectArea } = useLocation()
  const [start, setStart] = useState(today)
  const [end, setEnd] = useState(today)
  const [error, setError] = useState("")
  const filtered = useMemo(() => aqiTrend.map((item) => ({ ...item, date: start, aqi: Math.round(item.aqi * selectedArea.aqi / 185), forecast: Math.round(item.forecast * selectedArea.aqi / 185) })), [selectedArea.aqi, start])

  function updateStart(value: string) { setStart(value); if (value > end) setError("Start date must be on or before end date."); else setError("") }
  function updateEnd(value: string) { setEnd(value); if (start > value) setError("Start date must be on or before end date."); else setError("") }
  function exportReport() {
    if (start > end) { setError("Choose a valid date range before exporting."); return }
    const rows = [["Location", "Date", "Time", "AQI", "Forecast"], ...filtered.map((item) => [selectedArea.name, item.date, item.time, item.aqi, item.forecast])]
    const csv = rows.map((row) => row.join(",")).join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }))
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `aqi-analytics-${start}-to-${end}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return <div className="flex flex-wrap items-end gap-2"><label className="text-xs text-muted-foreground">Location<select className="ml-2 h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground" value={selectedArea.id} onChange={(event) => selectArea(event.target.value)}>{areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}</select></label><label className="text-xs text-muted-foreground">Start<input className="ml-2 h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground" type="date" value={start} onChange={(event) => updateStart(event.target.value)} /></label><label className="text-xs text-muted-foreground">End<input className="ml-2 h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground" type="date" value={end} onChange={(event) => updateEnd(event.target.value)} /></label><Button className="gap-2" onClick={exportReport} disabled={Boolean(error)}><Download className="size-4" />Export Report</Button>{error && <p className="basis-full text-sm text-destructive" role="alert">{error}</p>}<span className="sr-only">{particulateCompare.length} pollutant comparison records available</span></div>
}
