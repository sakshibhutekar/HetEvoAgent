import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import { AnalyticsControls } from "@/components/dashboard/analytics-controls"

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive air quality data analysis and trends
            </p>
          </div>
          <AnalyticsControls />
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average AQI (30 days)</CardDescription>
              <CardTitle className="text-2xl">167</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">↓ 12% vs last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Peak AQI</CardDescription>
              <CardTitle className="text-2xl">342</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Recorded on Nov 15</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Good Air Days</CardDescription>
              <CardTitle className="text-2xl">18</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">60% of month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Sensor Uptime</CardDescription>
              <CardTitle className="text-2xl">99.2%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Excellent reliability</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5 text-primary" />
                AQI Trend Analysis
              </CardTitle>
              <CardDescription>
                Monthly air quality index patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsCharts />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pollutant Breakdown</CardTitle>
              <CardDescription>
                PM2.5 vs PM10 comparison analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                <p>Pollutant comparison chart</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Statistical Analysis</CardTitle>
            <CardDescription>
              Detailed metrics and correlations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Standard Deviation</p>
                <p className="text-xl font-semibold mt-1">±45.2</p>
                <p className="text-xs text-muted-foreground mt-1">AQI variance</p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Correlation (Temp)</p>
                <p className="text-xl font-semibold mt-1">0.67</p>
                <p className="text-xs text-muted-foreground mt-1">Positive correlation</p>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">Correlation (Wind)</p>
                <p className="text-xl font-semibold mt-1">-0.42</p>
                <p className="text-xs text-muted-foreground mt-1">Negative correlation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
