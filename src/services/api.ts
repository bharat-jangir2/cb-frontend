import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token =
      useAuthStore.getState().token || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("🔒 401 Error in main API service:", {
        url: originalRequest.url,
        method: originalRequest.method,
      });

      // Only attempt refresh for non-auth endpoints
      const url = originalRequest.url || "";
      if (!url.includes("/auth/login") && !url.includes("/auth/register")) {
        try {
          // Try to refresh the token
          await useAuthStore.getState().refreshAuthToken();

          // Retry the original request with new token
          const newToken = useAuthStore.getState().token;
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If refresh fails, logout user
          console.log("🔒 Token refresh failed, logging out");
          useAuthStore.getState().logout();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        console.log("🔒 Skipping token refresh for auth endpoint");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
