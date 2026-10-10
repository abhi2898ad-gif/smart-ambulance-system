import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import MapComponent from "../../components/MapComponent";
import { emergencyService } from "../../services/emergencyService";
import { EMERGENCY_TYPES, HYDERABAD_CENTER } from "../../utils/constants";
import {
  Siren,
  MapPin,
  Phone,
  User,
  AlertCircle,
  Sparkles,
  Compass,
  CheckCircle2,
  ShieldAlert,
  ArrowRight
} from "lucide-react";

const RequestAmbulance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: user?.fullName || "Rahul Verma",
    patientPhone: user?.phone || "+91 98765 43211",
    emergencyType: "CARDIAC_ARREST",
    description: "Acute chest pain, breathing difficulty, dizziness",
    pickupAddress: "Cyber Towers Intersection, Hitec City, Hyderabad",
    pickupLatitude: 17.4435,
    pickupLongitude: 78.3772,
    priority: "CRITICAL"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepSimulation, setStepSimulation] = useState(0);
  const [error, setError] = useState("");

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      emergencyType: type.value,
      priority: type.defaultPriority
    }));
  };

  const handleMapLocationSelect = (coords) => {
    setFormData((prev) => ({
      ...prev,
      pickupLatitude: coords.lat,
      pickupLongitude: coords.lng,
      pickupAddress: `Pinned Location (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`
    }));
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            pickupLatitude: Math.round(position.coords.latitude * 10000) / 10000,
            pickupLongitude: Math.round(position.coords.longitude * 10000) / 10000,
            pickupAddress: "Current GPS Device Location"
          }));
        },
        () => {
          // Fallback to Hyderabad HITEC City
          setFormData((prev) => ({
            ...prev,
            pickupLatitude: 17.4435,
            pickupLongitude: 78.3772,
            pickupAddress: "HITEC City Cyber Towers, Hyderabad"
          }));
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // AI Simulation Steps
    try {
      setStepSimulation(1); // AI assessing
      await new Promise((r) => setTimeout(r, 700));

      setStepSimulation(2); // Locating unit
      await new Promise((r) => setTimeout(r, 700));

      setStepSimulation(3); // Contacting hospital & driver
      await new Promise((r) => setTimeout(r, 600));

      const newEmergency = await emergencyService.createEmergency({
        userId: user?.id || 2,
        ...formData
      });

      setStepSimulation(4); // Success!
      await new Promise((r) => setTimeout(r, 500));

      navigate(`/user/track-ambulance?id=${newEmergency.id}`);
    } catch (err) {
      setError(err.message || "Failed to dispatch ambulance.");
      setIsSubmitting(false);
      setStepSimulation(0);
    }
  };

  return (
    <div>
      <PageHeader
        title="Request Emergency Dispatch"
        subtitle="AI-powered symptom evaluation, immediate ambulance routing and hospital triage"
        badge={<span className="badge bg-danger text-white small">Urgent Dispatch</span>}
      />

      {error && (
        <div className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* AI DISPATCH SIMULATION MODAL OVERLAY */}
      {isSubmitting && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 1080
          }}
        >
          <div className="card border-0 shadow-2xl rounded-4 p-4 p-md-5 text-center bg-white" style={{ maxWidth: "500px", width: "100%" }}>
            <div className="p-3 rounded-circle bg-danger-subtle text-danger mx-auto mb-3" style={{ width: 68, height: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Siren size={36} className="emergency-icon-pulse" />
            </div>

            <h4 className="fw-bold text-dark mb-1">AI Dispatch Engine Active</h4>
            <p className="text-secondary small mb-4">Evaluating triage urgency and mobilizing nearest responder</p>

            <div className="d-flex flex-column gap-3 text-start mb-4">
              <div className={`p-3 rounded-3 border d-flex align-items-center gap-3 ${stepSimulation >= 1 ? "bg-primary-subtle border-primary-subtle text-primary" : "bg-light text-muted"}`}>
                {stepSimulation > 1 ? <CheckCircle2 size={20} className="text-primary flex-shrink-0" /> : <div className="spinner-border spinner-border-sm text-primary flex-shrink-0" />}
                <div className="small">
                  <strong className="d-block">1. Clinical Triage Analysis</strong>
                  <span>Priority rated as: <strong>{formData.priority}</strong></span>
                </div>
              </div>

              <div className={`p-3 rounded-3 border d-flex align-items-center gap-3 ${stepSimulation >= 2 ? "bg-primary-subtle border-primary-subtle text-primary" : "bg-light text-muted"}`}>
                {stepSimulation > 2 ? <CheckCircle2 size={20} className="text-primary flex-shrink-0" /> : stepSimulation === 2 ? <div className="spinner-border spinner-border-sm text-primary flex-shrink-0" /> : <div style={{ width: 20 }} />}
                <div className="small">
                  <strong className="d-block">2. Locating Nearest Ambulance</strong>
                  <span>Filtering telemetry GPS for closest ICU unit</span>
                </div>
              </div>

              <div className={`p-3 rounded-3 border d-flex align-items-center gap-3 ${stepSimulation >= 3 ? "bg-primary-subtle border-primary-subtle text-primary" : "bg-light text-muted"}`}>
                {stepSimulation >= 3 ? <CheckCircle2 size={20} className="text-primary flex-shrink-0" /> : <div style={{ width: 20 }} />}
                <div className="small">
                  <strong className="d-block">3. Reserving Hospital Trauma Bed</strong>
                  <span>Pre-alerting nearest emergency cath lab</span>
                </div>
              </div>
            </div>

            <div className="text-muted small">Redirecting to live telemetry map...</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left Form: Details and Emergency Type */}
          <div className="col-12 col-lg-7">
            {/* Step 1: Emergency Type */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <span className="badge bg-danger rounded-circle p-2 text-white" style={{ width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>1</span>
                  Select Emergency Type
                </h5>
                <span className="badge bg-primary-subtle text-primary small">AI Priority Preview: {formData.priority}</span>
              </div>

              <div className="row g-2 mb-3">
                {EMERGENCY_TYPES.map((type) => {
                  const isSelected = formData.emergencyType === type.value;
                  return (
                    <div className="col-12 col-sm-6" key={type.value}>
                      <button
                        type="button"
                        onClick={() => handleTypeSelect(type)}
                        className={`btn text-start w-100 p-3 rounded-3 border transition-all h-100 ${
                          isSelected
                            ? "border-danger bg-danger-subtle text-danger shadow-sm"
                            : "border-light bg-light text-dark hover-bg"
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <strong className="small">{type.label}</strong>
                          <span className={`badge rounded-pill ${type.defaultPriority === "CRITICAL" ? "bg-danger" : type.defaultPriority === "HIGH" ? "bg-warning text-dark" : "bg-primary"} text-white`} style={{ fontSize: "0.68rem" }}>
                            {type.defaultPriority}
                          </span>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mb-2">
                <label className="form-label small fw-semibold text-secondary">
                  Patient Symptoms & Current Condition
                </label>
                <textarea
                  className="form-control bg-light"
                  rows="3"
                  placeholder="Describe patient condition, conscious state, bleeding, or known allergies..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                ></textarea>
              </div>
            </div>

            {/* Step 2: Patient & Contact */}
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <span className="badge bg-danger rounded-circle p-2 text-white" style={{ width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>2</span>
                Patient Details
              </h5>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-secondary">Patient Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <User size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-start-0"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-semibold text-secondary">Contact Phone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Phone size={16} className="text-muted" />
                    </span>
                    <input
                      type="tel"
                      className="form-control bg-light border-start-0"
                      value={formData.patientPhone}
                      onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form: Location & Map Picker */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                    <span className="badge bg-danger rounded-circle p-2 text-white" style={{ width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>3</span>
                    Pickup Location
                  </h5>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center gap-1"
                  >
                    <Compass size={14} /> My GPS
                  </button>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-semibold text-secondary">Pickup Address / Landmark</label>
                  <div className="input-group mb-2">
                    <span className="input-group-text bg-light border-end-0">
                      <MapPin size={16} className="text-danger" />
                    </span>
                    <input
                      type="text"
                      className="form-control bg-light border-start-0"
                      value={formData.pickupAddress}
                      onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                      required
                    />
                  </div>
                  <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                    Or click anywhere on the map below to pinpoint the exact scene:
                  </span>
                </div>

                {/* Interactive Location Picker Map */}
                <div className="mb-3 rounded-4 overflow-hidden border">
                  <MapComponent
                    center={[formData.pickupLatitude, formData.pickupLongitude]}
                    zoom={13}
                    selectedLocation={{ lat: formData.pickupLatitude, lng: formData.pickupLongitude }}
                    onLocationSelect={handleMapLocationSelect}
                    height="260px"
                  />
                </div>

                {/* AI Triage Banner */}
                <div className="p-3 rounded-3 bg-danger-subtle border border-danger-subtle text-danger small mb-3">
                  <div className="d-flex align-items-center gap-2 fw-bold mb-1">
                    <ShieldAlert size={16} /> AI Automatic Pre-Alert
                  </div>
                  <p className="mb-0" style={{ fontSize: "0.8rem" }}>
                    Once requested, nearest available ICU/ALS vehicle will be assigned instantly. Telemetry will guide driver via optimal low-traffic corridors.
                  </p>
                </div>
              </div>

              {/* Submit Dispatch Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-danger btn-lg rounded-pill py-3 fw-bold w-100 d-flex align-items-center justify-content-center gap-2 shadow-lg emergency-btn-glow"
              >
                <Siren size={22} /> DISPATCH AMBULANCE NOW
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RequestAmbulance;
