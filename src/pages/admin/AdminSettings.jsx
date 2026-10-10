import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import Toast from "../../components/Toast";
import { Settings, Cpu, Radio, Bell, Save, ShieldAlert, Sliders } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    aiTriageMode: "BALANCED",
    trafficMultiplier: 1.25,
    gpsPingInterval: 30,
    hospitalPreAlertMinutes: 10,
    autoAssignEnabled: true,
    smsAlertsEnabled: true,
    telemetryLogging: true,
    apiEndpoint: "http://localhost:8080/api"
  });

  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
  };

  return (
    <div>
      <PageHeader
        title="Emergency System Settings & Configuration"
        subtitle="Manage dispatch heuristic parameters, GPS telemetry intervals and AI triage thresholds"
      />

      <Toast
        show={showToast}
        message="System dispatch parameters saved successfully."
        type="success"
        onClose={() => setShowToast(false)}
      />

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Dispatch Algorithms */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <Cpu size={20} className="text-primary" /> AI Triage & Routing Engine
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">AI Triage Sensitivity</label>
                <select
                  className="form-select bg-light"
                  value={settings.aiTriageMode}
                  onChange={(e) => setSettings({ ...settings, aiTriageMode: e.target.value })}
                >
                  <option value="AGGRESSIVE">AGGRESSIVE (Escalate borderline cases to Critical/ICU)</option>
                  <option value="BALANCED">BALANCED (Standard clinical protocol)</option>
                  <option value="CONSERVATIVE">CONSERVATIVE (Conserve ICU fleet for confirmed arrests)</option>
                </select>
                <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                  Controls the sensitivity of NLP symptom scoring algorithms.
                </span>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">City Traffic Multiplier Index</label>
                <input
                  type="number"
                  step="0.05"
                  className="form-control bg-light"
                  value={settings.trafficMultiplier}
                  onChange={(e) => setSettings({ ...settings, trafficMultiplier: parseFloat(e.target.value) })}
                />
                <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                  Real-time rush hour slowdown compensation for ETA estimation.
                </span>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Hospital Cath Lab Pre-Alert Window (mins)</label>
                <input
                  type="number"
                  className="form-control bg-light"
                  value={settings.hospitalPreAlertMinutes}
                  onChange={(e) => setSettings({ ...settings, hospitalPreAlertMinutes: parseInt(e.target.value) })}
                />
                <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                  Minutes prior to ambulance arrival to ping hospital trauma teams.
                </span>
              </div>

              <div className="form-check form-switch pt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoAssignSwitch"
                  checked={settings.autoAssignEnabled}
                  onChange={(e) => setSettings({ ...settings, autoAssignEnabled: e.target.checked })}
                />
                <label className="form-check-label small fw-semibold text-dark" htmlFor="autoAssignSwitch">
                  Enable Zero-Touch Automated Nearest Dispatch
                </label>
              </div>
            </div>
          </div>

          {/* Telemetry & Integrations */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <Radio size={20} className="text-danger" /> Telemetry & Gateway Connections
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">GPS Vehicle Telemetry Ping Rate</label>
                <select
                  className="form-select bg-light"
                  value={settings.gpsPingInterval}
                  onChange={(e) => setSettings({ ...settings, gpsPingInterval: parseInt(e.target.value) })}
                >
                  <option value={15}>Every 15 Seconds (High Precision / High Bandwidth)</option>
                  <option value={30}>Every 30 Seconds (Recommended Standard)</option>
                  <option value={60}>Every 60 Seconds (Low Power Mode)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary">Spring Boot REST Backend Base URL</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={settings.apiEndpoint}
                  onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
                />
              </div>

              <div className="form-check form-switch mb-3 pt-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="smsAlertsSwitch"
                  checked={settings.smsAlertsEnabled}
                  onChange={(e) => setSettings({ ...settings, smsAlertsEnabled: e.target.checked })}
                />
                <label className="form-check-label small fw-semibold text-dark" htmlFor="smsAlertsSwitch">
                  Send Instant SMS Emergency Dispatch Notifications
                </label>
              </div>

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="telemetrySwitch"
                  checked={settings.telemetryLogging}
                  onChange={(e) => setSettings({ ...settings, telemetryLogging: e.target.checked })}
                />
                <label className="form-check-label small fw-semibold text-dark" htmlFor="telemetrySwitch">
                  Record Full Geospatial Route Breadcrumbs to MySQL
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="submit"
            className="btn btn-primary rounded-pill px-5 py-2 fw-semibold d-flex align-items-center gap-2"
          >
            <Save size={16} /> Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
