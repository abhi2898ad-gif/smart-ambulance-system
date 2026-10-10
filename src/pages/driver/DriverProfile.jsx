import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";
import Toast from "../../components/Toast";
import { initialDrivers } from "../../data/drivers";
import { useAuth } from "../../context/AuthContext";
import { User, Award, ShieldCheck, Truck, Phone, Save } from "lucide-react";

const DriverProfile = () => {
  const { user } = useAuth();
  const driver = initialDrivers.find((d) => d.userId === user?.id || d.id === 1) || initialDrivers[0];

  const [formData, setFormData] = useState({
    fullName: driver.fullName,
    licenseNumber: driver.licenseNumber,
    phone: driver.phone,
    shift: driver.shift,
    experienceYears: driver.experienceYears,
    emergencyContact: "+91 98765 11223"
  });

  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
  };

  return (
    <div>
      <PageHeader
        title="Paramedic Driver Profile & Credentials"
        subtitle="Operational authorization and fleet license compliance"
      />

      <Toast
        show={showToast}
        message="Driver information successfully saved."
        type="success"
        onClose={() => setShowToast(false)}
      />

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-4">
            <div className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 80, height: 80, fontSize: "2rem", fontWeight: "bold" }}>
              {formData.fullName.charAt(0)}
            </div>
            <h5 className="fw-bold text-dark mb-1">{formData.fullName}</h5>
            <span className="badge bg-warning-subtle text-warning border border-warning-subtle rounded-pill px-3 py-1 small mb-3">
              Certified Critical Care Driver
            </span>

            <div className="p-3 bg-light rounded-3 text-start small mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">License:</span>
                <span className="fw-bold text-dark">{formData.licenseNumber}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Experience:</span>
                <span className="text-dark fw-medium">{formData.experienceYears} Years</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Rating:</span>
                <span className="text-warning fw-bold">&starf; {driver.rating} / 5.0</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Assigned Unit:</span>
                <span className="text-primary fw-bold">{driver.vehicleNumber}</span>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <Award size={18} className="text-success" /> Active Certifications
            </h6>
            <ul className="list-unstyled small text-secondary d-flex flex-column gap-2 mb-0">
              <li className="d-flex align-items-center gap-2">
                <ShieldCheck size={16} className="text-success" />
                <span>Advanced Cardiac Life Support (ACLS)</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <ShieldCheck size={16} className="text-success" />
                <span>Basic Trauma Life Support (BTLS)</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <ShieldCheck size={16} className="text-success" />
                <span>Emergency Vehicle Operator Course (EVOC)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-4">Edit Driver Profile</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Full Legal Name</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Heavy/Emergency License Number</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Direct Phone Contact</label>
                  <input
                    type="tel"
                    className="form-control bg-light"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Shift Assignment</label>
                  <select
                    className="form-select bg-light"
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                  >
                    <option value="Day (08:00 - 20:00)">Day (08:00 - 20:00)</option>
                    <option value="Night (20:00 - 08:00)">Night (20:00 - 08:00)</option>
                    <option value="On-Call Rapid Response">On-Call Rapid Response</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Years of Emergency Experience</label>
                  <input
                    type="number"
                    className="form-control bg-light"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Base Depot Emergency Contact</label>
                  <input
                    type="tel"
                    className="form-control bg-light"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;
