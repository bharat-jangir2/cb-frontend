import { apiClient } from './apiClient';
import type { 
  BallUpdate, 
  BallInProgress, 
  BallConfirmation, 
  OverSummary,
  BallStatus,
  BallType,
  BallResult 
} from '../types/ball';

const baseUrl = '/matches';

export const ballService = {
  // Start a new ball (ball in air)
  async startBall(matchId: string, inningsNumber: number, overNumber: number, ballNumber: number): Promise<BallUpdate> {
    const response = await apiClient.post(`${baseUrl}/${matchId}/innings/${inningsNumber}/overs/${overNumber}/balls`, {
      ballNumber,
      status: BallStatus.IN_AIR,
      startTime: new Date().toISOString()
    });
    return response.data;
  },

  // Confirm ball result
  async confirmBall(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    confirmation: BallConfirmation
  ): Promise<BallUpdate> {
    const response = await apiClient.patch(
      `${baseUrl}/${matchId}/innings/${inningsNumber}/overs/${overNumber}/balls/${ballNumber}/confirm`,
      {
        ...confirmation,
        status: BallStatus.CONFIRMED,
        endTime: new Date().toISOString()
      }
    );
    return response.data;
  },

  // Complete ball processing
  async completeBall(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number
  ): Promise<BallUpdate> {
    const response = await apiClient.patch(
      `${baseUrl}/${matchId}/innings/${inningsNumber}/overs/${overNumber}/balls/${ballNumber}/complete`,
      {
        status: BallStatus.COMPLETED
      }
    );
    return response.data;
  },

  // Get current ball in progress
  async getCurrentBall(matchId: string, inningsNumber: number): Promise<BallInProgress | null> {
    try {
      const response = await apiClient.get(`${baseUrl}/${matchId}/innings/${inningsNumber}/current-ball`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No ball in progress
      }
      throw error;
    }
  },

  // Get ball history for an over
  async getOverBalls(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number
  ): Promise<BallUpdate[]> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/innings/${inningsNumber}/overs/${overNumber}/balls`);
    return response.data;
  },

  // Get over summary
  async getOverSummary(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number
  ): Promise<OverSummary> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/innings/${inningsNumber}/overs/${overNumber}/summary`);
    return response.data;
  },

  // Get all balls for an innings
  async getInningsBalls(matchId: string, inningsNumber: number): Promise<BallUpdate[]> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/innings/${inningsNumber}/balls`);
    return response.data;
  },

  // Update ball details (for editing)
  async updateBall(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    updates: Partial<BallUpdate>
  ): Promise<BallUpdate> {
    const response = await apiClient.patch(
      `${baseUrl}/${matchId}/innings/${inningsNumber}/overs/${overNumber}/balls/${ballNumber}`,
      updates
    );
    return response.data;
  },

  // Delete a ball (for corrections)
  async deleteBall(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number
  ): Promise<void> {
    await apiClient.delete(`${baseUrl}/${matchId}/innings/${inningsNumber}/overs/${overNumber}/balls/${ballNumber}`);
  },

  // Get ball statistics
  async getBallStats(matchId: string, inningsNumber: number): Promise<any> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/innings/${inningsNumber}/ball-stats`);
    return response.data;
  },

  // Undo last ball (for corrections)
  async undoLastBall(matchId: string, inningsNumber: number): Promise<BallUpdate> {
    const response = await apiClient.post(`${baseUrl}/${matchId}/innings/${inningsNumber}/undo-last-ball`);
    return response.data;
  },

  // Get live ball updates (WebSocket alternative)
  async getLiveBallUpdates(matchId: string, inningsNumber: number): Promise<BallUpdate[]> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/innings/${inningsNumber}/live-balls`);
    return response.data;
  },

  // Quick ball result (for fast scoring)
  async quickBallResult(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    result: BallResult,
    runsScored: number = 0
  ): Promise<BallUpdate> {
    return this.confirmBall(matchId, inningsNumber, overNumber, ballNumber, {
      ballId: `${matchId}-${inningsNumber}-${overNumber}-${ballNumber}`,
      result,
      runsScored,
      confirmedBy: 'scorer'
    });
  }
};
