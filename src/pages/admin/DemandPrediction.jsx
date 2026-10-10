import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import Toast from "../../components/Toast";
import {
  initialPredictions,
  hourlyForecastData,
  categoryDistributionData,
  responseTimeTrends
} from "../../data/predictions";
import {
  TrendingUp,
  AlertTriangle,
  Cpu,
  Truck,
  RotateCw,
  Clock,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

const DemandPrediction = () => {
  const [predictions, setPredictions] = useState(initialPredictions);
  const [isRedistributing, setIsRedistributing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleRedistribute = async () => {
    setIsRedistributing(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Simulate fleet reallocation to reduce deficits
    setPredictions((prev) =>
      prev.map((item) => ({
        ...item,
        availableAmbulanceCount: item.recommendedAmbulanceCount,
        deficit: 0
      }))
    );
    setIsRedistributing(false);
    setToastMessage("AI fleet pre-positioning orders broadcasted to available units!");
  };

  return (
    <div>
      <PageHeader
        title="AI Emergency Demand Prediction & Heatmap"
        subtitle="Machine learning surge forecasting and automated proactive fleet re-balancing"
        badge={<span className="badge bg-danger text-white">Live Forecast Engine</span>}
        action={
          <button
            onClick={handleRedistribute}
            disabled={isRedistributing}
            className="btn btn-danger rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-sm emergency-btn-glow"
          >
            <RotateCw size={16} className={isRedistributing ? "spinner-border spinner-border-sm" : ""} />
            {isRedistributing ? "Recalculating City Fleet..." : "Pre-Position Fleet to High-Risk Zones"}
          </button>
        }
      />

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />

      {/* STAT CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Highest Risk Sector"
            value="HITEC City"
            subtitle="Rush hour volume predicted: 94.2"
            icon={AlertTriangle}
            variant="danger"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Fleet Deficit"
            value={predictions.reduce((acc, p) => acc + p.deficit, 0)}
            subtitle="Units needed for peak window"
            icon={Truck}
            variant="warning"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="ML Model Accuracy"
            value="99.4%"
            subtitle="Trained on 50,000+ incidents"
            icon={Cpu}
            variant="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Target Response ETA"
            value="7.4 min"
            subtitle="Down from 14.8 min in May"
            icon={Clock}
            variant="primary"
          />
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="row g-4 mb-4">
        {/* Chart 1: 24h Hourly Demand */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold text-dark mb-0">24-Hour Projected vs Actual Call Volume</h6>
                <span className="text-muted small">AI Prophet Neural Model with traffic regression</span>
              </div>
              <span className="badge bg-primary-subtle text-primary">Hourly Analysis</span>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={hourlyForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="predColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="actColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                  <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                  <Area type="monotone" dataKey="predicted" stroke="#2563eb" fillOpacity={1} fill="url(#predColor)" name="AI Projected Calls" />
                  <Area type="monotone" dataKey="actual" stroke="#ef4444" fillOpacity={1} fill="url(#actColor)" name="Actual Calls" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart 2: Category Distribution */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
            <h6 className="fw-bold text-dark mb-1">Emergency Category Share</h6>
            <p className="text-muted small mb-3">Breakdown of incoming distress types</p>

            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="d-flex flex-column gap-1 small mt-2">
              {categoryDistributionData.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between align-items-center">
                  <span className="d-flex align-items-center gap-2 text-muted">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: item.color }}></span>
                    {item.name}
                  </span>
                  <strong className="text-dark">{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CHART 3: RESPONSE TIME TRENDS */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h6 className="fw-bold text-dark mb-0">Systemic Response Time Reduction (May - Oct)</h6>
            <span className="text-muted small">Drop from 14.8 minutes to 7.4 minutes with AI predictive routing</span>
          </div>
          <span className="badge bg-success-subtle text-success">&minus;50% Response Time</span>
        </div>

        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={responseTimeTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={[5, 16]} />
              <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0" }} />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line type="monotone" dataKey="averageEta" stroke="#ef4444" strokeWidth={3} name="Actual Avg ETA (mins)" />
              <Line type="monotone" dataKey="targetEta" stroke="#10b981" strokeDasharray="5 5" strokeWidth={2} name="Benchmark Goal (8.0 mins)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HIGH RISK SECTORS CARDS */}
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-3">City Locality Risk Analysis & Fleet Deficits</h5>

        <div className="row g-3">
          {predictions.map((p) => {
            const hasDeficit = p.deficit > 0;
            return (
              <div className="col-12 col-md-6 col-xl-4" key={p.id}>
                <div
                  className={`card border-0 shadow-sm rounded-4 p-4 bg-white h-100 ${
                    hasDeficit ? "border-start border-4 border-danger" : "border-start border-4 border-success"
                  }`}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ maxWidth: "200px" }}>
                      {p.areaName}
                    </h6>
                    <span
                      className={`badge rounded-pill ${
                        p.riskLevel === "CRITICAL"
                          ? "bg-danger text-white"
                          : p.riskLevel === "HIGH"
                          ? "bg-warning text-dark"
                          : "bg-primary text-white"
                      }`}
                    >
                      {p.riskLevel}
                    </span>
                  </div>

                  <div className="d-flex align-items-baseline gap-2 mb-3">
                    <span className="display-6 fw-bold text-dark mb-0">{p.predictedDemandScore}</span>
                    <span className="text-muted small">Demand Index</span>
                  </div>

                  <div className="p-3 bg-light rounded-3 small mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Recommended Units:</span>
                      <strong>{p.recommendedAmbulanceCount}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Currently Positioned:</span>
                      <strong>{p.availableAmbulanceCount}</strong>
                    </div>
                    <div className="d-flex justify-content-between border-top pt-1">
                      <span className="text-muted">Unit Deficit:</span>
                      <strong className={hasDeficit ? "text-danger" : "text-success"}>
                        {hasDeficit ? `-${p.deficit} Shortage` : "Optimal Balance"}
                      </strong>
                    </div>
                  </div>

                  <div className="small text-secondary mb-2">
                    <strong className="d-block text-dark mb-1">Peak Window:</strong>
                    <span>{p.peakHourStart} - {p.peakHourEnd}</span>
                  </div>

                  <div className="small text-muted">
                    <strong className="d-block text-dark mb-1">Primary Drivers:</strong>
                    <ul className="mb-0 ps-3">
                      {p.primaryRiskFactors.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DemandPrediction;
