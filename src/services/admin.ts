import { apiClient } from "./apiClient";

export interface AdminApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Team interfaces
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  homeVenue?: string;
  captain?: string;
  coach?: string;
  foundedYear?: number;
  description?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Player interfaces
export interface Player {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  role: "batsman" | "bowler" | "all-rounder" | "wicket-keeper";
  battingStyle?: "right-handed" | "left-handed";
  bowlingStyle?: "fast" | "medium" | "spin" | "leg-spin" | "off-spin";
  teamId?: string;
  team?: Team;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Match interfaces
export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  team1?: Team;
  team2?: Team;
  tournamentId?: string;
  tournament?: any;
  seriesId?: string;
  series?: any;
  venue: string;
  startTime: string;
  format: "T20" | "ODI" | "Test";
  status: "scheduled" | "live" | "completed" | "cancelled";
  result?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Tournament interfaces
export interface Tournament {
  id: string;
  name: string;
  format: "T20" | "ODI" | "Test";
  startDate: string;
  endDate: string;
  description?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// Series interfaces
export interface Series {
  id: string;
  name: string;
  type: "bilateral" | "triangular" | "quadrangular";
  startDate: string;
  endDate: string;
  description?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// User interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Enhanced Squad and Playing XI interfaces
export interface EnhancedPlayer {
  _id: string;
  fullName: string;
  shortName: string;
  role: "batsman" | "bowler" | "all_rounder" | "wicket_keeper";
  nationality: string;
  battingStyle?: string;
  bowlingStyle?: string;
  photoUrl?: string;
}

export interface EnhancedSquadData {
  teamA: EnhancedPlayer[];
  teamB: EnhancedPlayer[];
}

export interface SquadUpdateData {
  teamA: string[];
  teamB: string[];
}

export interface PlayingXIPlayer {
  _id: string;
  fullName: string;
  shortName: string;
  role: "batsman" | "bowler" | "all_rounder" | "wicket_keeper";
  nationality: string;
}

export interface EnhancedPlayingXIData {
  teamA: {
    players: PlayingXIPlayer[];
    captain: PlayingXIPlayer | null;
    viceCaptain: PlayingXIPlayer | null;
    battingOrder: PlayingXIPlayer[];
    wicketKeeper: PlayingXIPlayer | null;
  };
  teamB: {
    players: PlayingXIPlayer[];
    captain: PlayingXIPlayer | null;
    viceCaptain: PlayingXIPlayer | null;
    battingOrder: PlayingXIPlayer[];
    wicketKeeper: PlayingXIPlayer | null;
  };
}

export interface PlayingXIUpdateData {
  teamA?: {
    players: string[];
    captain: string;
    viceCaptain: string;
    battingOrder: string[];
    wicketKeeper: string;
  };
  teamB?: {
    players: string[];
    captain: string;
    viceCaptain: string;
    battingOrder: string[];
    wicketKeeper: string;
  };
}

export interface CaptainUpdateData {
  team: "A" | "B";
  captainId: string;
}

export interface ViceCaptainUpdateData {
  team: "A" | "B";
  viceCaptainId: string;
}

export interface BattingOrderUpdateData {
  team: "A" | "B";
  battingOrder: string[];
}

export interface WicketKeeperUpdateData {
  team: "A" | "B";
  wicketKeeperId: string;
}

// Admin API class
class AdminApi {
  // Teams
  async getTeams(
    params: { page?: number; limit?: number; search?: string } = {}
  ) {
    console.log("AdminApi.getTeams called with params:", params);
    const response = await apiClient.get<any>("/teams", { params });
    console.log("AdminApi.getTeams response:", response.data);
    return response.data;
  }

  async getTeam(id: string) {
    console.log("AdminApi.getTeam called with id:", id);
    const response = await apiClient.get<AdminApiResponse<Team>>(
      `/teams/${id}`
    );
    console.log("AdminApi.getTeam response:", response.data);
    return response.data;
  }

  async createTeam(data: Partial<Team>) {
    console.log("AdminApi.createTeam called with data:", data);
    const response = await apiClient.post<AdminApiResponse<Team>>(
      "/teams",
      data
    );
    console.log("AdminApi.createTeam response:", response.data);
    return response.data;
  }

  async updateTeam(id: string, data: Partial<Team>) {
    console.log("AdminApi.updateTeam called with id:", id, "data:", data);
    const response = await apiClient.put<AdminApiResponse<Team>>(
      `/teams/${id}`,
      data
    );
    console.log("AdminApi.updateTeam response:", response.data);
    return response.data;
  }

  async deleteTeam(id: string) {
    console.log("AdminApi.deleteTeam called with id:", id);
    const response = await apiClient.delete<AdminApiResponse<void>>(
      `/teams/${id}`
    );
    console.log("AdminApi.deleteTeam response:", response.data);
    return response.data;
  }

  // Players
  async getPlayers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      teamId?: string;
    } = {}
  ) {
    console.log("AdminApi.getPlayers called with params:", params);
    const response = await apiClient.get<
      AdminApiResponse<PaginatedResponse<Player>>
    >("/players", { params });
    console.log("AdminApi.getPlayers response:", response.data);
    return response.data;
  }

  async getPlayer(id: string) {
    console.log("AdminApi.getPlayer called with id:", id);
    const response = await apiClient.get<AdminApiResponse<Player>>(
      `/players/${id}`
    );
    console.log("AdminApi.getPlayer response:", response.data);
    return response.data;
  }

  async createPlayer(data: Partial<Player>) {
    console.log("AdminApi.createPlayer called with data:", data);
    const response = await apiClient.post<AdminApiResponse<Player>>(
      "/players",
      data
    );
    console.log("AdminApi.createPlayer response:", response.data);
    return response.data;
  }

  async updatePlayer(id: string, data: Partial<Player>) {
    console.log("AdminApi.updatePlayer called with id:", id, "data:", data);
    const response = await apiClient.put<AdminApiResponse<Player>>(
      `/players/${id}`,
      data
    );
    console.log("AdminApi.updatePlayer response:", response.data);
    return response.data;
  }

  async deletePlayer(id: string) {
    console.log("AdminApi.deletePlayer called with id:", id);
    const response = await apiClient.delete<AdminApiResponse<void>>(
      `/players/${id}`
    );
    console.log("AdminApi.deletePlayer response:", response.data);
    return response.data;
  }

  // Matches
  async getMatches(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    } = {}
  ) {
    console.log("AdminApi.getMatches called with params:", params);
    const response = await apiClient.get<
      AdminApiResponse<PaginatedResponse<Match>>
    >("/matches", { params });
    console.log("AdminApi.getMatches response:", response.data);
    return response.data;
  }

  async getLiveMatches() {
    console.log("AdminApi.getLiveMatches called");
    const response = await apiClient.get<AdminApiResponse<Match[]>>(
      "/matches/live"
    );
    console.log("AdminApi.getLiveMatches response:", response.data);
    return response.data;
  }

  async getMatch(id: string) {
    console.log("AdminApi.getMatch called with id:", id);
    const response = await apiClient.get<AdminApiResponse<Match>>(
      `/matches/${id}`
    );
    console.log("AdminApi.getMatch response:", response.data);
    return response.data;
  }

  async createMatch(data: Partial<Match>) {
    console.log("AdminApi.createMatch called with data:", data);
    const response = await apiClient.post<AdminApiResponse<Match>>(
      "/matches",
      data
    );
    console.log("AdminApi.createMatch response:", response.data);
    return response.data;
  }

  async updateMatch(id: string, data: Partial<Match>) {
    console.log("AdminApi.updateMatch called with id:", id, "data:", data);
    const response = await apiClient.put<AdminApiResponse<Match>>(
      `/matches/${id}`,
      data
    );
    console.log("AdminApi.updateMatch response:", response.data);
    return response.data;
  }

  async updateMatchStatus(
    id: string,
    statusData: {
      status:
        | "scheduled"
        | "toss"
        | "in_progress"
        | "paused"
        | "completed"
        | "cancelled"
        | "abandoned";
      tossWinner?: string;
      tossDecision?: "bat" | "bowl";
      currentInnings?: number;
      currentOver?: number;
      currentBall?: number;
    }
  ) {
    console.log(
      "AdminApi.updateMatchStatus called with id:",
      id,
      "data:",
      statusData
    );
    const response = await apiClient.patch<AdminApiResponse<Match>>(
      `/matches/${id}/status`,
      statusData
    );
    console.log("AdminApi.updateMatchStatus response:", response.data);
    return response.data;
  }

  async updateMatchPowerPlay(
    id: string,
    powerPlayData: {
      teamA?: {
        powerPlayOvers: number;
        powerPlayStartOver: number;
        powerPlayEndOver: number;
      };
      teamB?: {
        powerPlayOvers: number;
        powerPlayStartOver: number;
        powerPlayEndOver: number;
      };
    }
  ) {
    console.log(
      "AdminApi.updateMatchPowerPlay called with id:",
      id,
      "data:",
      powerPlayData
    );
    const response = await apiClient.patch<AdminApiResponse<Match>>(
      `/matches/${id}/power-play`,
      powerPlayData
    );
    console.log("AdminApi.updateMatchPowerPlay response:", response.data);
    return response.data;
  }

  async deleteMatch(id: string) {
    console.log("AdminApi.deleteMatch called with id:", id);
    const response = await apiClient.delete<AdminApiResponse<void>>(
      `/matches/${id}`
    );
    console.log("AdminApi.deleteMatch response:", response.data);
    return response.data;
  }

  // Tournaments
  async getTournaments(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    } = {}
  ) {
    console.log("AdminApi.getTournaments called with params:", params);
    const response = await apiClient.get<
      AdminApiResponse<PaginatedResponse<Tournament>>
    >("/tournaments", { params });
    console.log("AdminApi.getTournaments response:", response.data);
    return response.data;
  }

  async getTournament(id: string) {
    console.log("AdminApi.getTournament called with id:", id);
    const response = await apiClient.get<AdminApiResponse<Tournament>>(
      `/tournaments/${id}`
    );
    console.log("AdminApi.getTournament response:", response.data);
    return response.data;
  }

  async createTournament(data: Partial<Tournament>) {
    console.log("AdminApi.createTournament called with data:", data);
    const response = await apiClient.post<AdminApiResponse<Tournament>>(
      "/tournaments",
      data
    );
    console.log("AdminApi.createTournament response:", response.data);
    return response.data;
  }

  async updateTournament(id: string, data: Partial<Tournament>) {
    console.log("AdminApi.updateTournament called with id:", id, "data:", data);
    const response = await apiClient.put<AdminApiResponse<Tournament>>(
      `/tournaments/${id}`,
      data
    );
    console.log("AdminApi.updateTournament response:", response.data);
    return response.data;
  }

  async deleteTournament(id: string) {
    console.log("AdminApi.deleteTournament called with id:", id);
    const response = await apiClient.delete<AdminApiResponse<void>>(
      `/tournaments/${id}`
    );
    console.log("AdminApi.deleteTournament response:", response.data);
    return response.data;
  }

  // Series
  async getSeries(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    } = {}
  ) {
    console.log("AdminApi.getSeries called with params:", params);
    const response = await apiClient.get<
      AdminApiResponse<PaginatedResponse<Series>>
    >("/series", { params });
    console.log("AdminApi.getSeries response:", response.data);
    return response.data;
  }

  async getSeriesById(id: string) {
    console.log("AdminApi.getSeriesById called with id:", id);
    const response = await apiClient.get<AdminApiResponse<Series>>(
      `/series/${id}`
    );
    console.log("AdminApi.getSeriesById response:", response.data);
    return response.data;
  }

  async createSeries(data: Partial<Series>) {
    console.log("AdminApi.createSeries called with data:", data);
    const response = await apiClient.post<AdminApiResponse<Series>>(
      "/series",
      data
    );
    console.log("AdminApi.createSeries response:", response.data);
    return response.data;
  }

  async updateSeries(id: string, data: Partial<Series>) {
    console.log("AdminApi.updateSeries called with id:", id, "data:", data);
    const response = await apiClient.put<AdminApiResponse<Series>>(
      `/series/${id}`,
      data
    );
    console.log("AdminApi.updateSeries response:", response.data);
    return response.data;
  }

  async deleteSeries(id: string) {
    console.log("AdminApi.deleteSeries called with id:", id);
    const response = await apiClient.delete<AdminApiResponse<void>>(
      `/series/${id}`
    );
    console.log("AdminApi.deleteSeries response:", response.data);
    return response.data;
  }

  // Users
  async getUsers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
    } = {}
  ) {
    console.log("AdminApi.getUsers called with params:", params);
    const response = await apiClient.get<
      AdminApiResponse<PaginatedResponse<User>>
    >("/users", { params });
    console.log("AdminApi.getUsers response:", response.data);
    return response.data;
  }

  async getUser(id: string) {
    console.log("AdminApi.getUser called with id:", id);
    const response = await apiClient.get<AdminApiResponse<User>>(
      `/users/${id}`
    );
    console.log("AdminApi.getUser response:", response.data);
    return response.data;
  }

  async createUser(data: Partial<User>) {
    console.log("AdminApi.createUser called with data:", data);
    const response = await apiClient.post<AdminApiResponse<User>>(
      "/users",
      data
    );
    console.log("AdminApi.createUser response:", response.data);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>) {
    console.log("AdminApi.updateUser called with id:", id, "data:", data);
    const response = await apiClient.put<AdminApiResponse<User>>(
      `/users/${id}`,
      data
    );
    console.log("AdminApi.updateUser response:", response.data);
    return response.data;
  }

  async deleteUser(id: string) {
    console.log("AdminApi.deleteUser called with id:", id);
    const response = await apiClient.delete<AdminApiResponse<void>>(
      `/users/${id}`
    );
    console.log("AdminApi.deleteUser response:", response.data);
    return response.data;
  }

  // Dashboard stats
  async getDashboardStats() {
    console.log("AdminApi.getDashboardStats called");
    const response = await apiClient.get<AdminApiResponse<any>>(
      "/dashboard/stats"
    );
    console.log("AdminApi.getDashboardStats response:", response.data);
    return response.data;
  }

  // Squad Management
  async getMatchSquad(matchId: string) {
    console.log("AdminApi.getMatchSquad called with matchId:", matchId);
    const response = await apiClient.get<AdminApiResponse<EnhancedSquadData>>(
      `/matches/${matchId}/squad`
    );
    console.log("AdminApi.getMatchSquad response:", response.data);
    return response.data;
  }

  async updateMatchSquad(matchId: string, data: SquadUpdateData) {
    console.log(
      "AdminApi.updateMatchSquad called with matchId:",
      matchId,
      "data:",
      data
    );
    const response = await apiClient.patch<AdminApiResponse<EnhancedSquadData>>(
      `/matches/${matchId}/squad`,
      data
    );
    console.log("AdminApi.updateMatchSquad response:", response.data);
    return response.data;
  }

  async getPlayingXI(matchId: string) {
    console.log("AdminApi.getPlayingXI called with matchId:", matchId);
    const response = await apiClient.get<
      AdminApiResponse<EnhancedPlayingXIData>
    >(`/matches/${matchId}/playing-xi`);
    console.log("AdminApi.getPlayingXI response:", response.data);
    return response.data;
  }

  async updatePlayingXI(matchId: string, data: PlayingXIUpdateData) {
    console.log(
      "AdminApi.updatePlayingXI called with matchId:",
      matchId,
      "data:",
      data
    );
    const response = await apiClient.patch<
      AdminApiResponse<EnhancedPlayingXIData>
    >(`/matches/${matchId}/playing-xi`, data);
    console.log("AdminApi.updatePlayingXI response:", response.data);
    return response.data;
  }

  // Enhanced Playing XI Management - Individual Component Updates
  async updateCaptain(matchId: string, data: CaptainUpdateData) {
    console.log(
      "AdminApi.updateCaptain called with matchId:",
      matchId,
      "data:",
      data
    );
    const response = await apiClient.patch<
      AdminApiResponse<EnhancedPlayingXIData>
    >(`/matches/${matchId}/captain`, data);
    console.log("AdminApi.updateCaptain response:", response.data);
    return response.data;
  }

  async updateViceCaptain(matchId: string, data: ViceCaptainUpdateData) {
    console.log(
      "AdminApi.updateViceCaptain called with matchId:",
      matchId,
      "data:",
      data
    );
    const response = await apiClient.patch<
      AdminApiResponse<EnhancedPlayingXIData>
    >(`/matches/${matchId}/vice-captain`, data);
    console.log("AdminApi.updateViceCaptain response:", response.data);
    return response.data;
  }

  async updateBattingOrder(matchId: string, data: BattingOrderUpdateData) {
    console.log(
      "AdminApi.updateBattingOrder called with matchId:",
      matchId,
      "data:",
      data
    );
    const response = await apiClient.patch<
      AdminApiResponse<EnhancedPlayingXIData>
    >(`/matches/${matchId}/batting-order`, data);
    console.log("AdminApi.updateBattingOrder response:", response.data);
    return response.data;
  }

  async updateWicketKeeper(matchId: string, data: WicketKeeperUpdateData) {
    console.log(
      "AdminApi.updateWicketKeeper called with matchId:",
      matchId,
      "data:",
      data
    );
    const response = await apiClient.patch<
      AdminApiResponse<EnhancedPlayingXIData>
    >(`/matches/${matchId}/wicket-keeper`, data);
    console.log("AdminApi.updateWicketKeeper response:", response.data);
    return response.data;
  }

  // Enhanced Squad Management - Team-specific endpoints
  async getSquadForTeam(matchId: string, team: "A" | "B") {
    console.log(
      "AdminApi.getSquadForTeam called with matchId:",
      matchId,
      "team:",
      team
    );
    const response = await apiClient.get<AdminApiResponse<EnhancedPlayer[]>>(
      `/matches/${matchId}/squad/team/${team}`
    );
    console.log("AdminApi.getSquadForTeam response:", response.data);
    return response.data;
  }

  async getAvailablePlayers(matchId: string, team: "A" | "B") {
    console.log(
      "AdminApi.getAvailablePlayers called with matchId:",
      matchId,
      "team:",
      team
    );
    const response = await apiClient.get<AdminApiResponse<EnhancedPlayer[]>>(
      `/matches/${matchId}/available-players/${team}`
    );
    console.log("AdminApi.getAvailablePlayers response:", response.data);
    return response.data;
  }

  // Players Management
  async getAllPlayers(limit: number = 1000) {
    console.log("AdminApi.getAllPlayers called with limit:", limit);
    const response = await apiClient.get<AdminApiResponse<Player[]>>(
      `/players?limit=${limit}`
    );
    console.log("AdminApi.getAllPlayers response:", response.data);
    return response.data;
  }

  async getPlayersByTeam(teamId: string) {
    console.log("AdminApi.getPlayersByTeam called with teamId:", teamId);
    const response = await apiClient.get<AdminApiResponse<Player[]>>(
      `/players/team/${teamId}`
    );
    console.log("AdminApi.getPlayersByTeam response:", response.data);
    return response.data;
  }

  async getPlayersByRole(role: string) {
    console.log("AdminApi.getPlayersByRole called with role:", role);
    const response = await apiClient.get<AdminApiResponse<Player[]>>(
      `/players/role/${role}`
    );
    console.log("AdminApi.getPlayersByRole response:", response.data);
    return response.data;
  }

  // Match Ball Updates
  async updateMatchBall(matchId: string, ballData: any) {
    console.log(
      "AdminApi.updateMatchBall called with matchId:",
      matchId,
      "ballData:",
      ballData
    );
    const response = await apiClient.post<AdminApiResponse<any>>(
      `/matches/${matchId}/ball`,
      ballData
    );
    console.log("AdminApi.updateMatchBall response:", response.data);
    return response.data;
  }

  // Match Commentary
  async updateMatchCommentary(matchId: string, commentary: string) {
    console.log(
      "AdminApi.updateMatchCommentary called with matchId:",
      matchId,
      "commentary:",
      commentary
    );
    const response = await apiClient.post<AdminApiResponse<any>>(
      `/matches/${matchId}/commentary`,
      { commentary }
    );
    console.log("AdminApi.updateMatchCommentary response:", response.data);
    return response.data;
  }

  // Match Odds
  async updateMatchOdds(matchId: string, oddsData: any) {
    console.log(
      "AdminApi.updateMatchOdds called with matchId:",
      matchId,
      "oddsData:",
      oddsData
    );
    const response = await apiClient.post<AdminApiResponse<any>>(
      `/matches/${matchId}/odds`,
      oddsData
    );
    console.log("AdminApi.updateMatchOdds response:", response.data);
    return response.data;
  }
}

export const adminApi = new AdminApi();
