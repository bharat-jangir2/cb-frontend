import { apiClient } from "../apiClient";

export interface Match {
  _id: string;
  name: string;
  venue: string;
  startTime: string;
  status: string;
  teamAId: {
    _id: string;
    name: string;
    shortName: string;
  };
  teamBId: {
    _id: string;
    name: string;
    shortName: string;
  };
  tossWinner?: {
    _id: string;
    name: string;
    shortName: string;
  };
  tossDecision?: string;
  matchType: string;
  overs: number;
  currentInnings: number;
  currentOver: number;
  currentBall: number;
  score: {
    teamA: { runs: number; wickets: number; overs: number };
    teamB: { runs: number; wickets: number; overs: number };
  };
  powerPlay?: {
    teamA: {
      powerPlayOvers: number;
      powerPlayRuns: number;
      powerPlayWickets: number;
      powerPlayCompleted: boolean;
      powerPlayStartOver: number;
      powerPlayEndOver: number;
    };
    teamB: {
      powerPlayOvers: number;
      powerPlayRuns: number;
      powerPlayWickets: number;
      powerPlayCompleted: boolean;
      powerPlayStartOver: number;
      powerPlayEndOver: number;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Innings {
  _id: string;
  matchId: string;
  inningsNumber: number;
  battingTeam: {
    _id: string;
    name: string;
    shortName: string;
  };
  bowlingTeam: {
    _id: string;
    name: string;
    shortName: string;
  };
  runs: number;
  wickets: number;
  overs: number;
  runRate: number;
  requiredRunRate?: number;
  currentPowerPlay?: {
    isActive: boolean;
    startOver: number;
    endOver: number;
    runs: number;
    wickets: number;
  };
  currentPlayers?: {
    striker?: {
      _id: string;
      name: string;
      runs: number;
      balls: number;
    };
    nonStriker?: {
      _id: string;
      name: string;
      runs: number;
      balls: number;
    };
    bowler?: {
      _id: string;
      name: string;
      overs: number;
      wickets: number;
      runs: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface Ball {
  _id: string;
  matchId: string;
  inningsNumber: number;
  over: number;
  ball: number;
  eventType: "runs" | "wicket" | "extra" | "over_change";
  runs: number;
  striker?: {
    _id: string;
    name: string;
  };
  nonStriker?: {
    _id: string;
    name: string;
  };
  bowler?: {
    _id: string;
    name: string;
  };
  commentary?: string;
  isLive: boolean;
  createdAt: string;
}

export interface PlayerStats {
  _id: string;
  matchId: string;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  role: "batsman" | "bowler" | "all-rounder" | "wicket-keeper";
  battingStats?: {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    dismissalType?: string;
    dismissedBy?: string;
  };
  bowlingStats?: {
    overs: number;
    wickets: number;
    runs: number;
    economy: number;
    maidens: number;
  };
  fieldingStats?: {
    catches: number;
    stumpings: number;
    runOuts: number;
  };
}

export interface Partnership {
  _id: string;
  matchId: string;
  inningsNumber: number;
  player1: {
    _id: string;
    name: string;
    runs: number;
  };
  player2: {
    _id: string;
    name: string;
    runs: number;
  };
  partnershipRuns: number;
  partnershipBalls: number;
  partnershipType: "wicket" | "unbroken";
  wicketNumber: number;
}

export interface MatchEvent {
  _id: string;
  matchId: string;
  eventType: string;
  title: string;
  description: string;
  timestamp: string;
  over?: number;
  ball?: number;
  playerId?: string;
  playerName?: string;
  teamId?: string;
  teamName?: string;
  isHighlight: boolean;
  createdAt: string;
}

export class MatchesAPIService {
  private baseURL = import.meta.env.VITE_API_URL;

  // Basic Match Operations
  async getMatch(matchId: string) {
    console.log("MatchesAPIService.getMatch called with matchId:", matchId);
    const response = await apiClient.get(`/matches/${matchId}`);
    console.log("MatchesAPIService.getMatch response:", response.data);
    return response.data;
  }

  async getMatches(params = {}) {
    console.log("MatchesAPIService.getMatches called with params:", params);
    const response = await apiClient.get("/matches", { params });
    console.log("MatchesAPIService.getMatches response:", response.data);
    return response.data;
  }

  async getLiveMatches() {
    console.log("MatchesAPIService.getLiveMatches called");
    const response = await apiClient.get("/matches/live");
    console.log("MatchesAPIService.getLiveMatches response:", response.data);
    return response.data;
  }

  async createMatch(data: Partial<Match>) {
    console.log("MatchesAPIService.createMatch called with data:", data);
    const response = await apiClient.post("/matches", data);
    console.log("MatchesAPIService.createMatch response:", response.data);
    return response.data;
  }

  async updateMatch(matchId: string, data: Partial<Match>) {
    console.log(
      "MatchesAPIService.updateMatch called with matchId:",
      matchId,
      "data:",
      data
    );
    const response = await apiClient.put(`/matches/${matchId}`, data);
    console.log("MatchesAPIService.updateMatch response:", response.data);
    return response.data;
  }

  async updateMatchStatus(
    matchId: string,
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
      "MatchesAPIService.updateMatchStatus called with matchId:",
      matchId,
      "data:",
      statusData
    );
    const response = await apiClient.put(
      `/matches/${matchId}/status`,
      statusData
    );
    console.log("MatchesAPIService.updateMatchStatus response:", response.data);
    return response.data;
  }

  async deleteMatch(matchId: string) {
    console.log("MatchesAPIService.deleteMatch called with matchId:", matchId);
    const response = await apiClient.delete(`/matches/${matchId}`);
    console.log("MatchesAPIService.deleteMatch response:", response.data);
    return response.data;
  }

  // Innings Data
  async getInnings(matchId: string, inningsNumber?: number) {
    console.log(
      "MatchesAPIService.getInnings called with matchId:",
      matchId,
      "inningsNumber:",
      inningsNumber
    );
    const url = inningsNumber
      ? `/matches/${matchId}/innings/${inningsNumber}`
      : `/matches/${matchId}/innings`;
    const response = await apiClient.get(url);
    console.log("MatchesAPIService.getInnings response:", response.data);
    return response.data;
  }

  async updateInnings(
    matchId: string,
    inningsNumber: number,
    data: Partial<Innings>
  ) {
    console.log(
      "MatchesAPIService.updateInnings called with matchId:",
      matchId,
      "inningsNumber:",
      inningsNumber,
      "data:",
      data
    );
    const response = await apiClient.patch(
      `/matches/${matchId}/innings/${inningsNumber}`,
      data
    );
    console.log("MatchesAPIService.updateInnings response:", response.data);
    return response.data;
  }

  // Ball-by-Ball Data
  async getBalls(matchId: string, filters = {}) {
    console.log(
      "MatchesAPIService.getBalls called with matchId:",
      matchId,
      "filters:",
      filters
    );
    const response = await apiClient.get(`/matches/${matchId}/balls`, {
      params: filters,
    });
    console.log("MatchesAPIService.getBalls response:", response.data);
    return response.data;
  }

  async addBall(matchId: string, ballData: Partial<Ball>) {
    console.log(
      "MatchesAPIService.addBall called with matchId:",
      matchId,
      "ballData:",
      ballData
    );
    const response = await apiClient.post(
      `/matches/${matchId}/balls`,
      ballData
    );
    console.log("MatchesAPIService.addBall response:", response.data);
    return response.data;
  }

  async getLatestBalls(matchId: string, limit = 10) {
    console.log(
      "MatchesAPIService.getLatestBalls called with matchId:",
      matchId,
      "limit:",
      limit
    );
    const response = await apiClient.get(`/matches/${matchId}/balls/latest`, {
      params: { limit },
    });
    console.log("MatchesAPIService.getLatestBalls response:", response.data);
    return response.data;
  }

  // Player Statistics
  async getPlayerStats(matchId: string, playerId?: string) {
    console.log(
      "MatchesAPIService.getPlayerStats called with matchId:",
      matchId,
      "playerId:",
      playerId
    );
    const url = playerId
      ? `/matches/${matchId}/player-stats/${playerId}`
      : `/matches/${matchId}/player-stats`;
    const response = await apiClient.get(url);
    console.log("MatchesAPIService.getPlayerStats response:", response.data);
    return response.data;
  }

  // Partnerships
  async getPartnerships(matchId: string, innings?: number) {
    console.log(
      "MatchesAPIService.getPartnerships called with matchId:",
      matchId,
      "innings:",
      innings
    );
    const url = innings
      ? `/matches/${matchId}/partnerships/${innings}`
      : `/matches/${matchId}/partnerships`;
    const response = await apiClient.get(url);
    console.log("MatchesAPIService.getPartnerships response:", response.data);
    return response.data;
  }

  async getBestPartnerships(limit = 10) {
    console.log(
      "MatchesAPIService.getBestPartnerships called with limit:",
      limit
    );
    const response = await apiClient.get(`/partnerships/best`, {
      params: { limit },
    });
    console.log(
      "MatchesAPIService.getBestPartnerships response:",
      response.data
    );
    return response.data;
  }

  // Events & Timeline
  async getEvents(matchId: string, filters = {}) {
    console.log(
      "MatchesAPIService.getEvents called with matchId:",
      matchId,
      "filters:",
      filters
    );
    const response = await apiClient.get(`/matches/${matchId}/events`, {
      params: filters,
    });
    console.log("MatchesAPIService.getEvents response:", response.data);
    return response.data;
  }

  async getHighlights(matchId: string, filters = {}) {
    console.log(
      "MatchesAPIService.getHighlights called with matchId:",
      matchId,
      "filters:",
      filters
    );
    const response = await apiClient.get(`/matches/${matchId}/highlights`, {
      params: filters,
    });
    console.log("MatchesAPIService.getHighlights response:", response.data);
    return response.data;
  }

  async addEvent(matchId: string, eventData: Partial<MatchEvent>) {
    console.log(
      "MatchesAPIService.addEvent called with matchId:",
      matchId,
      "eventData:",
      eventData
    );
    const response = await apiClient.post(
      `/matches/${matchId}/events`,
      eventData
    );
    console.log("MatchesAPIService.addEvent response:", response.data);
    return response.data;
  }

  // DRS Reviews
  async getDRSReviews(matchId: string, filters = {}) {
    console.log(
      "MatchesAPIService.getDRSReviews called with matchId:",
      matchId,
      "filters:",
      filters
    );
    const response = await apiClient.get(`/matches/${matchId}/drs-reviews`, {
      params: filters,
    });
    console.log("MatchesAPIService.getDRSReviews response:", response.data);
    return response.data;
  }

  async addDRSReview(matchId: string, reviewData: any) {
    console.log(
      "MatchesAPIService.addDRSReview called with matchId:",
      matchId,
      "reviewData:",
      reviewData
    );
    const response = await apiClient.post(
      `/matches/${matchId}/drs-reviews`,
      reviewData
    );
    console.log("MatchesAPIService.addDRSReview response:", response.data);
    return response.data;
  }

  // Match Settings
  async getMatchSettings(matchId: string) {
    console.log(
      "MatchesAPIService.getMatchSettings called with matchId:",
      matchId
    );
    const response = await apiClient.get(`/matches/${matchId}/settings`);
    console.log("MatchesAPIService.getMatchSettings response:", response.data);
    return response.data;
  }

  async updateMatchSettings(matchId: string, settings: any) {
    console.log(
      "MatchesAPIService.updateMatchSettings called with matchId:",
      matchId,
      "settings:",
      settings
    );
    const response = await apiClient.patch(
      `/matches/${matchId}/settings`,
      settings
    );
    console.log(
      "MatchesAPIService.updateMatchSettings response:",
      response.data
    );
    return response.data;
  }

  // Live State
  async getLiveState(matchId: string) {
    console.log("MatchesAPIService.getLiveState called with matchId:", matchId);
    const response = await apiClient.get(`/matches/${matchId}/live-state`);
    console.log("MatchesAPIService.getLiveState response:", response.data);
    return response.data;
  }

  async updateLiveState(matchId: string, liveState: any) {
    console.log(
      "MatchesAPIService.updateLiveState called with matchId:",
      matchId,
      "liveState:",
      liveState
    );
    const response = await apiClient.patch(
      `/matches/${matchId}/live-state`,
      liveState
    );
    console.log("MatchesAPIService.updateLiveState response:", response.data);
    return response.data;
  }
}

export const matchesAPI = new MatchesAPIService();
