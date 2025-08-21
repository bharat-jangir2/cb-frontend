import axios from "axios";

// Types
export interface Match {
  _id: string;
  name: string;
  venue: string;
  startTime: Date;
  status: "scheduled" | "in_progress" | "completed" | "abandoned";
  format: "T20" | "ODI" | "TEST";
  teamAId: Team;
  teamBId: Team;
  currentInnings?: number;
  currentOver?: number;
  currentBall?: number;
  toss?: TossInfo;
  pitchCondition?: string;
  weather?: string;
  matchType?: string;
  score?: {
    teamA?: {
      runs?: number;
      wickets?: number;
      overs?: number;
    };
    teamB?: {
      runs?: number;
      wickets?: number;
      overs?: number;
    };
  };
}

export interface Team {
  _id: string;
  name: string;
  shortName: string;
  country: string;
  logo?: string;
}

export interface TossInfo {
  winner: string;
  electedTo: string;
}

export interface Innings {
  _id: string;
  matchId: string;
  inningsNumber: number;
  battingTeam: Team;
  bowlingTeam: Team;
  runs: number;
  wickets: number;
  overs: number;
  extras: number;
  boundaries: number;
  sixes: number;
  runRate: number;
  requiredRunRate: number;
  status: "not_started" | "in_progress" | "completed" | "declared";
  startTime?: Date;
  endTime?: Date;
  currentPowerPlay?: PowerPlayInfo;
}

export interface PowerPlayInfo {
  isActive: boolean;
  startOver: number;
  endOver: number;
}

export interface Ball {
  _id: string;
  matchId: string;
  innings: number;
  over: number;
  ball: number;
  event: BallEvent;
  striker: Player;
  nonStriker: Player;
  bowler: Player;
  commentary?: string;
  reviewed?: boolean;
  reviewResult?: "upheld" | "struck_down" | "umpires_call";
  scoreState?: ScoreState;
  timestamp: Date;
}

export interface BallEvent {
  type: "runs" | "wicket" | "extra" | "over_change" | "innings_change";
  runs?: number;
  extras?: ExtraInfo;
  wicket?: WicketInfo;
  overChange?: OverChangeInfo;
  inningsChange?: InningsChangeInfo;
  description?: string;
}

export interface ExtraInfo {
  type: "wide" | "no_ball" | "bye" | "leg_bye";
  runs: number;
  description?: string;
}

export interface WicketInfo {
  type:
    | "bowled"
    | "caught"
    | "lbw"
    | "run_out"
    | "stumped"
    | "hit_wicket"
    | "obstructing"
    | "handled_ball"
    | "timed_out"
    | "retired_out";
  batsman: string;
  bowler?: string;
  caughtBy?: string;
  runOutBy?: string;
  stumpedBy?: string;
  description?: string;
}

export interface OverChangeInfo {
  newOver: number;
  newBowler: string;
}

export interface InningsChangeInfo {
  newInnings: number;
  newBattingTeam: string;
  newBowlingTeam: string;
}

export interface ScoreState {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
}

export interface Player {
  _id: string;
  fullName: string;
  shortName: string;
  role: "batsman" | "bowler" | "all_rounder" | "wicket_keeper";
  nationality: string;
  battingStyle?: string;
  bowlingStyle?: string;
  photoUrl?: string;
}

export interface PlayerMatchStats {
  _id: string;
  matchId: string;
  player: Player;
  team: Team;
  innings: number;
  battingRuns: number;
  battingBalls: number;
  battingFours: number;
  battingSixes: number;
  battingStrikeRate: number;
  battingDismissal?: DismissalInfo;
  bowlingOvers: number;
  bowlingBalls: number;
  bowlingRuns: number;
  bowlingWickets: number;
  bowlingMaidens: number;
  bowlingEconomy: number;
  bowlingAverage: number;
  bowlingStrikeRate: number;
}

export interface DismissalInfo {
  type: string;
  bowler?: string;
  caughtBy?: string;
  runOutBy?: string;
  stumpedBy?: string;
}

export interface Partnership {
  _id: string;
  matchId: string;
  innings: number;
  player1: Player;
  player2: Player;
  runs: number;
  balls: number;
  startOver: number;
  endOver: number;
  startBall: number;
  endBall: number;
  quality: "excellent" | "good" | "average" | "poor";
  keyMoments: string[];
  timestamp: Date;
}

export interface Commentary {
  _id: string;
  matchId: string;
  over: number;
  ball: number;
  innings: number;
  commentary: string;
  type: string;
  timestamp: Date;
}

class ScorecardService {
  private baseURL = "http://localhost:5000/api";

  // Get match with full scorecard data
  async getMatchScorecard(matchId: string): Promise<Match> {
    const response = await axios.get(`${this.baseURL}/matches/${matchId}`);
    return response.data;
  }

  // Get match state
  async getMatchState(matchId: string): Promise<any> {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/state`
    );
    return response.data;
  }

  // Update match status
  async updateMatchStatus(matchId: string, status: string): Promise<Match> {
    const response = await axios.patch(
      `${this.baseURL}/matches/${matchId}/status`,
      { status }
    );
    return response.data;
  }

  // Update match state
  async updateMatchState(matchId: string, state: any): Promise<any> {
    const response = await axios.patch(
      `${this.baseURL}/matches/${matchId}/state`,
      state
    );
    return response.data;
  }

  // Get innings data
  async getInnings(matchId: string): Promise<Innings[]> {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/innings`
    );
    return response.data;
  }

  // Get specific innings
  async getInningsByNumber(
    matchId: string,
    inningsNumber: number
  ): Promise<Innings> {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/innings/${inningsNumber}`
    );
    return response.data;
  }

  // Update innings data
  async updateInnings(
    matchId: string,
    inningsNumber: number,
    updates: Partial<Innings>
  ): Promise<Innings> {
    const response = await axios.patch(
      `${this.baseURL}/matches/${matchId}/innings/${inningsNumber}`,
      updates
    );
    return response.data;
  }

  // Get ball-by-ball data
  async getBalls(
    matchId: string,
    params?: {
      over?: number;
      innings?: number;
      limit?: number;
    }
  ): Promise<Ball[]> {
    const response = await axios.get(`${this.baseURL}/balls/match/${matchId}`, {
      params,
    });
    return response.data;
  }

  // Add new ball
  async addBall(ballData: Omit<Ball, "_id" | "timestamp">): Promise<Ball> {
    const response = await axios.post(`${this.baseURL}/balls`, ballData);
    return response.data;
  }

  // Update ball
  async updateBall(ballId: string, updates: Partial<Ball>): Promise<Ball> {
    const response = await axios.patch(
      `${this.baseURL}/balls/${ballId}`,
      updates
    );
    return response.data;
  }

  // Delete ball
  async deleteBall(ballId: string): Promise<void> {
    await axios.delete(`${this.baseURL}/balls/${ballId}`);
  }

  // Undo last ball
  async undoLastBall(matchId: string): Promise<Ball> {
    const response = await axios.post(`${this.baseURL}/balls/undo/${matchId}`);
    return response.data;
  }

  // Get player statistics
  async getPlayerStats(matchId: string): Promise<PlayerMatchStats[]> {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/player-stats`
    );
    return response.data;
  }

  // Get specific player stats
  async getPlayerStatsById(
    matchId: string,
    playerId: string
  ): Promise<PlayerMatchStats> {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/player-stats/${playerId}`
    );
    return response.data;
  }

  // Update player stats
  async updatePlayerStats(
    matchId: string,
    playerId: string,
    updates: Partial<PlayerMatchStats>
  ): Promise<PlayerMatchStats> {
    const response = await axios.patch(
      `${this.baseURL}/matches/${matchId}/player-stats/${playerId}`,
      updates
    );
    return response.data;
  }

  // Get partnerships
  async getPartnerships(matchId: string): Promise<Partnership[]> {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/partnerships`
    );
    return response.data;
  }

  // Get best partnerships
  async getBestPartnerships(limit: number = 10): Promise<Partnership[]> {
    const response = await axios.get(`${this.baseURL}/partnerships/best`, {
      params: { limit },
    });
    return response.data;
  }

  // Get player partnerships
  async getPlayerPartnerships(playerId: string): Promise<Partnership[]> {
    const response = await axios.get(
      `${this.baseURL}/partnerships/player/${playerId}`
    );
    return response.data;
  }

  // Get match commentary
  async getCommentary(
    matchId: string,
    params?: {
      over?: number;
      innings?: number;
    }
  ): Promise<Commentary[]> {
    const response = await axios.get(
      `${this.baseURL}/matches/${matchId}/commentary`,
      {
        params,
      }
    );
    return response.data;
  }

  // Add commentary
  async addCommentary(
    matchId: string,
    commentaryData: {
      over: number;
      ball: number;
      innings: number;
      commentary: string;
      type: string;
    }
  ): Promise<Commentary> {
    const response = await axios.post(
      `${this.baseURL}/matches/${matchId}/commentary`,
      commentaryData
    );
    return response.data;
  }
}

export const scorecardService = new ScorecardService();
