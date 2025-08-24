import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { powerplayService } from '../services/powerplay.service';
import type { CurrentPowerPlay, PowerPlay, PowerplayData, PowerplayUpdateData } from '../types/powerplay';
import { PowerPlayStatus } from '../types/powerplay';

export const usePowerplay = (matchId: string) => {
  const queryClient = useQueryClient();
  const [currentOver, setCurrentOver] = useState(0);

  // Query for current powerplay state
  const { data: currentPowerplay, isLoading: isLoadingCurrent } = useQuery({
    queryKey: ['powerplay', matchId, 'current'],
    queryFn: () => powerplayService.getCurrentPowerPlay(matchId),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  // Query for all powerplays
  const { data: powerplays = [], isLoading: isLoadingPowerplays } = useQuery({
    queryKey: ['powerplays', matchId],
    queryFn: () => powerplayService.getAllPowerplays(matchId),
  });

  // Query for match with all powerplays (for additional match data)
  const { data: matchWithPowerplays, isLoading: isLoadingMatch } = useQuery({
    queryKey: ['match', matchId, 'with-powerplays'],
    queryFn: () => powerplayService.getMatchWithPowerplays(matchId),
  });
  
  // Debug logging
  console.log('🔧 usePowerplay - matchWithPowerplays:', matchWithPowerplays);
  console.log('🔧 usePowerplay - powerplays:', powerplays);

  // Create powerplay mutation
  const createPowerplayMutation = useMutation({
    mutationFn: (data: PowerplayData) => powerplayService.createPowerPlay(matchId, data),
    onSuccess: () => {
      toast.success('Powerplay created successfully');
      queryClient.invalidateQueries({ queryKey: ['powerplays', matchId] });
      queryClient.invalidateQueries({ queryKey: ['powerplay', matchId, 'current'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create powerplay');
    },
  });

  // Update powerplay mutation
  const updatePowerplayMutation = useMutation({
    mutationFn: ({ index, data }: { index: number; data: PowerplayUpdateData }) =>
      powerplayService.updatePowerPlay(matchId, index, data),
    onSuccess: () => {
      toast.success('Powerplay updated successfully');
      queryClient.invalidateQueries({ queryKey: ['powerplays', matchId] });
      queryClient.invalidateQueries({ queryKey: ['powerplay', matchId, 'current'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update powerplay');
    },
  });

  // Delete powerplay mutation
  const deletePowerplayMutation = useMutation({
    mutationFn: (index: number) => powerplayService.deletePowerPlay(matchId, index),
    onSuccess: () => {
      toast.success('Powerplay deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['powerplays', matchId] });
      queryClient.invalidateQueries({ queryKey: ['powerplay', matchId, 'current'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete powerplay');
    },
  });

  // Activate powerplay mutation
  const activatePowerplayMutation = useMutation({
    mutationFn: (index: number) => powerplayService.activatePowerPlay(matchId, index),
    onSuccess: () => {
      toast.success('Powerplay activated');
      queryClient.invalidateQueries({ queryKey: ['powerplays', matchId] });
      queryClient.invalidateQueries({ queryKey: ['powerplay', matchId, 'current'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to activate powerplay');
    },
  });

  // Deactivate powerplay mutation
  const deactivatePowerplayMutation = useMutation({
    mutationFn: () => powerplayService.deactivatePowerPlay(matchId),
    onSuccess: () => {
      toast.success('Powerplay deactivated');
      queryClient.invalidateQueries({ queryKey: ['powerplays', matchId] });
      queryClient.invalidateQueries({ queryKey: ['powerplay', matchId, 'current'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate powerplay');
    },
  });

  // Auto-management logic
  const checkPowerplayAutoManagement = useCallback((over: number) => {
    powerplays.forEach((powerplay: PowerPlay, index: number) => {
      if (over >= powerplay.startOver && 
          over <= powerplay.endOver && 
          powerplay.status === PowerPlayStatus.PENDING) {
        // Auto-activate powerplay
        activatePowerplayMutation.mutate(index);
      } else if (over > powerplay.endOver && 
                 powerplay.status === PowerPlayStatus.ACTIVE) {
        // Auto-deactivate powerplay
        deactivatePowerplayMutation.mutate();
      }
    });
  }, [powerplays, activatePowerplayMutation, deactivatePowerplayMutation]);

  // Update current over and check auto-management
  const updateCurrentOver = useCallback((over: number) => {
    setCurrentOver(over);
    checkPowerplayAutoManagement(over);
  }, [checkPowerplayAutoManagement]);

  // Get powerplay by index
  const getPowerplayByIndex = useCallback((index: number): PowerPlay | undefined => {
    return powerplays[index];
  }, [powerplays]);

  // Get active powerplay
  const getActivePowerplay = useCallback((): PowerPlay | undefined => {
    return powerplays.find(p => p.status === PowerPlayStatus.ACTIVE);
  }, [powerplays]);

  // Get pending powerplays
  const getPendingPowerplays = useCallback((): PowerPlay[] => {
    return powerplays.filter(p => p.status === PowerPlayStatus.PENDING);
  }, [powerplays]);

  // Get completed powerplays
  const getCompletedPowerplays = useCallback((): PowerPlay[] => {
    return powerplays.filter(p => p.status === PowerPlayStatus.COMPLETED);
  }, [powerplays]);

  return {
    // Data
    currentPowerplay,
    powerplays,
    currentOver,
    matchWithPowerplays,
    isLoading: isLoadingCurrent || isLoadingPowerplays || isLoadingMatch,

    // Mutations
    createPowerplay: createPowerplayMutation.mutate,
    updatePowerplay: updatePowerplayMutation.mutate,
    deletePowerplay: deletePowerplayMutation.mutate,
    activatePowerplay: activatePowerplayMutation.mutate,
    deactivatePowerplay: deactivatePowerplayMutation.mutate,

    // Loading states
    isCreating: createPowerplayMutation.isPending,
    isUpdating: updatePowerplayMutation.isPending,
    isDeleting: deletePowerplayMutation.isPending,
    isActivating: activatePowerplayMutation.isPending,
    isDeactivating: deactivatePowerplayMutation.isPending,

    // Helper functions
    updateCurrentOver,
    getPowerplayByIndex,
    getActivePowerplay,
    getPendingPowerplays,
    getCompletedPowerplays,
    checkPowerplayAutoManagement,
  };
};
