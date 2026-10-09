"use client"

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import {
    getZones,
    predictAQI,
    type Prediction,
    type Zone,
} from "@/lib/api"

interface PredictionContextValue {
    zones: Zone[]
    selectedZone: Zone | null
    prediction: Prediction | null
    isLoading: boolean
    error: string | null
    predictionDate: string
    selectZone: (zone: Zone) => Promise<void>
}

const PredictionContext =
    createContext<PredictionContextValue | null>(null)

function getTodayDate(): string {
    const today = new Date()

    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    return `${year}-${month}-${day}`
}

export function PredictionProvider({
    children,
}: {
    children: ReactNode
}) {
    const [zones, setZones] = useState<Zone[]>([])
    const [selectedZone, setSelectedZone] =
        useState<Zone | null>(null)

    const [prediction, setPrediction] =
        useState<Prediction | null>(null)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [predictionDate] = useState(() =>
        getTodayDate()
    )

    // Load all real prediction zones
    // and automatically generate the first prediction.
    useEffect(() => {
        async function loadZonesAndPrediction() {
            try {
                setIsLoading(true)
                setError(null)

                // Get the real zones from the backend
                const data = await getZones()

                setZones(data)

                // Automatically select the first real zone
                if (data.length > 0) {
                    const firstZone = data[0]

                    setSelectedZone(firstZone)

                    // Generate a real AQI prediction
                    const result = await predictAQI(
                        firstZone.zone_name,
                        predictionDate
                    )

                    setPrediction(result)
                } else {
                    setError("No prediction zones were returned by the backend.")
                }
            } catch (err) {
                console.error(
                    "Failed to load zones and prediction:",
                    err
                )

                setPrediction(null)

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load AQI prediction."
                )
            } finally {
                setIsLoading(false)
            }
        }

        loadZonesAndPrediction()
    }, [predictionDate])

    // Select another zone and generate its real prediction
    async function selectZone(zone: Zone) {
        try {
            setSelectedZone(zone)
            setIsLoading(true)
            setError(null)

            const result = await predictAQI(
                zone.zone_name,
                predictionDate
            )

            setPrediction(result)
        } catch (err) {
            console.error("Prediction error:", err)

            setPrediction(null)

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to generate AQI prediction."
            )
        } finally {
            setIsLoading(false)
        }
    }

    const value = useMemo(
        () => ({
            zones,
            selectedZone,
            prediction,
            isLoading,
            error,
            predictionDate,
            selectZone,
        }),
        [
            zones,
            selectedZone,
            prediction,
            isLoading,
            error,
            predictionDate,
        ]
    )

    return (
        <PredictionContext.Provider value={value}>
            {children}
        </PredictionContext.Provider>
    )
}

export function usePrediction() {
    const context = useContext(PredictionContext)

    if (!context) {
        throw new Error(
            "usePrediction must be used inside PredictionProvider"
        )
    }

    return context
}