import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { inningsService } from '../services/innings.service';
import type { Innings, InningsUpdateData, Partnership, PlayerMatchStats } from '../types/innings';
import { InningsStatus, InningsResult } from '../types/innings';

export const useInnings = (matchId: string) => {
  const queryClient = useQueryClient();
  const [selectedInningsNumber, setSelectedInningsNumber] = useState<number | null>(null);

  // Query for all innings - this will fetch all innings for the match
  const { 
    data: innings = [], 
    isLoading: isLoadingInnings, 
    error: inningsError,
    refetch: refetchInnings 
  } = useQuery({
    queryKey: ['innings', matchId],
    queryFn: () => inningsService.getAllInnings(matchId),
    enabled: !!matchId,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    retry: 3,
    retryDelay: 1000,
    staleTime: 5000, // Consider data stale after 5 seconds
  });

  // Query for selected innings details
  const { 
    data: selectedInnings, 
    isLoading: isLoadingSelectedInnings, 
    error: selectedInningsError 
  } = useQuery({
    queryKey: ['innings', matchId, selectedInningsNumber],
    queryFn: () => selectedInningsNumber ? inningsService.getInnings(matchId, selectedInningsNumber) : null,
    enabled: !!matchId && !!selectedInningsNumber,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    retry: 3,
    retryDelay: 1000,
  });

  // Query for partnerships by selected innings
  const { 
    data: partnerships = [], 
    isLoading: isLoadingPartnerships, 
    error: partnershipsError 
  } = useQuery({
    queryKey: ['partnerships', matchId, selectedInningsNumber],
    queryFn: () => selectedInningsNumber ? inningsService.getPartnershipsByInnings(matchId, selectedInningsNumber) : [],
    enabled: !!matchId && !!selectedInningsNumber,
    retry: 2,
    retryDelay: 1000,
  });

  // Query for player stats by selected innings
  const { 
    data: playerStats = [], 
    isLoading: isLoadingPlayerStats, 
    error: playerStatsError 
  } = useQuery({
    queryKey: ['player-stats', matchId, selectedInningsNumber],
    queryFn: () => selectedInningsNumber ? inningsService.getPlayerStatsByInnings(matchId, selectedInningsNumber) : [],
    enabled: !!matchId && !!selectedInningsNumber,
    retry: 2,
    retryDelay: 1000,
  });

  // Auto-select first innings if none selected
  useEffect(() => {
    if (innings.length > 0 && !selectedInningsNumber) {
      setSelectedInningsNumber(innings[0].inningsNumber);
    }
  }, [innings, selectedInningsNumber]);

  // Create new innings mutation
  const createInningsMutation = useMutation({
    mutationFn: (inningsData: {
      inningsNumber: number;
      battingTeam: string; // Team ID
      bowlingTeam: string; // Team ID
      status?: InningsStatus;
    }) => inningsService.createInnings(matchId, inningsData),
    onSuccess: (data) => {
      toast.success(`Innings ${data.inningsNumber} created successfully`);
      queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
      // Auto-select the newly created innings
      setSelectedInningsNumber(data.inningsNumber);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create innings';
      toast.error(errorMessage);
      console.error('Create innings error:', error);
    },
  });

  // Start innings mutation
  const startInningsMutation = useMutation({
    mutationFn: ({ inningsNumber }: { inningsNumber: number }) =>
      inningsService.startInnings(matchId, inningsNumber),
    onSuccess: (data) => {
      toast.success(`Innings ${data.inningsNumber} started successfully`);
      queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, data.inningsNumber] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to start innings';
      toast.error(errorMessage);
      console.error('Start innings error:', error);
    },
  });

  // Pause innings mutation
  const pauseInningsMutation = useMutation({
    mutationFn: ({ inningsNumber }: { inningsNumber: number }) =>
      inningsService.pauseInnings(matchId, inningsNumber),
    onSuccess: (data) => {
      toast.success(`Innings ${data.inningsNumber} paused successfully`);
      queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, data.inningsNumber] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to pause innings';
      toast.error(errorMessage);
      console.error('Pause innings error:', error);
    },
  });

  // Resume innings mutation
  const resumeInningsMutation = useMutation({
    mutationFn: ({ inningsNumber }: { inningsNumber: number }) =>
      inningsService.resumeInnings(matchId, inningsNumber),
    onSuccess: (data) => {
      toast.success(`Innings ${data.inningsNumber} resumed successfully`);
      queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, data.inningsNumber] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to resume innings';
      toast.error(errorMessage);
      console.error('Resume innings error:', error);
    },
  });

  // End innings mutation
  const endInningsMutation = useMutation({
    mutationFn: ({ 
      inningsNumber, 
      result, 
      resultDescription 
    }: { 
      inningsNumber: number; 
      result: InningsResult; 
      resultDescription?: string;
    }) => inningsService.endInnings(matchId, inningsNumber, result, resultDescription),
    onSuccess: (data) => {
      const resultText = data.result?.replace('_', ' ').toLowerCase() || 'completed';
      toast.success(`Innings ${data.inningsNumber} ended: ${resultText}`);
      queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, data.inningsNumber] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to end innings';
      toast.error(errorMessage);
      console.error('End innings error:', error);
    },
  });

  // Declare innings mutation
  const declareInningsMutation = useMutation({
    mutationFn: ({ 
      inningsNumber, 
      resultDescription 
    }: { 
      inningsNumber: number; 
      resultDescription?: string;
    }) => inningsService.declareInnings(matchId, inningsNumber, resultDescription),
    onSuccess: (data) => {
      toast.success(`Innings ${data.inningsNumber} declared successfully`);
      queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, data.inningsNumber] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to declare innings';
      toast.error(errorMessage);
      console.error('Declare innings error:', error);
    },
  });

  // Update innings mutation
  const updateInningsMutation = useMutation({
    mutationFn: ({ 
      inningsNumber, 
      updateData 
    }: { 
      inningsNumber: number; 
      updateData: InningsUpdateData;
    }) => inningsService.updateInnings(matchId, inningsNumber, updateData),
    onSuccess: (data) => {
      toast.success('Innings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, data.inningsNumber] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update innings';
      toast.error(errorMessage);
      console.error('Update innings error:', error);
    },
  });

  // Update current players mutation
  const updateCurrentPlayersMutation = useMutation({
    mutationFn: ({ 
      inningsNumber, 
      players 
    }: { 
      inningsNumber: number; 
      players: { striker: string; nonStriker: string; bowler: string; };
    }) => inningsService.updateCurrentPlayers(matchId, inningsNumber, players),
    onSuccess: (data) => {
      toast.success('Current players updated successfully');
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, data.inningsNumber] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update current players';
      toast.error(errorMessage);
      console.error('Update current players error:', error);
    },
  });

  // Delete innings mutation
  const deleteInningsMutation = useMutation({
    mutationFn: (inningsNumber: number) =>
      inningsService.deleteInnings(matchId, inningsNumber),
    onSuccess: (data, variables) => {
      toast.success('Innings deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
      // If we deleted the selected innings, select the first available one
      if (selectedInningsNumber === variables) {
        const remainingInnings = innings.filter(i => i.inningsNumber !== variables);
        if (remainingInnings.length > 0) {
          setSelectedInningsNumber(remainingInnings[0].inningsNumber);
        } else {
          setSelectedInningsNumber(null);
        }
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete innings';
      toast.error(errorMessage);
      console.error('Delete innings error:', error);
    },
  });

  // Helper functions
  const getInningsByNumber = useCallback((inningsNumber: number): Innings | undefined => {
    return innings.find(i => i.inningsNumber === inningsNumber);
  }, [innings]);

  const getCurrentInnings = useCallback((): Innings | undefined => {
    return innings.find(i => i.status === InningsStatus.IN_PROGRESS);
  }, [innings]);

  const getCompletedInnings = useCallback((): Innings[] => {
    return innings.filter(i => i.status === InningsStatus.COMPLETED || i.status === InningsStatus.DECLARED);
  }, [innings]);

  const getPendingInnings = useCallback((): Innings[] => {
    return innings.filter(i => i.status === InningsStatus.NOT_STARTED);
  }, [innings]);

  const getInProgressInnings = useCallback((): Innings[] => {
    return innings.filter(i => i.status === InningsStatus.IN_PROGRESS);
  }, [innings]);

  const getNextInningsNumber = useCallback((): number => {
    if (innings.length === 0) return 1;
    const maxInningsNumber = Math.max(...innings.map(i => i.inningsNumber));
    return maxInningsNumber + 1;
  }, [innings]);

  // Enhanced auto-progression logic with better error handling
  const checkInningsAutoProgression = useCallback((ball: any) => {
    const current = getCurrentInnings();
    if (!current) return;

    try {
      // Check if innings should end due to all out
      if (ball.eventType === 'wicket' && current.wickets >= 10) {
        endInningsMutation.mutate({
          inningsNumber: current.inningsNumber,
          result: InningsResult.ALL_OUT,
          resultDescription: 'All out - Auto progression'
        });
        return;
      }

      // Check if innings should end due to overs completed
      // Get match settings from context or props
      const maxOvers = 20; // Default for T20, should be configurable
      if (ball.eventType === 'over_change' && ball.over >= maxOvers) {
        endInningsMutation.mutate({
          inningsNumber: current.inningsNumber,
          result: InningsResult.OVERS_COMPLETED,
          resultDescription: 'Overs completed - Auto progression'
        });
        return;
      }

      // Check if target reached (for second innings onwards)
      if (current.inningsNumber > 1) {
        const previousInnings = getInningsByNumber(current.inningsNumber - 1);
        if (previousInnings && current.runs >= previousInnings.runs) {
          endInningsMutation.mutate({
            inningsNumber: current.inningsNumber,
            result: InningsResult.TARGET_REACHED,
            resultDescription: 'Target reached - Auto progression'
          });
          return;
        }
      }
    } catch (error) {
      console.error('Auto-progression error:', error);
      toast.error('Failed to auto-progress innings');
    }
  }, [getCurrentInnings, getInningsByNumber, endInningsMutation]);

  // WebSocket integration for real-time updates
  useEffect(() => {
    // This would be replaced with actual WebSocket implementation
    // For now, we'll use polling with React Query
    
    // Example WebSocket implementation:
    // const socket = io('ws://localhost:5000');
    // 
    // socket.on('innings_updated', (data) => {
    //   queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
    //   toast.success('Innings updated in real-time');
    // });
    //
    // socket.on('ball_added', (data) => {
    //   checkInningsAutoProgression(data.ball);
    // });
    //
    // socket.on('players_updated', (data) => {
    //   queryClient.invalidateQueries({ queryKey: ['innings', matchId, selectedInningsNumber] });
    //   toast.success('Players updated in real-time');
    // });
    //
    // socket.on('connect_error', (error) => {
    //   console.error('WebSocket connection error:', error);
    //   toast.error('Lost real-time connection');
    // });
    //
    // return () => {
    //   socket.off('innings_updated');
    //   socket.off('ball_added');
    //   socket.off('players_updated');
    //   socket.off('connect_error');
    //   socket.disconnect();
    // };
  }, [matchId, selectedInningsNumber, queryClient, checkInningsAutoProgression]);

  // Error handling for queries
  useEffect(() => {
    if (inningsError) {
      console.error('Innings query error:', inningsError);
      toast.error('Failed to load innings data');
    }
    if (selectedInningsError) {
      console.error('Selected innings query error:', selectedInningsError);
      toast.error('Failed to load selected innings data');
    }
    if (partnershipsError) {
      console.error('Partnerships query error:', partnershipsError);
      // Don't show toast for partnerships as it's not critical
    }
    if (playerStatsError) {
      console.error('Player stats query error:', playerStatsError);
      // Don't show toast for player stats as it's not critical
    }
  }, [inningsError, selectedInningsError, partnershipsError, playerStatsError]);

  return {
    // Data
    innings,
    selectedInnings,
    selectedInningsNumber,
    partnerships,
    playerStats,
    isLoading: isLoadingInnings || isLoadingSelectedInnings || isLoadingPartnerships || isLoadingPlayerStats,

    // Errors
    inningsError,
    selectedInningsError,
    partnershipsError,
    playerStatsError,

    // Mutations
    createInnings: createInningsMutation.mutate,
    startInnings: startInningsMutation.mutate,
    pauseInnings: pauseInningsMutation.mutate,
    resumeInnings: resumeInningsMutation.mutate,
    endInnings: endInningsMutation.mutate,
    declareInnings: declareInningsMutation.mutate,
    updateInnings: updateInningsMutation.mutate,
    updateCurrentPlayers: updateCurrentPlayersMutation.mutate,
    deleteInnings: deleteInningsMutation.mutate,

    // Loading states
    isCreating: createInningsMutation.isPending,
    isStarting: startInningsMutation.isPending,
    isPausing: pauseInningsMutation.isPending,
    isResuming: resumeInningsMutation.isPending,
    isEnding: endInningsMutation.isPending,
    isDeclaring: declareInningsMutation.isPending,
    isUpdating: updateInningsMutation.isPending,
    isUpdatingPlayers: updateCurrentPlayersMutation.isPending,
    isDeleting: deleteInningsMutation.isPending,

    // Helper functions
    setSelectedInningsNumber,
    getInningsByNumber,
    getCurrentInnings,
    getCompletedInnings,
    getPendingInnings,
    getInProgressInnings,
    getNextInningsNumber,
    checkInningsAutoProgression,
    refetchInnings,
  };
};
