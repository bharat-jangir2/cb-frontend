export enum InningsStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  PAUSED = "paused",
  COMPLETED = "completed",
  DECLARED = "declared"
}

export enum InningsResult {
  ALL_OUT = "all_out",
  TARGET_REACHED = "target_reached",
  OVERS_COMPLETED = "overs_completed",
  DECLARATION = "declaration"
}

export interface Player {
  _id: string;
  fullName: string;
  shortName: string;
}

export interface Team {
  _id: string;
  name: string;
  shortName: string;
}

export interface CurrentPlayers {
  striker: Player;
  nonStriker: Player;
  bowler: Player;
  lastUpdated: Date;
}

export interface PowerPlay {
  isActive: boolean;
  currentPowerPlayIndex: number;
  type?: string;
  startOver?: number;
  endOver?: number;
  maxFieldersOutside: number;
}

export interface Partnership {
  _id: string;
  player1: Player;
  player2: Player;
  runs: number;
  balls: number;
  startOver: number;
  endOver: number;
  duration: number; // in minutes
}

export interface PlayerMatchStats {
  _id: string;
  player: Player;
  battingStats: {
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
    dismissalType?: string;
    dismissalBowler?: Player;
  };
  bowlingStats: {
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    extras: number;
  };
}

export interface Innings {
  _id: string;
  matchId: string;
  inningsNumber: number; // 1 or 2
  battingTeam: Team;
  bowlingTeam: Team;
  
  // Score details
  runs: number;
  wickets: number;
  overs: number;
  extras: number;
  boundaries: number;
  sixes: number;
  runRate: number;
  requiredRunRate: number;
  
  // Innings status
  status: InningsStatus;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  
  // Current players on field
  currentPlayers: CurrentPlayers;
  
  // Innings result
  result: InningsResult;
  resultDescription: string;
  
  // DRS reviews
  drsReviewsUsed: number;
  drsReviewsRemaining: number;
  
  // Power play information
  currentPowerPlay: PowerPlay;
  powerPlays: any[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface InningsUpdateData {
  status?: InningsStatus;
  runs?: number;
  wickets?: number;
  overs?: number;
  extras?: number;
  boundaries?: number;
  sixes?: number;
  runRate?: number;
  requiredRunRate?: number;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  currentPlayers?: CurrentPlayers;
  result?: InningsResult;
  resultDescription?: string;
  drsReviewsUsed?: number;
  drsReviewsRemaining?: number;
}

export interface InningsState {
  innings: Innings[];
  currentInnings: Innings | null;
  currentInningsNumber: number;
  isLoading: boolean;
  error: string | null;
  partnerships: Partnership[];
  playerStats: PlayerMatchStats[];
}
