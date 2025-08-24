import { apiClient } from './apiClient';
import type { Innings, InningsUpdateData, Partnership } from '../types/innings';
import { InningsStatus, InningsResult } from '../types/innings';

const baseUrl = '/matches';

export const inningsService = {
  // Get all innings for a match
  async getAllInnings(matchId: string): Promise<Innings[]> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/innings`);
    return response.data;
  },

  // Get specific innings
  async getInnings(matchId: string, inningsNumber: number): Promise<Innings> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/innings/${inningsNumber}`);
    return response.data;
  },

  // Update innings
  async updateInnings(
    matchId: string, 
    inningsNumber: number, 
    updateData: InningsUpdateData
  ): Promise<Innings> {
    const response = await apiClient.patch(
      `${baseUrl}/${matchId}/innings/${inningsNumber}`, 
      updateData
    );
    return response.data;
  },

  // Start innings
  async startInnings(matchId: string, inningsNumber: number): Promise<Innings> {
    return this.updateInnings(matchId, inningsNumber, {
      status: InningsStatus.IN_PROGRESS,
      startTime: new Date().toISOString()
    });
  },

  // Pause innings
  async pauseInnings(matchId: string, inningsNumber: number): Promise<Innings> {
    return this.updateInnings(matchId, inningsNumber, {
      status: InningsStatus.PAUSED
    });
  },

  // Resume innings
  async resumeInnings(matchId: string, inningsNumber: number): Promise<Innings> {
    return this.updateInnings(matchId, inningsNumber, {
      status: InningsStatus.IN_PROGRESS
    });
  },

  // End innings
  async endInnings(
    matchId: string, 
    inningsNumber: number, 
    result: InningsResult,
    resultDescription?: string
  ): Promise<Innings> {
    return this.updateInnings(matchId, inningsNumber, {
      status: InningsStatus.COMPLETED,
      endTime: new Date().toISOString(),
      result,
      resultDescription
    });
  },

  // Declare innings
  async declareInnings(
    matchId: string, 
    inningsNumber: number, 
    resultDescription?: string
  ): Promise<Innings> {
    return this.updateInnings(matchId, inningsNumber, {
      status: InningsStatus.DECLARED,
      endTime: new Date().toISOString(),
      result: InningsResult.DECLARATION,
      resultDescription
    });
  },

  // Update current players
  async updateCurrentPlayers(
    matchId: string,
    inningsNumber: number,
    players: {
      striker: string;
      nonStriker: string;
      bowler: string;
    }
  ): Promise<Innings> {
    return this.updateInnings(matchId, inningsNumber, {
      currentPlayers: {
        ...players,
        lastUpdated: new Date().toISOString()
      }
    });
  },

  // Get partnerships by innings
  async getPartnershipsByInnings(matchId: string, innings: number): Promise<Partnership[]> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/partnerships/${innings}`);
    return response.data;
  },

  // Get player stats by innings
  async getPlayerStatsByInnings(matchId: string, innings: number): Promise<any[]> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/player-stats/${innings}`);
    return response.data;
  },

  // Create new innings
  async createInnings(matchId: string, inningsData: {
    inningsNumber: number;
    battingTeam: string; // Team ID
    bowlingTeam: string; // Team ID
    status?: InningsStatus;
  }): Promise<Innings> {
    const response = await apiClient.post(`${baseUrl}/${matchId}/innings`, inningsData);
    return response.data;
  },

  // Delete innings
  async deleteInnings(matchId: string, inningsNumber: number): Promise<void> {
    await apiClient.delete(`${baseUrl}/${matchId}/innings/${inningsNumber}`);
  },

  // Get innings statistics
  async getInningsStats(matchId: string, inningsNumber: number): Promise<any> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/innings/${inningsNumber}/stats`);
    return response.data;
  },

  // Update innings statistics
  async updateInningsStats(
    matchId: string, 
    inningsNumber: number, 
    stats: Partial<Innings>
  ): Promise<Innings> {
    const response = await apiClient.patch(
      `${baseUrl}/${matchId}/innings/${inningsNumber}/stats`, 
      stats
    );
    return response.data;
  }
};
