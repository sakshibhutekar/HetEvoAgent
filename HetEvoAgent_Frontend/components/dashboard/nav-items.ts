import {
  Activity,
  BarChart3,
  Bell,
  Brain,
  FileText,
  LayoutDashboard,
  MapPinned,
  Settings,
  TrendingUp,
  User,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  icon: LucideIcon
  badge?: string
  href: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Live AQI", icon: Activity, badge: "Live", href: "/live-aqi" },
      { label: "Prediction", icon: TrendingUp, href: "/prediction" },
      { label: "Analytics", icon: BarChart3, href: "/analytics" },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { label: "Heatmap", icon: MapPinned, href: "/heatmap" },
      { label: "Alerts", icon: Bell, badge: "4", href: "/alerts" },
      { label: "Reports", icon: FileText, href: "/reports" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "AI Insights", icon: Brain, href: "/ai-insights" },
      { label: "Settings", icon: Settings, href: "/settings" },
      { label: "Profile", icon: User, href: "/profile" },
    ],
  },
]
