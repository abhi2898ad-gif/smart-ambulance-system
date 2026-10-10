import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Siren,
  LogOut,
  User,
  Shield,
  Truck,
  Building2,
  ChevronDown,
  Menu,
  X,
  PhoneCall
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Demo role switcher to quickly test any dashboard
  const handleQuickSwitch = async (roleEmail) => {
    setRoleDropdownOpen(false);
    try {
      await login(roleEmail, "admin123");
      if (roleEmail.includes("admin")) navigate("/admin/dashboard");
      else if (roleEmail.includes("driver")) navigate("/driver/dashboard");
      else if (roleEmail.includes("hospital")) navigate("/hospital/dashboard");
      else navigate("/user/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "DRIVER":
        return "/driver/dashboard";
      case "HOSPITAL":
        return "/hospital/dashboard";
      default:
        return "/user/dashboard";
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 px-3 px-lg-4 shadow-xs">
      <div className="container-fluid px-0">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-dark text-decoration-none py-1">
          <div className="p-2 rounded-3 bg-danger text-white d-flex align-items-center justify-content-center shadow-sm">
            <Siren size={20} className="emergency-icon-pulse" />
          </div>
          <div className="d-flex flex-column lh-1">
            <span className="fs-5 fw-extrabold text-navy tracking-tight">SmartAmbulance</span>
            <span className="text-muted small fw-normal" style={{ fontSize: "0.68rem" }}>
              Faster Response. Smarter Care.
            </span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0 shadow-none d-lg-none"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? "show py-3" : ""}`} id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-3">
            <li className="nav-item">
              <Link to="/" className={`nav-link fw-medium px-2 ${location.pathname === "/" ? "text-primary active" : "text-secondary"}`}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <a href="/#features" className="nav-link fw-medium px-2 text-secondary">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a href="/#how-it-works" className="nav-link fw-medium px-2 text-secondary">
                How It Works
              </a>
            </li>
            <li className="nav-item">
              <a href="/#about" className="nav-link fw-medium px-2 text-secondary">
                About System
              </a>
            </li>
          </ul>

          {/* Right actions */}
          <div className="d-flex align-items-center flex-wrap gap-2 pt-2 pt-lg-0">
            {/* Quick Demo Switcher */}
            <div className="dropdown position-relative">
              <button
                className="btn btn-sm btn-light border rounded-pill px-3 py-1 text-secondary d-flex align-items-center gap-1 dropdown-toggle"
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                aria-expanded={roleDropdownOpen}
              >
                <Shield size={14} className="text-primary" />
                <span className="small fw-semibold">Demo Role Switcher</span>
                <ChevronDown size={12} />
              </button>
              {roleDropdownOpen && (
                <div className="dropdown-menu show position-absolute end-0 mt-2 shadow-lg rounded-4 p-2 border-0" style={{ minWidth: "220px", zIndex: 1050 }}>
                  <h6 className="dropdown-header small text-uppercase fw-bold text-muted px-2 py-1">Quick Switch Profile</h6>
                  <button
                    className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 small"
                    onClick={() => handleQuickSwitch("user@smartambulance.com")}
                  >
                    <User size={16} className="text-primary" />
                    <div>
                      <div className="fw-semibold">Patient / User</div>
                      <div className="text-muted" style={{ fontSize: "0.72rem" }}>user@smartambulance.com</div>
                    </div>
                  </button>
                  <button
                    className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 small"
                    onClick={() => handleQuickSwitch("driver@smartambulance.com")}
                  >
                    <Truck size={16} className="text-warning" />
                    <div>
                      <div className="fw-semibold">Ambulance Driver</div>
                      <div className="text-muted" style={{ fontSize: "0.72rem" }}>driver@smartambulance.com</div>
                    </div>
                  </button>
                  <button
                    className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 small"
                    onClick={() => handleQuickSwitch("hospital@smartambulance.com")}
                  >
                    <Building2 size={16} className="text-danger" />
                    <div>
                      <div className="fw-semibold">Hospital Admin</div>
                      <div className="text-muted" style={{ fontSize: "0.72rem" }}>hospital@smartambulance.com</div>
                    </div>
                  </button>
                  <button
                    className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 small"
                    onClick={() => handleQuickSwitch("admin@smartambulance.com")}
                  >
                    <Shield size={16} className="text-success" />
                    <div>
                      <div className="fw-semibold">System Super Admin</div>
                      <div className="text-muted" style={{ fontSize: "0.72rem" }}>admin@smartambulance.com</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Emergency Button */}
            <Link
              to="/user/request-ambulance"
              className="btn btn-danger btn-sm rounded-pill px-3 py-1 fw-bold d-flex align-items-center gap-2 shadow-sm emergency-btn-glow"
            >
              <Siren size={15} /> Request Ambulance
            </Link>

            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 ms-lg-2">
                <Link
                  to={getDashboardPath()}
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-light btn-sm rounded-circle p-2 text-danger border"
                  title="Log out"
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2 ms-lg-2">
                <Link to="/login" className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-medium">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm rounded-pill px-3 fw-medium">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
