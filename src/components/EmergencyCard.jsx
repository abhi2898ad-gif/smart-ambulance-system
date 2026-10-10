import React from "react";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import { MapPin, Clock, Phone, Truck, ShieldAlert, ArrowRight } from "lucide-react";
import { formatTime, timeAgo } from "../utils/helpers";
import { Link } from "react-router-dom";

const EmergencyCard = ({ emergency, onAction, actionLabel = "View Details", role = "USER" }) => {
  const isCritical = emergency.priority === "CRITICAL";

  return (
    <div
      className={`card border-0 shadow-sm rounded-4 mb-3 transition-all ${
        isCritical ? "border-start border-4 border-danger" : ""
      }`}
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="card-body p-3 p-md-4">
        {/* Header row */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-secondary border px-2 py-1 small fw-semibold">
              #{emergency.id}
            </span>
            <PriorityBadge priority={emergency.priority} />
            <StatusBadge status={emergency.status} />
          </div>
          <span className="text-muted small d-flex align-items-center gap-1">
            <Clock size={13} /> {timeAgo(emergency.createdAt)}
          </span>
        </div>

        {/* Patient and emergency info */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-7">
            <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              {emergency.patientName}
              <span className="text-muted fs-6 fw-normal">({emergency.emergencyType?.replace(/_/g, " ")})</span>
            </h5>
            <p className="text-secondary small mb-2 line-clamp-2">
              {emergency.description}
            </p>
            <div className="d-flex align-items-start gap-2 text-muted small">
              <MapPin size={15} className="text-danger mt-1 flex-shrink-0" />
              <span>{emergency.pickupAddress}</span>
            </div>
          </div>

          <div className="col-12 col-md-5 bg-light rounded-3 p-3">
            <div className="small fw-semibold text-secondary mb-2 text-uppercase letter-spacing-wide">
              Dispatch Details
            </div>
            {emergency.vehicleNumber ? (
              <div className="d-flex flex-column gap-1 small">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Ambulance:</span>
                  <span className="fw-bold text-primary">{emergency.vehicleNumber}</span>
                </div>
                {emergency.driverName && (
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Driver:</span>
                    <span className="fw-medium text-dark">{emergency.driverName}</span>
                  </div>
                )}
                {emergency.etaMinutes !== null && emergency.etaMinutes > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-1 pt-1 border-top">
                    <span className="text-muted">Estimated ETA:</span>
                    <span className="badge bg-primary text-white fw-bold px-2 py-1">
                      {emergency.etaMinutes} mins
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted small py-2 d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm text-warning" role="status"></div>
                <span>Finding closest optimal unit...</span>
              </div>
            )}
          </div>
        </div>

        {/* AI insight note if present */}
        {emergency.aiRecommendation && (
          <div className="p-2 px-3 rounded-3 bg-primary-subtle text-primary border border-primary-subtle small mb-3 d-flex align-items-center gap-2">
            <ShieldAlert size={16} className="flex-shrink-0" />
            <span className="text-truncate">{emergency.aiRecommendation}</span>
          </div>
        )}

        {/* Footer actions */}
        <div className="d-flex align-items-center justify-content-between pt-2 border-top">
          <div className="d-flex align-items-center gap-2">
            {emergency.patientPhone && (
              <a
                href={`tel:${emergency.patientPhone}`}
                className="btn btn-sm btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-1"
              >
                <Phone size={13} /> Call Patient
              </a>
            )}
          </div>

          <div className="d-flex align-items-center gap-2">
            {role === "USER" && emergency.status !== "COMPLETED" && emergency.status !== "CANCELLED" && (
              <Link
                to={`/user/track-ambulance?id=${emergency.id}`}
                className="btn btn-sm btn-primary rounded-pill px-3 d-flex align-items-center gap-1"
              >
                <Truck size={14} /> Live Track
              </Link>
            )}
            {onAction && (
              <button
                onClick={() => onAction(emergency)}
                className="btn btn-sm btn-outline-primary rounded-pill px-3 d-flex align-items-center gap-1"
              >
                {actionLabel} <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCard;
