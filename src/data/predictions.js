export const initialPredictions = [
  {
    id: 1,
    areaName: "HITEC City & Madhapur",
    predictedDemandScore: 94.2,
    riskLevel: "CRITICAL",
    recommendedAmbulanceCount: 6,
    availableAmbulanceCount: 2,
    deficit: 4,
    peakHourStart: "17:30",
    peakHourEnd: "21:30",
    primaryRiskFactors: ["Peak IT rush hour congestion", "High pedestrian/two-wheeler density", "Elevated cardiac/stress incidence"],
    historicalIncidentsLast7Days: 48,
    lat: 17.4435,
    lng: 78.3772
  },
  {
    id: 2,
    areaName: "Gachibowli & Financial District",
    predictedDemandScore: 88.5,
    riskLevel: "HIGH",
    recommendedAmbulanceCount: 5,
    availableAmbulanceCount: 3,
    deficit: 2,
    peakHourStart: "18:00",
    peakHourEnd: "22:00",
    primaryRiskFactors: ["High speed ORR feeder intersections", "Construction zones", "Heavy tech-park traffic"],
    historicalIncidentsLast7Days: 39,
    lat: 17.4401,
    lng: 78.3489
  },
  {
    id: 3,
    areaName: "Banjara Hills & Jubilee Hills",
    predictedDemandScore: 76.0,
    riskLevel: "HIGH",
    recommendedAmbulanceCount: 4,
    availableAmbulanceCount: 4,
    deficit: 0,
    peakHourStart: "11:00",
    peakHourEnd: "15:00",
    primaryRiskFactors: ["High elderly demographic", "Steep terrain & narrow residential roads", "Commercial high-traffic corridors"],
    historicalIncidentsLast7Days: 34,
    lat: 17.4375,
    lng: 78.4482
  },
  {
    id: 4,
    areaName: "Kukatpally & Miyapur",
    predictedDemandScore: 82.4,
    riskLevel: "HIGH",
    recommendedAmbulanceCount: 5,
    availableAmbulanceCount: 2,
    deficit: 3,
    peakHourStart: "19:00",
    peakHourEnd: "23:00",
    primaryRiskFactors: ["High population density", "Metro station convergence points", "Highway transit corridor"],
    historicalIncidentsLast7Days: 42,
    lat: 17.4947,
    lng: 78.3996
  },
  {
    id: 5,
    areaName: "Secunderabad & Begumpet",
    predictedDemandScore: 68.1,
    riskLevel: "MEDIUM",
    recommendedAmbulanceCount: 4,
    availableAmbulanceCount: 3,
    deficit: 1,
    peakHourStart: "08:30",
    peakHourEnd: "12:00",
    primaryRiskFactors: ["Major railway terminal congestion", "Market area congestion"],
    historicalIncidentsLast7Days: 29,
    lat: 17.4399,
    lng: 78.4983
  },
  {
    id: 6,
    areaName: "Charminar & Old City",
    predictedDemandScore: 54.0,
    riskLevel: "MEDIUM",
    recommendedAmbulanceCount: 3,
    availableAmbulanceCount: 2,
    deficit: 1,
    peakHourStart: "16:00",
    peakHourEnd: "20:00",
    primaryRiskFactors: ["Narrow lanes requiring compact response units", "High market footfall"],
    historicalIncidentsLast7Days: 24,
    lat: 17.3616,
    lng: 78.4747
  }
];

export const hourlyForecastData = [
  { time: "00:00", predicted: 12, actual: 11, dispatched: 10 },
  { time: "02:00", predicted: 8, actual: 7, dispatched: 7 },
  { time: "04:00", predicted: 6, actual: 5, dispatched: 5 },
  { time: "06:00", predicted: 14, actual: 12, dispatched: 12 },
  { time: "08:00", predicted: 28, actual: 26, dispatched: 25 },
  { time: "10:00", predicted: 36, actual: 35, dispatched: 34 },
  { time: "12:00", predicted: 42, actual: 40, dispatched: 39 },
  { time: "14:00", predicted: 38, actual: 37, dispatched: 36 },
  { time: "16:00", predicted: 48, actual: 45, dispatched: 44 },
  { time: "18:00", predicted: 62, actual: 60, dispatched: 57 },
  { time: "20:00", predicted: 58, actual: 54, dispatched: 53 },
  { time: "22:00", predicted: 34, actual: 32, dispatched: 31 }
];

export const categoryDistributionData = [
  { name: "Cardiac Emergencies", value: 38, color: "#ef4444" },
  { name: "Accident / Trauma", value: 27, color: "#f59e0b" },
  { name: "Respiratory / Hypoxia", value: 18, color: "#3b82f6" },
  { name: "Neurological / Stroke", value: 11, color: "#8b5cf6" },
  { name: "Pediatric / Neonatal", value: 6, color: "#10b981" }
];

export const responseTimeTrends = [
  { month: "May", averageEta: 14.8, targetEta: 8.0 },
  { month: "Jun", averageEta: 13.5, targetEta: 8.0 },
  { month: "Jul", averageEta: 11.9, targetEta: 8.0 },
  { month: "Aug", averageEta: 10.2, targetEta: 8.0 },
  { month: "Sep", averageEta: 8.7, targetEta: 8.0 },
  { month: "Oct", averageEta: 7.4, targetEta: 8.0 }
];
