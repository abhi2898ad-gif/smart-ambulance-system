// Calculate distance between two coordinates in kilometers (Haversine Formula)
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

// Calculate ETA in minutes based on distance and average city speed (~35 km/h for emergency vehicle)
export function calculateEtaMinutes(distanceKm, trafficMultiplier = 1.2) {
  if (!distanceKm || distanceKm <= 0) return 0;
  const speedKmH = 35 / trafficMultiplier;
  const timeHours = distanceKm / speedKmH;
  return Math.max(2, Math.round(timeHours * 60));
}

// Format date into human readable string
export function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// Format time
export function formatTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

// Format relative time (e.g., "5 mins ago")
export function timeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

// Helper to get color/class for different statuses
export function getStatusBadgeProps(status) {
  const map = {
    AVAILABLE: { label: "Available", bg: "bg-success-subtle", text: "text-success", border: "border-success-subtle" },
    DISPATCHED: { label: "Dispatched", bg: "bg-warning-subtle", text: "text-warning", border: "border-warning-subtle" },
    ON_TRIP: { label: "On Trip", bg: "bg-primary-subtle", text: "text-primary", border: "border-primary-subtle" },
    MAINTENANCE: { label: "Maintenance", bg: "bg-secondary-subtle", text: "text-secondary", border: "border-secondary-subtle" },
    OFFLINE: { label: "Offline", bg: "bg-light", text: "text-muted", border: "border-secondary" },
    
    // Emergency status
    REQUESTED: { label: "Requested", bg: "bg-warning-subtle", text: "text-warning", border: "border-warning-subtle" },
    PRIORITY_ASSIGNED: { label: "Triaged", bg: "bg-info-subtle", text: "text-info", border: "border-info-subtle" },
    AMBULANCE_ASSIGNED: { label: "Unit Assigned", bg: "bg-info-subtle", text: "text-info", border: "border-info-subtle" },
    PENDING: { label: "Pending", bg: "bg-warning-subtle", text: "text-warning", border: "border-warning-subtle" },
    ASSIGNED: { label: "Assigned", bg: "bg-info-subtle", text: "text-info", border: "border-info-subtle" },
    EN_ROUTE: { label: "En Route", bg: "bg-primary-subtle", text: "text-primary", border: "border-primary-subtle" },
    ARRIVED: { label: "Arrived", bg: "bg-success-subtle", text: "text-success", border: "border-success-subtle" },
    PATIENT_PICKED: { label: "Patient Onboard", bg: "bg-indigo-subtle", text: "text-primary", border: "border-primary-subtle" },
    AT_HOSPITAL: { label: "At Hospital", bg: "bg-primary-subtle", text: "text-primary", border: "border-primary-subtle" },
    IN_TRANSIT: { label: "In Transit", bg: "bg-indigo-subtle", text: "text-primary", border: "border-primary-subtle" },
    COMPLETED: { label: "Completed", bg: "bg-success-subtle", text: "text-success", border: "border-success-subtle" },
    CANCELLED: { label: "Cancelled", bg: "bg-danger-subtle", text: "text-danger", border: "border-danger-subtle" },

    // Hospital status
    READY: { label: "Ready / Accepting", bg: "bg-success-subtle", text: "text-success", border: "border-success-subtle" },
    ACCEPTING: { label: "Accepting", bg: "bg-success-subtle", text: "text-success", border: "border-success-subtle" },
    FULL: { label: "Full Capacity", bg: "bg-danger-subtle", text: "text-danger", border: "border-danger-subtle" },
    DIVERTING: { label: "Diverting", bg: "bg-warning-subtle", text: "text-warning", border: "border-warning-subtle" },
    UNAVAILABLE: { label: "Unavailable", bg: "bg-secondary-subtle", text: "text-secondary", border: "border-secondary-subtle" },

    // Driver status
    ON_DUTY: { label: "On Duty", bg: "bg-success-subtle", text: "text-success", border: "border-success-subtle" },
    BUSY: { label: "Busy", bg: "bg-primary-subtle", text: "text-primary", border: "border-primary-subtle" }
  };

  return map[status] || { label: status, bg: "bg-light", text: "text-dark", border: "border-secondary" };
}

// LocalStorage persistence helpers for mock database
export function loadFromStorage(key, defaultData) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return defaultData;
  }
}

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}
