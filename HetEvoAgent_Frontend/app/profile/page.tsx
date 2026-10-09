import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, Camera } from "lucide-react"

export default function ProfilePage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          <Button className="gap-2">
            <Save className="size-4" />
            Save Changes
          </Button>
        </div>

        {/* Profile Overview */}
        <Card className="bg-gradient-to-br from-primary/10 to-cyan/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="size-24">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    P
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 size-8 rounded-full"
                >
                  <Camera className="size-4" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">Pratikk</h2>
                  <Badge className="bg-primary">Admin</Badge>
                </div>
                <p className="text-muted-foreground mt-1">MIT Student</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="size-4" />
                    pratik@hetevo.ai
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4" />
                    Chhatrapati Sambhajinagar, India
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue="Pratikk" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input defaultValue="pratik@hetevo.ai" type="email" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input defaultValue="+91 98765 43210" type="tel" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Location</label>
              <Input defaultValue="Chhatrapati Sambhajinagar, India" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Job Title</label>
              <Input defaultValue="MIT Student" />
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5 text-primary" />
              Account Security
            </CardTitle>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button variant="outline" className="gap-2">
              <Edit className="size-4" />
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Account Details
            </CardTitle>
            <CardDescription>
              Your account information and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">January 15, 2024</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-muted-foreground">Account Type</span>
                <span className="font-medium">Enterprise</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-muted-foreground">Subscription Status</span>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <span className="text-muted-foreground">Last Login</span>
                <span className="font-medium">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-destructive/5">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
