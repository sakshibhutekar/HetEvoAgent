"use client"

import { createContext, useContext, useEffect, useMemo, useState, useTransition, type ReactNode } from "react"
import { findLocalArea, LOCAL_AREA_DATA } from "@/lib/local-area-data"
import type { WardData } from "@/lib/csmc-ward-data"

interface LocationContextValue {
  areas: WardData[]
  selectedArea: WardData
  isLoading: boolean
  error: string | null
  selectArea: (query: string) => boolean
}

const LocationContext = createContext<LocationContextValue | null>(null)
const STORAGE_KEY = "csmc-selected-area"
const defaultArea = LOCAL_AREA_DATA[0]

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedArea, setSelectedArea] = useState(defaultArea)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const area = findLocalArea(saved)
      if (area) setSelectedArea(area)
    }
  }, [])

  function selectArea(query: string) {
    const area = findLocalArea(query)
    if (!area) {
      setError("No AQI data available for this local area.")
      return false
    }
    setError(null)
    startTransition(() => setSelectedArea(area))
    window.localStorage.setItem(STORAGE_KEY, area.name)
    return true
  }

  const value = useMemo(() => ({ areas: LOCAL_AREA_DATA, selectedArea, isLoading: isPending, error, selectArea }), [selectedArea, isPending, error])
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) throw new Error("useLocation must be used inside LocationProvider")
  return context
}
