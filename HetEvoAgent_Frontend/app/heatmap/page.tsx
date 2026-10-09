import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { HeatmapClient } from "@/components/maps/heatmap-client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MapPinned,
  Layers3,
  Map,
  Database,
} from "lucide-react"

export default function HeatmapPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">

        {/* Header */}

        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <MapPinned className="size-6 text-primary" />
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                AQI Heatmap
              </h1>

              <p className="mt-1 text-muted-foreground">
                Hyper-local air quality visualization across six HetEvoAgent prediction zones
              </p>
            </div>
          </div>
        </div>

        {/* Main Map */}

        <HeatmapClient className="h-auto" />

        {/* Information Cards */}

        <div className="grid gap-4 md:grid-cols-3">

          {/* Heatmap */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Layers3 className="size-5 text-primary" />
                Heatmap
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                Visualizes the spatial distribution of air pollution
                using AQI, PM2.5, or PM10 intensity.
              </p>

              <div className="mt-4 h-3 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 via-orange-500 via-red-500 to-purple-700" />

              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>Lower pollution</span>
                <span>Higher pollution</span>
              </div>
            </CardContent>
          </Card>

          {/* Zones */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Map className="size-5 text-primary" />
                Prediction Zones
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">

                {[
                  ["Z1", "Chikalthana MIDC"],
                  ["Z2", "Waluj / More Chowk"],
                  ["Z3", "Gulmandi / Central City"],
                  ["Z4", "CIDCO"],
                  ["Z5", "Shendra"],
                  ["Z6", "Deolai"],
                ].map(([id, name]) => (
                  <div
                    key={id}
                    className="rounded-lg border bg-muted/30 p-2"
                  >
                    <div className="text-xs font-semibold text-primary">
                      {id}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {name}
                    </div>
                  </div>
                ))}

              </div>
            </CardContent>
          </Card>

          {/* Data */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="size-5 text-primary" />
                Visualization Data
              </CardTitle>
            </CardHeader>

            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 6 HetEvoAgent prediction zones</li>
                <li>• AQI visualization</li>
                <li>• PM2.5 visualization</li>
                <li>• PM10 visualization</li>
                <li>• Interactive zone boundaries</li>
                <li>• Zone-level environmental details</li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardShell>
  )
}