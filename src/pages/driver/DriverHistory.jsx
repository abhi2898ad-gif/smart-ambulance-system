import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { initialTrips } from "../../data/trips";
import { formatDate, formatTime } from "../../utils/helpers";
import { Compass, Clock, MapPin, CheckCircle2, Search, Calendar } from "lucide-react";

const DriverHistory = () => {
  const [search, setSearch] = useState("");
  const trips = initialTrips;

  const filteredTrips = trips.filter(
    (t) =>
      ((t.patientName || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((t.hospitalName || "")).toLowerCase().includes(search.toLowerCase()) ||
      ((t.ambulanceNumber || t.vehicleNumber || "")).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Driver Dispatch Logbook"
        subtitle="Complete record of emergency transports and patient transfer runs"
        badge={<span className="badge bg-light text-secondary border">{trips.length} Total Trips</span>}
      />

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <StatCard
            title="Total Distance Logged"
            value="2,410 km"
            subtitle="Across Hyderabad metro"
            icon={Compass}
            variant="primary"
          />
        </div>
        <div className="col-12 col-sm-4">
          <StatCard
            title="Average Run Duration"
            value="14.2 min"
            subtitle="Golden hour standard met"
            icon={Clock}
            variant="success"
          />
        </div>
        <div className="col-12 col-sm-4">
          <StatCard
            title="Successful Handovers"
            value="100%"
            subtitle="Zero transport mortality"
            icon={CheckCircle2}
            variant="info"
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="row g-3 align-items-center mb-3">
          <div className="col-12 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Search patient name, hospital, or vehicle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th>Trip ID</th>
                <th>Patient</th>
                <th>Receiving Hospital</th>
                <th>Vehicle Unit</th>
                <th>Distance</th>
                <th>Duration</th>
                <th>Date / Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="small">
              {filteredTrips.map((trip) => (
                <tr key={trip.id}>
                  <td className="fw-semibold">#{trip.id}</td>
                  <td className="fw-medium text-dark">{trip.patientName}</td>
                  <td>{trip.hospitalName}</td>
                  <td>
                    <span className="badge bg-light text-primary border">{trip.ambulanceNumber}</span>
                  </td>
                  <td>{trip.distanceKm} km</td>
                  <td>{trip.durationMinutes} mins</td>
                  <td className="text-muted">
                    {formatDate(trip.startTime)} &bull; {formatTime(trip.startTime)}
                  </td>
                  <td>
                    <StatusBadge status={trip.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverHistory;
