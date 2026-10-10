import React, { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import MapComponent from "../../components/MapComponent";
import Toast from "../../components/Toast";
import { ambulanceService } from "../../services/ambulanceService";
import { initialDrivers } from "../../data/drivers";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Navigation, Radio, CheckCircle, Save } from "lucide-react";

const DriverLocation = () => {
  const { user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [ambulance, setAmbulance] = useState(null);
  const [coords, setCoords] = useState({ lat: 17.4375, lng: 78.4482 });
  const [locationName, setLocationName] = useState("Banjara Hills Rd No 2");
  const [showToast, setShowToast] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(true);

  useEffect(() => {
    const d = initialDrivers.find((item) => item.userId === user?.id || item.id === 1) || initialDrivers[0];
    setDriver(d);
    setCoords({ lat: d.currentLatitude, lng: d.currentLongitude });
    setLocationName(d.locationName || "Banjara Hills Rd No 2");

    const loadAmbulance = async () => {
      if (d.assignedAmbulanceId) {
        const amb = await ambulanceService.getAmbulanceById(d.assignedAmbulanceId);
        if (amb) setAmbulance(amb);
      }
    };
    loadAmbulance();
  }, [user]);

  const handleMapClick = (newCoords) => {
    setCoords(newCoords);
    setLocationName(`Custom GPS Ping (${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)})`);
  };

  const handlePresetSelect = (preset) => {
    setCoords({ lat: preset.lat, lng: preset.lng });
    setLocationName(preset.name);
  };

  const handleSaveLocation = async () => {
    try {
      if (ambulance?.id) {
        await ambulanceService.updateLocation(ambulance.id, coords.lat, coords.lng, locationName);
      }
      setShowToast(true);
    } catch (e) {
      console.error(e);
    }
  };

  const presets = [
    { name: "HITEC City Cyber Towers", lat: 17.4435, lng: 78.3772 },
    { name: "Banjara Hills Rd No 2", lat: 17.4375, lng: 78.4482 },
    { name: "Gachibowli Stadium Jn", lat: 17.4401, lng: 78.3489 },
    { name: "Jubilee Hills Checkpost", lat: 17.4325, lng: 78.4071 },
    { name: "Secunderabad Clock Tower", lat: 17.4399, lng: 78.4983 }
  ];

  return (
    <div>
      <PageHeader
        title="Vehicle GPS Telemetry Broadcast"
        subtitle={`Live position for Unit ${ambulance?.vehicleNumber || "TS-09-EA-1001"}`}
        action={
          <button
            onClick={() => setIsBroadcasting(!isBroadcasting)}
            className={`btn rounded-pill px-3 py-2 small fw-semibold d-flex align-items-center gap-2 ${
              isBroadcasting ? "btn-success" : "btn-secondary"
            }`}
          >
            <Radio size={16} /> {isBroadcasting ? "Transmitting (30s interval)" : "Transponder Paused"}
          </button>
        }
      />

      <Toast
        show={showToast}
        message="Vehicle GPS position updated across city network!"
        type="success"
        onClose={() => setShowToast(false)}
      />

      <div className="row g-4">
        {/* Map picker */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white mb-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="fw-bold text-dark mb-0">Click Anywhere on Map to Update Position</h6>
              <span className="badge bg-light text-secondary border small">Interactive Telemetry</span>
            </div>
            <p className="text-muted small mb-3">
              Tap a new point on the city map to simulate moving this ambulance vehicle
            </p>
            <MapComponent
              center={[coords.lat, coords.lng]}
              zoom={13}
              selectedLocation={coords}
              onLocationSelect={handleMapClick}
              height="450px"
            />
          </div>
        </div>

        {/* Form & Presets */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h6 className="fw-bold text-dark mb-3">Current Coordinates</h6>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Location Landmark</label>
              <input
                type="text"
                className="form-control bg-light"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-control bg-light"
                  value={coords.lat}
                  onChange={(e) => setCoords({ ...coords, lat: parseFloat(e.target.value) })}
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-control bg-light"
                  value={coords.lng}
                  onChange={(e) => setCoords({ ...coords, lng: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <button
              onClick={handleSaveLocation}
              className="btn btn-primary rounded-pill w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 py-2 mb-4"
            >
              <Save size={16} /> Broadcast New Coordinates
            </button>

            <h6 className="fw-bold text-dark mb-2">Quick City Hub Presets</h6>
            <div className="d-flex flex-column gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className="btn btn-light border text-start p-2 rounded-3 small d-flex align-items-center justify-content-between hover-bg"
                >
                  <span className="text-dark fw-medium">{p.name}</span>
                  <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                    {p.lat}, {p.lng}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverLocation;
