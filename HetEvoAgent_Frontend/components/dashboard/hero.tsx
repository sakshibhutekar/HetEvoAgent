"use client"

import { motion } from "framer-motion"
import { ArrowRight, Activity, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      {/* Decorative brand glow (kept subtle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 right-32 size-64 rounded-full bg-cyan/10 blur-3xl"
      />

      <div className="relative max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          AI models updated 4 minutes ago
        </span>

        <h1 className="mt-4 text-pretty text-3xl font-semibold tracking-tight md:text-4xl">
          AI Powered Air Quality Management
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground md:text-lg">
          Monitor air quality, predict pollution trends, analyze environmental
          data, and receive AI-powered insights — all in one intelligent
          command center.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href="/dashboard">
            <Button size="lg" className="gap-1.5">
              Explore Dashboard
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
          <Link href="/live-aqi">
            <Button size="lg" variant="outline" className="gap-1.5">
              <Activity className="size-4 mr-2" />
              View Live AQI
            </Button>
          </Link>
          <Link href="/reports">
            <Button size="lg" variant="ghost" className="gap-1.5">
              <FileText className="size-4 mr-2" />
              Generate AI Report
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
