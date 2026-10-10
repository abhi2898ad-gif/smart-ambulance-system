import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { HYDERABAD_CENTER } from "../utils/constants";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

// Fix standard marker icon issue using modern custom HTML SVG icons
const createCustomIcon = (type, status = "AVAILABLE", priority = "HIGH") => {
  let bgColor = "#2563eb";
  let symbol = "📍";

  if (type === "ambulance") {
    if (status === "AVAILABLE") bgColor = "#10b981"; // green
    else if (status === "DISPATCHED") bgColor = "#f59e0b"; // yellow
    else if (status === "ON_TRIP") bgColor = "#3b82f6"; // blue
    else bgColor = "#64748b"; // gray
    symbol = "🚑";
  } else if (type === "hospital") {
    bgColor = "#ef4444";
    symbol = "🏥";
  } else if (type === "emergency") {
    bgColor = priority === "CRITICAL" ? "#ef4444" : priority === "HIGH" ? "#f59e0b" : "#3b82f6";
    symbol = "⚠️";
  } else if (type === "pickup") {
    bgColor = "#0f172a";
    symbol = "📍";
  }

  const pulseHtml =
    type === "emergency" || status === "DISPATCHED" || status === "ON_TRIP"
      ? `<span class="map-pulse-ring" style="border-color: ${bgColor}"></span>`
      : "";

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        ${pulseHtml}
        <div style="background-color: ${bgColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 17px; box-shadow: 0 4px 10px rgba(0,0,0,0.25); border: 2px solid #ffffff;">
          ${symbol}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
};

// Component to handle map centering when center prop changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

// Click listener to pick location
function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect({
          lat: Math.round(e.latlng.lat * 10000) / 10000,
          lng: Math.round(e.latlng.lng * 10000) / 10000
        });
      }
    }
  });
  return null;
}

const MapComponent = ({
  center = [HYDERABAD_CENTER.lat, HYDERABAD_CENTER.lng],
  zoom = HYDERABAD_CENTER.zoom,
  ambulances = [],
  hospitals = [],
  emergencies = [],
  activeEmergency = null,
  routePolyline = null, // array of [lat, lng]
  onLocationSelect = null,
  selectedLocation = null,
  height = "450px",
  interactive = true,
  className = ""
}) => {
  return (
    <div className={`map-wrapper rounded-4 overflow-hidden shadow-sm border ${className}`} style={{ height, width: "100%", position: "relative" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={interactive}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={center} zoom={zoom} />
        {onLocationSelect && <LocationPicker onLocationSelect={onLocationSelect} />}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Selected location marker if picking */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={createCustomIcon("pickup")}
          >
            <Popup>
              <div className="p-1 text-center">
                <span className="badge bg-dark text-white mb-1">Pickup Location</span>
                <p className="small mb-0">{selectedLocation.lat}, {selectedLocation.lng}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {routePolyline && routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.85, dashArray: "1, 10" }}
          />
        )}

        {/* Single Active Emergency Marker */}
        {activeEmergency && (
          <Marker
            position={[activeEmergency.pickupLatitude, activeEmergency.pickupLongitude]}
            icon={createCustomIcon("emergency", activeEmergency.status, activeEmergency.priority)}
          >
            <Popup>
              <div className="p-2" style={{ minWidth: "200px" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h6 className="fw-bold text-dark mb-0">{activeEmergency.patientName}</h6>
                  <PriorityBadge priority={activeEmergency.priority} showIcon={false} />
                </div>
                <p className="text-secondary small mb-2">{activeEmergency.emergencyType?.replace(/_/g, " ")}</p>
                <div className="text-muted small mb-1">{activeEmergency.pickupAddress}</div>
                {activeEmergency.etaMinutes && (
                  <div className="badge bg-danger text-white mt-1">ETA: {activeEmergency.etaMinutes} mins</div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Emergencies list */}
        {emergencies.map((em) => (
          <Marker
            key={`em-${em.id}`}
            position={[em.pickupLatitude, em.pickupLongitude]}
            icon={createCustomIcon("emergency", em.status, em.priority)}
          >
            <Popup>
              <div className="p-2" style={{ minWidth: "190px" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-dark">{em.patientName}</strong>
                  <PriorityBadge priority={em.priority} showIcon={false} />
                </div>
                <p className="small text-muted mb-1">{em.pickupAddress}</p>
                <StatusBadge status={em.status} />
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Ambulances */}
        {ambulances.map((amb) => (
          <Marker
            key={`amb-${amb.id}`}
            position={[amb.latitude, amb.longitude]}
            icon={createCustomIcon("ambulance", amb.status)}
          >
            <Popup>
              <div className="p-2" style={{ minWidth: "200px" }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong className="text-primary">{amb.vehicleNumber}</strong>
                  <StatusBadge status={amb.status} />
                </div>
                <div className="small text-secondary mb-1">Type: <strong>{amb.ambulanceType}</strong></div>
                <div className="small text-muted">Driver: {amb.assignedDriverName || "Unassigned"}</div>
                {amb.locationName && <div className="small text-muted">{amb.locationName}</div>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Hospitals */}
        {hospitals.map((hosp) => (
          <Marker
            key={`hosp-${hosp.id}`}
            position={[hosp.latitude, hosp.longitude]}
            icon={createCustomIcon("hospital", hosp.status)}
          >
            <Popup>
              <div className="p-2" style={{ minWidth: "210px" }}>
                <strong className="text-danger d-block mb-1">{hosp.name}</strong>
                <div className="small text-muted mb-2">{hosp.address}</div>
                <div className="d-flex justify-content-between small border-top pt-1">
                  <span>Available Beds:</span>
                  <strong className="text-dark">{hosp.availableBeds}/{hosp.totalBeds}</strong>
                </div>
                <div className="d-flex justify-content-between small">
                  <span>ICU Beds:</span>
                  <strong className="text-success">{hosp.availableIcuBeds}</strong>
                </div>
                <div className="mt-2 text-center">
                  <StatusBadge status={hosp.status} />
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div
        className="position-absolute bottom-0 start-0 m-3 p-2 px-3 bg-white rounded-3 shadow-sm border small d-flex flex-wrap align-items-center gap-3"
        style={{ zIndex: 1000, opacity: 0.94 }}
      >
        <span className="fw-semibold text-secondary">Legend:</span>
        <span className="d-flex align-items-center gap-1">
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
          Available Ambulance
        </span>
        <span className="d-flex align-items-center gap-1">
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f59e0b", display: "inline-block" }}></span>
          Dispatched
        </span>
        <span className="d-flex align-items-center gap-1">
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block" }}></span>
          Emergency / Hospital
        </span>
      </div>
    </div>
  );
};

export default MapComponent;
