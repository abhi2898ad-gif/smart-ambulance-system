export const ROLES = {
  USER: "USER",
  DRIVER: "DRIVER",
  HOSPITAL: "HOSPITAL",
  ADMIN: "ADMIN"
};

export const PRIORITIES = {
  CRITICAL: {
    label: "Critical",
    color: "#ef4444",
    bg: "#fee2e2",
    border: "#fca5a5",
    description: "Life-threatening condition requiring immediate ICU ambulance & pre-alert"
  },
  HIGH: {
    label: "High",
    color: "#f59e0b",
    bg: "#fef3c7",
    border: "#fcd34d",
    description: "Serious condition requiring urgent Advanced Life Support dispatch"
  },
  MEDIUM: {
    label: "Medium",
    color: "#3b82f6",
    bg: "#dbeafe",
    border: "#93c5fd",
    description: "Stable condition needing medical transport with basic paramedic care"
  },
  LOW: {
    label: "Low",
    color: "#10b981",
    bg: "#d1fae5",
    border: "#6ee7b7",
    description: "Non-critical patient transport / scheduled transfer"
  }
};

export const AMBULANCE_TYPES = {
  ICU: { label: "ICU / Advanced Cardiac Unit", description: "Equipped with mechanical ventilator, defibrillator, infusion pump" },
  ADVANCED: { label: "Advanced Life Support (ALS)", description: "Cardiac monitor, advanced airway management, emergency drugs" },
  BASIC: { label: "Basic Life Support (BLS)", description: "Stretcher, oxygen therapy, first aid, splint immobilization" },
  NEONATAL: { label: "Neonatal & Pediatric Care", description: "Transport incubator, pediatric resuscitator, phototherapy" }
};

export const EMERGENCY_TYPES = [
  { value: "CARDIAC_ARREST", label: "Cardiac Arrest / Heart Attack", defaultPriority: "CRITICAL" },
  { value: "STROKE_NEURO", label: "Stroke / Neurological Paralysis", defaultPriority: "CRITICAL" },
  { value: "RESPIRATORY_DISTRESS", label: "Acute Respiratory Distress / Severe Asthma", defaultPriority: "CRITICAL" },
  { value: "TRAUMA_ACCIDENT", label: "Severe Trauma / Road Traffic Accident", defaultPriority: "HIGH" },
  { value: "PEDIATRIC_NEONATAL", label: "Pediatric / Infant Emergency", defaultPriority: "HIGH" },
  { value: "MATERNITY_LABOR", label: "Obstetric / Labor Emergency", defaultPriority: "HIGH" },
  { value: "ALLERGIC_REACTION", label: "Severe Anaphylaxis / Drug Reaction", defaultPriority: "HIGH" },
  { value: "FALL_FRACTURE", label: "Fracture / Severe Fall", defaultPriority: "MEDIUM" },
  { value: "HIGH_FEVER_CONVULSION", label: "High Fever / Convulsions", defaultPriority: "MEDIUM" },
  { value: "OTHER_NON_CRITICAL", label: "Other Medical Assistance", defaultPriority: "LOW" }
];

export const HYDERABAD_CENTER = {
  lat: 17.4300,
  lng: 78.4100,
  zoom: 12
};

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "http://localhost:8080/api";
