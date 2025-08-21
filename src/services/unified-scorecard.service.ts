import axios from "axios";
import type {
  UnifiedScorecard,
  InningsScorecard,
  BattingScorecard,
  BowlingScorecard,
  FallOfWicket,
  DismissalInfo,
  PowerPlayInfo,
  CommentaryEntry,
  PartnershipSummary,
  Team,
  TossInfo,
  LiveScorecard,
} from "../types/scorecard";

class UnifiedScorecardService {
  private baseURL = "http://localhost:5000/api";

  // Get complete unified scorecard
  async getScorecard(matchId: string): Promise<UnifiedScorecard> {
    const response = await axios.get(`${this.baseURL}/scorecard/${matchId}`);
    return response.data;
  }

  // Get live scorecard with real-time updates
  async getLiveScorecard(matchId: string): Promise<LiveScorecard> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/live`
    );
    return response.data;
  }

  // Get specific innings scorecard
  async getInningsScorecard(
    matchId: string,
    inningsNumber: number
  ): Promise<InningsScorecard> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/innings/${inningsNumber}`
    );
    return response.data;
  }

  // Get player performance
  async getPlayerPerformance(
    matchId: string,
    playerId: string
  ): Promise<{
    batting: BattingScorecard;
    bowling: BowlingScorecard;
  }> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/player/${playerId}`
    );
    return response.data;
  }

  // Get batting stats for specific innings
  async getBattingStats(
    matchId: string,
    inningsNumber: number
  ): Promise<BattingScorecard[]> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/innings/${inningsNumber}/batting`
    );
    return response.data;
  }

  // Get bowling stats for specific innings
  async getBowlingStats(
    matchId: string,
    inningsNumber: number
  ): Promise<BowlingScorecard[]> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/innings/${inningsNumber}/bowling`
    );
    return response.data;
  }

  // Get fall of wickets for specific innings
  async getFallOfWickets(
    matchId: string,
    inningsNumber: number
  ): Promise<FallOfWicket[]> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/innings/${inningsNumber}/fall-of-wickets`
    );
    return response.data;
  }

  // Get commentary
  async getCommentary(
    matchId: string,
    params?: {
      innings?: number;
      over?: number;
      limit?: number;
    }
  ): Promise<CommentaryEntry[]> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/commentary`,
      { params }
    );
    return response.data;
  }

  // Get partnerships
  async getPartnerships(
    matchId: string,
    inningsNumber?: number
  ): Promise<PartnershipSummary[]> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/partnerships`,
      {
        params: { innings: inningsNumber },
      }
    );
    return response.data;
  }

  // Force refresh scorecard data (Admin/Scorer only)
  async refreshScorecard(matchId: string): Promise<UnifiedScorecard> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/refresh`
    );
    return response.data;
  }

  // Get power play information
  async getPowerPlays(
    matchId: string,
    inningsNumber: number
  ): Promise<PowerPlayInfo[]> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/innings/${inningsNumber}/power-plays`
    );
    return response.data;
  }

  // Get match summary
  async getMatchSummary(
    matchId: string
  ): Promise<UnifiedScorecard["matchSummary"]> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/summary`
    );
    return response.data;
  }

  // Get team comparison
  async getTeamComparison(matchId: string): Promise<{
    teamA: {
      totalRuns: number;
      totalWickets: number;
      totalOvers: number;
      runRate: number;
      boundaries: number;
      sixes: number;
    };
    teamB: {
      totalRuns: number;
      totalWickets: number;
      totalOvers: number;
      runRate: number;
      boundaries: number;
      sixes: number;
    };
  }> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/team-comparison`
    );
    return response.data;
  }

  // Get match highlights
  async getMatchHighlights(matchId: string): Promise<{
    highestScore: BattingScorecard;
    bestBowling: BowlingScorecard;
    bestPartnership: PartnershipSummary;
    fastestFifty?: BattingScorecard;
    fastestHundred?: BattingScorecard;
    mostSixes: BattingScorecard;
    mostFours: BattingScorecard;
  }> {
    const response = await axios.get(
      `${this.baseURL}/scorecard/${matchId}/highlights`
    );
    return response.data;
  }
}

export const unifiedScorecardService = new UnifiedScorecardService();
