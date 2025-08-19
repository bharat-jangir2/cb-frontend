import api from "./api";
import type { Match, Ball, MatchState } from "../types/matches";

export const matchesApi = {
  // Get all matches
  getMatches: (filters?: any): Promise<Match[]> => {
    console.log("📡 matchesApi.getMatches called with filters:", filters);
    return api.get("/matches", { params: filters }).then((res) => {
      console.log("✅ matchesApi.getMatches response:", res.data);
      return res.data;
    });
  },

  // Get live matches
  getLiveMatches: (): Promise<Match[]> => {
    console.log("📡 matchesApi.getLiveMatches called");
    return api.get("/matches/live").then((res) => {
      console.log("✅ matchesApi.getLiveMatches response:", res.data);
      return res.data;
    });
  },

  // Get match by ID
  getMatch: (id: string): Promise<Match> => {
    console.log("📡 matchesApi.getMatch called with id:", id);
    return api.get(`/matches/${id}`).then((res) => {
      console.log("✅ matchesApi.getMatch response:", res.data);
      return res.data;
    });
  },

  // Create match
  createMatch: (data: Partial<Match>): Promise<Match> => {
    console.log("📡 matchesApi.createMatch called with data:", data);
    return api.post("/matches", data).then((res) => {
      console.log("✅ matchesApi.createMatch response:", res.data);
      return res.data;
    });
  },

  // Update match
  updateMatch: (id: string, data: Partial<Match>): Promise<Match> => {
    console.log("📡 matchesApi.updateMatch called with id:", id, "data:", data);
    return api.patch(`/matches/${id}`, data).then((res) => {
      console.log("✅ matchesApi.updateMatch response:", res.data);
      return res.data;
    });
  },

  // Delete match
  deleteMatch: (id: string): Promise<void> => {
    console.log("📡 matchesApi.deleteMatch called with id:", id);
    return api.delete(`/matches/${id}`).then((res) => {
      console.log("✅ matchesApi.deleteMatch response:", res.data);
      return res.data;
    });
  },

  // Update match status
  updateMatchStatus: (id: string, status: string): Promise<Match> => {
    console.log(
      "📡 matchesApi.updateMatchStatus called with id:",
      id,
      "status:",
      status
    );
    return api.patch(`/matches/${id}/status`, { status }).then((res) => {
      console.log("✅ matchesApi.updateMatchStatus response:", res.data);
      return res.data;
    });
  },

  // Get match state
  getMatchState: (id: string): Promise<MatchState> => {
    console.log("📡 matchesApi.getMatchState called with id:", id);
    return api.get(`/matches/${id}/state`).then((res) => {
      console.log("✅ matchesApi.getMatchState response:", res.data);
      return res.data;
    });
  },

  // Get match players
  getMatchPlayers: (id: string): Promise<any[]> => {
    console.log("📡 matchesApi.getMatchPlayers called with id:", id);
    return api.get(`/matches/${id}/players`).then((res) => {
      console.log("✅ matchesApi.getMatchPlayers response:", res.data);
      return res.data;
    });
  },

  // Add player to match
  addPlayerToMatch: (matchId: string, playerData: any): Promise<any> => {
    console.log(
      "📡 matchesApi.addPlayerToMatch called with matchId:",
      matchId,
      "playerData:",
      playerData
    );
    return api.post(`/matches/${matchId}/players`, playerData).then((res) => {
      console.log("✅ matchesApi.addPlayerToMatch response:", res.data);
      return res.data;
    });
  },

  // Remove player from match
  removePlayerFromMatch: (matchId: string, playerId: string): Promise<void> => {
    console.log(
      "📡 matchesApi.removePlayerFromMatch called with matchId:",
      matchId,
      "playerId:",
      playerId
    );
    return api.delete(`/matches/${matchId}/players/${playerId}`).then((res) => {
      console.log("✅ matchesApi.removePlayerFromMatch response:", res.data);
      return res.data;
    });
  },

  // Get match balls
  getMatchBalls: (matchId: string, filters?: any): Promise<Ball[]> => {
    console.log(
      "📡 matchesApi.getMatchBalls called with matchId:",
      matchId,
      "filters:",
      filters
    );
    return api
      .get(`/matches/${matchId}/balls`, { params: filters })
      .then((res) => {
        console.log("✅ matchesApi.getMatchBalls response:", res.data);
        return res.data;
      });
  },

  // Add ball to match
  addBall: (matchId: string, ballData: Partial<Ball>): Promise<Ball> => {
    console.log(
      "📡 matchesApi.addBall called with matchId:",
      matchId,
      "ballData:",
      ballData
    );
    return api.post(`/matches/${matchId}/balls`, ballData).then((res) => {
      console.log("✅ matchesApi.addBall response:", res.data);
      return res.data;
    });
  },

  // Undo last ball
  undoLastBall: (matchId: string): Promise<void> => {
    console.log("📡 matchesApi.undoLastBall called with matchId:", matchId);
    return api.post(`/matches/${matchId}/balls/undo`).then((res) => {
      console.log("✅ matchesApi.undoLastBall response:", res.data);
      return res.data;
    });
  },

  // Get match commentary
  getCommentary: (matchId: string): Promise<any[]> => {
    console.log("📡 matchesApi.getCommentary called with matchId:", matchId);
    return api.get(`/matches/${matchId}/commentary`).then((res) => {
      console.log("✅ matchesApi.getCommentary response:", res.data);
      return res.data;
    });
  },

  // Add commentary
  addCommentary: (matchId: string, data: any): Promise<any> => {
    console.log(
      "📡 matchesApi.addCommentary called with matchId:",
      matchId,
      "data:",
      data
    );
    return api.post(`/matches/${matchId}/commentary`, data).then((res) => {
      console.log("✅ matchesApi.addCommentary response:", res.data);
      return res.data;
    });
  },

  // Get match statistics
  getMatchStats: (matchId: string): Promise<any> => {
    console.log("📡 matchesApi.getMatchStats called with matchId:", matchId);
    return api.get(`/matches/${matchId}/stats`).then((res) => {
      console.log("✅ matchesApi.getMatchStats response:", res.data);
      return res.data;
    });
  },

  // Get match timeline
  getMatchTimeline: (matchId: string): Promise<any[]> => {
    console.log("📡 matchesApi.getMatchTimeline called with matchId:", matchId);
    return api.get(`/matches/${matchId}/timeline`).then((res) => {
      console.log("✅ matchesApi.getMatchTimeline response:", res.data);
      return res.data;
    });
  },
};
