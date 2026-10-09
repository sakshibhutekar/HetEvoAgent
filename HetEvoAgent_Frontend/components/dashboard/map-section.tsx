"use client"

import dynamic from "next/dynamic"

const HetEvoZoneMap = dynamic(
  () => import("@/components/maps/hetevo-zone-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border bg-white">
        <p className="text-sm text-gray-500">
          Loading AQI map...
        </p>
      </div>
    ),
  }
)

export default function MapSection() {
  return (
    <section className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          AQI Map
        </h2>

        <p className="text-sm text-gray-500">
          HetEvoAgent AQI Monitoring
        </p>
      </div>

      <HetEvoZoneMap />
    </section>
  )
}