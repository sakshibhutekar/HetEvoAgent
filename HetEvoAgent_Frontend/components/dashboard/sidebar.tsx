"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  BarChart3,
  Bell,
  BrainCircuit,
  FileText,
  Grid2X2,
  MapPinned,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  Wind,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarContentProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
  variant?: "desktop" | "mobile"
}

const navigation = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        icon: Grid2X2,
        href: "/dashboard",
      },
      {
        label: "Live AQI",
        icon: Activity,
        href: "/live-aqi",
        badge: "Live",
      },
      {
        label: "Prediction",
        icon: BarChart3,
        href: "/prediction",
      },
      {
        label: "Analytics",
        icon: BarChart3,
        href: "/analytics",
      },
    ],
  },
  {
    title: "MONITORING",
    items: [
      {
        label: "Heatmap",
        icon: MapPinned,
        href: "/heatmap",
      },
      {
        label: "Alerts",
        icon: Bell,
        href: "/alerts",
      },
      {
        label: "Reports",
        icon: FileText,
        href: "/reports",
      },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      {
        label: "AI Insights",
        icon: BrainCircuit,
        href: "/ai-insights",
      },
      {
        label: "Settings",
        icon: Settings,
        href: "/settings",
      },
      {
        label: "Profile",
        icon: User,
        href: "/profile",
      },
    ],
  },
]

export function SidebarContent({
  collapsed = false,
  onToggleCollapse,
  variant = "desktop",
}: SidebarContentProps) {
  const pathname = usePathname()

  const isMobile = variant === "mobile"
  const showLabels = isMobile || !collapsed

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-background",
        isMobile ? "w-full" : "w-full"
      )}
    >
      {/* =====================================================
          LOGO / BRAND
          ===================================================== */}

      <div
        className={cn(
          "flex h-20 shrink-0 items-center border-b border-border",
          showLabels ? "px-5" : "justify-center px-3"
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3",
            !showLabels && "justify-center"
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
            <Wind className="size-5" />
          </div>

          {showLabels && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold">
                HetEvoAgent
              </p>
              <p className="text-xs text-muted-foreground">
                Air Intelligence
              </p>
            </div>
          )}
        </Link>
      </div>

      {/* =====================================================
          NAVIGATION
          ===================================================== */}

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              {showLabels && (
                <p className="mb-2 px-2 text-[11px] font-semibold tracking-wider text-muted-foreground">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon

                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(`${item.href}/`))

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={!showLabels ? item.label : undefined}
                      className={cn(
                        "group relative flex items-center rounded-lg text-sm transition-colors",
                        showLabels
                          ? "gap-3 px-3 py-2.5"
                          : "justify-center px-2 py-2.5",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                      )}

                      <Icon
                        className={cn(
                          "size-[18px] shrink-0",
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />

                      {showLabels && (
                        <>
                          <span className="min-w-0 flex-1 truncate">
                            {item.label}
                          </span>

                          {item.badge && (
                            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* =====================================================
          COLLAPSE BUTTON
          ===================================================== */}

      {!isMobile && onToggleCollapse && (
        <div className="shrink-0 border-t border-border p-3">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={onToggleCollapse}
            aria-label={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            className={cn(
              "text-muted-foreground hover:text-foreground",
              collapsed ? "mx-auto" : "w-full justify-center"
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <>
                <PanelLeftClose className="size-4" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      )}
    </aside>
  )
}