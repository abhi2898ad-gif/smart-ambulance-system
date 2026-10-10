import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { hospitalService } from "../../services/hospitalService";
import { emergencyService } from "../../services/emergencyService";
import {
  Building2,
  BedDouble,
  Activity,
  Siren,
  Clock,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal
} from "lucide-react";

const HospitalDashboard = () => {
  const [hospital, setHospital] = useState(null);
  const [incomingEmergencies, setIncomingEmergencies] = useState([]);
  const [showBedModal, setShowBedModal] = useState(false);
  const [bedForm, setBedForm] = useState({ availableBeds: 42, availableIcuBeds: 8, status: "ACCEPTING" });
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHospitalData = async () => {
      try {
        const hospList = await hospitalService.getHospitals();
        const mainHosp = hospList[0]; // Apollo Health City
        setHospital(mainHosp);
        setBedForm({
          availableBeds: mainHosp.availableBeds,
          availableIcuBeds: mainHosp.availableIcuBeds,
          status: mainHosp.status
        });

        const emergencies = await emergencyService.getEmergencies();
        const incoming = emergencies.filter(
          (e) =>
            (e.destinationHospitalId === mainHosp.id || !e.destinationHospitalId) &&
            e.status !== "COMPLETED" &&
            e.status !== "CANCELLED"
        );
        setIncomingEmergencies(incoming);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadHospitalData();
  }, []);

  const handleUpdateBeds = async (e) => {
    e.preventDefault();
    try {
      if (hospital?.id) {
        await hospitalService.updateBeds(hospital.id, bedForm.availableBeds, bedForm.availableIcuBeds);
        await hospitalService.updateStatus(hospital.id, bedForm.status);
        setHospital((prev) => ({
          ...prev,
          availableBeds: parseInt(bedForm.availableBeds),
          availableIcuBeds: parseInt(bedForm.availableIcuBeds),
          status: bedForm.status
        }));
      }
      setShowBedModal(false);
      setToastMessage("Hospital bed capacity & triage status updated!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuickStatusChange = async (newStatus) => {
    try {
      if (hospital?.id) {
        await hospitalService.updateStatus(hospital.id, newStatus);
        setHospital((prev) => ({ ...prev, status: newStatus }));
        setBedForm((prev) => ({ ...prev, status: newStatus }));
        setToastMessage(`Hospital status set to ${newStatus}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <PageHeader
        title={hospital?.name || "Apollo Health City Jubilee Hills"}
        subtitle={`Emergency Command Center & Trauma Registry | Status: ${hospital?.status || "ACCEPTING"}`}
        badge={<StatusBadge status={hospital?.status || "ACCEPTING"} />}
        action={
          <button
            onClick={() => setShowBedModal(true)}
            className="btn btn-primary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
          >
            <SlidersHorizontal size={16} /> Update Live Bed Capacity
          </button>
        }
      />

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />

      {/* QUICK STATUS TOGGLE BAR */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <Activity size={18} className="text-danger" />
            <span className="small fw-bold text-dark">Trauma Admission Status:</span>
          </div>

          <div className="btn-group" role="group">
            <button
              type="button"
              onClick={() => handleQuickStatusChange("ACCEPTING")}
              className={`btn btn-sm ${
                hospital?.status === "ACCEPTING" ? "btn-success" : "btn-outline-success"
              }`}
            >
              &check; Accepting Emergencies
            </button>
            <button
              type="button"
              onClick={() => handleQuickStatusChange("DIVERTING")}
              className={`btn btn-sm ${
                hospital?.status === "DIVERTING" ? "btn-warning" : "btn-outline-warning"
              }`}
            >
              &bull; Diverting Non-Critical
            </button>
            <button
              type="button"
              onClick={() => handleQuickStatusChange("FULL")}
              className={`btn btn-sm ${
                hospital?.status === "FULL" ? "btn-danger" : "btn-outline-danger"
              }`}
            >
              &times; At Full Capacity
            </button>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Available General Beds"
            value={`${hospital?.availableBeds || 42} / ${hospital?.totalBeds || 450}`}
            subtitle="Monitored in real-time"
            icon={BedDouble}
            variant="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Available ICU Beds"
            value={`${hospital?.availableIcuBeds || 8} / ${hospital?.icuBeds || 90}`}
            subtitle="Mechanical ventilators ready"
            icon={Activity}
            variant={hospital?.availableIcuBeds <= 2 ? "danger" : "success"}
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Incoming Ambulances"
            value={incomingEmergencies.length}
            subtitle="En route or pre-alerted"
            icon={Siren}
            variant="danger"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Overall Occupancy"
            value={`${hospital?.occupancyRate || 90.6}%`}
            subtitle="Capacity utilization"
            icon={Building2}
            variant="warning"
          />
        </div>
      </div>

      {/* INCOMING EMERGENCIES STREAM */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  <span className="spinner-grow spinner-grow-sm text-danger" role="status"></span>
                  Incoming Ambulance Radar
                </h5>
                <p className="text-muted small mb-0">Pre-alerts dispatched directly from paramedic vehicles</p>
              </div>
              <Link to="/hospital/emergencies" className="text-primary small fw-semibold text-decoration-none">
                Manage All Admissions &rarr;
              </Link>
            </div>

            {incomingEmergencies.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {incomingEmergencies.map((em) => (
                  <div
                    key={em.id}
                    className="p-3 rounded-4 border bg-light d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 transition-all hover-shadow"
                  >
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <PriorityBadge priority={em.priority} />
                        <span className="badge bg-white text-secondary border small">#{em.id}</span>
                        <span className="badge bg-primary text-white small">{em.vehicleNumber || "Assigned Ambulance"}</span>
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{em.patientName} &bull; {em.emergencyType?.replace(/_/g, " ")}</h6>
                      <p className="text-muted small mb-0 line-clamp-1">{em.description}</p>
                    </div>

                    <div className="d-flex align-items-center gap-3 flex-shrink-0">
                      <div className="bg-white rounded-3 p-2 px-3 border text-center">
                        <span className="small text-muted d-block" style={{ fontSize: "0.68rem" }}>ETA</span>
                        <strong className="text-danger fs-5">{em.etaMinutes || 6}m</strong>
                      </div>

                      <Link
                        to="/hospital/emergencies"
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      >
                        Prepare Bay
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center text-muted">
                <CheckCircle2 size={36} className="text-success mx-auto mb-2" />
                <p className="mb-0">No pending ambulance arrivals at this moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Hospital Capacity Breakdown */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h6 className="fw-bold text-dark mb-3">Trauma Department Readiness</h6>

            <div className="d-flex flex-column gap-3 mb-4">
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Cardiac Catheterization Lab</span>
                  <span className="badge bg-success-subtle text-success">On Standby</span>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div className="progress-bar bg-success" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Stroke Neuro Trauma Bay</span>
                  <span className="badge bg-success-subtle text-success">Available</span>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div className="progress-bar bg-success" style={{ width: "80%" }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">Pediatric Neonatal ICU</span>
                  <span className="badge bg-warning-subtle text-warning">Limited</span>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div className="progress-bar bg-warning" style={{ width: "92%" }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-muted">General Emergency Beds</span>
                  <span className="badge bg-primary-subtle text-primary">{hospital?.availableBeds} free</span>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div className="progress-bar bg-primary" style={{ width: `${hospital?.occupancyRate}%` }}></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-light rounded-3 small">
              <span className="fw-bold text-dark d-block mb-1">Emergency Desk Hotline:</span>
              <a href={`tel:${hospital?.emergencyUnitNumber}`} className="text-danger fw-bold fs-6 text-decoration-none">
                {hospital?.emergencyUnitNumber}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* UPDATE BED MODAL */}
      <Modal
        isOpen={showBedModal}
        onClose={() => setShowBedModal(false)}
        title="Update Emergency Bed Availability"
        footer={
          <>
            <button className="btn btn-light rounded-pill px-3" onClick={() => setShowBedModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary rounded-pill px-4" onClick={handleUpdateBeds}>
              Save Updates
            </button>
          </>
        }
      >
        <form onSubmit={handleUpdateBeds}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Available General Beds</label>
            <input
              type="number"
              className="form-control bg-light"
              value={bedForm.availableBeds}
              onChange={(e) => setBedForm({ ...bedForm, availableBeds: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Available ICU Beds</label>
            <input
              type="number"
              className="form-control bg-light"
              value={bedForm.availableIcuBeds}
              onChange={(e) => setBedForm({ ...bedForm, availableIcuBeds: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Hospital Operating Status</label>
            <select
              className="form-select bg-light"
              value={bedForm.status}
              onChange={(e) => setBedForm({ ...bedForm, status: e.target.value })}
            >
              <option value="ACCEPTING">ACCEPTING (Fully open for all emergencies)</option>
              <option value="DIVERTING">DIVERTING (Accept only critical/life-threatening)</option>
              <option value="FULL">FULL (No beds available)</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HospitalDashboard;
