import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import PriorityBadge from "../../components/PriorityBadge";
import StatusBadge from "../../components/StatusBadge";
import MapComponent from "../../components/MapComponent";
import { ambulanceService } from "../../services/ambulanceService";
import { emergencyService } from "../../services/emergencyService";
import { hospitalService } from "../../services/hospitalService";
import { hourlyForecastData, initialPredictions } from "../../data/predictions";
import {
  Truck,
  Siren,
  Clock,
  Building2,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const AdminDashboard = () => {
  const [ambulances, setAmbulances] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ambs, ems, hosps] = await Promise.all([
          ambulanceService.getAmbulances(),
          emergencyService.getEmergencies(),
          hospitalService.getHospitals()
        ]);
        setAmbulances(ambs);
        setEmergencies(ems);
        setHospitals(hosps);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeEmergencies = emergencies.filter(
    (e) => e.status !== "COMPLETED" && e.status !== "CANCELLED"
  );
  const availableAmbulances = ambulances.filter((a) => a.status === "AVAILABLE");

  return (
    <div>
      <PageHeader
        title="Emergency Operations Command Center"
        subtitle="City-wide telemetry monitoring, AI automated dispatch and network hospital capacity"
        action={
          <div className="d-flex align-items-center gap-2">
            <Link to="/admin/predictions" className="btn btn-outline-primary btn-sm rounded-pill fw-semibold">
              <TrendingUp size={14} className="me-1" /> AI Demand Radar
            </Link>
            <Link to="/admin/ambulances" className="btn btn-primary btn-sm rounded-pill fw-semibold">
              <Plus size={14} className="me-1" /> Add Ambulance Unit
            </Link>
          </div>
        }
      />

      {/* STAT CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Ambulance Fleet"
            value={ambulances.length}
            subtitle={`${availableAmbulances.length} available &bull; ${ambulances.filter((a) => a.status === "ON_TRIP" || a.status === "DISPATCHED").length} active`}
            icon={Truck}
            variant="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Active Emergency Calls"
            value={activeEmergencies.length}
            subtitle={`${emergencies.filter((e) => e.priority === "CRITICAL").length} critical cases`}
            icon={Siren}
            trend={{ value: "Real-time", isPositive: true }}
            variant="danger"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Average City ETA"
            value="7.4 mins"
            subtitle="Target: under 8.0 mins"
            icon={Clock}
            trend={{ value: "-18% vs last month", isPositive: true }}
            variant="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Partner Hospital Beds"
            value={`${hospitals.reduce((acc, h) => acc + h.availableBeds, 0)}`}
            subtitle={`Across ${hospitals.length} major hospitals`}
            icon={Building2}
            variant="info"
          />
        </div>
      </div>

      {/* MAP AND PREDICTIVE CHART */}
      <div className="row g-4 mb-4">
        {/* Left: Real-time Fleet Telemetry Map */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div>
                <h6 className="fw-bold text-dark mb-0">Live Hyderabad Dispatch Telemetry</h6>
                <span className="text-muted small">Tracking ambulances, hospitals, and distress coordinates</span>
              </div>
              <span className="badge bg-success-subtle text-success small">Real-Time Sync</span>
            </div>
            <div className="flex-grow-1" style={{ minHeight: "400px" }}>
              <MapComponent
                ambulances={ambulances}
                hospitals={hospitals}
                emergencies={activeEmergencies}
                height="400px"
              />
            </div>
          </div>
        </div>

        {/* Right: AI Incident Forecast Curve */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h6 className="fw-bold text-dark mb-0">Predicted vs Actual Calls</h6>
                <span className="badge bg-primary-subtle text-primary small">AI Prophet Model</span>
              </div>
              <p className="text-muted small mb-3">
                24-Hour hourly emergency surge projection
              </p>

              <div style={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <AreaChart data={hourlyForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0" }}
                    />
                    <Area type="monotone" dataKey="predicted" stroke="#2563eb" fillOpacity={1} fill="url(#colorPredicted)" name="AI Predicted Calls" />
                    <Area type="monotone" dataKey="actual" stroke="#ef4444" fillOpacity={1} fill="url(#colorActual)" name="Actual Calls" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-3 bg-light rounded-3 small mt-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Current Peak Window:</span>
                <strong className="text-danger">17:30 - 21:30 (Rush Hour)</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">High Risk Sector:</span>
                <strong className="text-dark">HITEC City (Deficit: 4 Units)</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT INCIDENTS TABLE */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h5 className="fw-bold text-dark mb-0">Active Emergency Incident Stream</h5>
            <span className="text-muted small">Live triage feed and unit assignments</span>
          </div>
          <Link to="/admin/emergencies" className="text-primary small fw-semibold text-decoration-none">
            Manage All Incidents &rarr;
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Condition</th>
                <th>Priority</th>
                <th>Assigned Unit</th>
                <th>ETA</th>
                <th>Destination Hospital</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="small">
              {emergencies.slice(0, 5).map((em) => (
                <tr key={em.id}>
                  <td className="fw-semibold">#{em.id}</td>
                  <td className="fw-medium text-dark">{em.patientName}</td>
                  <td>{em.emergencyType?.replace(/_/g, " ")}</td>
                  <td>
                    <PriorityBadge priority={em.priority} />
                  </td>
                  <td>
                    {em.vehicleNumber ? (
                      <span className="badge bg-light text-primary border">{em.vehicleNumber}</span>
                    ) : (
                      <span className="text-muted">Auto-locating...</span>
                    )}
                  </td>
                  <td>
                    {em.etaMinutes ? (
                      <span className="badge bg-danger text-white">{em.etaMinutes}m</span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: "160px" }}>
                    {em.destinationHospitalName || "Apollo Health City"}
                  </td>
                  <td>
                    <StatusBadge status={em.status} />
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

export default AdminDashboard;
