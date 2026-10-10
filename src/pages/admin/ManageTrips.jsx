import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import MapComponent from "../../components/MapComponent";
import { initialTrips } from "../../data/trips";
import { formatDate, formatTime } from "../../utils/helpers";
import { Compass, Clock, MapPin, Truck, Building2, User, Search } from "lucide-react";

const ManageTrips = () => {
  const [trips, setTrips] = useState(initialTrips);
  const [search, setSearch] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);

  const filtered = trips.filter(
    (t) =>
      ((t.patientName || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((t.driverName || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((t.ambulanceNumber || t.vehicleNumber || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((t.hospitalName || "")).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Active & Historical Trips Log"
        subtitle="GPS route audit trails, transit durations, and fleet travel metrics"
        badge={<span className="badge bg-light text-secondary border">{trips.length} Logged Runs</span>}
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
                placeholder="Search patient, driver, unit plate, or hospital..."
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
                <th>Trip ID</th>
                <th>Patient</th>
                <th>Driver</th>
                <th>Ambulance</th>
                <th>Destination</th>
                <th>Distance</th>
                <th>Duration</th>
                <th>Started</th>
                <th>Status</th>
                <th className="text-end">Route</th>
              </tr>
            </thead>
            <tbody className="small">
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="fw-semibold">#{t.id}</td>
                  <td className="fw-medium text-dark">{t.patientName}</td>
                  <td>{t.driverName}</td>
                  <td>
                    <span className="badge bg-light text-primary border">{t.ambulanceNumber}</span>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "160px" }}>{t.hospitalName}</td>
                  <td>{t.distanceKm} km</td>
                  <td>{t.durationMinutes} mins</td>
                  <td className="text-muted">{formatTime(t.startTime)}</td>
                  <td>
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="text-end">
                    <button
                      onClick={() => setSelectedTrip(t)}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    >
                      View Route
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRIP ROUTE MODAL */}
      <Modal
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        title={`GPS Telemetry Route for Trip #${selectedTrip?.id}`}
        size="lg"
        footer={
          <button className="btn btn-primary rounded-pill px-4" onClick={() => setSelectedTrip(null)}>
            Close Route Map
          </button>
        }
      >
        {selectedTrip && (
          <div>
            <div className="row g-2 mb-3 small">
              <div className="col-4">
                <strong>Patient:</strong> {selectedTrip.patientName}
              </div>
              <div className="col-4">
                <strong>Ambulance:</strong> {selectedTrip.ambulanceNumber}
              </div>
              <div className="col-4">
                <strong>Distance:</strong> {selectedTrip.distanceKm} km
              </div>
            </div>

            <div className="rounded-3 overflow-hidden border">
              <MapComponent
                center={[selectedTrip.startLatitude, selectedTrip.startLongitude]}
                zoom={14}
                routePolyline={selectedTrip.routePoints || [
                  [selectedTrip.startLatitude, selectedTrip.startLongitude],
                  [selectedTrip.endLatitude, selectedTrip.endLongitude]
                ]}
                height="380px"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageTrips;
