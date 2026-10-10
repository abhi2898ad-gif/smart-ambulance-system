import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Modal from "../../components/Modal";
import Toast from "../../components/Toast";
import StatusBadge from "../../components/StatusBadge";
import { initialDrivers } from "../../data/drivers";
import { ambulanceService } from "../../services/ambulanceService";
import { User, Phone, Truck, Search, Plus, Edit } from "lucide-react";

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [ambulances, setAmbulances] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [assignAmbulanceId, setAssignAmbulanceId] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const ambs = await ambulanceService.getAmbulances();
      setAmbulances(ambs);
    };
    load();
  }, []);

  const handleAssignAmbulance = () => {
    if (selectedDriver && assignAmbulanceId) {
      const targetAmb = ambulances.find((a) => a.id === parseInt(assignAmbulanceId));
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === selectedDriver.id
            ? { ...d, assignedAmbulanceId: parseInt(assignAmbulanceId), vehicleNumber: targetAmb?.vehicleNumber }
            : d
        )
      );
      setSelectedDriver(null);
      setToastMessage("Ambulance successfully paired with driver.");
    }
  };

  const filtered = drivers.filter(
    (d) =>
      ((d.fullName || d.name || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((d.licenseNumber || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((d.vehicleNumber || "")).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Paramedic Driver Fleet Dispatch"
        subtitle="Operational driver status, shifts, licensing, and ambulance vehicle pairing"
        badge={<span className="badge bg-light text-secondary border">{drivers.length} Paramedic Drivers</span>}
      />

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />

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
                placeholder="Search driver name, license, or vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th>Driver ID</th>
                <th>Full Name</th>
                <th>License Number</th>
                <th>Contact</th>
                <th>Assigned Unit</th>
                <th>Shift</th>
                <th>Trips</th>
                <th>Rating</th>
                <th>Status</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody className="small">
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="fw-semibold">#{d.id}</td>
                  <td className="fw-medium text-dark">{d.fullName}</td>
                  <td className="text-muted">{d.licenseNumber}</td>
                  <td>{d.phone}</td>
                  <td>
                    {d.vehicleNumber ? (
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">{d.vehicleNumber}</span>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>
                  <td>{d.shift}</td>
                  <td>{d.completedTrips}</td>
                  <td className="text-warning fw-semibold">&starf; {d.rating}</td>
                  <td>
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="text-end">
                    <button
                      onClick={() => {
                        setSelectedDriver(d);
                        setAssignAmbulanceId(d.assignedAmbulanceId || "");
                      }}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAIR AMBULANCE MODAL */}
      <Modal
        isOpen={!!selectedDriver}
        onClose={() => setSelectedDriver(null)}
        title={`Assign Ambulance to ${selectedDriver?.fullName}`}
        footer={
          <>
            <button className="btn btn-light rounded-pill px-3" onClick={() => setSelectedDriver(null)}>
              Cancel
            </button>
            <button className="btn btn-primary rounded-pill px-4" onClick={handleAssignAmbulance}>
              Save Pairing
            </button>
          </>
        }
      >
        {selectedDriver && (
          <div>
            <p className="small text-muted mb-3">
              Select an available ambulance vehicle from the fleet to assign to this driver:
            </p>
            <select
              className="form-select bg-light mb-3"
              value={assignAmbulanceId}
              onChange={(e) => setAssignAmbulanceId(e.target.value)}
            >
              <option value="">-- Choose Ambulance Unit --</option>
              {ambulances.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.vehicleNumber} ({a.ambulanceType}) - Status: {a.status}
                </option>
              ))}
            </select>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageDrivers;
