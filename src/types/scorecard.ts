// Scorecard Types
export interface UnifiedScorecard {
  _id: string;
  matchId: string;
  matchSummary: {
    name: string;
    venue: string;
    startTime: Date;
    status: "scheduled" | "in_progress" | "completed" | "abandoned";
    format: "T20" | "ODI" | "TEST";
    matchType: string;
    teamA: Team;
    teamB: Team;
    toss?: TossInfo;
    pitchCondition?: string;
    weather?: string;
    result?: string;
  };
  innings: InningsScorecard[];
  commentary: CommentaryEntry[];
  partnerships: PartnershipSummary[];
  lastUpdateTime: Date;
  updatedAt: Date;
}

export interface InningsScorecard {
  inningNumber: number;
  teamId: string;
  teamName: string;
  runs: number;
  wickets: number;
  overs: number;
  extras: number;
  boundaries: number;
  sixes: number;
  runRate: number;
  requiredRunRate?: number;
  status: "not_started" | "in_progress" | "completed" | "declared";
  startTime?: Date;
  endTime?: Date;
  batting: BattingScorecard[];
  bowling: BowlingScorecard[];
  fallOfWickets: FallOfWicket[];
  powerPlays: PowerPlayInfo[];
  currentPowerPlay?: PowerPlayInfo;
}

export interface BattingScorecard {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissal?: DismissalInfo;
  battingOrder: number;
  partnershipRuns?: number;
  partnershipBalls?: number;
}

export interface BowlingScorecard {
  playerId: string;
  playerName: string;
  overs: number;
  balls: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  average: number;
  strikeRate: number;
  extras: number;
  boundaries: number;
  sixes: number;
}

export interface FallOfWicket {
  runs: number;
  wicket: number;
  playerId: string;
  playerName: string;
  dismissal: DismissalInfo;
  over: number;
  ball: number;
  partnership: number;
}

export interface DismissalInfo {
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
  bowler?: string;
  bowlerName?: string;
  caughtBy?: string;
  caughtByName?: string;
  runOutBy?: string;
  runOutByName?: string;
  stumpedBy?: string;
  stumpedByName?: string;
  description?: string;
}

export interface PowerPlayInfo {
  isActive: boolean;
  startOver: number;
  endOver: number;
  runs: number;
  wickets: number;
  overs: number;
}

export interface CommentaryEntry {
  ball: string; // e.g., "18.3"
  batsmanId: string;
  batsmanName: string;
  bowlerId: string;
  bowlerName: string;
  runs: number;
  event: string;
  comment: string;
  timestamp: Date;
  innings: number;
  over: number;
  ballNumber: number;
}

export interface PartnershipSummary {
  player1Id: string;
  player1Name: string;
  player2Id: string;
  player2Name: string;
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

// Live Scorecard for real-time updates
export interface LiveScorecard {
  matchId: string;
  currentInnings: number;
  currentOver: number;
  currentBall: number;
  teamAScore: {
    runs: number;
    wickets: number;
    overs: number;
  };
  teamBScore: {
    runs: number;
    wickets: number;
    overs: number;
  };
  currentBatsmen: {
    striker: {
      id: string;
      name: string;
      runs: number;
      balls: number;
    };
    nonStriker: {
      id: string;
      name: string;
      runs: number;
      balls: number;
    };
  };
  currentBowler: {
    id: string;
    name: string;
    overs: number;
    wickets: number;
    runs: number;
  };
  lastBall: {
    runs: number;
    event: string;
    comment: string;
  };
  requiredRunRate?: number;
  currentRunRate: number;
  remainingRuns?: number;
  remainingBalls?: number;
  matchStatus: string;
  lastUpdateTime: Date;
}
