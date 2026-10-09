"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/** Themed tooltip used across every recharts widget for consistency. */
export function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  unit?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{
        backgroundColor: "var(--chart-tooltip-bg)",
        borderColor: "var(--chart-tooltip-border)"
      }}
    >
      {label && <p className="mb-1 font-medium" style={{ color: "var(--chart-text)" }}>{label}</p>}
      <div className="flex flex-col gap-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="capitalize" style={{ color: "var(--chart-text)" }}>
              {entry.name}
            </span>
            <span className="ml-auto font-medium tabular-nums" style={{ color: "var(--chart-text)" }}>
              {entry.value}
              {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ChartCardProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
  children: ReactNode
  delay?: number
}

export function ChartCard({
  title,
  description,
  action,
  className,
  children,
  delay = 0,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <Card className="h-full">
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          {action}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}
