import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Siren, Lock, Mail, User, Phone, MapPin, Heart, AlertCircle, ArrowRight } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "O+",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    role: "USER"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await register(formData);
      if (res.user.role === "ADMIN") navigate("/admin/dashboard");
      else if (res.user.role === "DRIVER") navigate("/driver/dashboard");
      else if (res.user.role === "HOSPITAL") navigate("/hospital/dashboard");
      else navigate("/user/dashboard");
    } catch (err) {
      setError(err.message || "Failed to register. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5 px-3">
      <div className="container" style={{ maxWidth: "720px" }}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="d-inline-flex p-2 rounded-3 bg-danger text-white mb-2">
              <Siren size={24} />
            </div>
            <h3 className="fw-bold text-dark mb-1">Create an Account</h3>
            <p className="text-muted small">Register for smart emergency dispatch and rapid medical response</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 small rounded-3 d-flex align-items-center gap-2 mb-3">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <User size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    className="form-control bg-light border-start-0"
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Mail size={16} className="text-muted" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-light border-start-0"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Lock size={16} className="text-muted" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control bg-light border-start-0"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Phone size={16} className="text-muted" />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control bg-light border-start-0"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
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

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Account Role</label>
                <select
                  name="role"
                  className="form-select bg-light"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="USER">Patient / General User</option>
                  <option value="DRIVER">Paramedic Ambulance Driver</option>
                  <option value="HOSPITAL">Hospital Emergency Staff</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold text-secondary">Home / Work Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <MapPin size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    name="address"
                    className="form-control bg-light border-start-0"
                    placeholder="Banjara Hills, Road No 12, Hyderabad"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  className="form-control bg-light"
                  placeholder="Relative / Spouse Name"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold text-secondary">Emergency Contact Phone</label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  className="form-control bg-light"
                  placeholder="+91 98765 00000"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 mt-3"
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status"></div>
              ) : (
                <>
                  Complete Registration <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-muted small mt-4 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-primary fw-semibold text-decoration-none">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
