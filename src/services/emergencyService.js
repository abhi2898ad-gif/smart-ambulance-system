import api from "./api";
import { initialEmergencies } from "../data/emergencies";
import { initialAmbulances } from "../data/ambulances";
import { initialHospitals } from "../data/hospitals";
import { loadFromStorage, saveToStorage, calculateDistanceKm, calculateEtaMinutes } from "../utils/helpers";

const EMERGENCIES_STORAGE_KEY = "smart_ambulance_emergencies";
const AMBULANCES_STORAGE_KEY = "smart_ambulance_fleet";
const HOSPITALS_STORAGE_KEY = "smart_ambulance_hospitals";

export const emergencyService = {
  getEmergencies: async () => {
    try {
      const response = await api.get("/emergencies");
      if (response.data) return response.data;
    } catch (e) {
      // fallback
    }
    return loadFromStorage(EMERGENCIES_STORAGE_KEY, initialEmergencies);
  },

  getEmergencyById: async (id) => {
    try {
      const response = await api.get(`/emergencies/${id}`);
      if (response.data) return response.data;
    } catch (e) {
      // fallback
    }
    const emergencies = loadFromStorage(EMERGENCIES_STORAGE_KEY, initialEmergencies);
    return emergencies.find((e) => e.id === parseInt(id)) || null;
  },

  // AI-Assisted Emergency Dispatch Creation
  createEmergency: async (requestData) => {
    try {
      const payload = {
        emergencyType: requestData.emergencyType || "GENERAL",
        description: requestData.description || "Emergency assistance requested",
        severity: requestData.priority || requestData.severity || "HIGH",
        latitude: Number(requestData.pickupLatitude || requestData.latitude || 17.4375),
        longitude: Number(requestData.pickupLongitude || requestData.longitude || 78.4482),
        patientName: requestData.patientName,
        patientPhone: requestData.patientPhone,
        pickupAddress: requestData.pickupAddress,
        pickupLatitude: Number(requestData.pickupLatitude || requestData.latitude || 17.4375),
        pickupLongitude: Number(requestData.pickupLongitude || requestData.longitude || 78.4482)
      };
      const res = await api.post("/emergencies", payload);
      if (res.data) return res.data;
    } catch (e) {
      // fallback to intelligent mock triage
    }

    const emergencies = loadFromStorage(EMERGENCIES_STORAGE_KEY, initialEmergencies);
    const ambulances = loadFromStorage(AMBULANCES_STORAGE_KEY, initialAmbulances);
    const hospitals = loadFromStorage(HOSPITALS_STORAGE_KEY, initialHospitals);

    // AI Priority assessment logic
    let priority = requestData.priority;
    if (!priority) {
      const desc = (requestData.description + " " + requestData.emergencyType).toLowerCase();
      if (desc.includes("cardiac") || desc.includes("heart") || desc.includes("breath") || desc.includes("unconscious") || desc.includes("stroke")) {
        priority = "CRITICAL";
      } else if (desc.includes("accident") || desc.includes("fracture") || desc.includes("bleeding") || desc.includes("baby") || desc.includes("labor")) {
        priority = "HIGH";
      } else if (desc.includes("fever") || desc.includes("pain") || desc.includes("fall")) {
        priority = "MEDIUM";
      } else {
        priority = "LOW";
      }
    }

    const pickupLat = requestData.pickupLatitude || 17.4375;
    const pickupLng = requestData.pickupLongitude || 78.4482;

    // AI Nearest Ambulance selection
    const availableAmbulances = ambulances.filter((a) => a.status === "AVAILABLE");
    let chosenAmbulance = null;
    let minDistance = 9999;

    if (availableAmbulances.length > 0) {
      // Prioritize ICU for CRITICAL
      let preferredPool = availableAmbulances;
      if (priority === "CRITICAL") {
        const icuPool = availableAmbulances.filter((a) => a.ambulanceType === "ICU" || a.ambulanceType === "ADVANCED");
        if (icuPool.length > 0) preferredPool = icuPool;
      }

      preferredPool.forEach((amb) => {
        const dist = calculateDistanceKm(pickupLat, pickupLng, amb.latitude, amb.longitude);
        if (dist < minDistance) {
          minDistance = dist;
          chosenAmbulance = amb;
        }
      });
    }

    // Nearest Hospital selection with available beds
    let chosenHospital = hospitals.find((h) => h.status === "ACCEPTING") || hospitals[0];
    let hospitalDist = 9999;
    hospitals.forEach((h) => {
      if (h.status === "ACCEPTING" && h.availableBeds > 0) {
        const dist = calculateDistanceKm(pickupLat, pickupLng, h.latitude, h.longitude);
        if (dist < hospitalDist) {
          hospitalDist = dist;
          chosenHospital = h;
        }
      }
    });

    const eta = chosenAmbulance ? calculateEtaMinutes(minDistance) : 10;

    const newEmergency = {
      id: emergencies.length ? Math.max(...emergencies.map((e) => e.id)) + 1 : 1,
      userId: requestData.userId || 2,
      patientName: requestData.patientName,
      patientPhone: requestData.patientPhone,
      emergencyType: requestData.emergencyType,
      description: requestData.description,
      priority,
      status: chosenAmbulance ? "ASSIGNED" : "PENDING",
      pickupLatitude: pickupLat,
      pickupLongitude: pickupLng,
      pickupAddress: requestData.pickupAddress || "Selected Map Location, Hyderabad",
      destinationHospitalId: chosenHospital ? chosenHospital.id : 1,
      destinationHospitalName: chosenHospital ? chosenHospital.name : "Apollo Health City",
      assignedAmbulanceId: chosenAmbulance ? chosenAmbulance.id : null,
      vehicleNumber: chosenAmbulance ? chosenAmbulance.vehicleNumber : null,
      assignedDriverId: chosenAmbulance ? chosenAmbulance.assignedDriverId : null,
      driverName: chosenAmbulance ? chosenAmbulance.assignedDriverName : null,
      driverPhone: "+91 98765 43212",
      etaMinutes: eta,
      distanceKm: minDistance === 9999 ? 3.5 : minDistance,
      createdAt: new Date().toISOString(),
      aiTriaged: true,
      aiRecommendation: `AI triaged as ${priority}. ${chosenAmbulance ? `Assigned nearest unit ${chosenAmbulance.vehicleNumber} (${minDistance} km). Destination: ${chosenHospital.name}` : "Queued in high priority dispatch pool."}`
    };

    // Update the chosen ambulance status to DISPATCHED
    if (chosenAmbulance) {
      const updatedAmbulances = ambulances.map((a) =>
        a.id === chosenAmbulance.id ? { ...a, status: "DISPATCHED" } : a
      );
      saveToStorage(AMBULANCES_STORAGE_KEY, updatedAmbulances);
    }

    const updatedEmergencies = [newEmergency, ...emergencies];
    saveToStorage(EMERGENCIES_STORAGE_KEY, updatedEmergencies);
    return newEmergency;
  },

  updateStatus: async (id, status) => {
    try {
      await api.patch(`/emergencies/${id}/status`, { status });
    } catch (e) {
      // fallback
    }
    const emergencies = loadFromStorage(EMERGENCIES_STORAGE_KEY, initialEmergencies);
    const updated = emergencies.map((item) => {
      if (item.id === parseInt(id)) {
        const patch = { ...item, status };
        if (status === "COMPLETED") {
          patch.completedAt = new Date().toISOString();
          patch.etaMinutes = 0;
        }
        return patch;
      }
      return item;
    });
    saveToStorage(EMERGENCIES_STORAGE_KEY, updated);
    return updated.find((e) => e.id === parseInt(id));
  },

  assignAmbulance: async (emergencyId, ambulanceId, driverId) => {
    try {
      await api.post(`/emergencies/${emergencyId}/assign`, { ambulanceId: parseInt(ambulanceId) });
    } catch (e) {
      // fallback
    }
    const emergencies = loadFromStorage(EMERGENCIES_STORAGE_KEY, initialEmergencies);
    const ambulances = loadFromStorage(AMBULANCES_STORAGE_KEY, initialAmbulances);

    const ambulance = ambulances.find((a) => a.id === parseInt(ambulanceId));
    const updatedEmergencies = emergencies.map((em) => {
      if (em.id === parseInt(emergencyId)) {
        return {
          ...em,
          assignedAmbulanceId: parseInt(ambulanceId),
          vehicleNumber: ambulance ? ambulance.vehicleNumber : em.vehicleNumber,
          assignedDriverId: driverId || (ambulance ? ambulance.assignedDriverId : null),
          driverName: ambulance ? ambulance.assignedDriverName : em.driverName,
          status: "ASSIGNED",
          etaMinutes: 8
        };
      }
      return em;
    });

    if (ambulance) {
      const updatedFleet = ambulances.map((a) =>
        a.id === parseInt(ambulanceId) ? { ...a, status: "DISPATCHED" } : a
      );
      saveToStorage(AMBULANCES_STORAGE_KEY, updatedFleet);
    }

    saveToStorage(EMERGENCIES_STORAGE_KEY, updatedEmergencies);
    return updatedEmergencies.find((e) => e.id === parseInt(emergencyId));
  }
};
