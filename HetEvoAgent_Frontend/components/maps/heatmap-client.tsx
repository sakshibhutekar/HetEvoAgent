"use client"

import dynamic from "next/dynamic"

const CSMCHeatmap = dynamic(
  () =>
    import("@/components/maps/csmc-heatmap").then(
      (mod) => mod.CSMCHeatmap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full animate-pulse rounded-xl bg-muted" />
    ),
  }
)

interface HeatmapClientProps {
  className?: string
}

export function HeatmapClient({
  className,
}: HeatmapClientProps) {
  return <CSMCHeatmap className={className} />
}