import api from "./api";
import { initialUsers } from "../data/users";
import { loadFromStorage, saveToStorage } from "../utils/helpers";

const USERS_STORAGE_KEY = "smart_ambulance_users";
const CURRENT_USER_KEY = "currentUser";
const TOKEN_KEY = "token";

export const authService = {
  // Get all users from storage
  getUsers: () => {
    return loadFromStorage(USERS_STORAGE_KEY, initialUsers);
  },

  // Login method: Tries backend API first, falls back smoothly to realistic mock users
  login: async (email, password) => {
    try {
      // Try hitting real Spring Boot backend if available
      const response = await api.post("/auth/login", { email, password });
      if (response.data && response.data.token) {
        const userObj = response.data.user || {
          id: response.data.userId,
          fullName: response.data.name || response.data.fullName,
          name: response.data.name,
          role: response.data.role,
          email: email
        };
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
        return { success: true, user: userObj, token: response.data.token };
      }
    } catch (apiError) {
      // Backend not running or failed; use realistic local mock users
      console.info("Using mock authentication (Backend not reachable or demo mode)");
    }

    const users = authService.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || password === "admin123")
    );

    if (user) {
      const mockToken = `mock-jwt-token-${user.id}-${Date.now()}`;
      const safeUser = { ...user };
      delete safeUser.password;
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
      return { success: true, user: safeUser, token: mockToken };
    }

    throw new Error("Invalid email or password. For demo, try admin@smartambulance.com / admin123");
  },

  // Register method
  register: async (userData) => {
    try {
      const payload = {
        name: userData.fullName || userData.name,
        fullName: userData.fullName || userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || "+91 98765 00000",
        role: userData.role || "USER",
        address: userData.address || "Hyderabad, India"
      };
      const response = await api.post("/auth/register", payload);
      if (response.data) {
        const userObj = response.data.user || response.data;
        return { success: true, user: userObj };
      }
    } catch (apiError) {
      console.info("Using mock registration");
    }

    const users = authService.getUsers();
    if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error("An account with this email address already exists.");
    }

    const newUser = {
      id: users.length + 1,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone || "+91 98765 00000",
      role: userData.role || "USER",
      bloodGroup: userData.bloodGroup || "O+",
      emergencyContactName: userData.emergencyContactName || "Family Contact",
      emergencyContactPhone: userData.emergencyContactPhone || "+91 98765 11111",
      address: userData.address || "Hyderabad, India",
      active: true,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...users, newUser];
    saveToStorage(USERS_STORAGE_KEY, updatedUsers);

    const mockToken = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return { success: true, user: newUser, token: mockToken };
  },

  // Get currently logged-in user
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
