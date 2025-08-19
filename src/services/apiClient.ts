import axios from "axios";
import { useAuthStore } from "../stores/authStore";

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log("🚀 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
      params: config.params,
    });

    // Add auth token if available
    const token =
      useAuthStore.getState().token || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Auth token added to request");
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    console.error("❌ API Response Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message,
      isNetworkError: !error.response,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - clearing token and redirecting to login");
      console.log("🔒 401 Error URL:", error.config?.url);
      console.log("🔒 401 Error Method:", error.config?.method);

      // Only logout for non-auth endpoints to avoid logout during login
      const url = error.config?.url || "";
      if (!url.includes("/auth/login") && !url.includes("/auth/register")) {
        console.log("🔒 Calling logout for non-auth endpoint");
        useAuthStore.getState().logout();
      } else {
        console.log("🔒 Skipping logout for auth endpoint");
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
