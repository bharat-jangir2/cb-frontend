import api from "./api";
import type { AIAgent, AgentCommand } from "../types/odds";

export const agentsApi = {
  // Get match agent
  getMatchAgent: (matchId: string): Promise<AIAgent> =>
    api.get(`/matches/${matchId}/agent`).then((res) => res.data),

  // Start agent
  startAgent: (matchId: string): Promise<AIAgent> =>
    api.post(`/matches/${matchId}/agent/start`).then((res) => res.data),

  // Stop agent
  stopAgent: (matchId: string): Promise<AIAgent> =>
    api.post(`/matches/${matchId}/agent/stop`).then((res) => res.data),

  // Pause agent
  pauseAgent: (matchId: string): Promise<AIAgent> =>
    api.post(`/matches/${matchId}/agent/pause`).then((res) => res.data),

  // Resume agent
  resumeAgent: (matchId: string): Promise<AIAgent> =>
    api.post(`/matches/${matchId}/agent/resume`).then((res) => res.data),

  // Execute command
  executeCommand: (matchId: string, command: string): Promise<any> =>
    api.post(`/matches/${matchId}/agent/command`, { command }).then((res) => res.data),

  // Get all agents
  getAllAgents: (): Promise<AIAgent[]> =>
    api.get("/agents").then((res) => res.data),

  // Execute global command
  executeGlobalCommand: (command: string): Promise<any> =>
    api.post("/agents/command", { command }).then((res) => res.data),
}; 