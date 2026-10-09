"use client"

import { useState } from "react"
import { Copy, Download, Loader2, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WardData } from "@/lib/csmc-ward-data"
import { useLocation } from "@/components/location-provider"

interface AiReportPanelProps {
  wards?: WardData[]
  location?: string
  purpose?: string
  label?: string
}

export function AiReportPanel({ wards, location, purpose, label = "Generate full AI report" }: AiReportPanelProps) {
  const { selectedArea } = useLocation()
  const reportWards = wards?.length ? wards : [selectedArea]
  const reportLocation = location === "Chhatrapati Sambhajinagar" || !location ? selectedArea.name : location
  const [report, setReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generateReport() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wards: reportWards, location: reportLocation, purpose }),
      })
      const result = await response.json() as { report?: string; error?: string }
      if (!response.ok || !result.report) throw new Error(result.error || "Unable to generate the report.")
      setReport(result.report)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to generate the report.")
    } finally {
      setLoading(false)
    }
  }

  function downloadReport() {
    if (!report) return
    const blob = new Blob([report], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `aqi-report-${new Date().toISOString().slice(0, 10)}.md`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function copyReport() {
    if (!report) return
    await navigator.clipboard.writeText(report)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <Button className="gap-2" onClick={generateReport} disabled={loading || reportWards.length === 0}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {loading ? "Generating..." : label}
      </Button>
      {error && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
      {report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Generated AI report">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-semibold">Generated Air Quality Report</h2>
              <Button variant="ghost" size="icon" aria-label="Close report" onClick={() => setReport(null)}><X className="size-4" /></Button>
            </div>
            <pre className="flex-1 overflow-auto whitespace-pre-wrap p-5 text-sm leading-6 text-foreground">{report}</pre>
            <div className="flex justify-end gap-2 border-t border-border p-4">
              <Button variant="outline" className="gap-2" onClick={copyReport}><Copy className="size-4" />{copied ? "Copied" : "Copy"}</Button>
              <Button className="gap-2" onClick={downloadReport}><Download className="size-4" />Download</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
