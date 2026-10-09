/* eslint-disable react/display-name */
"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Download, Eye, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { getAqiCategory, reports } from "@/lib/aqi-data"
import { useLocation } from "@/components/location-provider"

export function ReportsTable() {
  const { selectedArea } = useLocation()
  const currentReports = [{ ...reports[0], location: selectedArea.name, aqi: selectedArea.aqi, pm25: selectedArea.pm25, pm10: selectedArea.pm10, temp: selectedArea.temperature, updated: selectedArea.lastUpdated }]
  const [selectedReport, setSelectedReport] = useState<typeof reports[number] | null>(null)

  function exportReports() {
    const rows = [["Location", "AQI", "PM2.5", "PM10", "Temperature"], ...currentReports.map((report) => [report.location, report.aqi, report.pm25, report.pm10, report.temp])]
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" }))
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `aqi-reports-${new Date().toISOString().slice(0, 10)}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription className="mt-0.5">
              Station readings across all monitored locations
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={exportReports}>
            <Download className="size-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Location</TableHead>
                  <TableHead>AQI</TableHead>
                  <TableHead>PM2.5</TableHead>
                  <TableHead>PM10</TableHead>
                  <TableHead>Temp</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentReports.map((r) => {
                  const cat = getAqiCategory(r.aqi)
                  return (
                    <TableRow key={r.id} className="group">
                      <TableCell className="pl-6 font-medium">
                        {r.location}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: cat.hex }}
                          />
                          {r.aqi}
                        </span>
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {r.pm25}
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {r.pm10}
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {r.temp}°C
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn(cat.soft)}>
                          {cat.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.updated}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`View ${r.location}`}
                            onClick={() => setSelectedReport(r)}
                          >
                            <Eye className="size-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  aria-label={`More actions for ${r.location}`}
                                />
                              }
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedReport(r)}>View details</DropdownMenuItem>
                              <DropdownMenuItem onClick={exportReports}>Download report</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setSelectedReport(r)}>Set alert</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {selectedReport && <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"><div className="flex items-center justify-between"><h2 className="font-semibold">{selectedReport.location} report</h2><Button variant="ghost" size="sm" onClick={() => setSelectedReport(null)}>Close</Button></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><span>AQI: <strong>{selectedReport.aqi}</strong></span><span>PM2.5: <strong>{selectedReport.pm25}</strong></span><span>PM10: <strong>{selectedReport.pm10}</strong></span><span>Temperature: <strong>{selectedReport.temp}°C</strong></span></div></div></div>}
      </Card>
    </motion.div>
  )
}
