import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import MapComponent from "../../components/MapComponent";
import { emergencyService } from "../../services/emergencyService";
import { ambulanceService } from "../../services/ambulanceService";
import { initialDrivers } from "../../data/drivers";
import { initialTrips } from "../../data/trips";
import {
  Truck,
  Compass,
  Clock,
  ShieldAlert,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Power,
  MapPin
} from "lucide-react";

const DriverDashboard = () => {
  const { user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [assignedAmbulance, setAssignedAmbulance] = useState(null);
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    // Locate driver record
    const d = initialDrivers.find((item) => item.userId === user?.id || item.id === 1) || initialDrivers[0];
    setDriver(d);

    const loadData = async () => {
      try {
        const emergencies = await emergencyService.getEmergencies();
        // Find active emergency assigned to this driver or in progress
        const active = emergencies.find(
          (e) => (e.assignedDriverId === d.id || e.id === 1) && e.status !== "COMPLETED" && e.status !== "CANCELLED"
        );
        setActiveEmergency(active);

        if (d.assignedAmbulanceId) {
          const amb = await ambulanceService.getAmbulanceById(d.assignedAmbulanceId);
          setAssignedAmbulance(amb);
        }

        setRecentTrips(initialTrips.filter((t) => t.driverId === d.id || initialTrips.length <= 5));
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, [user]);

  const toggleDuty = () => {
    setIsOnDuty(!isOnDuty);
  };

  return (
    <div>
      <PageHeader
        title={`Paramedic Console: ${driver?.fullName || "Rajesh Kumar"}`}
        subtitle={`Vehicle Unit: ${assignedAmbulance?.vehicleNumber || "TS-09-EA-1001"} | Shift: Day`}
        action={
          <button
            onClick={toggleDuty}
            className={`btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2 ${
              isOnDuty ? "btn-success" : "btn-secondary"
            }`}
          >
            <Power size={16} /> {isOnDuty ? "Status: ON DUTY" : "Status: OFF DUTY"}
          </button>
        }
      />

      {/* ACTIVE DISPATCH ALERT CARD */}
      {activeEmergency && (
        <div className="card border-0 bg-danger text-white shadow-lg rounded-4 p-4 mb-4 position-relative overflow-hidden animate-fadeIn">
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="spinner-grow spinner-grow-sm text-white" role="status"></span>
                <span className="badge bg-white text-danger fw-bold small">ACTIVE DISPATCH CALL</span>
                <span className="badge bg-white bg-opacity-20 text-white small">
                  Priority: {activeEmergency.priority}
                </span>
              </div>
              <h4 className="fw-bold mb-1 text-white">
                {activeEmergency.patientName} &bull; {activeEmergency.emergencyType?.replace(/_/g, " ")}
              </h4>
              <div className="d-flex align-items-center gap-2 text-white text-opacity-90 small mb-2">
                <MapPin size={16} className="text-white" />
                <span>{activeEmergency.pickupAddress}</span>
              </div>
              <p className="small mb-0 text-white text-opacity-80">
                Symptoms: {activeEmergency.description}
              </p>
            </div>

            <div className="col-12 col-lg-4 d-flex flex-column align-items-lg-end gap-2">
              <div className="bg-white bg-opacity-20 rounded-3 p-2 px-3 text-center">
                <span className="small text-white text-opacity-80 d-block">Target ETA</span>
                <span className="h3 fw-bold text-white mb-0">{activeEmergency.etaMinutes || 6} MINS</span>
              </div>
              <Link
                to={`/driver/emergency?id=${activeEmergency.id}`}
                className="btn btn-light text-danger fw-bold rounded-pill px-4 py-2 d-flex align-items-center gap-2 w-100 justify-content-center"
              >
                <Compass size={18} /> Open Tactical Console
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Assigned Vehicle"
            value={assignedAmbulance?.vehicleNumber || "TS-09-EA-1001"}
            subtitle={assignedAmbulance?.ambulanceType || "ICU Unit"}
            icon={Truck}
            variant="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Completed Trips"
            value={driver?.completedTrips || 342}
            subtitle="Career total dispatches"
            icon={CheckCircle2}
            trend={{ value: "+14 this week", isPositive: true }}
            variant="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Average Response Time"
            value="6.4 min"
            subtitle="Top 5% fleet ranking"
            icon={Clock}
            variant="warning"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Driver Rating"
            value={driver?.rating || 4.9}
            subtitle="Based on patient reviews"
            icon={ShieldAlert}
            variant="info"
          />
        </div>
      </div>

      {/* RECENT TRIPS & LIVE MAP */}
      <div className="row g-4 mb-4">
        {/* Left: Recent Completed Trips */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-dark mb-0">Recent Completed Trips</h5>
              <Link to="/driver/history" className="text-primary small fw-semibold text-decoration-none">
                View Logbook &rarr;
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-secondary">
                  <tr>
                    <th>Trip ID</th>
                    <th>Patient</th>
                    <th>Hospital</th>
                    <th>Distance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {recentTrips.map((t) => (
                    <tr key={t.id}>
                      <td className="fw-semibold">#{t.id}</td>
                      <td>{t.patientName}</td>
                      <td className="text-truncate" style={{ maxWidth: "160px" }}>{t.hospitalName}</td>
                      <td>{t.distanceKm} km</td>
                      <td>
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: GPS Location Simulator */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="fw-bold text-dark mb-0">Vehicle GPS Status</h6>
                <span className="badge bg-success-subtle text-success small">Transmitting</span>
              </div>
              <p className="text-muted small mb-3">
                Current position: {assignedAmbulance?.locationName || "Banjara Hills Rd No 2"}
              </p>
              <div style={{ height: "240px" }} className="rounded-3 overflow-hidden border mb-3">
                <MapComponent
                  center={[driver?.currentLatitude || 17.4375, driver?.currentLongitude || 78.4482]}
                  zoom={14}
                  ambulances={assignedAmbulance ? [assignedAmbulance] : []}
                  height="240px"
                />
              </div>
            </div>

            <Link
              to="/driver/location"
              className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-medium"
            >
              Update Vehicle GPS Coordinates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
