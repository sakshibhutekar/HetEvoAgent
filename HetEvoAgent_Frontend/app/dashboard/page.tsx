import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Hero } from "@/components/dashboard/hero"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import MapSection from "@/components/dashboard/map-section"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { RightRail } from "@/components/dashboard/right-rail"
import { Footer } from "@/components/dashboard/footer"

export default function DashboardPage() {
  return (
    <DashboardShell>

      {/* =================================================
          TOP — FULL WIDTH
          ================================================= */}

      <section className="space-y-5">
        <Hero />
        <KpiCards />
        <MapSection />
      </section>


      {/* =================================================
          ANALYTICS — FULL WIDTH
          ================================================= */}

      <section className="mt-5">
        <AnalyticsCharts />
      </section>


      {/* =================================================
          REAL-TIME INFORMATION
          ================================================= */}

      <section className="mt-5">
        <RightRail />
      </section>


      <Footer />

    </DashboardShell>
  )
}