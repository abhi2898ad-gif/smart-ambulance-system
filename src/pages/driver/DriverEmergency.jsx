import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import MapComponent from "../../components/MapComponent";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import Toast from "../../components/Toast";
import { emergencyService } from "../../services/emergencyService";
import { hospitalService } from "../../services/hospitalService";
import { initialTrips } from "../../data/trips";
import {
  Siren,
  Phone,
  MapPin,
  CheckCircle2,
  Navigation,
  Building2,
  ArrowRight,
  ShieldCheck,
  HeartPulse
} from "lucide-react";

const DriverEmergency = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emergencyId = searchParams.get("id") || "1";

  const [emergency, setEmergency] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [trip, setTrip] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("EN_ROUTE");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmergency = async () => {
      try {
        const em = await emergencyService.getEmergencyById(emergencyId);
        if (em) {
          setEmergency(em);
          setCurrentStatus(em.status || "EN_ROUTE");
          if (em.destinationHospitalId) {
            const h = await hospitalService.getHospitalById(em.destinationHospitalId);
            setHospital(h);
          }
          const t = initialTrips.find((item) => item.emergencyRequestId === em.id);
          if (t) setTrip(t);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadEmergency();
  }, [emergencyId]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await emergencyService.updateStatus(emergencyId, newStatus);
      setCurrentStatus(newStatus);
      setToastMessage(`Status updated to ${newStatus.replace(/_/g, " ")}`);

      if (newStatus === "COMPLETED") {
        setTimeout(() => {
          navigate("/driver/dashboard");
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!emergency) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
        <h5>No Active Emergency Selected</h5>
        <Link to="/driver/dashboard" className="btn btn-primary rounded-pill px-4 mx-auto mt-2">
          Back to Driver Console
        </Link>
      </div>
    );
  }

  const routePoints = trip?.routePoints || [
    [emergency.pickupLatitude + 0.015, emergency.pickupLongitude - 0.012],
    [emergency.pickupLatitude, emergency.pickupLongitude],
    [hospital ? hospital.latitude : 17.4262, hospital ? hospital.longitude : 78.4116]
  ];

  return (
    <div>
      <PageHeader
        title={`Emergency Call #${emergency.id}: ${emergency.patientName}`}
        subtitle={`Priority: ${emergency.priority} | Destination: ${emergency.destinationHospitalName || "Apollo Hospital"}`}
        action={
          <div className="d-flex align-items-center gap-2">
            <PriorityBadge priority={emergency.priority} />
            <StatusBadge status={currentStatus} />
          </div>
        }
      />

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />

      {/* ACTION CONTROLS / ADVANCE STATUS */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <h6 className="fw-bold text-dark mb-3">Live Dispatch Trip Progression</h6>

        <div className="row g-2">
          <div className="col-12 col-md-3">
            <button
              onClick={() => handleUpdateStatus("EN_ROUTE")}
              className={`btn w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                currentStatus === "EN_ROUTE" ? "btn-primary shadow-sm" : "btn-light border"
              }`}
            >
              <Navigation size={16} /> 1. En Route to Scene
            </button>
          </div>

          <div className="col-12 col-md-3">
            <button
              onClick={() => handleUpdateStatus("ARRIVED")}
              className={`btn w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                currentStatus === "ARRIVED" ? "btn-warning text-dark shadow-sm" : "btn-light border"
              }`}
            >
              <CheckCircle2 size={16} /> 2. Arrived at Scene
            </button>
          </div>

          <div className="col-12 col-md-3">
            <button
              onClick={() => handleUpdateStatus("IN_TRANSIT")}
              className={`btn w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                currentStatus === "IN_TRANSIT" ? "btn-info text-white shadow-sm" : "btn-light border"
              }`}
            >
              <Siren size={16} /> 3. In Transit to Hospital
            </button>
          </div>

          <div className="col-12 col-md-3">
            <button
              onClick={() => handleUpdateStatus("COMPLETED")}
              className={`btn w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                currentStatus === "COMPLETED" ? "btn-success shadow-sm" : "btn-outline-success"
              }`}
            >
              <ShieldCheck size={16} /> 4. Complete Handover
            </button>
          </div>
        </div>
      </div>

      {/* MAP & TACTICAL INFORMATION */}
      <div className="row g-4 mb-4">
        {/* Left: Tactical Map */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="fw-bold text-dark mb-0">Active Navigation Route</h6>
              <span className="badge bg-primary text-white">Turn-By-Turn GPS Mode</span>
            </div>
            <MapComponent
              center={[emergency.pickupLatitude, emergency.pickupLongitude]}
              zoom={14}
              activeEmergency={emergency}
              hospitals={hospital ? [hospital] : []}
              routePolyline={routePoints}
              height="450px"
            />
          </div>
        </div>

        {/* Right: Patient & Hospital */}
        <div className="col-12 col-lg-4">
          {/* Patient Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h6 className="fw-bold text-dark mb-3">Patient In Distress</h6>

            <div className="mb-3">
              <h5 className="fw-bold text-primary mb-1">{emergency.patientName}</h5>
              <div className="text-danger small fw-semibold mb-2">
                Condition: {emergency.emergencyType?.replace(/_/g, " ")}
              </div>
              <p className="text-secondary small bg-light p-2 rounded-3 mb-2">
                {emergency.description}
              </p>
              <div className="d-flex align-items-start gap-2 small text-muted">
                <MapPin size={15} className="text-danger mt-1 flex-shrink-0" />
                <span>{emergency.pickupAddress}</span>
              </div>
            </div>

            <a
              href={`tel:${emergency.patientPhone}`}
              className="btn btn-outline-primary rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 fw-medium"
            >
              <Phone size={15} /> Call Patient / Caller
            </a>
          </div>

          {/* Hospital Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold text-dark mb-3">Destination Hospital Trauma Center</h6>

            <div className="d-flex align-items-start gap-2 mb-3">
              <Building2 size={22} className="text-danger flex-shrink-0" />
              <div>
                <strong className="d-block text-dark">{hospital?.name || emergency.destinationHospitalName}</strong>
                <span className="small text-muted">{hospital?.address}</span>
              </div>
            </div>

            <div className="p-3 bg-success-subtle border border-success-subtle text-success rounded-3 small mb-3">
              <strong>Pre-alert Received:</strong> Trauma bay prepared. Vitals telemetry is broadcasting.
            </div>

            <a
              href={`tel:${hospital?.emergencyUnitNumber || "+91 40 1066"}`}
              className="btn btn-outline-danger rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 fw-medium"
            >
              <Phone size={15} /> Call Emergency Room
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverEmergency;
