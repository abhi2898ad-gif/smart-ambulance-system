import React from "react";
import { Siren, Phone, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 border-top">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Info */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-3 bg-danger text-white">
                <Siren size={20} />
              </div>
              <h5 className="fw-bold mb-0 text-white">SmartAmbulance</h5>
            </div>
            <p className="text-secondary small mb-3">
              AI-powered emergency dispatch and medical coordination system. Connecting patients, ambulances, and hospitals within seconds.
            </p>
            <div className="d-flex align-items-center gap-2 text-secondary small">
              <ShieldCheck size={16} className="text-success" />
              <span>ISO 27001 Certified Healthcare Dispatch</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-white mb-3">Platform</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li><Link to="/" className="text-secondary text-decoration-none hover-white">Home</Link></li>
              <li><Link to="/user/request-ambulance" className="text-secondary text-decoration-none hover-white">Request Dispatch</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none hover-white">Staff Login</Link></li>
              <li><Link to="/register" className="text-secondary text-decoration-none hover-white">Register</Link></li>
            </ul>
          </div>

          <div className="col-6 col-md-2">
            <h6 className="fw-bold text-white mb-3">Roles</h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li><Link to="/user/dashboard" className="text-secondary text-decoration-none hover-white">Patient Portal</Link></li>
              <li><Link to="/driver/dashboard" className="text-secondary text-decoration-none hover-white">Driver Console</Link></li>
              <li><Link to="/hospital/dashboard" className="text-secondary text-decoration-none hover-white">Hospital Control</Link></li>
              <li><Link to="/admin/dashboard" className="text-secondary text-decoration-none hover-white">Admin Hub</Link></li>
            </ul>
          </div>

          {/* Emergency Hotlines */}
          <div className="col-12 col-md-4">
            <h6 className="fw-bold text-white mb-3">National Emergency Hotlines</h6>
            <div className="d-flex flex-column gap-2">
              <a
                href="tel:108"
                className="btn btn-outline-danger btn-sm text-start d-flex align-items-center justify-content-between p-2 rounded-3 text-white"
              >
                <span className="d-flex align-items-center gap-2">
                  <Phone size={15} className="text-danger" /> 108 Emergency Medical
                </span>
                <span className="badge bg-danger">Toll Free 24/7</span>
              </a>
              <a
                href="tel:112"
                className="btn btn-outline-light btn-sm text-start d-flex align-items-center justify-content-between p-2 rounded-3 text-secondary"
              >
                <span className="d-flex align-items-center gap-2">
                  <Phone size={15} /> 112 All-in-One Helpline
                </span>
                <span className="badge bg-secondary">Nationwide</span>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between small text-secondary">
          <p className="mb-2 mb-md-0">
            &copy; {new Date().getFullYear()} SmartAmbulance Emergency Response Platform. All rights reserved.
          </p>
          <div className="d-flex align-items-center gap-1">
            Built with <Heart size={14} className="text-danger" fill="#ef4444" /> for emergency healthcare response.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
