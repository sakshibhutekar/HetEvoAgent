// Chhatrapati Sambhajinagar Municipal Corporation (CSN) Ward Data
// Mock data structure for ward-level AQI monitoring

export interface WardData {
  id: string
  wardNumber: number
  name: string
  coordinates: [number, number][] // Polygon coordinates [lat, lng]
  aqi: number
  pm25: number
  pm10: number
  co: number
  no2: number
  so2: number
  o3: number
  temperature: number
  humidity: number
  windSpeed: number
  population: number
  area: number // in sq km
  lastUpdated: string
  landmarks: string[]
  hospitals: number
  schools: number
  industrial: boolean
  greenZone: boolean
}

const DATA_TIMESTAMP = "2026-08-20T12:00:00.000Z"

export const CSMC_WARDS: WardData[] = [
  {
    id: "ward-1",
    wardNumber: 1,
    name: "Cidco Area",
    coordinates: [
      [19.8760, 75.3240],
      [19.8780, 75.3280],
      [19.8740, 75.3320],
      [19.8720, 75.3260],
      [19.8760, 75.3240],
    ],
    aqi: 142,
    pm25: 72,
    pm10: 98,
    co: 1.2,
    no2: 35,
    so2: 18,
    o3: 45,
    temperature: 32,
    humidity: 65,
    windSpeed: 12,
    population: 45000,
    area: 8.5,
    lastUpdated: DATA_TIMESTAMP,
    landmarks: ["Cidco Bus Stand", "Prozone Mall", "Shivaji Statue"],
    hospitals: 3,
    schools: 8,
    industrial: false,
    greenZone: false,
  },
  {
    id: "ward-2",
    wardNumber: 2,
    name: "Jawahar Colony",
    coordinates: [
      [19.8720, 75.3260],
      [19.8760, 75.3240],
      [19.8800, 75.3200],
      [19.8780, 75.3160],
      [19.8740, 75.3180],
      [19.8720, 75.3260],
    ],
    aqi: 185,
    pm25: 95,
    pm10: 120,
    co: 1.8,
    no2: 48,
    so2: 25,
    o3: 52,
    temperature: 33,
    humidity: 62,
    windSpeed: 10,
    population: 52000,
    area: 9.2,
    lastUpdated: DATA_TIMESTAMP,
    landmarks: ["Jawahar Colony Market", "Railway Station", "Buddha Statue"],
    hospitals: 5,
    schools: 12,
    industrial: true,
    greenZone: false,
  },
  {
    id: "ward-3",
    wardNumber: 3,
    name: "Nirala Bazar",
    coordinates: [
      [19.8680, 75.3220],
      [19.8720, 75.3260],
      [19.8740, 75.3180],
      [19.8700, 75.3140],
      [19.8660, 75.3180],
      [19.8680, 75.3220],
    ],
    aqi: 210,
    pm25: 110,
    pm10: 145,
    co: 2.1,
    no2: 55,
    so2: 32,
    o3: 58,
    temperature: 34,
    humidity: 60,
    windSpeed: 8,
    population: 38000,
    area: 7.8,
    lastUpdated: DATA_TIMESTAMP,
    landmarks: ["Nirala Bazar", "City Center", "Main Market"],
    hospitals: 4,
    schools: 10,
    industrial: true,
    greenZone: false,
  },
  {
    id: "ward-4",
    wardNumber: 4,
    name: "Shahganj",
    coordinates: [
      [19.8640, 75.3180],
      [19.8680, 75.3220],
      [19.8660, 75.3180],
      [19.8620, 75.3140],
      [19.8600, 75.3180],
      [19.8640, 75.3180],
    ],
    aqi: 95,
    pm25: 48,
    pm10: 65,
    co: 0.9,
    no2: 28,
    so2: 15,
    o3: 38,
    temperature: 31,
    humidity: 70,
    windSpeed: 14,
    population: 42000,
    area: 8.1,
    lastUpdated: DATA_TIMESTAMP,
    landmarks: ["Shahganj Masjid", "Old City Area", "Heritage Sites"],
    hospitals: 6,
    schools: 15,
    industrial: false,
    greenZone: true,
  },
  {
    id: "ward-5",
    wardNumber: 5,
    name: "Khadki",
    coordinates: [
      [19.8600, 75.3140],
      [19.8640, 75.3180],
      [19.8620, 75.3140],
      [19.8580, 75.3100],
      [19.8560, 75.3140],
      [19.8600, 75.3140],
    ],
    aqi: 165,
    pm25: 85,
    pm10: 110,
    co: 1.5,
    no2: 42,
    so2: 22,
    o3: 48,
    temperature: 32,
    humidity: 66,
    windSpeed: 11,
    population: 35000,
    area: 7.5,
    lastUpdated: DATA_TIMESTAMP,
    landmarks: ["Khadki Market", "Industrial Area", "Water Tank"],
    hospitals: 3,
    schools: 9,
    industrial: true,
    greenZone: false,
  },
  {
    id: "ward-6",
    wardNumber: 6,
    name: "Beed Bypass",
    coordinates: [
      [19.8560, 75.3100],
      [19.8600, 75.3140],
      [19.8580, 75.3100],
      [19.8540, 75.3060],
      [19.8520, 75.3100],
      [19.8560, 75.3100],
    ],
    aqi: 78,
    pm25: 38,
    pm10: 52,
    co: 0.7,
    no2: 22,
    so2: 12,
    o3: 32,
    temperature: 30,
    humidity: 72,
    windSpeed: 16,
    population: 28000,
    area: 6.8,
    lastUpdated: DATA_TIMESTAMP,
    landmarks: ["Beed Bypass", "Highway Junction", "Truck Terminal"],
    hospitals: 2,
    schools: 6,
    industrial: false,
    greenZone: true,
  },
  {
    id: "ward-7",
    wardNumber: 7,
    name: "Waluj MIDC",
    coordinates: [
      [19.8520, 75.3060],
      [19.8560, 75.3100],
      [19.8540, 75.3060],
      [19.8500, 75.3020],
      [19.8480, 75.3060],
      [19.8520, 75.3060],
    ],
    aqi: 245,
    pm25: 125,
    pm10: 165,
    co: 2.5,
    no2: 65,
    so2: 38,
    o3: 62,
    temperature: 35,
    humidity: 58,
    windSpeed: 6,
    population: 18000,
    area: 12.5,
    lastUpdated: DATA_TIMESTAMP,
    landmarks: ["Waluj MIDC", "Industrial Estate", "Power Plant"],
    hospitals: 1,
    schools: 4,
    industrial: true,
    greenZone: false,
  },
  {
    id: "ward-8",
    wardNumber: 8,
    name: "Chikalthana",
    coordinates: [
      [19.8480, 75.3020],
      [19.8520, 75.3060],
      [19.8500, 75.3020],
      [19.8460, 75.2980],
      [19.8440, 75.3020],
      [19.8480, 75.3020],
    ],
    aqi: 112,
    pm25: 56,
    pm10: 75,
    co: 1.1,
    no2: 32,
    so2: 18,
    o3: 42,
    temperature: 31,
    humidity: 68,
    windSpeed: 13,
    population: 32000,
    area: 7.2,
    lastUpdated: DATA_TIMESTAMP,
    landmarks: ["Chikalthana MIDC", "IT Park", "College Area"],
    hospitals: 3,
    schools: 11,
    industrial: true,
    greenZone: false,
  },
]

// Chhatrapati Sambhajinagar city bounds
export const CSMC_BOUNDS = {
  north: 19.8900,
  south: 19.8300,
  east: 75.3600,
  west: 75.2900,
}

export const CSMC_CENTER = {
  lat: 19.8600,
  lng: 75.3200,
}

// AQI color mapping
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "#10B981" // Green - Good
  if (aqi <= 100) return "#F59E0B" // Yellow - Moderate
  if (aqi <= 150) return "#F97316" // Orange - Unhealthy for Sensitive Groups
  if (aqi <= 200) return "#EF4444" // Red - Unhealthy
  if (aqi <= 300) return "#8B5CF6" // Purple - Very Unhealthy
  return "#7C2D12" // Maroon - Hazardous
}

export function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "Unhealthy for Sensitive Groups"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very Unhealthy"
  return "Hazardous"
}

export function getRiskLevel(aqi: number): string {
  if (aqi <= 50) return "Low"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "High for Sensitive Groups"
  if (aqi <= 200) return "High"
  if (aqi <= 300) return "Very High"
  return "Severe"
}

export function getSafetyMeasures(aqi: number): string[] {
  if (aqi <= 50) {
    return [
      "Air quality is satisfactory",
      "Outdoor activities are safe",
      "No special precautions needed",
    ]
  }
  if (aqi <= 100) {
    return [
      "Acceptable air quality",
      "Sensitive individuals should limit prolonged outdoor exertion",
      "General population can enjoy outdoor activities",
    ]
  }
  if (aqi <= 150) {
    return [
      "Members of sensitive groups may experience health effects",
      "Limit prolonged outdoor exertion",
      "Consider wearing masks outdoors",
      "Keep windows closed",
    ]
  }
  if (aqi <= 200) {
    return [
      "Everyone may begin to experience health effects",
      "Avoid prolonged outdoor exertion",
      "Wear N95 masks when outdoors",
      "Use air purifiers indoors",
      "Keep windows and doors closed",
    ]
  }
  if (aqi <= 300) {
    return [
      "Health alert: everyone may experience serious health effects",
      "Avoid all outdoor physical activities",
      "Wear N95 masks at all times when outdoors",
      "Use high-efficiency air purifiers",
      "Stay indoors with windows closed",
      "Seek medical attention if experiencing symptoms",
    ]
  }
  return [
    "Health emergency: everyone at serious risk",
    "Avoid all outdoor activities",
    "Wear N95/KN95 masks at all times",
    "Use HEPA air purifiers continuously",
    "Stay indoors and minimize movement",
    "Seek immediate medical attention for symptoms",
    "Follow local authority guidelines",
  ]
}
