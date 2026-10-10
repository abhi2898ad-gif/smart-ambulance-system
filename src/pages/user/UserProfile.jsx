import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import Toast from "../../components/Toast";
import { userService } from "../../services/userService";
import { User, Mail, Phone, MapPin, Heart, Shield, CheckCircle, Save } from "lucide-react";

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bloodGroup: user?.bloodGroup || "O+",
    address: user?.address || "",
    emergencyContactName: user?.emergencyContactName || "",
    emergencyContactPhone: user?.emergencyContactPhone || "",
    medicalNotes: "No known penicillin allergies. Mild asthma history."
  });

  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user?.id) {
        await userService.updateUser(user.id, formData);
      }
      updateUserProfile(formData);
      setShowToast(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Personal Profile & Medical Card"
        subtitle="Emergency responder vitals and contact preferences"
      />

      <Toast
        show={showToast}
        message="Profile details updated successfully!"
        type="success"
        onClose={() => setShowToast(false)}
      />

      <div className="row g-4">
        {/* Profile Card Summary */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-4">
            <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 80, height: 80, fontSize: "2rem", fontWeight: "bold" }}>
              {formData.fullName.charAt(0) || "U"}
            </div>
            <h5 className="fw-bold text-dark mb-1">{formData.fullName}</h5>
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 small mb-3">
              {user?.role || "USER"} Account
            </span>
            <div className="p-3 bg-light rounded-3 text-start small mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Blood Group:</span>
                <span className="fw-bold text-danger">{formData.bloodGroup}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Registered Email:</span>
                <span className="text-dark fw-medium text-truncate" style={{ maxWidth: "160px" }}>{formData.email}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Primary Phone:</span>
                <span className="text-dark fw-medium">{formData.phone}</span>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <Heart size={18} className="text-danger" /> Emergency Medical Pass
            </h6>
            <p className="text-secondary small mb-3">
              During distress dispatches, paramedics scan this vital data to prepare IV fluids and drug choices en route.
            </p>
            <div className="p-2 px-3 rounded-3 bg-danger-subtle text-danger small fw-semibold">
              Always keep your blood group and emergency contact updated.
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-4">Edit Profile & Emergency Information</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control bg-light"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-light"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control bg-light"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Blood Group</label>
                  <select
                    name="bloodGroup"
                    className="form-select bg-light"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Home / Primary Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control bg-light"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContactName"
                    className="form-control bg-light"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    className="form-control bg-light"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Medical Conditions & Allergies</label>
                  <textarea
                    name="medicalNotes"
                    className="form-control bg-light"
                    rows="3"
                    value={formData.medicalNotes}
                    onChange={handleChange}
                    placeholder="List existing conditions, pacemaker, diabetes, allergies..."
                  ></textarea>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={loading}
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

export default UserProfile;
