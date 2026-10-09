import { NextResponse } from "next/server"
import { getAQICategory, getSafetyMeasures, type WardData } from "@/lib/csmc-ward-data"

interface ReportRequest {
  location?: string
  wards?: WardData[]
  purpose?: string
}

function buildDataReport(wards: WardData[], location: string, purpose: string) {
  const averageAqi = Math.round(wards.reduce((sum, ward) => sum + ward.aqi, 0) / wards.length)
  const highest = wards.reduce((current, ward) => ward.aqi > current.aqi ? ward : current, wards[0])
  const lowest = wards.reduce((current, ward) => ward.aqi < current.aqi ? ward : current, wards[0])
  const pollutants = [
    { name: "PM2.5", value: wards.reduce((sum, ward) => sum + ward.pm25, 0) / wards.length },
    { name: "PM10", value: wards.reduce((sum, ward) => sum + ward.pm10, 0) / wards.length },
    { name: "NO2", value: wards.reduce((sum, ward) => sum + ward.no2, 0) / wards.length },
    { name: "SO2", value: wards.reduce((sum, ward) => sum + ward.so2, 0) / wards.length },
  ].sort((a, b) => b.value - a.value)
  const industrialCount = wards.filter((ward) => ward.industrial).length
  const measures = getSafetyMeasures(averageAqi)

  return [
    `## ${purpose || "Air Quality Report"}`,
    `Area: ${location || "Chhatrapati Sambhajinagar"}`,
    `Data coverage: ${wards.length} CSN wards`,
    "",
    `### Overall AQI status\nThe current average AQI is ${averageAqi}, classified as ${getAQICategory(averageAqi)}. The highest reading is ${highest.aqi} in ${highest.name}; the lowest is ${lowest.aqi} in ${lowest.name}.`,
    `### Major pollutants\n${pollutants.map((pollutant) => `${pollutant.name}: ${pollutant.value.toFixed(1)} (ward average)`).join("\n")}`,
    `### Health and environmental impact\nAt this AQI level, ${measures[0].toLowerCase()}. Higher exposure risk is concentrated around ${highest.name}, where ${highest.industrial ? "industrial activity and" : "local traffic and"} particulate readings are elevated.`,
    `### Trends and possible causes\n${industrialCount} of ${wards.length} selected wards are marked industrial. Lower wind speeds coincide with the highest AQI readings, while ${lowest.name} has the strongest recorded dispersion conditions at ${lowest.windSpeed} km/h.`,
    `### Recommendations\n${measures.map((measure) => `- ${measure}`).join("\n")}\n- Prioritize source inspection and traffic controls around ${highest.name}.\n- Continue ward-level monitoring before changing operating limits.`,
    `### Local observations\nThe selected area spans ${wards.map((ward) => ward.name).join(", ")}. This report is calculated from the project’s current ward dataset; connect an AI provider server-side for model-generated narrative enrichment.`,
  ].join("\n\n")
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as ReportRequest
    const wards = body.wards ?? []
    if (wards.length === 0) {
      return NextResponse.json({ error: "No AQI data is available for this report." }, { status: 400 })
    }

    const fallback = buildDataReport(wards, body.location ?? "", body.purpose ?? "")
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ report: fallback, source: "project-data" })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: "Write a concise factual AQI report with headings for overview, pollutants, impact, trends, causes, recommendations, and local observations. Use only supplied data." },
          { role: "user", content: JSON.stringify({ location: body.location, purpose: body.purpose, wards }) },
        ],
      }),
    })
    if (!response.ok) throw new Error("AI provider request failed")
    const result = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    return NextResponse.json({ report: result.choices?.[0]?.message?.content || fallback, source: "ai-provider" })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Report generation failed." }, { status: 500 })
  }
}
