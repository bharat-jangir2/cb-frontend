import api from "./api";
import type { Team } from "../types/teams";

export const teamsApi = {
  // Get all teams
  getTeams: (filters?: any): Promise<Team[]> =>
    api.get("/teams", { params: filters }).then((res) => res.data),

  // Get team by ID
  getTeam: (id: string): Promise<Team> =>
    api.get(`/teams/${id}`).then((res) => res.data),

  // Create team
  createTeam: (data: Partial<Team>): Promise<Team> =>
    api.post("/teams", data).then((res) => res.data),

  // Update team
  updateTeam: (id: string, data: Partial<Team>): Promise<Team> =>
    api.patch(`/teams/${id}`, data).then((res) => res.data),

  // Delete team
  deleteTeam: (id: string): Promise<void> =>
    api.delete(`/teams/${id}`).then((res) => res.data),
}; 