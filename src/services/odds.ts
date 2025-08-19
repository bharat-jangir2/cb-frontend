import api from "./api";
import type { Odds } from "../types/odds";

export const oddsApi = {
  // Get odds for match
  getMatchOdds: (matchId: string): Promise<Odds[]> =>
    api.get(`/matches/${matchId}/odds`).then((res) => res.data),

  // Get latest odds for match
  getLatestOdds: (matchId: string): Promise<Odds> =>
    api.get(`/matches/${matchId}/odds/latest`).then((res) => res.data),

  // Set odds for match
  setOdds: (matchId: string, data: Partial<Odds>): Promise<Odds> =>
    api.post(`/matches/${matchId}/odds`, data).then((res) => res.data),

  // Generate AI odds for match
  generateAIOdds: (matchId: string): Promise<Odds> =>
    api.post(`/matches/${matchId}/odds/ai`).then((res) => res.data),
}; 