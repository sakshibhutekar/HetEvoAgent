"use client"

import dynamic from "next/dynamic"

const HetEvoZoneMap = dynamic(
  () =>
    import("@/components/maps/hetevo-zone-map").then(
      (mod) => mod.default
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full rounded-2xl border bg-muted animate-pulse" />
    ),
  }
)

interface LiveAqiClientProps {
  className?: string
}

export function LiveAqiClient({
  className,
}: LiveAqiClientProps) {
  return (
    <div className={className}>
      <HetEvoZoneMap />
    </div>
  )
}