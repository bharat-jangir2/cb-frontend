import { apiClient } from './apiClient';
import type { BallUpdateData, BallUpdateResponse, CurrentBall } from '../types/ballUpdate';

export type { BallUpdateData, BallUpdateResponse, CurrentBall };

// Export the service class
export class BallUpdateService {
  async updateBall(matchId: string, updateData: BallUpdateData): Promise<BallUpdateResponse> {
    try {
      // Include matchId in the request body as well
      const requestData = {
        ...updateData,
        matchId
      };
      console.log('Sending ball update request:', {
        url: `/matches/${matchId}/ball/update`,
        data: requestData
      });
      const response = await apiClient.post(`/matches/${matchId}/ball/update`, requestData);
      console.log('Ball update response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Ball update failed:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Ball update failed');
    }
  }

  async getCurrentBall(matchId: string, inningsNumber: number): Promise<CurrentBall> {
    try {
      const response = await apiClient.get(`/matches/${matchId}/innings/${inningsNumber}/current-ball`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get current ball:', error);
      throw new Error(error.response?.data?.message || 'Failed to get current ball');
    }
  }

  async startBall(matchId: string, inningsNumber: number, overNumber: number, ballNumber: number, userId: string) {
    return this.updateBall(matchId, {
      updateType: 'start_ball',
      inningsNumber,
      overNumber,
      ballNumber,
      updatedBy: userId
    });
  }

  async markBallInAir(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    ballInAirData: BallUpdateData['ballInAirData'], 
    userId: string
  ) {
    return this.updateBall(matchId, {
      updateType: 'ball_in_air',
      inningsNumber,
      overNumber,
      ballNumber,
      ballInAirData,
      updatedBy: userId
    });
  }

  async recordRuns(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    runEventData: BallUpdateData['runEventData'], 
    userId: string, 
    notes: string = ''
  ) {
    return this.updateBall(matchId, {
      updateType: 'runs',
      inningsNumber,
      overNumber,
      ballNumber,
      runEventData,
      notes,
      updatedBy: userId
    });
  }

  async recordBoundary(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    runEventData: BallUpdateData['runEventData'], 
    userId: string, 
    notes: string = ''
  ) {
    return this.updateBall(matchId, {
      updateType: 'boundary',
      inningsNumber,
      overNumber,
      ballNumber,
      runEventData,
      notes,
      updatedBy: userId
    });
  }

  async recordWicket(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    wicketEventData: BallUpdateData['wicketEventData'], 
    userId: string, 
    notes: string = ''
  ) {
    return this.updateBall(matchId, {
      updateType: 'wicket',
      inningsNumber,
      overNumber,
      ballNumber,
      wicketEventData,
      notes,
      updatedBy: userId
    });
  }

  async recordExtra(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    extraEventData: BallUpdateData['extraEventData'], 
    userId: string, 
    notes: string = ''
  ) {
    return this.updateBall(matchId, {
      updateType: 'extra',
      inningsNumber,
      overNumber,
      ballNumber,
      extraEventData,
      notes,
      updatedBy: userId
    });
  }

  async completeBall(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    userId: string, 
    notes: string = ''
  ) {
    return this.updateBall(matchId, {
      updateType: 'complete_ball',
      inningsNumber,
      overNumber,
      ballNumber,
      notes,
      updatedBy: userId
    });
  }

  async cancelBall(
    matchId: string, 
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    userId: string, 
    notes: string = ''
  ) {
    return this.updateBall(matchId, {
      updateType: 'cancel_ball',
      inningsNumber,
      overNumber,
      ballNumber,
      notes,
      updatedBy: userId
    });
  }
}

// Export the service instance
export const ballUpdateService = new BallUpdateService();
