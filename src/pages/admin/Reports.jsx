import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import Toast from "../../components/Toast";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  TrendingDown,
  CheckCircle,
  Truck,
  Building2,
  Users
} from "lucide-react";

const Reports = () => {
  const [timeframe, setTimeframe] = useState("30D");
  const [toastMessage, setToastMessage] = useState("");

  const handleExport = (format) => {
    setToastMessage(`Generating and downloading ${format.toUpperCase()} executive summary report...`);
  };

  return (
    <div>
      <PageHeader
        title="Analytics & Executive Performance Reports"
        subtitle="Operational KPIs, response time compliance, hospital handover times and fleet audit logs"
        badge={<span className="badge bg-primary text-white">October Audit</span>}
        action={
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => handleExport("csv")}
              className="btn btn-outline-primary rounded-pill px-3 py-2 btn-sm fw-medium d-flex align-items-center gap-1"
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="btn btn-primary rounded-pill px-3 py-2 btn-sm fw-medium d-flex align-items-center gap-1"
            >
              <FileText size={14} /> Export PDF Report
            </button>
          </div>
        }
      />

      <Toast
        show={!!toastMessage}
        message={toastMessage}
        type="success"
        onClose={() => setToastMessage("")}
      />

      {/* TIMEFRAME SELECTOR */}
      <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <Calendar size={16} className="text-muted" />
            <span className="small fw-semibold text-secondary">Reporting Interval:</span>
          </div>

          <div className="btn-group" role="group">
            {[
              { id: "7D", label: "Last 7 Days" },
              { id: "30D", label: "Last 30 Days" },
              { id: "90D", label: "Quarter 3" },
              { id: "YTD", label: "Year To Date" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`btn btn-sm ${
                  timeframe === t.id ? "btn-primary" : "btn-light border"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Dispatches"
            value="1,428"
            subtitle="Across 6 city zones"
            icon={Truck}
            trend={{ value: "+12.4%", isPositive: true }}
            variant="primary"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Avg Response Time (90th %ile)"
            value="7.4 min"
            subtitle="Benchmark: < 8 min"
            icon={Clock}
            trend={{ value: "-2.1 min", isPositive: true }}
            variant="success"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Hospital Handover Time"
            value="11.2 min"
            subtitle="Arrival to bed transfer"
            icon={Building2}
            trend={{ value: "-4.5 min", isPositive: true }}
            variant="info"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Golden Hour Compliance"
            value="98.7%"
            subtitle="Delivered within 60 min window"
            icon={CheckCircle}
            trend={{ value: "+3.2%", isPositive: true }}
            variant="warning"
          />
        </div>
      </div>

      {/* DETAILED SUMMARY TABLE */}
      <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
        <h5 className="fw-bold text-dark mb-3">Response Time Metrics by Emergency Triage Level</h5>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small text-secondary">
              <tr>
                <th>Priority Category</th>
                <th>Total Volume</th>
                <th>Average Dispatch Lag</th>
                <th>Average Transit ETA</th>
                <th>Target Compliance</th>
                <th>Survival / Stabilization Rate</th>
              </tr>
            </thead>
            <tbody className="small">
              <tr>
                <td>
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-semibold">
                    CRITICAL (Cardiac, Stroke, Hypoxia)
                  </span>
                </td>
                <td>486</td>
                <td>42 secs</td>
                <td><strong>5.8 mins</strong></td>
                <td><span className="badge bg-success-subtle text-success">99.2%</span></td>
                <td>98.6%</td>
              </tr>
              <tr>
                <td>
                  <span className="badge bg-warning-subtle text-warning border border-warning-subtle fw-semibold">
                    HIGH (Major Trauma, Ob-Gyn)
                  </span>
                </td>
                <td>512</td>
                <td>1.1 mins</td>
                <td><strong>6.9 mins</strong></td>
                <td><span className="badge bg-success-subtle text-success">98.1%</span></td>
                <td>99.1%</td>
              </tr>
              <tr>
                <td>
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold">
                    MEDIUM (Fractures, Stable Wounds)
                  </span>
                </td>
                <td>310</td>
                <td>2.4 mins</td>
                <td><strong>9.8 mins</strong></td>
                <td><span className="badge bg-success-subtle text-success">96.8%</span></td>
                <td>100.0%</td>
              </tr>
              <tr>
                <td>
                  <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold">
                    LOW (Inter-facility Transports)
                  </span>
                </td>
                <td>120</td>
                <td>3.8 mins</td>
                <td><strong>12.4 mins</strong></td>
                <td><span className="badge bg-success-subtle text-success">95.4%</span></td>
                <td>100.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
