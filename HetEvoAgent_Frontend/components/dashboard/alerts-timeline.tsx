"use client"

import { motion } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Wind,
  type LucideIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { usePrediction } from "@/components/prediction-provider"


type StatusType =
  | "critical"
  | "warning"
  | "info"
  | "success"


interface StatusConfig {
  icon: LucideIcon
  ring: string
  bg: string
}


const config: Record<
  StatusType,
  StatusConfig
> = {
  critical: {
    icon: AlertTriangle,
    ring: "text-destructive",
    bg: "bg-destructive/10",
  },

  warning: {
    icon: AlertTriangle,
    ring: "text-[color:var(--warning)]",
    bg: "bg-[color:var(--warning)]/10",
  },

  info: {
    icon: Info,
    ring: "text-primary",
    bg: "bg-primary/10",
  },

  success: {
    icon: CheckCircle2,
    ring: "text-[color:var(--success)]",
    bg: "bg-success/10",
  },
}


export function AlertsTimeline() {

  const {
    selectedZone,
    prediction,
    isLoading,
    error,
  } = usePrediction()


  /* =====================================================
     Loading
     ===================================================== */

  if (isLoading && !prediction) {
    return (
      <Card>

        <CardHeader>

          <CardTitle>
            Current Status
          </CardTitle>

          <CardDescription>
            Loading prediction status...
          </CardDescription>

        </CardHeader>

        <CardContent>

          <div className="h-20 animate-pulse rounded-xl bg-muted/30" />

        </CardContent>

      </Card>
    )
  }


  /* =====================================================
     Error
     ===================================================== */

  if (error && !prediction) {
    return (
      <Card>

        <CardHeader>

          <CardTitle>
            Current Status
          </CardTitle>

          <CardDescription>
            Prediction status
          </CardDescription>

        </CardHeader>

        <CardContent>

          <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3">

            <AlertTriangle className="size-5 text-destructive" />

            <div>

              <p className="text-sm font-medium">
                Prediction unavailable
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Unable to retrieve the current AQI prediction.
              </p>

            </div>

          </div>

        </CardContent>

      </Card>
    )
  }


  /* =====================================================
     No prediction
     ===================================================== */

  if (!prediction) {
    return (
      <Card>

        <CardHeader>

          <CardTitle>
            Current Status
          </CardTitle>

          <CardDescription>
            Prediction status
          </CardDescription>

        </CardHeader>

        <CardContent>

          <p className="text-sm text-muted-foreground">
            No prediction is currently available.
          </p>

        </CardContent>

      </Card>
    )
  }


  /* =====================================================
     Determine status from REAL AQI
     ===================================================== */

  const aqi =
    prediction.predicted_aqi


  let statusType: StatusType
  let statusTitle: string
  let statusDescription: string


  if (aqi <= 50) {

    statusType = "success"

    statusTitle =
      "Air quality is good"

    statusDescription =
      `The predicted AQI is ${aqi.toFixed(
        2
      )}. Current conditions are within the Good category.`

  } else if (aqi <= 100) {

    statusType = "info"

    statusTitle =
      "Air quality is satisfactory"

    statusDescription =
      `The predicted AQI is ${aqi.toFixed(
        2
      )}. Current conditions are within the Satisfactory category.`

  } else if (aqi <= 200) {

    statusType = "warning"

    statusTitle =
      "Air quality requires attention"

    statusDescription =
      `The predicted AQI is ${aqi.toFixed(
        2
      )}. Current conditions are in the ${prediction.aqi_category} category.`

  } else {

    statusType = "critical"

    statusTitle =
      "High AQI detected"

    statusDescription =
      `The predicted AQI is ${aqi.toFixed(
        2
      )}. Current conditions are in the ${prediction.aqi_category} category.`

  }


  const status =
    config[statusType]

  const Icon =
    status.icon


  return (
    <Card>

      {/* =================================================
          Header
          ================================================= */}

      <CardHeader>

        <CardTitle>
          Current Status
        </CardTitle>

        <CardDescription>
          Real-time prediction status
        </CardDescription>

      </CardHeader>


      {/* =================================================
          Status
          ================================================= */}

      <CardContent>

        <motion.div
          initial={{
            opacity: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          className="relative flex gap-3"
        >

          {/* Status icon */}

          <div
            className={`
              flex size-9 shrink-0
              items-center justify-center
              rounded-full
              ${status.bg}
            `}
          >

            <Icon
              className={`size-4 ${status.ring}`}
            />

          </div>


          {/* Status content */}

          <div className="min-w-0 flex-1">

            <div className="flex items-center gap-2">

              <p className="text-sm font-medium">
                {statusTitle}
              </p>

            </div>


            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">

              {statusDescription}

            </p>


            {/* Zone */}

            <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">

              <Wind className="size-3.5" />

              <span>
                {selectedZone?.zone_name}
              </span>

            </div>

          </div>

        </motion.div>

      </CardContent>

    </Card>
  )
}