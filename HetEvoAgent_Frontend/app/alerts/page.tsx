"use client"

import { useMemo, useState } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { useLocation } from "@/components/location-provider"

import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Info,
  XCircle,
  Wind,
  X,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/* -------------------------------------------------------------------------- */
/*                              PROJECT ZONES                                 */
/* -------------------------------------------------------------------------- */

interface ProjectZone {
  zone_id: string
  zone_name: string
  zone_type: string
  aqi: number
}

const PROJECT_ZONES: ProjectZone[] = [
  {
    zone_id: "Z1",
    zone_name: "Chikalthana MIDC",
    zone_type: "Industrial",
    aqi: 142,
  },
  {
    zone_id: "Z2",
    zone_name: "Waluj / More Chowk",
    zone_type: "Industrial + Urban",
    aqi: 178,
  },
  {
    zone_id: "Z3",
    zone_name: "Gulmandi / Central City",
    zone_type: "Commercial",
    aqi: 126,
  },
  {
    zone_id: "Z4",
    zone_name: "CIDCO",
    zone_type: "Residential + Urban",
    aqi: 96,
  },
  {
    zone_id: "Z5",
    zone_name: "Shendra",
    zone_type: "Industrial + Developing",
    aqi: 165,
  },
  {
    zone_id: "Z6",
    zone_name: "Deolai",
    zone_type: "Peripheral Residential",
    aqi: 82,
  },
]

/* -------------------------------------------------------------------------- */
/*                              ALERT TYPES                                   */
/* -------------------------------------------------------------------------- */

type AlertType = "critical" | "warning" | "info" | "success"

interface AlertItem {
  id: number
  type: AlertType
  title: string
  description: string
  time: string
  action: string
}

/* -------------------------------------------------------------------------- */
/*                              HELPERS                                       */
/* -------------------------------------------------------------------------- */

function getAQICategory(aqi: number) {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Satisfactory"
  if (aqi <= 150) return "Moderate"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very Unhealthy"
  return "Hazardous"
}

function getAQIColor(aqi: number) {
  if (aqi <= 50) return "text-emerald-500"
  if (aqi <= 100) return "text-yellow-500"
  if (aqi <= 150) return "text-orange-500"
  if (aqi <= 200) return "text-red-500"
  if (aqi <= 300) return "text-purple-500"
  return "text-red-700"
}

function getDefaultZone() {
  return PROJECT_ZONES[0]
}

/* -------------------------------------------------------------------------- */
/*                            ALERT ICONS                                     */
/* -------------------------------------------------------------------------- */

const typeIcons = {
  critical: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
}

const typeStyles = {
  critical: {
    icon: "bg-red-500/15 text-red-500",
    border: "border-red-500/30",
    badge: "border-red-500/30 text-red-500",
    label: "Critical",
  },

  warning: {
    icon: "bg-yellow-500/15 text-yellow-500",
    border: "border-yellow-500/30",
    badge: "border-yellow-500/30 text-yellow-500",
    label: "Warning",
  },

  info: {
    icon: "bg-purple-500/15 text-purple-500",
    border: "border-purple-500/30",
    badge: "border-purple-500/30 text-purple-500",
    label: "Information",
  },

  success: {
    icon: "bg-emerald-500/15 text-emerald-500",
    border: "border-emerald-500/30",
    badge: "border-emerald-500/30 text-emerald-500",
    label: "Resolved",
  },
}

/* -------------------------------------------------------------------------- */
/*                              PAGE                                          */
/* -------------------------------------------------------------------------- */

export default function AlertsPage() {
  const { selectedArea } = useLocation()

  const [acknowledged, setAcknowledged] = useState<
    Record<number, boolean>
  >({})

  const [selectedAlert, setSelectedAlert] =
    useState<AlertItem | null>(null)

  /* ---------------------------------------------------------------------- */
  /*                         MATCH GLOBAL ZONE                              */
  /* ---------------------------------------------------------------------- */

  const selectedZone = useMemo(() => {
    const selectedName =
      selectedArea?.name?.toLowerCase() || ""

    const match = PROJECT_ZONES.find(
      (zone) =>
        zone.zone_name.toLowerCase() === selectedName ||
        zone.zone_name
          .toLowerCase()
          .includes(selectedName) ||
        selectedName.includes(
          zone.zone_name.toLowerCase()
        )
    )

    return match || getDefaultZone()
  }, [selectedArea])

  /* ---------------------------------------------------------------------- */
  /*                           ALERT GENERATION                             */
  /* ---------------------------------------------------------------------- */

  const alerts = useMemo<AlertItem[]>(() => {
    const zone = selectedZone
    const aqi = zone.aqi

    const generated: AlertItem[] = []

    /* AQI alert */

    if (aqi > 200) {
      generated.push({
        id: 1,
        type: "critical",
        title: "Critical AQI threshold exceeded",
        description: `AQI has reached ${aqi} in ${zone.zone_name}. Immediate attention is recommended.`,
        time: "2 mins ago",
        action: "AQI threshold exceeded",
      })
    } else if (aqi > 150) {
      generated.push({
        id: 1,
        type: "warning",
        title: "Elevated AQI detected",
        description: `AQI is ${aqi} in ${zone.zone_name}, currently classified as ${getAQICategory(aqi)}.`,
        time: "2 mins ago",
        action: "Elevated AQI",
      })
    } else if (aqi > 100) {
      generated.push({
        id: 1,
        type: "warning",
        title: "Moderate air quality",
        description: `AQI is ${aqi} in ${zone.zone_name}. Sensitive individuals should consider limiting prolonged outdoor exposure.`,
        time: "2 mins ago",
        action: "Moderate AQI",
      })
    } else {
      generated.push({
        id: 1,
        type: "success",
        title: "Air quality within acceptable range",
        description: `AQI is ${aqi} in ${zone.zone_name}, currently classified as ${getAQICategory(aqi)}.`,
        time: "2 mins ago",
        action: "AQI within range",
      })
    }

    /* Sensor alert */

    generated.push({
      id: 2,
      type: "warning",
      title: "Environmental monitoring update",
      description: `Monitoring systems are active for ${zone.zone_name}. New environmental observations are being processed.`,
      time: "15 mins ago",
      action: "Monitoring status",
    })

    /* Weather / pollution alert */

    generated.push({
      id: 3,
      type: "info",
      title: "Pollution forecast updated",
      description: `The latest prediction cycle for ${zone.zone_name} has been processed by HetEvoAgent.`,
      time: "1 hour ago",
      action: "Forecast updated",
    })

    /* System status */

    generated.push({
      id: 4,
      type: "success",
      title: "Prediction system operational",
      description: `HetEvoAgent is actively monitoring ${zone.zone_name} and processing zone-level air quality information.`,
      time: "4 hours ago",
      action: "System operational",
    })

    return generated
  }, [selectedZone])

  /* ---------------------------------------------------------------------- */
  /*                             COUNTS                                     */
  /* ---------------------------------------------------------------------- */

  const acknowledgedCount = Object.values(acknowledged).filter(
    Boolean
  ).length

  const criticalCount = alerts.filter(
    (alert) => alert.type === "critical"
  ).length

  const warningCount = alerts.filter(
    (alert) => alert.type === "warning"
  ).length

  /* ---------------------------------------------------------------------- */
  /*                           MARK ALL READ                                */
  /* ---------------------------------------------------------------------- */

  function markAllRead() {
    setAcknowledged(
      Object.fromEntries(
        alerts.map((alert) => [alert.id, true])
      )
    )
  }

  /* ---------------------------------------------------------------------- */
  /*                              RENDER                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                <Bell className="size-6 text-primary" />
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  Alert Management
                </h1>

                <p className="mt-1 text-muted-foreground">
                  Monitor air-quality alerts for{" "}
                  <span className="font-medium text-foreground">
                    {selectedZone.zone_name}
                  </span>
                </p>
              </div>

            </div>
          </div>

          <Button
            className="gap-2"
            onClick={markAllRead}
            disabled={
              acknowledgedCount === alerts.length
            }
          >
            <CheckCircle className="size-4" />
            Mark All Read
          </Button>

        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CURRENT ZONE BANNER                                              */}
        {/* ---------------------------------------------------------------- */}

        <Card className="border-primary/20 bg-primary/[0.03]">
          <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Wind className="size-6 text-primary" />
              </div>

              <div>
                <div className="text-sm text-muted-foreground">
                  Active Prediction Zone
                </div>

                <div className="text-lg font-semibold">
                  {selectedZone.zone_id} · {selectedZone.zone_name}
                </div>

                <div className="text-sm text-muted-foreground">
                  {selectedZone.zone_type}
                </div>
              </div>

            </div>

            <div className="text-left md:text-right">

              <div className="text-sm text-muted-foreground">
                Current AQI
              </div>

              <div
                className={`text-3xl font-bold ${getAQIColor(
                  selectedZone.aqi
                )}`}
              >
                {selectedZone.aqi}
              </div>

              <div className="text-sm">
                {getAQICategory(selectedZone.aqi)}
              </div>

            </div>

          </CardContent>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* KPI CARDS                                                        */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>
                Total Alerts
              </CardDescription>

              <CardTitle className="text-3xl">
                {alerts.length}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Current zone
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-500/30">
            <CardHeader className="pb-2">
              <CardDescription>
                Critical
              </CardDescription>

              <CardTitle className="text-3xl text-red-500">
                {criticalCount}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Immediate attention
              </p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/30">
            <CardHeader className="pb-2">
              <CardDescription>
                Warnings
              </CardDescription>

              <CardTitle className="text-3xl text-yellow-500">
                {warningCount}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Requires monitoring
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/30">
            <CardHeader className="pb-2">
              <CardDescription>
                Acknowledged
              </CardDescription>

              <CardTitle className="text-3xl text-emerald-500">
                {acknowledgedCount}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reviewed alerts
              </p>
            </CardContent>
          </Card>

        </div>

        {/* ---------------------------------------------------------------- */}
        {/* RECENT ALERTS                                                    */}
        {/* ---------------------------------------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5 text-primary" />
              Recent Alerts
            </CardTitle>

            <CardDescription>
              Latest environmental events detected for{" "}
              {selectedZone.zone_name}
            </CardDescription>
          </CardHeader>

          <CardContent>

            <div className="space-y-3">

              {alerts.map((alert) => {

                const Icon = typeIcons[alert.type]
                const style = typeStyles[alert.type]
                const isAcknowledged =
                  acknowledged[alert.id]

                return (
                  <div
                    key={alert.id}
                    className={`rounded-xl border p-4 transition-colors hover:bg-muted/30 ${style.border}`}
                  >

                    <div className="flex items-start gap-4">

                      {/* Icon */}

                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${style.icon}`}
                      >
                        <Icon className="size-5" />
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              <h4 className="font-semibold">
                                {alert.title}
                              </h4>

                              <Badge
                                variant="outline"
                                className={style.badge}
                              >
                                {style.label}
                              </Badge>

                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {alert.description}
                            </p>

                          </div>

                          <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            {alert.time}
                          </div>

                        </div>

                        {/* Actions */}

                        <div className="mt-4 flex flex-wrap gap-2">

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setSelectedAlert(alert)
                            }
                          >
                            View Details
                          </Button>

                          <Button
                            size="sm"
                            variant={
                              isAcknowledged
                                ? "secondary"
                                : "outline"
                            }
                            onClick={() =>
                              setAcknowledged(
                                (current) => ({
                                  ...current,
                                  [alert.id]: true,
                                })
                              )
                            }
                            disabled={isAcknowledged}
                          >
                            {isAcknowledged
                              ? "Acknowledged"
                              : "Acknowledge"}
                          </Button>

                        </div>

                      </div>

                    </div>

                  </div>
                )
              })}

            </div>

          </CardContent>
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* ALL ALERTS SUMMARY                                               */}
        {/* ---------------------------------------------------------------- */}

        <Card>
          <CardHeader>
            <CardTitle>
              Alert Overview
            </CardTitle>

            <CardDescription>
              Status of environmental monitoring for{" "}
              {selectedZone.zone_name}
            </CardDescription>
          </CardHeader>

          <CardContent>

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl border bg-muted/20 p-4">

                <div className="text-sm text-muted-foreground">
                  AQI Status
                </div>

                <div
                  className={`mt-1 text-xl font-semibold ${getAQIColor(
                    selectedZone.aqi
                  )}`}
                >
                  {getAQICategory(selectedZone.aqi)}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  AQI {selectedZone.aqi}
                </div>

              </div>

              <div className="rounded-xl border bg-muted/20 p-4">

                <div className="text-sm text-muted-foreground">
                  Monitoring
                </div>

                <div className="mt-1 text-xl font-semibold text-emerald-500">
                  Active
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  Zone monitoring operational
                </div>

              </div>

              <div className="rounded-xl border bg-muted/20 p-4">

                <div className="text-sm text-muted-foreground">
                  Alert Status
                </div>

                <div className="mt-1 text-xl font-semibold">
                  {acknowledgedCount}/{alerts.length}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  Alerts acknowledged
                </div>

              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DETAILS MODAL                                                      */}
      {/* ------------------------------------------------------------------ */}

      {selectedAlert && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >

          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-2xl">

            <div className="flex items-start justify-between gap-4">

              <div>

                <div className="mb-2 flex items-center gap-2">

                  <Badge
                    variant="outline"
                    className={
                      typeStyles[selectedAlert.type].badge
                    }
                  >
                    {typeStyles[selectedAlert.type].label}
                  </Badge>

                  <span className="text-xs text-muted-foreground">
                    {selectedAlert.time}
                  </span>

                </div>

                <h2 className="text-xl font-semibold">
                  {selectedAlert.title}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedAlert.description}
                </p>

              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setSelectedAlert(null)
                }
              >
                <X className="size-4" />
              </Button>

            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">

              <div className="rounded-lg border p-3">
                <div className="text-muted-foreground">
                  Zone
                </div>

                <div className="mt-1 font-medium">
                  {selectedZone.zone_id}
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="text-muted-foreground">
                  Location
                </div>

                <div className="mt-1 font-medium">
                  {selectedZone.zone_name}
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="text-muted-foreground">
                  AQI
                </div>

                <div
                  className={`mt-1 font-semibold ${getAQIColor(
                    selectedZone.aqi
                  )}`}
                >
                  {selectedZone.aqi}
                </div>
              </div>

              <div className="rounded-lg border p-3">
                <div className="text-muted-foreground">
                  Category
                </div>

                <div className="mt-1 font-medium">
                  {getAQICategory(
                    selectedZone.aqi
                  )}
                </div>
              </div>

              <div className="col-span-2 rounded-lg border p-3">

                <div className="text-muted-foreground">
                  Alert status
                </div>

                <div className="mt-1 font-medium">
                  {acknowledged[selectedAlert.id]
                    ? "Acknowledged"
                    : "Unacknowledged"}
                </div>

              </div>

            </div>

            <div className="mt-6 flex justify-end gap-2">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedAlert(null)
                }
              >
                Close
              </Button>

              <Button
                onClick={() => {
                  setAcknowledged(
                    (current) => ({
                      ...current,
                      [selectedAlert.id]: true,
                    })
                  )

                  setSelectedAlert(null)
                }}
                disabled={
                  acknowledged[selectedAlert.id]
                }
              >
                {acknowledged[selectedAlert.id]
                  ? "Acknowledged"
                  : "Acknowledge Alert"}
              </Button>

            </div>

          </div>

        </div>
      )}
    </DashboardShell>
  )
}