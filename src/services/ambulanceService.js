import api from "./api";
import { initialAmbulances } from "../data/ambulances";
import { loadFromStorage, saveToStorage } from "../utils/helpers";

const AMBULANCES_STORAGE_KEY = "smart_ambulance_fleet";

export const ambulanceService = {
  getAmbulances: async () => {
    try {
      const response = await api.get("/ambulances");
      if (response.data) return response.data;
    } catch (e) {
      // fallback
    }
    return loadFromStorage(AMBULANCES_STORAGE_KEY, initialAmbulances);
  },

  getAmbulanceById: async (id) => {
    try {
      const response = await api.get(`/ambulances/${id}`);
      if (response.data) return response.data;
    } catch (e) {
      // fallback
    }
    const fleet = loadFromStorage(AMBULANCES_STORAGE_KEY, initialAmbulances);
    return fleet.find((a) => a.id === parseInt(id)) || null;
  },

  updateStatus: async (id, status) => {
    try {
      await api.patch(`/ambulances/${id}/status`, { status });
    } catch (e) {
      // fallback
    }
    const fleet = loadFromStorage(AMBULANCES_STORAGE_KEY, initialAmbulances);
    const updated = fleet.map((a) => (a.id === parseInt(id) ? { ...a, status } : a));
    saveToStorage(AMBULANCES_STORAGE_KEY, updated);
    return updated.find((a) => a.id === parseInt(id));
  },

  updateLocation: async (id, latitude, longitude, locationName) => {
    try {
      await api.patch(`/ambulances/${id}/location`, { latitude, longitude });
    } catch (e) {
      // fallback
    }
    const fleet = loadFromStorage(AMBULANCES_STORAGE_KEY, initialAmbulances);
    const updated = fleet.map((a) =>
      a.id === parseInt(id) ? { ...a, latitude, longitude, locationName: locationName || a.locationName } : a
    );
    saveToStorage(AMBULANCES_STORAGE_KEY, updated);
    return updated.find((a) => a.id === parseInt(id));
  },

  createAmbulance: async (data) => {
    try {
      const payload = {
        ambulanceNumber: data.vehicleNumber || data.ambulanceNumber,
        vehicleNumber: data.vehicleNumber || data.ambulanceNumber,
        ambulanceType: data.ambulanceType || "BASIC",
        status: data.status || "AVAILABLE",
        latitude: Number(data.latitude || 17.4375),
        longitude: Number(data.longitude || 78.4482),
        driverId: data.driverId || data.assignedDriverId || null,
        hospitalId: data.hospitalId || data.baseHospitalId || null
      };
      const res = await api.post("/ambulances", payload);
      if (res.data) return res.data;
    } catch (e) {
      // fallback
    }
    const fleet = loadFromStorage(AMBULANCES_STORAGE_KEY, initialAmbulances);
    const newAmbulance = {
      id: fleet.length ? Math.max(...fleet.map((a) => a.id)) + 1 : 1,
      ...data,
      fuelLevel: data.fuelLevel || 100,
      equipment: data.equipment || ["Basic Stretcher", "First Aid Kit", "Oxygen Tank"]
    };
    const updated = [...fleet, newAmbulance];
    saveToStorage(AMBULANCES_STORAGE_KEY, updated);
    return newAmbulance;
  },

  deleteAmbulance: async (id) => {
    try {
      await api.delete(`/ambulances/${id}`);
    } catch (e) {
      // fallback
    }
    const fleet = loadFromStorage(AMBULANCES_STORAGE_KEY, initialAmbulances);
    const updated = fleet.filter((a) => a.id !== parseInt(id));
    saveToStorage(AMBULANCES_STORAGE_KEY, updated);
    return true;
  }
};
