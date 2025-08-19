export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  country?: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  battingStyle?: string;
  bowlingStyle?: string;
  photo?: string;
}

export interface Match {
  id: string;
  title: string;
  description?: string;
  team1: Team;
  team2: Team;
  venue: string;
  date: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  format: 't20' | 'odi' | 'test';
  tossWinner?: string;
  tossChoice?: 'bat' | 'bowl';
  result?: string;
  currentInnings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ball {
  id: string;
  matchId: string;
  over: number;
  ball: number;
  runs: number;
  extras?: number;
  extraType?: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
  wicket?: boolean;
  wicketType?: string;
  batsmanId: string;
  bowlerId: string;
  nonStrikerId?: string;
  commentary?: string;
  timestamp: string;
}

export interface Scorecard {
  teamId: string;
  innings: number;
  total: number;
  wickets: number;
  overs: number;
  runRate: number;
  players: PlayerScore[];
}

export interface PlayerScore {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalType?: string;
  bowlerId?: string;
  fielderId?: string;
}

export interface BowlingStats {
  playerId: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  extras: number;
}

export interface MatchState {
  matchId: string;
  currentInnings: number;
  currentOver: number;
  currentBall: number;
  team1Score: number;
  team1Wickets: number;
  team1Overs: number;
  team2Score: number;
  team2Wickets: number;
  team2Overs: number;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  lastBall?: Ball;
}
