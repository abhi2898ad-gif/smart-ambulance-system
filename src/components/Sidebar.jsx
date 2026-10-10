import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Siren,
  Truck,
  History,
  User,
  MapPin,
  Building2,
  Users,
  Compass,
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getLinks = () => {
    switch (role) {
      case "USER":
        return [
          { to: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { to: "/user/request-ambulance", label: "Request Ambulance", icon: Siren, highlight: true },
          { to: "/user/track-ambulance", label: "Live Tracking", icon: Compass },
          { to: "/user/history", label: "Emergency History", icon: History },
          { to: "/user/profile", label: "My Profile", icon: User }
        ];

      case "DRIVER":
        return [
          { to: "/driver/dashboard", label: "Driver Console", icon: LayoutDashboard },
          { to: "/driver/emergency", label: "Active Emergency", icon: ShieldAlert, highlight: true },
          { to: "/driver/location", label: "GPS & Location", icon: MapPin },
          { to: "/driver/history", label: "Trip Logbook", icon: History },
          { to: "/driver/profile", label: "Driver Profile", icon: User }
        ];

      case "HOSPITAL":
        return [
          { to: "/hospital/dashboard", label: "Command Center", icon: LayoutDashboard },
          { to: "/hospital/emergencies", label: "Incoming Patients", icon: Siren, highlight: true },
          { to: "/hospital/profile", label: "Hospital & Bed Info", icon: Building2 }
        ];

      case "ADMIN":
        return [
          { to: "/admin/dashboard", label: "System Overview", icon: LayoutDashboard },
          { to: "/admin/users", label: "Users & Accounts", icon: Users },
          { to: "/admin/ambulances", label: "Ambulance Fleet", icon: Truck },
          { to: "/admin/drivers", label: "Drivers Dispatch", icon: User },
          { to: "/admin/hospitals", label: "Hospitals Network", icon: Building2 },
          { to: "/admin/emergencies", label: "Emergency Stream", icon: Siren },
          { to: "/admin/trips", label: "Trips & Routes", icon: Compass },
          { to: "/admin/predictions", label: "AI Demand Forecast", icon: TrendingUp, highlight: true },
          { to: "/admin/reports", label: "Analytics & Reports", icon: BarChart3 },
          { to: "/admin/settings", label: "System Settings", icon: Settings }
        ];

      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end h-100" style={{ width: "260px", minHeight: "calc(100vh - 61px)" }}>
      {/* Role Title */}
      <div className="px-2 mb-3">
        <span className="text-uppercase fw-bold text-muted small" style={{ letterSpacing: "1px", fontSize: "0.72rem" }}>
          {role} Workspace
        </span>
      </div>

      {/* Nav List */}
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <li className="nav-item" key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center justify-content-between rounded-3 px-3 py-2 fw-medium transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : link.highlight
                      ? "text-danger bg-danger-subtle hover-bg"
                      : "text-secondary hover-bg text-dark"
                  }`
                }
              >
                <div className="d-flex align-items-center gap-3">
                  <Icon size={18} />
                  <span className="small">{link.label}</span>
                </div>
                {link.highlight && <span className="badge bg-danger rounded-pill" style={{ width: 6, height: 6 }}> </span>}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <hr className="my-3 text-secondary" />

      {/* Current User Card */}
      <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: 34, height: 34, minWidth: 34, fontSize: "0.85rem" }}>
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <h6 className="fw-semibold text-dark mb-0 small text-truncate">{user?.fullName || "User"}</h6>
            <span className="text-muted d-block" style={{ fontSize: "0.7rem" }}>
              {user?.role || "GUEST"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-link text-danger p-1"
          title="Sign out"
          aria-label="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
