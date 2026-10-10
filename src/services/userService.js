import api from "./api";
import { initialUsers } from "../data/users";
import { loadFromStorage, saveToStorage } from "../utils/helpers";

const USERS_STORAGE_KEY = "smart_ambulance_users";

export const userService = {
  getUsers: async () => {
    try {
      const response = await api.get("/users");
      if (response.data) return response.data;
    } catch (e) {
      // fallback
    }
    return loadFromStorage(USERS_STORAGE_KEY, initialUsers);
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      if (response.data) return response.data;
    } catch (e) {
      // fallback
    }
    const users = loadFromStorage(USERS_STORAGE_KEY, initialUsers);
    return users.find((u) => u.id === parseInt(id)) || null;
  },

  updateUser: async (id, data) => {
    try {
      const payload = {
        name: data.fullName || data.name,
        fullName: data.fullName || data.name,
        phone: data.phone,
        address: data.address
      };
      await api.put(`/users/${id}`, payload);
    } catch (e) {
      // fallback
    }
    const users = loadFromStorage(USERS_STORAGE_KEY, initialUsers);
    const updated = users.map((u) => (u.id === parseInt(id) ? { ...u, ...data } : u));
    saveToStorage(USERS_STORAGE_KEY, updated);

    // If current logged-in user, also update currentUser in localStorage
    const current = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (current && current.id === parseInt(id)) {
      localStorage.setItem("currentUser", JSON.stringify({ ...current, ...data }));
    }

    return updated.find((u) => u.id === parseInt(id));
  },

  toggleUserStatus: async (id) => {
    const users = loadFromStorage(USERS_STORAGE_KEY, initialUsers);
    const updated = users.map((u) => (u.id === parseInt(id) ? { ...u, active: !u.active } : u));
    saveToStorage(USERS_STORAGE_KEY, updated);
    return updated.find((u) => u.id === parseInt(id));
  },

  deleteUser: async (id) => {
    try {
      await api.delete(`/users/${id}`);
    } catch (e) {
      // fallback
    }
    const users = loadFromStorage(USERS_STORAGE_KEY, initialUsers);
    const updated = users.filter((u) => u.id !== parseInt(id));
    saveToStorage(USERS_STORAGE_KEY, updated);
    return true;
  }
};
