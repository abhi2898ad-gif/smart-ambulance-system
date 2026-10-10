import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import EmergencyCard from "../../components/EmergencyCard";
import Modal from "../../components/Modal";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import { emergencyService } from "../../services/emergencyService";
import { formatDate, formatTime } from "../../utils/helpers";
import { Search, Filter, History, MapPin, Calendar, Clock, User, Phone, Building2, Truck } from "lucide-react";

const EmergencyHistory = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const data = await emergencyService.getEmergencies();
        setEmergencies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmergencies();
  }, []);

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
        title="Emergency Request History"
        subtitle="Complete archive of all patient distress requests and dispatch outcomes"
        badge={<span className="badge bg-light text-secondary border">{emergencies.length} Total Records</span>}
      />

      {/* FILTER BAR */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
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
              <option value="COMPLETED">Completed</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="EN_ROUTE">En Route</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="PENDING">Pending</option>
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

      {/* LIST OF EMERGENCIES */}
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : filtered.length > 0 ? (
        <div>
          {filtered.map((item) => (
            <EmergencyCard
              key={item.id}
              emergency={item}
              role="USER"
              actionLabel="View Full Report"
              onAction={(em) => setSelectedEmergency(em)}
            />
          ))}
        </div>
      ) : (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <History size={36} className="text-muted mx-auto mb-2" />
          <h5 className="fw-semibold text-dark">No records found</h5>
          <p className="text-muted small">Try modifying your search or filter options.</p>
        </div>
      )}

      {/* EMERGENCY REPORT DETAILS MODAL */}
      <Modal
        isOpen={!!selectedEmergency}
        onClose={() => setSelectedEmergency(null)}
        title={`Emergency Incident Report #${selectedEmergency?.id}`}
        size="lg"
        footer={
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => setSelectedEmergency(null)}
          >
            Close Report
          </button>
        }
      >
        {selectedEmergency && (
          <div>
            <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light mb-4">
              <div>
                <span className="small text-muted d-block">Incident Type</span>
                <h5 className="fw-bold text-dark mb-0">{selectedEmergency.emergencyType?.replace(/_/g, " ")}</h5>
              </div>
              <div className="d-flex align-items-center gap-2">
                <PriorityBadge priority={selectedEmergency.priority} />
                <StatusBadge status={selectedEmergency.status} />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-white">
                  <h6 className="fw-bold text-secondary small text-uppercase mb-2">Patient Details</h6>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <User size={15} className="text-muted" />
                    <strong>{selectedEmergency.patientName}</strong>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted small">
                    <Phone size={15} />
                    <span>{selectedEmergency.patientPhone}</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-white">
                  <h6 className="fw-bold text-secondary small text-uppercase mb-2">Timing</h6>
                  <div className="d-flex align-items-center gap-2 mb-1 small text-dark">
                    <Calendar size={15} className="text-muted" />
                    <span>{formatDate(selectedEmergency.createdAt)}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 small text-muted">
                    <Clock size={15} />
                    <span>Initiated at {formatTime(selectedEmergency.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="p-3 rounded-3 border bg-white">
                  <h6 className="fw-bold text-secondary small text-uppercase mb-2">Scene Location</h6>
                  <div className="d-flex align-items-start gap-2 text-dark small">
                    <MapPin size={16} className="text-danger mt-1 flex-shrink-0" />
                    <span>{selectedEmergency.pickupAddress}</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-white">
                  <h6 className="fw-bold text-secondary small text-uppercase mb-2">Assigned Unit</h6>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <Truck size={15} className="text-primary" />
                    <strong>{selectedEmergency.vehicleNumber || "Unassigned"}</strong>
                  </div>
                  <span className="text-muted small">Driver: {selectedEmergency.driverName || "N/A"}</span>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-white">
                  <h6 className="fw-bold text-secondary small text-uppercase mb-2">Receiving Trauma Center</h6>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <Building2 size={15} className="text-danger" />
                    <strong>{selectedEmergency.destinationHospitalName || "Apollo Health City"}</strong>
                  </div>
                  <span className="text-success small fw-medium">&check; Trauma Bay Pre-Allocated</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-3 bg-light">
              <h6 className="fw-bold text-secondary small text-uppercase mb-1">AI Clinical Triage Summary</h6>
              <p className="text-secondary small mb-0">
                {selectedEmergency.aiRecommendation || "Emergency evaluated and dispatched based on automated priority matrix."}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmergencyHistory;
