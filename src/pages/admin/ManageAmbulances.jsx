import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import AmbulanceCard from "../../components/AmbulanceCard";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import StatusBadge from "../../components/StatusBadge";
import { ambulanceService } from "../../services/ambulanceService";
import { Truck, Plus, Filter, Search, Edit3, Trash2 } from "lucide-react";

const ManageAmbulances = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const [newAmbulance, setNewAmbulance] = useState({
    vehicleNumber: "TS-09-EA-1011",
    ambulanceType: "ICU",
    status: "AVAILABLE",
    latitude: 17.4375,
    longitude: 78.4482,
    locationName: "Banjara Hills Depot",
    fuelLevel: 95,
    assignedDriverName: "Unassigned",
    baseHospitalName: "Apollo Health City",
    equipment: ["Ventilator", "Defibrillator", "Oxygen Tank"]
  });

  useEffect(() => {
    loadFleet();
  }, []);

  const loadFleet = async () => {
    const list = await ambulanceService.getAmbulances();
    setAmbulances(list);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await ambulanceService.createAmbulance(newAmbulance);
    setShowAddModal(false);
    loadFleet();
    setToastMessage("New ambulance vehicle added to city fleet.");
  };

  const handleUpdateStatus = async (status) => {
    if (editTarget) {
      await ambulanceService.updateStatus(editTarget.id, status);
      setEditTarget(null);
      loadFleet();
      setToastMessage("Ambulance status updated.");
    }
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await ambulanceService.deleteAmbulance(deleteTarget.id);
      setDeleteTarget(null);
      loadFleet();
      setToastMessage("Ambulance removed from fleet.");
    }
  };

  const filtered = ambulances.filter((a) => {
    const vehNum = a.vehicleNumber || a.ambulanceNumber || "";
    const driver = a.assignedDriverName || "";
    const loc = a.locationName || "";
    const matchesSearch =
      vehNum.toLowerCase().includes(search.toLowerCase()) ||
      driver.toLowerCase().includes(search.toLowerCase()) ||
      loc.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchesType = typeFilter === "ALL" || a.ambulanceType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div>
      <PageHeader
        title="Ambulance Fleet Management"
        subtitle="Telemetry control, vehicle operational status, equipment and driver pairing"
        badge={<span className="badge bg-light text-secondary border">{ambulances.length} Registered Units</span>}
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
          >
            <Plus size={16} /> Deploy New Vehicle
          </button>
        }
      />

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />

      {/* FILTERS */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search plate, driver, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-4">
            <select
              className="form-select bg-light"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Operational Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="DISPATCHED">Dispatched</option>
              <option value="ON_TRIP">On Trip</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>

          <div className="col-6 col-md-4">
            <select
              className="form-select bg-light"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Unit Types</option>
              <option value="ICU">ICU Advanced Unit</option>
              <option value="ADVANCED">Advanced ALS</option>
              <option value="BASIC">Basic BLS</option>
              <option value="NEONATAL">Neonatal Unit</option>
            </select>
          </div>
        </div>
      </div>

      {/* AMBULANCE GRID */}
      <div className="row g-4 mb-4">
        {filtered.map((amb) => (
          <div className="col-12 col-md-6 col-xl-4" key={amb.id}>
            <AmbulanceCard
              ambulance={amb}
              actionLabel="Change Status / Inspect"
              onAction={(a) => setEditTarget(a)}
            />
          </div>
        ))}
      </div>

      {/* EDIT STATUS MODAL */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Inspect Unit ${editTarget?.vehicleNumber}`}
        footer={
          <div className="d-flex justify-content-between w-100">
            <button
              className="btn btn-outline-danger btn-sm rounded-pill"
              onClick={() => {
                setDeleteTarget(editTarget);
                setEditTarget(null);
              }}
            >
              <Trash2 size={14} className="me-1" /> Decommission
            </button>
            <button className="btn btn-light btn-sm rounded-pill px-3" onClick={() => setEditTarget(null)}>
              Close
            </button>
          </div>
        }
      >
        {editTarget && (
          <div>
            <div className="p-3 bg-light rounded-3 mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted small">Unit Type:</span>
                <strong>{editTarget.ambulanceType}</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted small">Assigned Driver:</span>
                <strong>{editTarget.assignedDriverName || "None"}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted small">Current Status:</span>
                <StatusBadge status={editTarget.status} />
              </div>
            </div>

            <label className="form-label small fw-semibold text-secondary mb-2">Change Operational Status</label>
            <div className="d-flex flex-wrap gap-2">
              {["AVAILABLE", "DISPATCHED", "ON_TRIP", "MAINTENANCE", "OFFLINE"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleUpdateStatus(s)}
                  className={`btn btn-sm ${editTarget.status === s ? "btn-primary" : "btn-light border"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* ADD AMBULANCE MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Deploy New Ambulance to Fleet"
        footer={
          <>
            <button className="btn btn-light rounded-pill px-3" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary rounded-pill px-4" onClick={handleCreate}>
              Deploy Ambulance
            </button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Vehicle Registration Plate</label>
              <input
                type="text"
                className="form-control bg-light"
                value={newAmbulance.vehicleNumber}
                onChange={(e) => setNewAmbulance({ ...newAmbulance, vehicleNumber: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Ambulance Specification</label>
              <select
                className="form-select bg-light"
                value={newAmbulance.ambulanceType}
                onChange={(e) => setNewAmbulance({ ...newAmbulance, ambulanceType: e.target.value })}
              >
                <option value="ICU">ICU Advanced Unit</option>
                <option value="ADVANCED">Advanced ALS</option>
                <option value="BASIC">Basic BLS</option>
                <option value="NEONATAL">Neonatal Pediatric</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Assigned Base Hospital</label>
              <input
                type="text"
                className="form-control bg-light"
                value={newAmbulance.baseHospitalName}
                onChange={(e) => setNewAmbulance({ ...newAmbulance, baseHospitalName: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Initial Fuel Level (%)</label>
              <input
                type="number"
                className="form-control bg-light"
                value={newAmbulance.fuelLevel}
                onChange={(e) => setNewAmbulance({ ...newAmbulance, fuelLevel: parseInt(e.target.value) })}
              />
            </div>

            <div className="col-12">
              <label className="form-label small fw-semibold text-secondary">Initial Location / Depot Landmark</label>
              <input
                type="text"
                className="form-control bg-light"
                value={newAmbulance.locationName}
                onChange={(e) => setNewAmbulance({ ...newAmbulance, locationName: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Vehicle Decommission"
        footer={
          <>
            <button className="btn btn-light rounded-pill px-3" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button className="btn btn-danger rounded-pill px-4" onClick={handleDelete}>
              Decommission Vehicle
            </button>
          </>
        }
      >
        <p className="mb-0 text-secondary">
          Are you sure you want to permanently decommission ambulance <strong>{deleteTarget?.vehicleNumber}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default ManageAmbulances;
