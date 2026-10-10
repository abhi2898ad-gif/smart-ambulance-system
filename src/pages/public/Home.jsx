import React from "react";
import { Link } from "react-router-dom";
import {
  Siren,
  Shield,
  Zap,
  MapPin,
  Clock,
  HeartPulse,
  Activity,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Building2,
  Compass,
  Cpu
} from "lucide-react";
import MapComponent from "../../components/MapComponent";
import { initialAmbulances } from "../../data/ambulances";
import { initialHospitals } from "../../data/hospitals";

const Home = () => {
  return (
    <div className="landing-page overflow-hidden">
      {/* HERO SECTION */}
      <section className="position-relative py-5 py-lg-6 hero-gradient border-bottom">
        <div className="container py-4 py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-danger-subtle text-danger border border-danger-subtle small fw-bold mb-3 animate-fadeIn">
                <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                LIVE HYDERABAD EMERGENCY RESPONSE NETWORK
              </div>

              <h1 className="display-4 fw-extrabold text-navy lh-tight mb-3">
                Emergency Response, <br />
                <span className="text-gradient-primary">Reimagined by AI.</span>
              </h1>

              <p className="lead text-secondary mb-4" style={{ maxWidth: "580px" }}>
                AI-driven ambulance dispatch that cuts critical response time by 42%. Connecting patients, paramedics, ambulances, and hospital emergency trauma units in real time.
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <Link
                  to="/user/request-ambulance"
                  className="btn btn-danger btn-lg rounded-pill px-4 py-3 fw-bold shadow-lg d-flex align-items-center gap-2 emergency-btn-glow"
                >
                  <Siren size={22} /> Request Ambulance Now
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-lg rounded-pill px-4 py-3 fw-semibold bg-white"
                >
                  Login & Demo Dashboards
                </Link>
              </div>

              <div className="d-flex align-items-center gap-4 text-secondary small pt-2">
                <div className="d-flex align-items-center gap-1">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Sub-8 Min Response</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>Real-time ICU Pre-Alert</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <CheckCircle2 size={16} className="text-success" />
                  <span>GPS Telemetry</span>
                </div>
              </div>
            </div>

            {/* Live Floating Emergency Card Demo */}
            <div className="col-12 col-lg-5">
              <div className="position-relative">
                {/* Glow backdrop */}
                <div
                  className="position-absolute w-100 h-100 rounded-5"
                  style={{
                    background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(239,68,68,0.12) 100%)",
                    filter: "blur(40px)",
                    transform: "scale(1.05)",
                    zIndex: 0
                  }}
                ></div>

                {/* Main Card */}
                <div className="card border-0 shadow-xl rounded-4 bg-white p-4 position-relative z-1">
                  <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-danger text-white rounded-pill px-2 py-1 small">
                        CRITICAL PRIORITY
                      </span>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1 small">
                        AI DISPATCHED
                      </span>
                    </div>
                    <span className="text-muted small d-flex align-items-center gap-1">
                      <Clock size={13} /> Active Now
                    </span>
                  </div>

                  <div className="mb-3">
                    <h5 className="fw-bold text-dark mb-1">Cardiac Emergency Dispatch</h5>
                    <p className="text-muted small mb-2">Madhapur Cyber Towers &rarr; Apollo Health City</p>
                    <div className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted small">Assigned Unit:</span>
                        <span className="fw-bold text-primary">TS-09-EA-1002 (ICU Unit)</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted small">Driver:</span>
                        <span className="fw-semibold text-dark">Suresh Reddy</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">Distance & ETA:</span>
                        <span className="badge bg-danger text-white fw-bold">3.2 km &bull; 6 MINS</span>
                      </div>
                    </div>
                  </div>

                  <div className="progress mb-3" style={{ height: "6px" }}>
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated bg-danger"
                      role="progressbar"
                      style={{ width: "65%" }}
                    ></div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2">
                    <div className="d-flex align-items-center gap-2">
                      <HeartPulse size={20} className="text-danger" />
                      <span className="small text-muted">Cath Lab Pre-Alerted</span>
                    </div>
                    <Link
                      to="/user/track-ambulance?id=1"
                      className="btn btn-sm btn-primary rounded-pill px-3 d-flex align-items-center gap-1"
                    >
                      View Live Map <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS BAR */}
      <section className="bg-white py-4 border-bottom shadow-xs">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3 border-end-md">
              <h2 className="display-6 fw-bold text-navy mb-0">7.4 <span className="fs-5 text-muted">min</span></h2>
              <p className="text-secondary small fw-medium mb-0">Average Response Time</p>
            </div>
            <div className="col-6 col-md-3 border-end-md">
              <h2 className="display-6 fw-bold text-primary mb-0">100%</h2>
              <p className="text-secondary small fw-medium mb-0">Active Fleet Monitored</p>
            </div>
            <div className="col-6 col-md-3 border-end-md">
              <h2 className="display-6 fw-bold text-success mb-0">99.4%</h2>
              <p className="text-secondary small fw-medium mb-0">AI Triage Accuracy</p>
            </div>
            <div className="col-6 col-md-3">
              <h2 className="display-6 fw-bold text-danger mb-0">5</h2>
              <p className="text-secondary small fw-medium mb-0">Major Network Hospitals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES / FEATURES */}
      <section className="py-5 py-lg-6 bg-light" id="features">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 small fw-bold mb-2">
              PLATFORM FEATURES
            </span>
            <h2 className="h1 fw-bold text-navy mb-3">Intelligent Systems Working Synchronously</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: "600px" }}>
              Every millisecond counts during emergency triage. Our architecture unites geospatial algorithms, predictive demand, and clinical workflow.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 transition-all hover-translate">
                <div className="p-3 rounded-4 bg-danger-subtle text-danger mb-3 d-inline-block" style={{ width: "fit-content" }}>
                  <Cpu size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2">AI-Driven Priority Triage</h5>
                <p className="text-secondary small mb-0">
                  Natural language and symptom analysis automatically categorizes incidents into CRITICAL, HIGH, MEDIUM, and LOW, ensuring life-saving ICU allocations instantly.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 transition-all hover-translate">
                <div className="p-3 rounded-4 bg-primary-subtle text-primary mb-3 d-inline-block" style={{ width: "fit-content" }}>
                  <Compass size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Dynamic Proximity Dispatch</h5>
                <p className="text-secondary small mb-0">
                  Considers real-time GPS locations, vehicle capabilities (ICU, ALS, BLS), traffic congestion multipliers, and driver availability to assign optimal responders.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 p-4 transition-all hover-translate">
                <div className="p-3 rounded-4 bg-success-subtle text-success mb-3 d-inline-block" style={{ width: "fit-content" }}>
                  <Building2 size={26} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Hospital Emergency Coordination</h5>
                <p className="text-secondary small mb-0">
                  Pre-alerts hospital emergency trauma teams and cath labs with patient details and accurate ETA while validating live ICU and emergency bed availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-5 py-lg-6 bg-white border-top border-bottom" id="how-it-works">
        <div className="container py-3">
          <div className="text-center mb-5">
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-3 py-1 small fw-bold mb-2">
              RAPID WORKFLOW
            </span>
            <h2 className="h1 fw-bold text-navy mb-3">From Distress Call to Hospital Ward</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: "600px" }}>
              A 4-step streamlined pipeline that eliminates response delays and manual phone dispatching.
            </p>
          </div>

          <div className="row g-4 position-relative">
            <div className="col-12 col-md-3">
              <div className="p-3 text-center">
                <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 50, height: 50, fontSize: "1.2rem" }}>
                  1
                </div>
                <h6 className="fw-bold text-dark mb-2">Patient Distress Request</h6>
                <p className="text-secondary small mb-0">
                  Patient or bystander submits emergency symptoms and exact GPS coordinates via web portal or phone.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="p-3 text-center">
                <div className="rounded-circle bg-danger text-white fw-bold d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 50, height: 50, fontSize: "1.2rem" }}>
                  2
                </div>
                <h6 className="fw-bold text-dark mb-2">AI Assessment & Scoring</h6>
                <p className="text-secondary small mb-0">
                  Algorithms calculate urgency, match vehicle equipment (e.g. ICU ventilator), and select accepting hospitals.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="p-3 text-center">
                <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 50, height: 50, fontSize: "1.2rem" }}>
                  3
                </div>
                <h6 className="fw-bold text-dark mb-2">Driver Auto-Dispatch</h6>
                <p className="text-secondary small mb-0">
                  Nearest driver console receives audio/visual alert with turn-by-turn routing and patient vitals preview.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-3">
              <div className="p-3 text-center">
                <div className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 50, height: 50, fontSize: "1.2rem" }}>
                  4
                </div>
                <h6 className="fw-bold text-dark mb-2">Hospital Preparation</h6>
                <p className="text-secondary small mb-0">
                  Trauma bay, doctors, and blood bank are notified with real-time countdown before ambulance arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE INTERACTIVE MAP DEMO */}
      <section className="py-5 py-lg-6 bg-light" id="about">
        <div className="container py-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end mb-4">
            <div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 small fw-bold mb-2">
                ACTIVE RADAR
              </span>
              <h2 className="h2 fw-bold text-navy mb-1">Live Hyderabad Fleet & Hospitals</h2>
              <p className="text-secondary small mb-0">
                Interactive real-time map displaying current ambulance positioning, hospitals, and emergency coordinates.
              </p>
            </div>
            <Link to="/user/request-ambulance" className="btn btn-outline-primary rounded-pill px-3 mt-3 mt-md-0 fw-medium">
              Request From Map
            </Link>
          </div>

          <MapComponent
            ambulances={initialAmbulances}
            hospitals={initialHospitals}
            height="480px"
          />
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-5 bg-navy text-white text-center">
        <div className="container py-4">
          <div className="p-4 p-md-5 rounded-4 bg-primary text-white shadow-lg mx-auto" style={{ maxWidth: "900px" }}>
            <h2 className="h1 fw-extrabold mb-3 text-white">Every Second Counts. Experience the Difference.</h2>
            <p className="lead mb-4 text-white text-opacity-90">
              Access the live emergency platform now as a patient, paramedic driver, hospital emergency coordinator, or administrator.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/user/request-ambulance" className="btn btn-light text-primary btn-lg rounded-pill px-4 fw-bold">
                Request Immediate Ambulance
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill px-4 fw-semibold">
                Sign In to Console
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
