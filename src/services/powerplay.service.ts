import type { CurrentPowerPlay, PowerPlay, PowerplayData, PowerplayUpdateData } from '../types/powerplay';
import { apiClient } from './apiClient';


const baseUrl = '/matches';

export const powerplayService = {
  // Create a new powerplay
  async createPowerPlay(matchId: string, powerPlayData: PowerplayData): Promise<PowerPlay> {
    const response = await apiClient.post(`${baseUrl}/${matchId}/power-play`, powerPlayData);
    return response.data;
  },

  // Update an existing powerplay
  async updatePowerPlay(
    matchId: string, 
    powerPlayIndex: number, 
    updateData: PowerplayUpdateData
  ): Promise<PowerPlay> {
    console.log(`🔧 Updating powerplay at index: ${powerPlayIndex} for match: ${matchId}`);
    console.log(`🔧 Update data:`, updateData);
    console.log(`🔧 URL: ${baseUrl}/${matchId}/power-play/${powerPlayIndex}`);
    
    try {
      const response = await apiClient.patch(
        `${baseUrl}/${matchId}/power-play/${powerPlayIndex}`, 
        updateData
      );
      console.log(`✅ Powerplay update successful:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Powerplay update failed:`, error);
      console.error(`❌ Error response:`, error.response?.data);
      throw error;
    }
  },

  // Get current powerplay state
  async getCurrentPowerPlay(matchId: string): Promise<CurrentPowerPlay> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/power-play`);
    return response.data;
  },

  // Get all powerplays for a match
  async getAllPowerplays(matchId: string): Promise<PowerPlay[]> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/power-plays`);
    return response.data;
  },

  // Get match with all powerplays
  async getMatchWithPowerplays(matchId: string): Promise<any> {
    const response = await apiClient.get(`${baseUrl}/${matchId}`);
    return response.data;
  },

  // Delete a powerplay
  async deletePowerPlay(matchId: string, powerPlayIndex: number): Promise<void> {
    await apiClient.delete(`${baseUrl}/${matchId}/power-play/${powerPlayIndex}`);
  },

  // Activate a powerplay manually
  async activatePowerPlay(matchId: string, powerPlayIndex: number): Promise<PowerPlay> {
    console.log(`🔧 Activating powerplay at index: ${powerPlayIndex} for match: ${matchId}`);
    try {
      return await this.updatePowerPlay(matchId, powerPlayIndex, {
        status: 'active' as any,
        isActive: true
      });
    } catch (error) {
      console.error(`❌ Failed to activate powerplay at index ${powerPlayIndex}:`, error);
      throw error;
    }
  },

  // Deactivate current powerplay
  async deactivatePowerPlay(matchId: string): Promise<PowerPlay> {
    console.log(`🔧 Deactivating powerplay for match: ${matchId}`);
    try {
      // Get all powerplays and find the active one
      const allPowerplays = await this.getAllPowerplays(matchId);
      console.log(`🔧 All powerplays:`, allPowerplays);
      
      const activePowerplayIndex = allPowerplays.findIndex(p => p.status === 'active' || p.isActive);
      console.log(`🔧 Active powerplay index: ${activePowerplayIndex}`);
      
      if (activePowerplayIndex >= 0) {
        return await this.updatePowerPlay(matchId, activePowerplayIndex, {
          status: 'completed' as any,
          isActive: false,
          completedAt: new Date().toISOString()
        });
      }
      throw new Error('No active powerplay to deactivate');
    } catch (error) {
      console.error(`❌ Failed to deactivate powerplay:`, error);
      throw error;
    }
  },

  // Get powerplay statistics
  async getPowerPlayStats(matchId: string, powerPlayIndex: number): Promise<PowerPlay['stats']> {
    const response = await apiClient.get(`${baseUrl}/${matchId}/power-play/${powerPlayIndex}/stats`);
    return response.data;
  }
};
