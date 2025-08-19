import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../services/auth";
import { jwtUtils } from "../utils/jwt";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthState,
} from "../types/auth";

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        console.log("🔐 AuthStore.login called with credentials:", {
          email: credentials.email,
          password: "***",
        });

        set({ isLoading: true });
        try {
          console.log("📡 Calling authApi.login...");
          const response = await authApi.login(credentials);
          console.log("✅ AuthStore.login successful:", {
            user: response.user,
            hasAccessToken: !!response.accessToken,
            hasRefreshToken: !!response.refreshToken,
            responseKeys: Object.keys(response),
            userKeys: response.user ? Object.keys(response.user) : null,
          });

          // Store tokens in localStorage for API client
          localStorage.setItem("token", response.accessToken);
          localStorage.setItem("refreshToken", response.refreshToken);

          console.log("💾 Tokens stored in localStorage");

          // Debug the received JWT token
          console.log("🔍 Debugging received JWT token...");
          jwtUtils.debugToken(response.accessToken);

          // Debug the full response structure
          console.log(
            "🔍 Full login response:",
            JSON.stringify(response, null, 2)
          );

          // Set state and ensure it persists
          const newState = {
            user: response.user,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          };

          set(newState);

          // Force persistence to localStorage
          localStorage.setItem(
            "auth-storage",
            JSON.stringify({
              state: newState,
              version: 0,
            })
          );

          console.log("✅ Auth state updated successfully");
          console.log("💾 State persisted to localStorage");

          // Redirect based on role
          const role = response.user.role;
          console.log("🔄 AuthStore.login - Redirecting based on role:", role);

          // Use a small delay to ensure state is properly set before redirect
          setTimeout(() => {
            // Double-check that state is still valid before redirecting
            const currentState = get();
            console.log("🔄 Pre-redirect state check:", {
              isAuthenticated: currentState.isAuthenticated,
              hasUser: !!currentState.user,
              hasToken: !!currentState.token,
              role: currentState.user?.role,
            });

            if (role === "admin") {
              console.log("🔄 Redirecting to /admin");
              window.location.href = "/admin";
            } else if (role === "scorer") {
              console.log("🔄 Redirecting to /manage");
              window.location.href = "/manage";
            } else {
              console.log("🔄 Redirecting to /user");
              window.location.href = "/user";
            }
          }, 200); // Increased delay to ensure state persistence
        } catch (error) {
          console.error("❌ AuthStore.login failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        console.log("🔐 AuthStore.register called with data:", {
          username: data.username,
          email: data.email,
          password: "***",
        });

        set({ isLoading: true });
        try {
          console.log("📡 Calling authApi.register...");
          const response = await authApi.register(data);
          console.log("✅ AuthStore.register successful:", {
            user: response.user,
            hasAccessToken: !!response.accessToken,
            hasRefreshToken: !!response.refreshToken,
          });

          // Store tokens in localStorage for API client
          localStorage.setItem("token", response.accessToken);
          localStorage.setItem("refreshToken", response.refreshToken);

          set({
            user: response.user,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          // Redirect based on role
          const role = response.user.role;
          console.log(
            "🔄 AuthStore.register - Redirecting based on role:",
            role
          );
          if (role === "admin") {
            window.location.href = "/admin";
          } else if (role === "scorer") {
            window.location.href = "/manage";
          } else {
            window.location.href = "/user";
          }
        } catch (error) {
          console.error("❌ AuthStore.register failed:", error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        console.log("🔐 AuthStore.logout called");
        console.log("🔐 AuthStore.logout - Stack trace:", new Error().stack);

        // Call logout API
        authApi.logout().catch((error) => {
          console.error("❌ AuthStore.logout API call failed:", error);
        });

        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // Clear local state
        console.log("🧹 AuthStore.logout - Clearing local state");
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });

        // Redirect to login
        console.log("🔄 AuthStore.logout - Redirecting to login");
        window.location.href = "/login";
      },

      refreshUser: async () => {
        console.log("🔄 AuthStore.refreshUser called");
        try {
          const currentToken = get().token;
          const localToken = localStorage.getItem("token");

          console.log(
            "🔑 Current token in state:",
            currentToken ? "EXISTS" : "NULL"
          );
          console.log(
            "🔑 Current token in localStorage:",
            localToken ? "EXISTS" : "NULL"
          );

          // Ensure we have a token before making the request
          if (!currentToken && !localToken) {
            throw new Error("No authentication token available");
          }

          // If state token is null but localStorage has token, update state
          if (!currentToken && localToken) {
            console.log("🔄 Updating state token from localStorage");
            set({ token: localToken });
          }

          // Debug JWT token
          const tokenToUse = currentToken || localToken;
          if (tokenToUse) {
            console.log("🔍 Debugging JWT token...");
            jwtUtils.debugToken(tokenToUse);

            if (jwtUtils.isTokenExpired(tokenToUse)) {
              console.warn("⚠️ JWT token is expired!");
              throw new Error("JWT token is expired");
            }
          }

          console.log("📡 Making API call to /auth/me...");
          const response = await authApi.getCurrentUser();
          console.log("✅ AuthStore.refreshUser successful:", response);

          if (response && response.user) {
            set({ user: response.user });
            console.log("✅ User data set in state:", response.user);
          } else {
            console.warn("⚠️ Response doesn't contain user data:", response);
            throw new Error("Invalid user data received");
          }
        } catch (error: any) {
          console.error("❌ AuthStore.refreshUser failed:", error);
          console.error("❌ Error details:", {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
          });
          throw error;
        }
      },

      updateProfile: async (data: Partial<User>) => {
        console.log("📝 AuthStore.updateProfile called with data:", data);
        try {
          // For now, we'll just update the local state
          // TODO: Implement proper profile update API call
          console.log("✅ AuthStore.updateProfile - updating local state only");
          set((state) => ({
            user: state.user ? ({ ...state.user, ...data } as User) : null,
          }));
        } catch (error) {
          console.error("❌ AuthStore.updateProfile failed:", error);
          throw error;
        }
      },

      refreshAuthToken: async () => {
        console.log("🔄 AuthStore.refreshAuthToken called");
        const { refreshToken } = get();

        if (!refreshToken) {
          console.error(
            "❌ AuthStore.refreshAuthToken - No refresh token available"
          );
          throw new Error("No refresh token available");
        }

        try {
          const response = await authApi.refreshToken(refreshToken);
          console.log("✅ AuthStore.refreshAuthToken successful:", {
            hasAccessToken: !!response.accessToken,
            hasRefreshToken: !!response.refreshToken,
          });

          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch (error) {
          console.error("❌ AuthStore.refreshAuthToken failed:", error);
          // Clear auth state on refresh failure
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      initializeAuth: async () => {
        console.log("🔐 AuthStore.initializeAuth called");

        // Check if we already have valid state
        const currentState = get();
        console.log("🔐 AuthStore.initializeAuth - Current state:", {
          isLoading: currentState.isLoading,
          isAuthenticated: currentState.isAuthenticated,
          hasUser: !!currentState.user,
          hasToken: !!currentState.token,
        });

        // If we already have valid authentication state, don't reinitialize
        if (
          currentState.isAuthenticated &&
          currentState.user &&
          currentState.token
        ) {
          console.log(
            "✅ AuthStore.initializeAuth - Valid state already exists, skipping initialization"
          );
          set({ isLoading: false });
          return;
        }

        // Check for existing tokens in localStorage
        const token = localStorage.getItem("token");
        const refreshToken = localStorage.getItem("refreshToken");

        console.log("🔐 AuthStore.initializeAuth - localStorage check:", {
          hasToken: !!token,
          hasRefreshToken: !!refreshToken,
        });

        if (token && refreshToken) {
          console.log("🔑 Found existing tokens in localStorage");

          try {
            // Set the tokens in state first
            set({
              token,
              refreshToken,
              isAuthenticated: true,
              isLoading: true, // Set loading while fetching user data
            });

            console.log("🔑 Tokens set in state, fetching user data...");

            // Try to refresh the user data
            await get().refreshUser();

            console.log("✅ User data fetched successfully");
            set({ isLoading: false });
          } catch (error) {
            console.error("❌ Failed to refresh user data:", error);
            // Clear invalid tokens
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          console.log("🔑 No existing tokens found in localStorage");
          // Set loading to false when no tokens exist
          set({
            isLoading: false,
            isAuthenticated: false,
          });
          console.log("✅ AuthStore.initializeAuth - Set loading to false");
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("🔄 AuthStore - Rehydrating from storage");
        console.log("🔄 AuthStore - Rehydration state:", {
          hasUser: !!state?.user,
          hasToken: !!state?.token,
          isAuthenticated: state?.isAuthenticated,
          isLoading: state?.isLoading,
        });

        if (state) {
          // Ensure we don't lose authentication state during rehydration
          if (state.token && state.refreshToken && state.user) {
            console.log(
              "✅ AuthStore - Valid auth state found during rehydration"
            );
            state.isAuthenticated = true;
            state.isLoading = false;
          } else {
            console.log(
              "⚠️ AuthStore - Incomplete auth state during rehydration"
            );
            state.isAuthenticated = false;
            state.isLoading = false;
          }
          console.log("✅ AuthStore - Rehydration complete");
        }
      },
    }
  )
);
