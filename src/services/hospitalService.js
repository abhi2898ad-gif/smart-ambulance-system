import api from "./api";
import { initialHospitals } from "../data/hospitals";
import { loadFromStorage, saveToStorage } from "../utils/helpers";

const HOSPITALS_STORAGE_KEY = "smart_ambulance_hospitals";

export const hospitalService = {
  getHospitals: async () => {
    try {
      const response = await api.get("/hospitals");
      if (response.data) return response.data;
    } catch (e) {
      // fallback
    }
    return loadFromStorage(HOSPITALS_STORAGE_KEY, initialHospitals);
  },

  getHospitalById: async (id) => {
    try {
      const response = await api.get(`/hospitals/${id}`);
      if (response.data) return response.data;
    } catch (e) {
      // fallback
    }
    const list = loadFromStorage(HOSPITALS_STORAGE_KEY, initialHospitals);
    return list.find((h) => h.id === parseInt(id)) || null;
  },

  updateStatus: async (id, status) => {
    try {
      await api.patch(`/hospitals/${id}/status`, { status });
    } catch (e) {
      // fallback
    }
    const list = loadFromStorage(HOSPITALS_STORAGE_KEY, initialHospitals);
    const updated = list.map((h) => (h.id === parseInt(id) ? { ...h, status } : h));
    saveToStorage(HOSPITALS_STORAGE_KEY, updated);
    return updated.find((h) => h.id === parseInt(id));
  },

  updateBeds: async (id, availableBeds, availableIcuBeds) => {
    try {
      await api.patch(`/hospitals/${id}/beds`, { availableBeds, availableIcuBeds });
    } catch (e) {
      // fallback
    }
    const list = loadFromStorage(HOSPITALS_STORAGE_KEY, initialHospitals);
    const updated = list.map((h) => {
      if (h.id === parseInt(id)) {
        const occ = Math.round(((h.totalBeds - availableBeds) / h.totalBeds) * 1000) / 10;
        return {
          ...h,
          availableBeds: parseInt(availableBeds),
          availableIcuBeds: parseInt(availableIcuBeds),
          occupancyRate: occ
        };
      }
      return h;
    });
    saveToStorage(HOSPITALS_STORAGE_KEY, updated);
    return updated.find((h) => h.id === parseInt(id));
  },

  createHospital: async (data) => {
    try {
      const payload = {
        name: data.name,
        address: data.address || "Hyderabad, India",
        phone: data.phone || data.contactNumber || "+91 40 2300 0000",
        latitude: Number(data.latitude || 17.4325),
        longitude: Number(data.longitude || 78.4071),
        emergencyCapacity: Number(data.totalBeds || data.emergencyCapacity || 20),
        totalBeds: Number(data.totalBeds || data.emergencyCapacity || 20),
        status: data.status || "READY"
      };
      const res = await api.post("/hospitals", payload);
      if (res.data) return res.data;
    } catch (e) {
      // fallback
    }
    const list = loadFromStorage(HOSPITALS_STORAGE_KEY, initialHospitals);
    const newHospital = {
      id: list.length ? Math.max(...list.map((h) => h.id)) + 1 : 1,
      ...data,
      rating: 4.8,
      occupancyRate: Math.round(((data.totalBeds - data.availableBeds) / data.totalBeds) * 1000) / 10
    };
    const updated = [...list, newHospital];
    saveToStorage(HOSPITALS_STORAGE_KEY, updated);
    return newHospital;
  },

  deleteHospital: async (id) => {
    try {
      await api.delete(`/hospitals/${id}`);
    } catch (e) {
      // fallback
    }
    const list = loadFromStorage(HOSPITALS_STORAGE_KEY, initialHospitals);
    const updated = list.filter((h) => h.id !== parseInt(id));
    saveToStorage(HOSPITALS_STORAGE_KEY, updated);
    return true;
  }
};
