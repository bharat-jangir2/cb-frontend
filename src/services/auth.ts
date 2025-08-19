import api from "./api";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "../types/auth";

export const authApi = {
  // User login
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    api.post("/auth/login", credentials).then((res) => res.data),

  // User registration
  register: (data: RegisterData): Promise<AuthResponse> =>
    api.post("/auth/register", data).then((res) => res.data),

  // Refresh access token
  refreshToken: (refreshToken: string): Promise<AuthResponse> =>
    api.post("/auth/refresh", { refreshToken }).then((res) => res.data),

  // User logout
  logout: (): Promise<void> => api.post("/auth/logout").then((res) => res.data),

  // Forgot password
  forgotPassword: (email: string): Promise<void> =>
    api.post("/auth/forgot-password", { email }).then((res) => res.data),

  // Reset password
  resetPassword: (token: string, password: string): Promise<void> =>
    api
      .post("/auth/reset-password", { token, password })
      .then((res) => res.data),

  // Get current user
  getCurrentUser: (): Promise<any> =>
    api.get("/auth/me").then((res) => res.data),
};
