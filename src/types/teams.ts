export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  country?: string;
  captain?: string;
  coach?: string;
  homeVenue?: string;
  founded?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Player {
  id: string;
  name: string;
  teamId?: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  battingStyle?: string;
  bowlingStyle?: string;
  photo?: string;
  dateOfBirth?: string;
  nationality?: string;
  height?: string;
  weight?: string;
  battingAverage?: number;
  bowlingAverage?: number;
  totalMatches?: number;
  totalRuns?: number;
  totalWickets?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatchPlayer {
  id: string;
  matchId: string;
  playerId: string;
  teamId: string;
  isPlaying: boolean;
  battingPosition?: number;
  bowlingPosition?: number;
  captain: boolean;
  viceCaptain: boolean;
  wicketKeeper: boolean;
  createdAt: string;
  updatedAt: string;
} 