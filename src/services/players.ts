import api from "./api";
import type { Player } from "../types/teams";

export const playersApi = {
  // Get all players
  getPlayers: (filters?: any): Promise<Player[]> =>
    api.get("/players", { params: filters }).then((res) => res.data),

  // Get player by ID
  getPlayer: (id: string): Promise<Player> =>
    api.get(`/players/${id}`).then((res) => res.data),

  // Create player
  createPlayer: (data: Partial<Player>): Promise<Player> =>
    api.post("/players", data).then((res) => res.data),

  // Update player
  updatePlayer: (id: string, data: Partial<Player>): Promise<Player> =>
    api.patch(`/players/${id}`, data).then((res) => res.data),

  // Delete player
  deletePlayer: (id: string): Promise<void> =>
    api.delete(`/players/${id}`).then((res) => res.data),

  // Get player stats
  getPlayerStats: (id: string): Promise<any> =>
    api.get(`/players/${id}/stats`).then((res) => res.data),
}; 