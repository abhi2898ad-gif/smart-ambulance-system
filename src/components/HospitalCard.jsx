import React from "react";
import StatusBadge from "./StatusBadge";
import { Building2, Phone, BedDouble, Activity, CheckCircle } from "lucide-react";

const HospitalCard = ({ hospital, onAction, actionLabel = "Manage Hospital" }) => {
  const getOccupancyColor = (rate) => {
    if (rate >= 95) return "bg-danger";
    if (rate >= 85) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 transition-all hover-shadow">
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          {/* Header */}
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-3 bg-danger-subtle text-danger">
                <Building2 size={22} />
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: "220px" }}>
                  {hospital.name}
                </h6>
                <span className="text-muted small">{hospital.address}</span>
              </div>
            </div>
            <StatusBadge status={hospital.status} />
          </div>

          {/* Emergency Contact */}
          <div className="p-2 px-3 rounded-3 bg-light border small text-secondary d-flex align-items-center justify-content-between mb-3">
            <span className="d-flex align-items-center gap-2">
              <Phone size={14} className="text-danger" />
              <strong>Emergency Unit:</strong>
            </span>
            <a href={`tel:${hospital.emergencyUnitNumber}`} className="text-primary fw-bold text-decoration-none">
              {hospital.emergencyUnitNumber}
            </a>
          </div>

          {/* Bed Availability Grid */}
          <div className="row g-2 mb-3 text-center">
            <div className="col-6">
              <div className="p-2 rounded-3 bg-light border">
                <span className="text-muted d-block small">General Beds</span>
                <span className="fs-5 fw-bold text-dark">
                  {hospital.availableBeds}
                  <span className="text-muted fs-6 fw-normal">/{hospital.totalBeds}</span>
                </span>
              </div>
            </div>
            <div className="col-6">
              <div className="p-2 rounded-3 bg-light border">
                <span className="text-muted d-block small">ICU Beds</span>
                <span className={`fs-5 fw-bold ${hospital.availableIcuBeds <= 2 ? "text-danger" : "text-success"}`}>
                  {hospital.availableIcuBeds}
                  <span className="text-muted fs-6 fw-normal">/{hospital.icuBeds}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Occupancy Rate Bar */}
          <div className="mb-3">
            <div className="d-flex justify-content-between small text-muted mb-1">
              <span>Occupancy Rate</span>
              <span className="fw-bold text-dark">{hospital.occupancyRate}%</span>
            </div>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className={`progress-bar ${getOccupancyColor(hospital.occupancyRate)}`}
                role="progressbar"
                style={{ width: `${hospital.occupancyRate}%` }}
              ></div>
            </div>
          </div>

          {/* Specialities */}
          {hospital.departments && hospital.departments.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {hospital.departments.slice(0, 3).map((dep, idx) => (
                <span key={idx} className="badge bg-light text-secondary border small px-2 py-1">
                  {dep}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {onAction && (
          <div className="pt-3 border-top mt-2">
            <button
              onClick={() => onAction(hospital)}
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

export default HospitalCard;
