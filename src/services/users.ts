import api from "./api";
import type { User } from "../types/auth";

export const usersApi = {
  // Get all users (Admin/Scorer)
  getUsers: (filters?: any): Promise<User[]> =>
    api.get("/users", { params: filters }).then((res) => res.data),

  // Get user by ID
  getUser: (id: string): Promise<User> =>
    api.get(`/users/${id}`).then((res) => res.data),

  // Create user (Admin)
  createUser: (data: Partial<User>): Promise<User> =>
    api.post("/users", data).then((res) => res.data),

  // Update user (Admin)
  updateUser: (id: string, data: Partial<User>): Promise<User> =>
    api.patch(`/users/${id}`, data).then((res) => res.data),

  // Delete user (Admin)
  deleteUser: (id: string): Promise<void> =>
    api.delete(`/users/${id}`).then((res) => res.data),

  // Get current user profile
  getCurrentUser: (): Promise<User> =>
    api.get("/users/profile").then((res) => res.data),

  // Update current user profile
  updateProfile: (data: Partial<User>): Promise<User> =>
    api.patch("/users/profile", data).then((res) => res.data),

  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<void> =>
    api.post("/users/change-password", data).then((res) => res.data),
}; 