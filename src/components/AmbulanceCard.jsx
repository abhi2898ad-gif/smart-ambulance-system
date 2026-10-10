import React from "react";
import StatusBadge from "./StatusBadge";
import { Truck, Fuel, MapPin, User, Shield, Wrench } from "lucide-react";

const AmbulanceCard = ({ ambulance, onAction, actionLabel = "Manage" }) => {
  const getFuelColor = (fuel) => {
    if (fuel > 70) return "bg-success";
    if (fuel > 30) return "bg-warning";
    return "bg-danger";
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "ICU":
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">ICU Unit</span>;
      case "ADVANCED":
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Advanced ALS</span>;
      case "NEONATAL":
        return <span className="badge bg-info-subtle text-info border border-info-subtle">Neonatal</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">Basic BLS</span>;
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 transition-all hover-shadow">
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                <Truck size={20} />
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-0">{ambulance.vehicleNumber}</h6>
                <div className="d-flex gap-1 mt-1">{getTypeBadge(ambulance.ambulanceType)}</div>
              </div>
            </div>
            <StatusBadge status={ambulance.status} />
          </div>

          {/* Details list */}
          <div className="d-flex flex-column gap-2 small text-secondary mb-3">
            <div className="d-flex align-items-center gap-2">
              <MapPin size={15} className="text-muted flex-shrink-0" />
              <span className="text-truncate">{ambulance.locationName || `${ambulance.latitude.toFixed(4)}, ${ambulance.longitude.toFixed(4)}`}</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <User size={15} className="text-muted flex-shrink-0" />
              <span>Driver: <strong className="text-dark">{ambulance.assignedDriverName || "Unassigned"}</strong></span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Shield size={15} className="text-muted flex-shrink-0" />
              <span className="text-truncate">Base: {ambulance.baseHospitalName || "City Fleet Base"}</span>
            </div>
          </div>

          {/* Fuel Level */}
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center small mb-1">
              <span className="text-muted d-flex align-items-center gap-1">
                <Fuel size={13} /> Fuel
              </span>
              <span className="fw-semibold text-dark">{ambulance.fuelLevel || 85}%</span>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className={`progress-bar ${getFuelColor(ambulance.fuelLevel || 85)}`}
                role="progressbar"
                style={{ width: `${ambulance.fuelLevel || 85}%` }}
              ></div>
            </div>
          </div>

          {/* Equipment pills */}
          {ambulance.equipment && ambulance.equipment.length > 0 && (
            <div className="mb-3">
              <div className="d-flex flex-wrap gap-1">
                {ambulance.equipment.slice(0, 3).map((item, idx) => (
                  <span key={idx} className="badge bg-light text-muted border small px-2 py-1">
                    {item}
                  </span>
                ))}
                {ambulance.equipment.length > 3 && (
                  <span className="badge bg-light text-secondary border small px-2 py-1">
                    +{ambulance.equipment.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {onAction && (
          <div className="pt-3 border-top mt-2">
            <button
              onClick={() => onAction(ambulance)}
              className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-medium"
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbulanceCard;
