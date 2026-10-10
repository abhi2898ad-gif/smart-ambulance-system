import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { emergencyService } from "../../services/emergencyService";
import { ambulanceService } from "../../services/ambulanceService";
import { formatDate, formatTime } from "../../utils/helpers";
import { Siren, Search, Filter, Compass, CheckCircle2, User, Truck, Phone } from "lucide-react";

const ManageEmergencies = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [overrideEmergency, setOverrideEmergency] = useState(null);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const ems = await emergencyService.getEmergencies();
    const ambs = await ambulanceService.getAmbulances();
    setEmergencies(ems);
    setAmbulances(ambs);
  };

  const handleManualDispatch = async () => {
    if (overrideEmergency && selectedAmbulanceId) {
      await emergencyService.assignAmbulance(overrideEmergency.id, selectedAmbulanceId);
      setOverrideEmergency(null);
      loadData();
      setToastMessage("Manual dispatch assigned successfully.");
    }
  };

  const filtered = emergencies.filter((em) => {
    const matchesSearch =
      ((em.patientName || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((em.pickupAddress || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((em.emergencyType || "")).toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "ALL" || em.priority === priorityFilter;
    const matchesStatus = statusFilter === "ALL" || em.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Emergency Dispatch Queue"
        subtitle="Real-time intake stream, priority scoring, automated allocations and manual override"
        badge={<span className="badge bg-danger text-white">{emergencies.length} Incidents Logged</span>}
      />

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />

      {/* FILTER BAR */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search patient, address, or emergency type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select bg-light"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select bg-light"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="EN_ROUTE">En Route</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="col-12 col-md-1 text-md-end">
            <button
              className="btn btn-outline-secondary w-100 rounded-3 text-nowrap"
              onClick={() => {
                setSearch("");
                setPriorityFilter("ALL");
                setStatusFilter("ALL");
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Type & Symptoms</th>
                <th>Priority</th>
                <th>Assigned Unit</th>
                <th>ETA</th>
                <th>Destination</th>
                <th>Status</th>
                <th className="text-end">Manual Override</th>
              </tr>
            </thead>
            <tbody className="small">
              {filtered.map((em) => (
                <tr key={em.id}>
                  <td className="fw-semibold">#{em.id}</td>
                  <td>
                    <div className="fw-medium text-dark">{em.patientName}</div>
                    <span className="text-muted" style={{ fontSize: "0.72rem" }}>{em.patientPhone}</span>
                  </td>
                  <td>
                    <strong className="d-block text-dark">{em.emergencyType?.replace(/_/g, " ")}</strong>
                    <span className="text-muted line-clamp-1" style={{ maxWidth: "220px", fontSize: "0.72rem" }}>
                      {em.description}
                    </span>
                  </td>
                  <td>
                    <PriorityBadge priority={em.priority} />
                  </td>
                  <td>
                    {em.vehicleNumber ? (
                      <span className="badge bg-light text-primary border">{em.vehicleNumber}</span>
                    ) : (
                      <span className="text-warning fw-semibold">&bull; Awaiting unit</span>
                    )}
                  </td>
                  <td>
                    {em.etaMinutes ? (
                      <span className="badge bg-danger text-white">{em.etaMinutes}m</span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "160px" }}>
                    {em.destinationHospitalName || "Apollo Hospital"}
                  </td>
                  <td>
                    <StatusBadge status={em.status} />
                  </td>
                  <td className="text-end">
                    <button
                      onClick={() => {
                        setOverrideEmergency(em);
                        setSelectedAmbulanceId(em.assignedAmbulanceId || "");
                      }}
                      className="btn btn-sm btn-outline-danger rounded-pill px-3"
                    >
                      Override
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DISPATCH OVERRIDE MODAL */}
      <Modal
        isOpen={!!overrideEmergency}
        onClose={() => setOverrideEmergency(null)}
        title={`Manual Dispatch Override for #${overrideEmergency?.id}`}
        footer={
          <>
            <button className="btn btn-light rounded-pill px-3" onClick={() => setOverrideEmergency(null)}>
              Cancel
            </button>
            <button className="btn btn-danger rounded-pill px-4" onClick={handleManualDispatch}>
              Force Reassign Unit
            </button>
          </>
        }
      >
        {overrideEmergency && (
          <div>
            <div className="p-3 bg-light rounded-3 mb-3">
              <h6 className="fw-bold text-dark mb-1">{overrideEmergency.patientName}</h6>
              <p className="text-secondary small mb-1">{overrideEmergency.description}</p>
              <span className="text-muted small">Scene: {overrideEmergency.pickupAddress}</span>
            </div>

            <label className="form-label small fw-semibold text-secondary mb-2">Select Unit to Force-Assign</label>
            <select
              className="form-select bg-light"
              value={selectedAmbulanceId}
              onChange={(e) => setSelectedAmbulanceId(e.target.value)}
            >
              <option value="">-- Choose Ambulance Vehicle --</option>
              {ambulances.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.vehicleNumber} ({a.ambulanceType}) &bull; Status: {a.status} &bull; Driver: {a.assignedDriverName}
                </option>
              ))}
            </select>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageEmergencies;
