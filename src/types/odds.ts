export interface Odds {
  id: string;
  matchId: string;
  team1Odds: number;
  team2Odds: number;
  drawOdds?: number;
  source: 'manual' | 'ai';
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIAgent {
  id: string;
  matchId: string;
  status: 'running' | 'paused' | 'stopped';
  lastUpdate: string;
  config: {
    updateInterval: number;
    enabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AgentCommand {
  command: 'start' | 'stop' | 'pause' | 'resume';
  matchId: string;
} 