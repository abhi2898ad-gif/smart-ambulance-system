import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Siren, Lock, Mail, ArrowRight, ShieldCheck, User, Truck, Building2, Shield, AlertCircle } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login(email, password);
      redirectByRole(res.user.role);
    } catch (err) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoRole) => {
    setError("");
    setLoading(true);
    try {
      const res = await login(demoEmail, "admin123");
      redirectByRole(res.user.role || demoRole);
    } catch (err) {
      setError(err.message || "Quick login failed.");
    } finally {
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    if (from) {
      navigate(from, { replace: true });
      return;
    }
    switch (role) {
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      case "DRIVER":
        navigate("/driver/dashboard");
        break;
      case "HOSPITAL":
        navigate("/hospital/dashboard");
        break;
      default:
        navigate("/user/dashboard");
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5 px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Left branding panel */}
                <div className="col-12 col-md-5 bg-navy text-white p-4 p-lg-5 d-flex flex-column justify-content-between position-relative">
                  <div className="position-relative z-1">
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <div className="p-2 rounded-3 bg-danger text-white">
                        <Siren size={22} />
                      </div>
                      <span className="fs-5 fw-extrabold tracking-tight">SmartAmbulance</span>
                    </div>

                    <h3 className="fw-bold mb-3">Critical Response System</h3>
                    <p className="text-secondary small mb-4">
                      Secure authentication gateway for emergency responders, patients, and network hospitals.
                    </p>

                    <div className="d-flex flex-column gap-3 small text-secondary">
                      <div className="d-flex align-items-center gap-2">
                        <ShieldCheck size={18} className="text-success" />
                        <span>Encrypted HIPAA/ISO Compliant</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <ShieldCheck size={18} className="text-success" />
                        <span>Instant AI Dispatch Link</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <ShieldCheck size={18} className="text-success" />
                        <span>Real-time Bed Registry Access</span>
                      </div>
                    </div>
                  </div>

                  <div className="position-relative z-1 pt-4 border-top border-secondary mt-4">
                    <span className="small text-muted">Emergency Dispatch Helpline</span>
                    <h5 className="fw-bold text-danger mb-0">108 / +91 40 1066</h5>
                  </div>
                </div>

                {/* Right form panel */}
                <div className="col-12 col-md-7 p-4 p-lg-5 bg-white">
                  <div className="mb-4">
                    <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
                    <p className="text-muted small">Sign in to your account or use 1-click demo logins below</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-3">
                      <AlertCircle size={16} className="flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-secondary">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Mail size={16} className="text-muted" />
                        </span>
                        <input
                          type="email"
                          className="form-control bg-light border-start-0"
                          placeholder="name@smartambulance.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="form-label small fw-semibold text-secondary mb-0">Password</label>
                        <span className="small text-muted">Default: admin123</span>
                      </div>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Lock size={16} className="text-muted" />
                        </span>
                        <input
                          type="password"
                          className="form-control bg-light border-start-0"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    >
                      {loading ? (
                        <div className="spinner-border spinner-border-sm" role="status"></div>
                      ) : (
                        <>
                          Sign In <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>

                  {/* 1-Click Demo Accounts */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center my-3">
                      <hr className="flex-grow-1 text-muted" />
                      <span className="px-2 small text-muted text-uppercase fw-semibold" style={{ fontSize: "0.7rem" }}>
                        Instant Demo Logins
                      </span>
                      <hr className="flex-grow-1 text-muted" />
                    </div>

                    <div className="row g-2">
                      <div className="col-6">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin("user@smartambulance.com", "USER")}
                          className="btn btn-light border w-100 text-start p-2 rounded-3 small d-flex align-items-center gap-2 hover-shadow"
                        >
                          <User size={16} className="text-primary flex-shrink-0" />
                          <div className="overflow-hidden">
                            <strong className="d-block text-truncate">Patient / User</strong>
                            <span className="text-muted" style={{ fontSize: "0.68rem" }}>user@smartambulance.com</span>
                          </div>
                        </button>
                      </div>

                      <div className="col-6">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin("driver@smartambulance.com", "DRIVER")}
                          className="btn btn-light border w-100 text-start p-2 rounded-3 small d-flex align-items-center gap-2 hover-shadow"
                        >
                          <Truck size={16} className="text-warning flex-shrink-0" />
                          <div className="overflow-hidden">
                            <strong className="d-block text-truncate">Paramedic Driver</strong>
                            <span className="text-muted" style={{ fontSize: "0.68rem" }}>driver@smartambulance.com</span>
                          </div>
                        </button>
                      </div>

                      <div className="col-6">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin("hospital@smartambulance.com", "HOSPITAL")}
                          className="btn btn-light border w-100 text-start p-2 rounded-3 small d-flex align-items-center gap-2 hover-shadow"
                        >
                          <Building2 size={16} className="text-danger flex-shrink-0" />
                          <div className="overflow-hidden">
                            <strong className="d-block text-truncate">Hospital Admin</strong>
                            <span className="text-muted" style={{ fontSize: "0.68rem" }}>hospital@smartambulance.com</span>
                          </div>
                        </button>
                      </div>

                      <div className="col-6">
                        <button
                          type="button"
                          onClick={() => handleQuickLogin("admin@smartambulance.com", "ADMIN")}
                          className="btn btn-light border w-100 text-start p-2 rounded-3 small d-flex align-items-center gap-2 hover-shadow"
                        >
                          <Shield size={16} className="text-success flex-shrink-0" />
                          <div className="overflow-hidden">
                            <strong className="d-block text-truncate">Super Admin</strong>
                            <span className="text-muted" style={{ fontSize: "0.68rem" }}>admin@smartambulance.com</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-muted small mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                      Create an account
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
