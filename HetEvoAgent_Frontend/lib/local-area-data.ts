import { CSMC_WARDS, type WardData } from "./csmc-ward-data"

// Development fallback only: the repository has no local-area API or database.
// Values are explicit per-area records, never generated at runtime.
const fallbackOverrides: Array<Pick<WardData, "id" | "name" | "aqi" | "pm25" | "pm10" | "co" | "no2" | "so2" | "o3" | "temperature" | "humidity" | "windSpeed">> = [
  { id: "area-garkheda", name: "Garkheda", aqi: 128, pm25: 64, pm10: 88, co: 1.1, no2: 31, so2: 16, o3: 41, temperature: 31, humidity: 67, windSpeed: 13 },
  { id: "area-kranti-chowk", name: "Kranti Chowk", aqi: 176, pm25: 89, pm10: 121, co: 1.7, no2: 46, so2: 24, o3: 49, temperature: 33, humidity: 63, windSpeed: 9 },
  { id: "area-osmanpura", name: "Osmanpura", aqi: 116, pm25: 57, pm10: 81, co: 1, no2: 29, so2: 15, o3: 39, temperature: 30, humidity: 69, windSpeed: 14 },
  { id: "area-seven-hills", name: "Seven Hills", aqi: 104, pm25: 51, pm10: 73, co: 0.9, no2: 27, so2: 14, o3: 36, temperature: 30, humidity: 70, windSpeed: 15 },
  { id: "area-shahnoorwadi", name: "Shahnoorwadi", aqi: 151, pm25: 76, pm10: 102, co: 1.4, no2: 39, so2: 21, o3: 46, temperature: 32, humidity: 65, windSpeed: 11 },
  { id: "area-mukundwadi", name: "Mukundwadi", aqi: 137, pm25: 68, pm10: 94, co: 1.2, no2: 34, so2: 18, o3: 43, temperature: 31, humidity: 66, windSpeed: 12 },
  { id: "area-satara-parisar", name: "Satara Parisar", aqi: 92, pm25: 45, pm10: 62, co: 0.8, no2: 25, so2: 13, o3: 35, temperature: 29, humidity: 72, windSpeed: 16 },
  { id: "area-paithan-road", name: "Paithan Road", aqi: 162, pm25: 82, pm10: 113, co: 1.5, no2: 43, so2: 23, o3: 48, temperature: 33, humidity: 62, windSpeed: 10 },
  { id: "area-jalna-road", name: "Jalna Road", aqi: 188, pm25: 96, pm10: 129, co: 1.8, no2: 50, so2: 26, o3: 53, temperature: 34, humidity: 60, windSpeed: 8 },
  { id: "area-cannaught-place", name: "Cannaught Place", aqi: 149, pm25: 74, pm10: 101, co: 1.3, no2: 38, so2: 20, o3: 45, temperature: 32, humidity: 64, windSpeed: 11 },
]

function createFallbackArea(override: typeof fallbackOverrides[number], template: WardData): WardData {
  return { ...template, ...override, lastUpdated: template.lastUpdated, landmarks: [override.name], industrial: override.aqi > 160, greenZone: override.aqi < 110 }
}

export const LOCAL_AREA_DATA: WardData[] = [
  ...CSMC_WARDS,
  ...fallbackOverrides.map((override, index) => createFallbackArea(override, CSMC_WARDS[index % CSMC_WARDS.length])),
]

export const LOCAL_AREA_ALIASES: Record<string, string> = {
  cidco: "Cidco Area",
  garkheda: "Garkheda",
  waluj: "Waluj MIDC",
  chikalthana: "Chikalthana",
  "kranti chowk": "Kranti Chowk",
  osmanpura: "Osmanpura",
  "beed bypass": "Beed Bypass",
  "railway station": "Jawahar Colony",
  "seven hills": "Seven Hills",
  shahnoorwadi: "Shahnoorwadi",
  mukundwadi: "Mukundwadi",
  "satara parisar": "Satara Parisar",
  "paithan road": "Paithan Road",
  "jalna road": "Jalna Road",
  "nirala bazar": "Nirala Bazar",
  "cannaught place": "Cannaught Place",
  "connaught place": "Cannaught Place",
}

export function findLocalArea(query: string): WardData | undefined {
  const normalized = query.trim().toLowerCase()
  const alias = LOCAL_AREA_ALIASES[normalized]
  return LOCAL_AREA_DATA.find((area) => area.name.toLowerCase() === (alias ?? normalized))
    ?? LOCAL_AREA_DATA.find((area) => `${area.name} ${area.landmarks.join(" ")}`.toLowerCase().includes(normalized))
}
