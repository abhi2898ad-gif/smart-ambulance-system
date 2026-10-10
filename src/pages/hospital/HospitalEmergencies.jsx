import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import Toast from "../../components/Toast";
import { emergencyService } from "../../services/emergencyService";
import { formatDate, formatTime } from "../../utils/helpers";
import { Siren, Clock, User, Phone, CheckCircle2, BedDouble, Filter } from "lucide-react";

const HospitalEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmergencies();
  }, []);

  const loadEmergencies = async () => {
    try {
      const data = await emergencyService.getEmergencies();
      setEmergencies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (emergencyId, newStatus) => {
    try {
      await emergencyService.updateStatus(emergencyId, newStatus);
      setToastMessage(`Patient status updated to ${newStatus}`);
      loadEmergencies();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = emergencies.filter(
    (e) => filterPriority === "ALL" || e.priority === filterPriority
  );

  return (
    <div>
      <PageHeader
        title="Incoming Trauma & Emergency Stream"
        subtitle="Live pre-alert triage notifications received from ambulances en route"
        badge={<span className="badge bg-danger text-white">{emergencies.length} Admissions</span>}
      />

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />

      {/* Filter */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <Filter size={16} className="text-muted" />
            <span className="small fw-semibold text-secondary">Filter by Clinical Urgency:</span>
          </div>

          <div className="btn-group" role="group">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`btn btn-sm ${
                  filterPriority === p ? "btn-primary" : "btn-light border"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="row g-3">
        {filtered.map((item) => {
          const isCritical = item.priority === "CRITICAL";
          return (
            <div className="col-12" key={item.id}>
              <div
                className={`card border-0 shadow-sm rounded-4 p-4 bg-white transition-all ${
                  isCritical ? "border-start border-4 border-danger" : ""
                }`}
              >
                <div className="row align-items-center g-3">
                  <div className="col-12 col-md-5">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="badge bg-light text-secondary border small">#{item.id}</span>
                      <PriorityBadge priority={item.priority} />
                      <StatusBadge status={item.status} />
                    </div>
                    <h5 className="fw-bold text-dark mb-1">{item.patientName}</h5>
                    <p className="text-danger small fw-semibold mb-1">
                      {item.emergencyType?.replace(/_/g, " ")}
                    </p>
                    <p className="text-muted small mb-0">{item.description}</p>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-light rounded-3 small">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Assigned Ambulance:</span>
                        <strong className="text-primary">{item.vehicleNumber || "Dispatching..."}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Paramedic Driver:</span>
                        <span className="text-dark fw-medium">{item.driverName || "Pending"}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Estimated ETA:</span>
                        <span className="badge bg-danger text-white">{item.etaMinutes || 0} Mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-3 d-flex flex-column gap-2">
                    {item.status !== "COMPLETED" ? (
                      <>
                        <button
                          onClick={() => handleStatusChange(item.id, "ARRIVED")}
                          className="btn btn-sm btn-outline-warning rounded-pill fw-medium"
                        >
                          Mark Arrived at ER
                        </button>
                        <button
                          onClick={() => handleStatusChange(item.id, "COMPLETED")}
                          className="btn btn-sm btn-success rounded-pill fw-medium"
                        >
                          &check; Admit & Complete Care
                        </button>
                      </>
                    ) : (
                      <span className="badge bg-success-subtle text-success py-2 text-center rounded-pill">
                        &check; Admitted to Ward
                      </span>
                    )}
                    {item.patientPhone && (
                      <a
                        href={`tel:${item.patientPhone}`}
                        className="btn btn-sm btn-light border rounded-pill d-flex align-items-center justify-content-center gap-1"
                      >
                        <Phone size={13} /> Call Caller
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HospitalEmergencies;
