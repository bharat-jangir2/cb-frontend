import React from "react";
import { useAuthStore } from "../stores/authStore";
import { jwtUtils } from "../utils/jwt";
import { authApi } from "../services/auth";

const DebugAuth: React.FC = () => {
  const { isAuthenticated, user, token, refreshToken, isLoading } =
    useAuthStore();

  const checkLocalStorage = () => {
    const localToken = localStorage.getItem("token");
    const localRefreshToken = localStorage.getItem("refreshToken");
    console.log("🔍 DebugAuth - localStorage check:", {
      localToken: localToken ? "EXISTS" : "NOT FOUND",
      localRefreshToken: localRefreshToken ? "EXISTS" : "NOT FOUND",
    });

    if (localToken) {
      console.log("🔍 DebugAuth - JWT Token Analysis:");
      jwtUtils.debugToken(localToken);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    useAuthStore.setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
    console.log("🧹 DebugAuth - Auth cleared");
  };

  const resetLoading = () => {
    useAuthStore.setState({
      isLoading: false,
      isAuthenticated: false,
    });
    console.log("🔄 DebugAuth - Loading state reset");
  };

  const forceRehydrate = () => {
    // Force a rehydration by clearing and re-adding the store
    localStorage.removeItem("auth-storage");
    window.location.reload();
  };

  const testJWT = () => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      console.log("🔍 Testing JWT token...");
      jwtUtils.debugToken(localToken);
    } else {
      console.log("❌ No JWT token found in localStorage");
    }
  };

  const testLogin = async () => {
    console.log("🧪 Testing login with debug credentials...");
    try {
      // Test with sample credentials (you can modify these)
      const testCredentials = {
        email: "admin@example.com",
        password: "password123",
      };

      console.log("📡 Testing login API call...");
      const response = await authApi.login(testCredentials);
      console.log("✅ Test login successful:", response);

      // Don't actually set the auth state, just test the API
      console.log("🔍 Test login response structure:", {
        hasUser: !!response.user,
        hasAccessToken: !!response.accessToken,
        hasRefreshToken: !!response.refreshToken,
        userKeys: response.user ? Object.keys(response.user) : null,
        responseKeys: Object.keys(response),
      });
    } catch (error: any) {
      console.error("❌ Test login failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
  };

  const debugStateReset = () => {
    console.log("🔍 DebugAuth - Current state analysis:");
    console.log("🔍 State:", {
      isAuthenticated,
      isLoading,
      user: user
        ? { id: user.id, username: user.username, role: user.role }
        : null,
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
    });

    // Check localStorage
    const localToken = localStorage.getItem("token");
    const localRefreshToken = localStorage.getItem("refreshToken");
    const localAuthStorage = localStorage.getItem("auth-storage");

    console.log("🔍 localStorage analysis:", {
      hasLocalToken: !!localToken,
      hasLocalRefreshToken: !!localRefreshToken,
      hasLocalAuthStorage: !!localAuthStorage,
      authStorageContent: localAuthStorage
        ? JSON.parse(localAuthStorage)
        : null,
    });

    // Check if there's a mismatch
    if (token !== localToken) {
      console.warn("⚠️ Token mismatch between state and localStorage!");
    }
    if (refreshToken !== localRefreshToken) {
      console.warn("⚠️ Refresh token mismatch between state and localStorage!");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-sm mb-2">🔍 Auth Debug</h3>
      <div className="text-xs space-y-1">
        <div>Authenticated: {isAuthenticated ? "✅" : "❌"}</div>
        <div>Loading: {isLoading ? "⏳" : "✅"}</div>
        <div>User: {user ? user.username : "None"}</div>
        <div>Role: {user?.role || "None"}</div>
        <div>Token: {token ? "✅" : "❌"}</div>
        <div>Refresh: {refreshToken ? "✅" : "❌"}</div>
        {token && (
          <div>
            JWT: {jwtUtils.isTokenExpired(token) ? "❌ EXPIRED" : "✅ VALID"}
          </div>
        )}
      </div>
      <div className="mt-2 space-x-2">
        <button
          onClick={checkLocalStorage}
          className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
        >
          Check Storage
        </button>
        <button
          onClick={clearAuth}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
        >
          Clear Auth
        </button>
        <button
          onClick={resetLoading}
          className="px-2 py-1 bg-yellow-500 text-white text-xs rounded"
        >
          Reset Loading
        </button>
        <button
          onClick={forceRehydrate}
          className="px-2 py-1 bg-purple-500 text-white text-xs rounded"
        >
          Force Rehydrate
        </button>
        <button
          onClick={testJWT}
          className="px-2 py-1 bg-green-500 text-white text-xs rounded"
        >
          Test JWT
        </button>
        <button
          onClick={testLogin}
          className="px-2 py-1 bg-orange-500 text-white text-xs rounded"
        >
          Test Login
        </button>
        <button
          onClick={debugStateReset}
          className="px-2 py-1 bg-pink-500 text-white text-xs rounded"
        >
          Debug Reset
        </button>
      </div>
    </div>
  );
};

export default DebugAuth;
