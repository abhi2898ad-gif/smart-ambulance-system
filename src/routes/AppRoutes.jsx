import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import DriverLayout from "../layouts/DriverLayout";
import HospitalLayout from "../layouts/HospitalLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public Pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

// User Pages
import UserDashboard from "../pages/user/UserDashboard";
import RequestAmbulance from "../pages/user/RequestAmbulance";
import TrackAmbulance from "../pages/user/TrackAmbulance";
import EmergencyHistory from "../pages/user/EmergencyHistory";
import UserProfile from "../pages/user/UserProfile";

// Driver Pages
import DriverDashboard from "../pages/driver/DriverDashboard";
import DriverEmergency from "../pages/driver/DriverEmergency";
import DriverLocation from "../pages/driver/DriverLocation";
import DriverHistory from "../pages/driver/DriverHistory";
import DriverProfile from "../pages/driver/DriverProfile";

// Hospital Pages
import HospitalDashboard from "../pages/hospital/HospitalDashboard";
import HospitalEmergencies from "../pages/hospital/HospitalEmergencies";
import HospitalProfile from "../pages/hospital/HospitalProfile";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageAmbulances from "../pages/admin/ManageAmbulances";
import ManageDrivers from "../pages/admin/ManageDrivers";
import ManageHospitals from "../pages/admin/ManageHospitals";
import ManageEmergencies from "../pages/admin/ManageEmergencies";
import ManageTrips from "../pages/admin/ManageTrips";
import DemandPrediction from "../pages/admin/DemandPrediction";
import Reports from "../pages/admin/Reports";
import AdminSettings from "../pages/admin/AdminSettings";

// Role Route Guard
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // For testing convenience, super ADMIN can access all dashboards
  if (role === "ADMIN") {
    return children;
  }

  // If role doesn't match and not admin, redirect to respective dashboard
  if (allowedRole && role !== allowedRole) {
    switch (role) {
      case "DRIVER":
        return <Navigate to="/driver/dashboard" replace />;
      case "HOSPITAL":
        return <Navigate to="/hospital/dashboard" replace />;
      default:
        return <Navigate to="/user/dashboard" replace />;
    }
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* USER / PATIENT ROUTES */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRole="USER">
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/user/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="request-ambulance" element={<RequestAmbulance />} />
        <Route path="track-ambulance" element={<TrackAmbulance />} />
        <Route path="history" element={<EmergencyHistory />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* DRIVER ROUTES */}
      <Route
        path="/driver"
        element={
          <ProtectedRoute allowedRole="DRIVER">
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/driver/dashboard" replace />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="emergency" element={<DriverEmergency />} />
        <Route path="location" element={<DriverLocation />} />
        <Route path="history" element={<DriverHistory />} />
        <Route path="profile" element={<DriverProfile />} />
      </Route>

      {/* HOSPITAL ROUTES */}
      <Route
        path="/hospital"
        element={
          <ProtectedRoute allowedRole="HOSPITAL">
            <HospitalLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/hospital/dashboard" replace />} />
        <Route path="dashboard" element={<HospitalDashboard />} />
        <Route path="emergencies" element={<HospitalEmergencies />} />
        <Route path="profile" element={<HospitalProfile />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="ambulances" element={<ManageAmbulances />} />
        <Route path="drivers" element={<ManageDrivers />} />
        <Route path="hospitals" element={<ManageHospitals />} />
        <Route path="emergencies" element={<ManageEmergencies />} />
        <Route path="trips" element={<ManageTrips />} />
        <Route path="predictions" element={<DemandPrediction />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* CATCH ALL 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
