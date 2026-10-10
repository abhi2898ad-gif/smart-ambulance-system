import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 5000 // 5 seconds
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to unwrap Spring Boot's ApiResponse<T> wrapper
api.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data &&
      response.data.data !== undefined
    ) {
      const payload = response.data.data;
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        if (!("success" in payload)) payload.success = response.data.success;
        if (!("message" in payload)) payload.message = response.data.message;
      }
      response.data = payload;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.warn("Unauthorized API call or expired token");
    }
    return Promise.reject(error);
  }
);

export default api;
