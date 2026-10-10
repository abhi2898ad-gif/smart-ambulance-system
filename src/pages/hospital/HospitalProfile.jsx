import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Toast from "../../components/Toast";
import { hospitalService } from "../../services/hospitalService";
import { Building2, Phone, BedDouble, Activity, Save } from "lucide-react";

const HospitalProfile = () => {
  const [hospital, setHospital] = useState(null);
  const [formData, setFormData] = useState({
    name: "Apollo Health City Jubilee Hills",
    address: "Road No 72, Film Nagar, Jubilee Hills, Hyderabad",
    contactNumber: "+91 40 2360 7777",
    emergencyUnitNumber: "+91 40 1066",
    totalBeds: 450,
    icuBeds: 90
  });

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const load = async () => {
      const list = await hospitalService.getHospitals();
      if (list && list.length > 0) {
        setHospital(list[0]);
        setFormData({
          name: list[0].name,
          address: list[0].address,
          contactNumber: list[0].contactNumber,
          emergencyUnitNumber: list[0].emergencyUnitNumber,
          totalBeds: list[0].totalBeds,
          icuBeds: list[0].icuBeds
        });
      }
    };
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
  };

  return (
    <div>
      <PageHeader
        title="Hospital Facility & Trauma Profile"
        subtitle="Emergency intake capacity and critical care parameters"
      />

      <Toast
        show={showToast}
        message="Hospital profile updated successfully."
        type="success"
        onClose={() => setShowToast(false)}
      />

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white mb-4">
            <div className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: 80, height: 80 }}>
              <Building2 size={36} />
            </div>
            <h5 className="fw-bold text-dark mb-1">{formData.name}</h5>
            <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-1 small mb-3">
              Level 1 Trauma Center
            </span>

            <div className="p-3 bg-light rounded-3 text-start small">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Total Bed Base:</span>
                <strong className="text-dark">{formData.totalBeds}</strong>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">ICU Bed Base:</span>
                <strong className="text-danger">{formData.icuBeds}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Emergency Desk:</span>
                <strong className="text-primary">{formData.emergencyUnitNumber}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-4">Edit Hospital Facility Parameters</h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Hospital Name</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-semibold text-secondary">Campus Address</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">General Reception Phone</label>
                  <input
                    type="tel"
                    className="form-control bg-light"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">24/7 Trauma Emergency Hotline</label>
                  <input
                    type="tel"
                    className="form-control bg-light"
                    value={formData.emergencyUnitNumber}
                    onChange={(e) => setFormData({ ...formData, emergencyUnitNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Total Inpatient Beds</label>
                  <input
                    type="number"
                    className="form-control bg-light"
                    value={formData.totalBeds}
                    onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold text-secondary">Dedicated ICU Beds</label>
                  <input
                    type="number"
                    className="form-control bg-light"
                    value={formData.icuBeds}
                    onChange={(e) => setFormData({ ...formData, icuBeds: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-2"
                >
                  <Save size={16} /> Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;
