import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import EmergencyCard from "../../components/EmergencyCard";
import MapComponent from "../../components/MapComponent";
import { emergencyService } from "../../services/emergencyService";
import { ambulanceService } from "../../services/ambulanceService";
import { hospitalService } from "../../services/hospitalService";
import {
  Siren,
  Clock,
  HeartPulse,
  Building2,
  Compass,
  ArrowRight,
  PhoneCall,
  UserCheck
} from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emData, ambData, hospData] = await Promise.all([
          emergencyService.getEmergencies(),
          ambulanceService.getAmbulances(),
          hospitalService.getHospitals()
        ]);
        setEmergencies(emData);
        setAmbulances(ambData);
        setHospitals(hospData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter emergencies for this user (or show all in demo if none specifically belong)
  const myEmergencies = emergencies.filter((e) => e.userId === user?.id || emergencies.length <= 8);
  const activeEmergency = myEmergencies.find(
    (e) => e.status !== "COMPLETED" && e.status !== "CANCELLED"
  );

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user?.fullName || "Patient"}`}
        subtitle="Emergency patient portal & rapid ambulance response console"
        action={
          <Link
            to="/user/request-ambulance"
            className="btn btn-danger rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm emergency-btn-glow"
          >
            <Siren size={18} /> Request Ambulance Now
          </Link>
        }
      />

      {/* EMERGENCY ALERT BANNER IF ACTIVE REQUEST EXISTS */}
      {activeEmergency && (
        <div className="card border-0 bg-danger text-white shadow-lg rounded-4 p-4 mb-4 position-relative overflow-hidden animate-fadeIn">
          <div className="position-relative z-1 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-white text-danger fw-bold px-2 py-1 small">
                  DISPATCH IN PROGRESS
                </span>
                <span className="text-white text-opacity-80 small">Request #{activeEmergency.id}</span>
              </div>
              <h4 className="fw-bold mb-1 text-white">
                Ambulance is {activeEmergency.status.replace(/_/g, " ")}
              </h4>
              <p className="mb-0 text-white text-opacity-90 small">
                {activeEmergency.vehicleNumber ? (
                  <>
                    Unit <strong>{activeEmergency.vehicleNumber}</strong> is arriving at <strong>{activeEmergency.pickupAddress}</strong>
                  </>
                ) : (
                  "Locating and assigning the optimal emergency vehicle..."
                )}
              </p>
            </div>

            <div className="d-flex align-items-center gap-3">
              {activeEmergency.etaMinutes !== null && activeEmergency.etaMinutes > 0 && (
                <div className="bg-white bg-opacity-20 rounded-3 p-2 px-3 text-center">
                  <span className="small d-block text-white text-opacity-80">Estimated ETA</span>
                  <span className="h4 fw-bold mb-0 text-white">{activeEmergency.etaMinutes} Mins</span>
                </div>
              )}
              <Link
                to={`/user/track-ambulance?id=${activeEmergency.id}`}
                className="btn btn-light text-danger fw-bold rounded-pill px-4 py-2 d-flex align-items-center gap-2"
              >
                <Compass size={18} /> Live Map & Radar
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* QUICK STATS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Available Ambulances"
            value={ambulances.filter((a) => a.status === "AVAILABLE").length}
            subtitle="Within Hyderabad metro grid"
            icon={Siren}
            variant="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Average Dispatch ETA"
            value="6.8 mins"
            subtitle="Optimized with AI routing"
            icon={Clock}
            variant="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Network Hospitals"
            value={hospitals.length}
            subtitle="Live bed registry active"
            icon={Building2}
            variant="info"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Emergency Contact"
            value={user?.emergencyContactPhone || "+91 98765 43210"}
            subtitle={user?.emergencyContactName || "Primary Contact"}
            icon={PhoneCall}
            variant="warning"
          />
        </div>
      </div>

      {/* MAIN TWO COLUMN SECTION */}
      <div className="row g-4 mb-4">
        {/* Left: Active / Recent Emergencies */}
        <div className="col-12 col-lg-7">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-dark mb-0">My Emergency Requests</h5>
            <Link to="/user/history" className="text-primary small fw-semibold text-decoration-none">
              View All History &rarr;
            </Link>
          </div>

          {myEmergencies.length > 0 ? (
            myEmergencies.slice(0, 3).map((item) => (
              <EmergencyCard key={item.id} emergency={item} role="USER" />
            ))
          ) : (
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
              <p className="text-muted mb-0">No past emergency requests.</p>
            </div>
          )}
        </div>

        {/* Right: Live Radar Map */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="fw-bold text-dark mb-0">Nearby Emergency Grid</h6>
              <span className="badge bg-success-subtle text-success small">Real-Time Telemetry</span>
            </div>
            <p className="text-muted small mb-3">
              Live locations of city ambulances and trauma centers
            </p>
            <div className="flex-grow-1" style={{ minHeight: "340px" }}>
              <MapComponent
                ambulances={ambulances}
                hospitals={hospitals}
                height="340px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
