import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, MapPin, Shield, Palette, Database, Save, RotateCcw } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Configure your HetEvoAgent preferences and system settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RotateCcw className="size-4" />
              Reset to Default
            </Button>
            <Button className="gap-2">
              <Save className="size-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5 text-primary" />
              General Settings
            </CardTitle>
            <CardDescription>
              Basic application configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Application Name</label>
              <Input defaultValue="HetEvoAgent" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Default Language</label>
              <Input defaultValue="English (US)" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Timezone</label>
              <Input defaultValue="Asia/Kolkata (UTC+5:30)" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5 text-primary" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how and when you receive alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Critical Alerts</p>
                <p className="text-sm text-muted-foreground">Immediate notifications for critical AQI levels</p>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Daily Summary</p>
                <p className="text-sm text-muted-foreground">Receive daily air quality summary at 8 PM</p>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Weekly analysis and trend reports</p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Location Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              Location Settings
            </CardTitle>
            <CardDescription>
              Configure your monitoring location and zones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Primary Location</label>
              <Input defaultValue="Chhatrapati Sambhajinagar, India" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Monitoring Radius</label>
              <Input defaultValue="25 km" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Default Zone</label>
              <Input defaultValue="Connaught Place" />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Dark mode</p>
              </div>
              <Badge className="bg-primary">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Animations</p>
                <p className="text-sm text-muted-foreground">Enable UI animations</p>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              Data & Privacy
            </CardTitle>
            <CardDescription>
              Manage your data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Data Retention</p>
                <p className="text-sm text-muted-foreground">Keep data for 90 days</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all your data</p>
              </div>
              <Button variant="outline" size="sm">Export</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account</p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="size-5 text-primary" />
              System Settings
            </CardTitle>
            <CardDescription>
              Advanced system configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">API Rate Limit</p>
                <p className="text-sm text-muted-foreground">1000 requests/hour</p>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Cache Duration</p>
                <p className="text-sm text-muted-foreground">5 minutes</p>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium">Debug Mode</p>
                <p className="text-sm text-muted-foreground">Enable detailed logging</p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
