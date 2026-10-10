import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import MapComponent from "../../components/MapComponent";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import { emergencyService } from "../../services/emergencyService";
import { ambulanceService } from "../../services/ambulanceService";
import { hospitalService } from "../../services/hospitalService";
import { initialTrips } from "../../data/trips";
import {
  Siren,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Truck,
  User,
  ArrowLeft,
  XCircle,
  Share2
} from "lucide-react";

const TrackAmbulance = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const emergencyId = searchParams.get("id") || "1";

  const [emergency, setEmergency] = useState(null);
  const [ambulance, setAmbulance] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [trip, setTrip] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [etaRemaining, setEtaRemaining] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrackingData = async () => {
      try {
        const em = await emergencyService.getEmergencyById(emergencyId);
        if (em) {
          setEmergency(em);
          if (em.etaMinutes) setEtaRemaining(em.etaMinutes);
          if (em.assignedAmbulanceId) {
            const amb = await ambulanceService.getAmbulanceById(em.assignedAmbulanceId);
            setAmbulance(amb);
          }
          if (em.destinationHospitalId) {
            const hosp = await hospitalService.getHospitalById(em.destinationHospitalId);
            setHospital(hosp);
          }
          const matchedTrip = initialTrips.find((t) => t.emergencyRequestId === em.id);
          if (matchedTrip) setTrip(matchedTrip);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadTrackingData();
  }, [emergencyId]);

  // Live ETA countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaRemaining((prev) => (prev > 1 ? prev - 1 : 1));
    }, 15000); // decrement every 15s in demo
    return () => clearInterval(timer);
  }, []);

  const handleCancel = async () => {
    try {
      await emergencyService.updateStatus(emergencyId, "CANCELLED");
      setShowCancelModal(false);
      navigate("/user/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  const normalizeStatus = (status) => {
    if (!status) return "EN_ROUTE";
    switch (status) {
      case "REQUESTED":
      case "PRIORITY_ASSIGNED":
        return "PENDING";
      case "AMBULANCE_ASSIGNED":
        return "ASSIGNED";
      case "PATIENT_PICKED":
        return "IN_TRANSIT";
      case "AT_HOSPITAL":
        return "COMPLETED";
      default:
        return status;
    }
  };

  const getTimelineSteps = () => {
    const steps = [
      { key: "PENDING", label: "Request Placed", desc: "AI evaluated priority" },
      { key: "ASSIGNED", label: "Unit Dispatched", desc: "Ambulance mobilized" },
      { key: "EN_ROUTE", label: "En Route to Scene", desc: "Driver navigating via GPS" },
      { key: "ARRIVED", label: "Arrived at Location", desc: "Paramedics on site" },
      { key: "IN_TRANSIT", label: "In Transit to Hospital", desc: "Vitals monitored" },
      { key: "COMPLETED", label: "Patient Handover", desc: "Emergency trauma admission" }
    ];

    const statusOrder = ["PENDING", "ASSIGNED", "EN_ROUTE", "ARRIVED", "IN_TRANSIT", "COMPLETED"];
    const currentStatus = normalizeStatus(emergency?.status);
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => {
      const isCompleted = index <= (currentIndex === -1 ? 2 : currentIndex);
      const isCurrent = index === (currentIndex === -1 ? 2 : currentIndex);
      return { ...step, isCompleted, isCurrent };
    });
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading live emergency telemetry...</p>
      </div>
    );
  }

  if (!emergency) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
        <h5>Emergency Request Not Found</h5>
        <p className="text-muted">Could not find emergency request #{emergencyId}</p>
        <Link to="/user/dashboard" className="btn btn-primary rounded-pill px-4 mx-auto">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const routePoints = trip?.routePoints || [
    [emergency.pickupLatitude + 0.015, emergency.pickupLongitude - 0.012],
    [emergency.pickupLatitude + 0.008, emergency.pickupLongitude - 0.005],
    [emergency.pickupLatitude, emergency.pickupLongitude],
    [hospital ? hospital.latitude : 17.4262, hospital ? hospital.longitude : 78.4116]
  ];

  const ambulancesOnMap = ambulance
    ? [ambulance]
    : [
        {
          id: 99,
          vehicleNumber: emergency.vehicleNumber || "TS-09-EA-1002",
          ambulanceType: "ICU",
          status: "DISPATCHED",
          latitude: emergency.pickupLatitude + 0.012,
          longitude: emergency.pickupLongitude - 0.008,
          assignedDriverName: emergency.driverName || "Suresh Reddy"
        }
      ];

  const hospitalsOnMap = hospital ? [hospital] : [];

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Link to="/user/dashboard" className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-secondary border px-2 py-1 small">
            ID: #{emergency.id}
          </span>
          <PriorityBadge priority={emergency.priority} />
          <StatusBadge status={emergency.status} />
        </div>
      </div>

      {/* TOP LIVE BANNER */}
      <div className="card border-0 bg-navy text-white shadow-lg rounded-4 p-4 mb-4">
        <div className="row align-items-center g-3">
          <div className="col-12 col-md-7">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="spinner-grow spinner-grow-sm text-danger" role="status"></span>
              <span className="small text-danger fw-bold text-uppercase letter-spacing-wide">
                LIVE GPS TELEMETRY &bull; EN ROUTE
              </span>
            </div>
            <h3 className="fw-bold mb-1 text-white">
              {emergency.vehicleNumber || "Assigned Ambulance"} is responding
            </h3>
            <p className="text-secondary small mb-0">
              Pickup destination: <strong>{emergency.pickupAddress}</strong>
            </p>
          </div>

          <div className="col-12 col-md-5 d-flex align-items-center justify-content-md-end gap-3">
            <div className="bg-white bg-opacity-10 rounded-3 p-3 text-center border border-white border-opacity-10">
              <span className="small text-secondary d-block">Estimated Arrival</span>
              <span className="display-6 fw-extrabold text-danger mb-0">
                {etaRemaining} <span className="fs-5 text-white">min</span>
              </span>
            </div>

            <button
              onClick={() => setShowCancelModal(true)}
              className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 text-white border-danger"
            >
              Cancel Request
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TRACKING GRID */}
      <div className="row g-4 mb-4">
        {/* Left Column: Live Leaflet Map */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 rounded-3 bg-primary-subtle text-primary">
                  <Truck size={20} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">Live Tactical Navigation Map</h6>
                  <span className="text-muted small">Updated in real-time via telemetry</span>
                </div>
              </div>
              <span className="badge bg-success-subtle text-success small">GPS Signal Locked</span>
            </div>

            <MapComponent
              center={[emergency.pickupLatitude, emergency.pickupLongitude]}
              zoom={14}
              ambulances={ambulancesOnMap}
              hospitals={hospitalsOnMap}
              activeEmergency={emergency}
              routePolyline={routePoints}
              height="440px"
            />
          </div>

          {/* Timeline Tracking Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold text-dark mb-4">Dispatch & Care Progression</h6>

            <div className="row g-3">
              {getTimelineSteps().map((step, idx) => (
                <div className="col-6 col-md-4 col-xl-2 text-center" key={idx}>
                  <div className="d-flex flex-column align-items-center position-relative">
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-xs ${
                        step.isCompleted
                          ? "bg-primary text-white"
                          : "bg-light text-muted border"
                      }`}
                      style={{ width: 40, height: 40 }}
                    >
                      {step.isCompleted ? <CheckCircle2 size={20} /> : idx + 1}
                    </div>
                    <span className={`small fw-semibold ${step.isCompleted ? "text-dark" : "text-muted"}`}>
                      {step.label}
                    </span>
                    <span className="text-muted" style={{ fontSize: "0.68rem" }}>
                      {step.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Driver & Hospital Information */}
        <div className="col-12 col-lg-4">
          {/* Driver Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="small text-uppercase fw-bold text-muted letter-spacing-wide">
                Assigned Responder
              </span>
              <span className="badge bg-success-subtle text-success small">On Duty</span>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="rounded-circle bg-primary-subtle text-primary p-3 d-flex align-items-center justify-content-center" style={{ width: 56, height: 56 }}>
                <User size={28} />
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-0">{emergency.driverName || "Suresh Reddy"}</h6>
                <span className="text-muted small">Paramedic Senior Driver</span>
                <div className="text-warning small">&starf;&starf;&starf;&starf;&starf; 4.9 (512 trips)</div>
              </div>
            </div>

            <div className="p-3 bg-light rounded-3 mb-3">
              <div className="d-flex justify-content-between small mb-1">
                <span className="text-muted">Vehicle Plate:</span>
                <strong className="text-dark">{emergency.vehicleNumber || "TS-09-EA-1002"}</strong>
              </div>
              <div className="d-flex justify-content-between small">
                <span className="text-muted">Vehicle Type:</span>
                <span className="badge bg-danger-subtle text-danger small">ICU Advanced Unit</span>
              </div>
            </div>

            <a
              href={`tel:${emergency.driverPhone || "+91 98765 43217"}`}
              className="btn btn-outline-primary rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold py-2"
            >
              <Phone size={16} /> Call Driver Directly
            </a>
          </div>

          {/* Hospital Card */}
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="small text-uppercase fw-bold text-muted letter-spacing-wide">
                Destination Hospital
              </span>
              <span className="badge bg-danger-subtle text-danger small">Pre-Alerted</span>
            </div>

            <div className="d-flex align-items-start gap-3 mb-3">
              <div className="rounded-3 bg-danger-subtle text-danger p-2">
                <Building2 size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-1">
                  {hospital?.name || emergency.destinationHospitalName || "Apollo Health City"}
                </h6>
                <p className="text-muted small mb-0">
                  {hospital?.address || "Film Nagar, Jubilee Hills, Hyderabad"}
                </p>
              </div>
            </div>

            <div className="p-3 bg-light rounded-3 small mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">ICU Bed Reservation:</span>
                <strong className="text-success">Confirmed & Held</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Emergency Ward:</span>
                <span className="text-dark fw-medium">Level 1 Trauma Bay</span>
              </div>
            </div>

            <a
              href={`tel:${hospital?.emergencyUnitNumber || "+91 40 1066"}`}
              className="btn btn-outline-danger rounded-pill w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold py-2"
            >
              <Phone size={16} /> Call Emergency Room
            </a>
          </div>
        </div>
      </div>

      {/* CANCEL MODAL */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Emergency Dispatch?"
        footer={
          <>
            <button
              className="btn btn-light rounded-pill px-3"
              onClick={() => setShowCancelModal(false)}
            >
              Keep Dispatch Active
            </button>
            <button
              className="btn btn-danger rounded-pill px-3"
              onClick={handleCancel}
            >
              Confirm Cancellation
            </button>
          </>
        }
      >
        <div className="text-center p-2">
          <div className="p-3 rounded-circle bg-danger-subtle text-danger mx-auto mb-3" style={{ width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={30} />
          </div>
          <h5 className="fw-bold text-dark mb-2">Are you sure you want to cancel?</h5>
          <p className="text-secondary small mb-0">
            An emergency vehicle has already been mobilized and is en route to your location. Only cancel if the emergency is resolved.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default TrackAmbulance;
