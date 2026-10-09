export interface Insight {
  id: string
  title: string
  detail: string
  severity: "high" | "medium" | "low"
  confidence: number
}

export interface RecommendedAction {
  id: string
  label: string
  icon: string
}

export interface Alert {
  id: string
  title: string
  description: string
  time: string
  type: "critical" | "warning" | "info" | "success"
}

export interface Zone {
  id: string
  name: string
  aqi: number
  x: number
  y: number
}

export interface Report {
  id: string
  location: string
  aqi: number
  pm25: number
  pm10: number
  temp: number
  updated: string
}

export interface Kpi {
  id: string
  label: string
  value: number
  unit: string
  change: number
  higherIsBetter: boolean
  icon: string
  spark: number[]
  status: string
}

export const kpis: Kpi[] = [
  {
    id: "k1",
    label: "AQI Level",
    value: 185,
    unit: "AQI",
    change: -12,
    higherIsBetter: false,
    icon: "gauge",
    spark: [195, 188, 192, 185, 180, 185, 182, 185],
    status: "Moderate air quality"
  },
  {
    id: "k2",
    label: "PM2.5",
    value: 74,
    unit: "µg/m³",
    change: -8,
    higherIsBetter: false,
    icon: "cloud-fog",
    spark: [82, 78, 80, 76, 74, 75, 73, 74],
    status: "Below WHO guidelines"
  },
  {
    id: "k3",
    label: "PM10",
    value: 135,
    unit: "µg/m³",
    change: -15,
    higherIsBetter: false,
    icon: "wind",
    spark: [150, 145, 140, 138, 135, 137, 133, 135],
    status: "Improving trend"
  },
  {
    id: "k4",
    label: "Temperature",
    value: 30,
    unit: "°C",
    change: 2,
    higherIsBetter: false,
    icon: "thermometer",
    spark: [28, 29, 29, 30, 30, 31, 30, 30],
    status: "Normal range"
  },
  {
    id: "k5",
    label: "Humidity",
    value: 65,
    unit: "%",
    change: 5,
    higherIsBetter: true,
    icon: "droplets",
    spark: [60, 62, 63, 64, 65, 64, 66, 65],
    status: "Optimal levels"
  },
  {
    id: "k6",
    label: "Wind Speed",
    value: 12,
    unit: "km/h",
    change: 8,
    higherIsBetter: true,
    icon: "wind",
    spark: [4, 6, 8, 10, 11, 12, 11, 12],
    status: "Good dispersion"
  },
  {
    id: "k7",
    label: "Air Quality Index",
    value: 185,
    unit: "Index",
    change: -12,
    higherIsBetter: false,
    icon: "sparkles",
    spark: [195, 188, 192, 185, 180, 185, 182, 185],
    status: "Moderate category"
  }
]

export const insights: Insight[] = [
  {
    id: "in1",
    title: "Morning Ozone Spike",
    detail: "Ground-level ozone is expected to rise between 8 AM and 11 AM due to increased solar radiation and commuter traffic.",
    severity: "high",
    confidence: 88,
  },
  {
    id: "in2",
    title: "Particulate Dispersion",
    detail: "Winds from the northwest are helping disperse PM2.5 in northern zones, leading to improved air quality index by evening.",
    severity: "low",
    confidence: 94,
  },
  {
    id: "in3",
    title: "Industrial Zone Alert",
    detail: "Localized sensor clusters near Okhla indicate stagnant air, potentially trapping sulfur dioxide emissions overnight.",
    severity: "medium",
    confidence: 76,
  },
]

export const recommendedActions: RecommendedAction[] = [
  {
    id: "a1",
    label: "Minimize outdoor activity during peak hours",
    icon: "shield",
  },
  {
    id: "a2",
    label: "Enforce odd-even vehicle routing in central zone",
    icon: "ban",
  },
  {
    id: "a3",
    label: "Encourage EV use or remote work for public sectors",
    icon: "car",
  },
  {
    id: "a4",
    label: "Activate indoor HEPA air filtration systems",
    icon: "home",
  },
]

export const alerts: Alert[] = [
  {
    id: "al1",
    title: "Critical AQI Exceeded",
    description: "Anand Vihar station recorded AQI above 420. Emergency action plan activated.",
    time: "2 mins ago",
    type: "critical",
  },
  {
    id: "al2",
    title: "Sensor Offline Warning",
    description: "Station Sector 62, Noida has failed to transmit telemetry for 3 consecutive intervals.",
    time: "15 mins ago",
    type: "warning",
  },
  {
    id: "al3",
    title: "Heavy Rainfall Forecast",
    description: "Precipitation expected at 8:00 PM. Wet deposition will significantly wash out PM10.",
    time: "1 hour ago",
    type: "info",
  },
  {
    id: "al4",
    title: "Target Achieved",
    description: "NSP zone meets clean air targets for the third consecutive day this week.",
    time: "4 hours ago",
    type: "success",
  },
]

export const aqiTrend = [
  { time: "00:00", aqi: 150, forecast: 152 },
  { time: "02:00", aqi: 145, forecast: 147 },
  { time: "04:00", aqi: 140, forecast: 142 },
  { time: "06:00", aqi: 165, forecast: 160 },
  { time: "08:00", aqi: 185, forecast: 180 },
  { time: "10:00", aqi: 195, forecast: 200 },
  { time: "12:00", aqi: 210, forecast: 205 },
  { time: "14:00", aqi: 205, forecast: 210 },
  { time: "16:00", aqi: 190, forecast: 195 },
  { time: "18:00", aqi: 180, forecast: 185 },
  { time: "20:00", aqi: 175, forecast: 170 },
  { time: "22:00", aqi: 160, forecast: 158 },
]

export const monthlyPollution = [
  { month: "Jan", value: 280 },
  { month: "Feb", value: 240 },
  { month: "Mar", value: 190 },
  { month: "Apr", value: 160 },
  { month: "May", value: 150 },
  { month: "Jun", value: 120 },
  { month: "Jul", value: 95 },
  { month: "Aug", value: 85 },
  { month: "Sep", value: 110 },
  { month: "Oct", value: 210 },
  { month: "Nov", value: 310 },
  { month: "Dec", value: 295 },
]

export const particulateCompare = [
  { day: "Mon", pm25: 65, pm10: 110 },
  { day: "Tue", pm25: 72, pm10: 125 },
  { day: "Wed", pm25: 80, pm10: 140 },
  { day: "Thu", pm25: 55, pm10: 95 },
  { day: "Fri", pm25: 48, pm10: 88 },
  { day: "Sat", pm25: 60, pm10: 105 },
  { day: "Sun", pm25: 70, pm10: 118 },
]

export const pollutionSources = [
  { name: "Vehicular Emissions", value: 38, color: "var(--chart-1)" },
  { name: "Industrial Activities", value: 25, color: "var(--chart-2)" },
  { name: "Construction Dust", value: 18, color: "var(--chart-3)" },
  { name: "Waste Burning", value: 11, color: "var(--chart-4)" },
  { name: "Domestic/Others", value: 8, color: "var(--chart-5)" },
]

export const zones: Zone[] = [
  { id: "z1", name: "Anand Vihar", aqi: 420, x: 25, y: 35 },
  { id: "z2", name: "Connaught Place", aqi: 155, x: 50, y: 50 },
  { id: "z3", name: "Dwarka Sector 8", aqi: 185, x: 15, y: 65 },
  { id: "z4", name: "Okhla Phase 3", aqi: 280, x: 75, y: 75 },
  { id: "z5", name: "Rohini Sector 16", aqi: 95, x: 30, y: 15 },
]

export const reports: Report[] = [
  { id: "r1", location: "Anand Vihar, Delhi", aqi: 420, pm25: 185, pm10: 310, temp: 31, updated: "2 mins ago" },
  { id: "r2", location: "Connaught Place, Delhi", aqi: 155, pm25: 58, pm10: 112, temp: 29, updated: "5 mins ago" },
  { id: "r3", location: "Dwarka Sector 8, Delhi", aqi: 185, pm25: 74, pm10: 135, temp: 30, updated: "8 mins ago" },
  { id: "r4", location: "Okhla Phase 3, Delhi", aqi: 280, pm25: 115, pm10: 210, temp: 32, updated: "12 mins ago" },
  { id: "r5", location: "Rohini Sector 16, Delhi", aqi: 95, pm25: 32, pm10: 65, temp: 28, updated: "15 mins ago" },
]

export function getAqiCategory(aqi: number) {
  if (aqi <= 50) {
    return { label: "Good", hex: "#10b981", soft: "bg-success/10 text-success" }
  } else if (aqi <= 100) {
    return { label: "Satisfactory", hex: "#84cc16", soft: "bg-green-500/10 text-green-500" }
  } else if (aqi <= 200) {
    return { label: "Moderate", hex: "#f59e0b", soft: "bg-warning/10 text-[color:var(--warning)]" }
  } else if (aqi <= 300) {
    return { label: "Poor", hex: "#f97316", soft: "bg-orange-500/10 text-orange-500" }
  } else if (aqi <= 400) {
    return { label: "Very Poor", hex: "#ef4444", soft: "bg-destructive/10 text-destructive" }
  } else {
    return { label: "Severe", hex: "#8b5cf6", soft: "bg-purple-500/10 text-purple-500" }
  }
}
