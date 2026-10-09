/* eslint-disable react/display-name */
"use client"

import { useMemo, useState } from "react"
import {
  Bell,
  ChevronDown,
  Cloud,
  LogOut,
  MapPin,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

import { alerts } from "@/lib/aqi-data"
import { usePrediction } from "@/components/prediction-provider"


interface TopbarProps {
  onOpenMobileNav: () => void
}


const typeDot: Record<string, string> = {
  critical: "bg-destructive",
  warning: "bg-[color:var(--warning)]",
  info: "bg-primary",
  success: "bg-success",
}


export function Topbar({
  onOpenMobileNav,
}: TopbarProps) {

  const router = useRouter()

  const {
    zones,
    selectedZone,
    prediction,
    isLoading,
    error,
    selectZone,
  } = usePrediction()


  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)


  /* =====================================================
     Search real backend prediction zones
     ===================================================== */

  const suggestions = useMemo(() => {

    const normalized =
      query.trim().toLowerCase()

    if (!normalized) {
      return []
    }

    return zones
      .filter((zone) =>
        `${zone.zone_name} ${zone.zone_type}`
          .toLowerCase()
          .includes(normalized)
      )
      .slice(0, 6)

  }, [zones, query])


  /* =====================================================
     Select zone
     ===================================================== */

  async function handleZoneSelect(
    zoneName: string
  ) {

    const zone = zones.find(
      (item) =>
        item.zone_name === zoneName
    )

    if (!zone) {
      return
    }

    setQuery(zone.zone_name)
    setOpen(false)

    await selectZone(zone)

    router.push(
      `/heatmap?zone=${encodeURIComponent(
        zone.zone_name
      )}`
    )
  }


  const temperature =
    prediction?.weather?.T2M


  return (

    <header
      className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border px-4 md:px-6"
    >


      {/* =================================================
          Mobile navigation
          ================================================= */}

      <Button
        variant="outline"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={onOpenMobileNav}
      >
        <Menu className="size-[18px]" />
      </Button>


      {/* =================================================
          Search
          ================================================= */}

      <div className="relative hidden max-w-md flex-1 sm:block">

        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />


        <Input
          type="search"
          placeholder="Search prediction zones..."
          aria-label="Search prediction zones"
          className="h-9 rounded-lg pl-9"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
        />


        {/* ==============================================
            Search suggestions
            ============================================== */}

        {open && query.trim() && (

          <div className="absolute left-0 right-0 top-11 z-50 rounded-lg border border-border bg-card p-1 shadow-lg">

            {suggestions.length ? (

              suggestions.map((zone) => (

                <button
                  key={zone.zone_name}
                  type="button"
                  className="flex w-full items-start gap-2 rounded-md p-2 text-left text-sm hover:bg-muted"
                  onClick={() =>
                    handleZoneSelect(
                      zone.zone_name
                    )
                  }
                >

                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                  <span>

                    <span className="block font-medium">
                      {zone.zone_name}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {zone.zone_type}
                    </span>

                  </span>

                </button>

              ))

            ) : (

              <p className="p-2 text-sm text-muted-foreground">
                No prediction zone found
              </p>

            )}

          </div>

        )}


        <kbd
          className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline-flex"
        >
          ⌘K
        </kbd>

      </div>


      {/* =================================================
          Right side
          ================================================= */}

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">


        {/* ================================================
            REAL WEATHER
            ================================================ */}

        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 xl:flex">

          <Cloud className="size-4 text-[color:var(--cyan)]" />

          <div className="leading-none">

            <p className="text-sm font-semibold">

              {temperature !== undefined
                ? `${temperature.toFixed(1)}°C`
                : "—"}

            </p>

            <p className="text-[11px] text-muted-foreground">

              {selectedZone?.zone_name ?? "Loading zone..."}

            </p>

          </div>

        </div>


        {/* ================================================
            REAL SELECTED LOCATION
            ================================================ */}

        <div className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground md:flex">

          <MapPin className="size-4 text-primary" />

          <span className="font-medium text-foreground">

            {isLoading && !selectedZone
              ? "Loading AQI..."
              : error && !selectedZone
                ? "AQI unavailable"
                : selectedZone
                  ? `${selectedZone.zone_name}, Chhatrapati Sambhajinagar`
                  : "No zone selected"}

          </span>

        </div>


        {/* ================================================
            Notifications
            ================================================ */}

        <DropdownMenu>

          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative text-muted-foreground hover:text-foreground"
              />
            }
          >

            <Bell className="size-[18px]" />

            <span className="absolute right-1.5 top-1.5 flex size-2">

              <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-75" />

              <span className="relative inline-flex size-2 rounded-full bg-destructive" />

            </span>

          </DropdownMenuTrigger>


          <DropdownMenuContent
            align="end"
            className="w-80"
          >

            <div className="flex items-center justify-between px-2 py-1.5">

              <DropdownMenuLabel className="p-0">
                Notifications
              </DropdownMenuLabel>

              <Badge variant="secondary">
                {alerts.length} new
              </Badge>

            </div>


            <DropdownMenuSeparator />


            {alerts
              .slice(0, 4)
              .map((alert) => (

                <DropdownMenuItem
                  key={alert.id}
                  className="items-start gap-2.5 py-2"
                >

                  <span
                    className={`mt-1.5 size-2 shrink-0 rounded-full ${typeDot[alert.type]}`}
                  />

                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium">
                      {alert.title}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      {alert.description}
                    </p>

                    <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                      {alert.time}
                    </p>

                  </div>

                </DropdownMenuItem>

              ))}

          </DropdownMenuContent>

        </DropdownMenu>


        {/* =================================================
            Theme
            ================================================= */}

        <ThemeToggle />


        {/* =================================================
            Account
            ================================================= */}

        <DropdownMenu>

          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-9 gap-2 pl-1.5 pr-2"
                aria-label="Account menu"
              />
            }
          >

            <Avatar className="size-7">

              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                P
              </AvatarFallback>

            </Avatar>

            <span className="hidden text-sm font-medium sm:inline">
              Pratikk
            </span>

            <ChevronDown className="hidden size-4 text-muted-foreground sm:inline" />

          </DropdownMenuTrigger>


          <DropdownMenuContent
            align="end"
            className="w-56"
          >

            <DropdownMenuLabel>

              <div className="flex flex-col">

                <span className="text-sm font-medium">
                  Pratikk
                </span>

                <span className="text-xs font-normal text-muted-foreground">
                  pratik@hetevo.ai
                </span>

              </div>

            </DropdownMenuLabel>


            <DropdownMenuSeparator />


            <DropdownMenuItem asChild>

              <Link
                href="/profile"
                className="flex cursor-pointer items-center gap-2"
              >

                <User className="size-4" />

                Profile

              </Link>

            </DropdownMenuItem>


            <DropdownMenuItem asChild>

              <Link
                href="/settings"
                className="flex cursor-pointer items-center gap-2"
              >

                <Settings className="size-4" />

                Settings

              </Link>

            </DropdownMenuItem>


            <DropdownMenuSeparator />


            <DropdownMenuItem>

              <LogOut className="size-4" />

              Sign out

            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

    </header>
  )
}