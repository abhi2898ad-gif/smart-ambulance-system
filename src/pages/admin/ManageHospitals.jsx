import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import HospitalCard from "../../components/HospitalCard";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import { hospitalService } from "../../services/hospitalService";
import { Building2, Plus, Search, Filter } from "lucide-react";

const ManageHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const [newHospital, setNewHospital] = useState({
    name: "",
    address: "",
    contactNumber: "+91 40 ",
    emergencyUnitNumber: "+91 40 ",
    totalBeds: 250,
    availableBeds: 35,
    icuBeds: 50,
    availableIcuBeds: 8,
    latitude: 17.4300,
    longitude: 78.4100,
    status: "ACCEPTING",
    departments: ["Emergency Trauma", "Cardiology"]
  });

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    const list = await hospitalService.getHospitals();
    setHospitals(list);
  };

  const handleCreateHospital = async (e) => {
    e.preventDefault();
    await hospitalService.createHospital(newHospital);
    setShowAddModal(false);
    loadHospitals();
    setToastMessage("New hospital enrolled in emergency response network.");
  };

  const filtered = hospitals.filter((h) => {
    const matchesSearch =
      ((h.name || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((h.address || "")).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Network Hospital Registry"
        subtitle="Manage participating trauma centers, emergency contact helplines and live bed telemetry"
        badge={<span className="badge bg-light text-secondary border">{hospitals.length} Network Hospitals</span>}
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2"
          >
            <Plus size={16} /> Enroll Partner Hospital
          </button>
        }
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
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search hospital name or locality..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2">
            {["ALL", "ACCEPTING", "DIVERTING", "FULL"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`btn btn-sm ${
                  statusFilter === s ? "btn-primary" : "btn-light border"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HOSPITAL CARDS */}
      <div className="row g-4 mb-4">
        {filtered.map((hosp) => (
          <div className="col-12 col-md-6 col-xl-4" key={hosp.id}>
            <HospitalCard
              hospital={hosp}
              actionLabel="View / Adjust Bed Quotas"
              onAction={(h) => setSelectedHospital(h)}
            />
          </div>
        ))}
      </div>

      {/* ADD HOSPITAL MODAL */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Enroll Partner Hospital into Emergency Network"
        size="lg"
        footer={
          <>
            <button className="btn btn-light rounded-pill px-3" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button className="btn btn-primary rounded-pill px-4" onClick={handleCreateHospital}>
              Enroll Hospital
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateHospital}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Hospital Name</label>
              <input
                type="text"
                className="form-control bg-light"
                value={newHospital.name}
                onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Campus Address</label>
              <input
                type="text"
                className="form-control bg-light"
                value={newHospital.address}
                onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">Main Reception Phone</label>
              <input
                type="tel"
                className="form-control bg-light"
                value={newHospital.contactNumber}
                onChange={(e) => setNewHospital({ ...newHospital, contactNumber: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold text-secondary">24/7 Trauma Hotline</label>
              <input
                type="tel"
                className="form-control bg-light"
                value={newHospital.emergencyUnitNumber}
                onChange={(e) => setNewHospital({ ...newHospital, emergencyUnitNumber: e.target.value })}
                required
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-secondary">Total Beds</label>
              <input
                type="number"
                className="form-control bg-light"
                value={newHospital.totalBeds}
                onChange={(e) => setNewHospital({ ...newHospital, totalBeds: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-secondary">Available Beds</label>
              <input
                type="number"
                className="form-control bg-light"
                value={newHospital.availableBeds}
                onChange={(e) => setNewHospital({ ...newHospital, availableBeds: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-secondary">ICU Beds</label>
              <input
                type="number"
                className="form-control bg-light"
                value={newHospital.icuBeds}
                onChange={(e) => setNewHospital({ ...newHospital, icuBeds: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-secondary">Available ICU</label>
              <input
                type="number"
                className="form-control bg-light"
                value={newHospital.availableIcuBeds}
                onChange={(e) => setNewHospital({ ...newHospital, availableIcuBeds: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* INSPECT MODAL */}
      <Modal
        isOpen={!!selectedHospital}
        onClose={() => setSelectedHospital(null)}
        title={selectedHospital?.name || "Hospital Info"}
        footer={
          <button className="btn btn-primary rounded-pill px-4" onClick={() => setSelectedHospital(null)}>
            Close
          </button>
        }
      >
        {selectedHospital && (
          <div>
            <p className="text-muted small mb-3">{selectedHospital.address}</p>
            <div className="p-3 bg-light rounded-3 mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted small">Status:</span>
                <span className="badge bg-success-subtle text-success">{selectedHospital.status}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted small">Available General Beds:</span>
                <strong>{selectedHospital.availableBeds} / {selectedHospital.totalBeds}</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted small">Available ICU Beds:</span>
                <strong className="text-danger">{selectedHospital.availableIcuBeds} / {selectedHospital.icuBeds}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted small">Occupancy Rate:</span>
                <strong>{selectedHospital.occupancyRate}%</strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageHospitals;
