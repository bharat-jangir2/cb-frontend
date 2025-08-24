import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ballService } from '../services/ball.service';
import type { 
  BallUpdate, 
  BallInProgress, 
  BallConfirmation, 
  OverSummary,
  BallStatus,
  BallResult 
} from '../types/ball';

export const useBall = (matchId: string, inningsNumber: number) => {
  const queryClient = useQueryClient();
  const [currentBall, setCurrentBall] = useState<BallInProgress | null>(null);
  const [isBallInProgress, setIsBallInProgress] = useState(false);

  // Query for current ball in progress
  const { data: ballInProgress, isLoading: isLoadingCurrentBall } = useQuery({
    queryKey: ['ball', matchId, inningsNumber, 'current'],
    queryFn: () => ballService.getCurrentBall(matchId, inningsNumber),
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
    onSuccess: (data) => {
      setCurrentBall(data);
      setIsBallInProgress(!!data);
    }
  });

  // Query for current over balls
  const { data: currentOverBalls = [], isLoading: isLoadingOverBalls } = useQuery({
    queryKey: ['ball', matchId, inningsNumber, 'over-balls'],
    queryFn: () => {
      if (!ballInProgress) return Promise.resolve([]);
      return ballService.getOverBalls(matchId, inningsNumber, ballInProgress.overNumber);
    },
    enabled: !!ballInProgress,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Query for over summary
  const { data: overSummary, isLoading: isLoadingOverSummary } = useQuery({
    queryKey: ['ball', matchId, inningsNumber, 'over-summary'],
    queryFn: () => {
      if (!ballInProgress) return Promise.resolve(null);
      return ballService.getOverSummary(matchId, inningsNumber, ballInProgress.overNumber);
    },
    enabled: !!ballInProgress,
  });

  // Start ball mutation
  const startBallMutation = useMutation({
    mutationFn: ({ overNumber, ballNumber }: { overNumber: number; ballNumber: number }) =>
      ballService.startBall(matchId, inningsNumber, overNumber, ballNumber),
    onSuccess: (data) => {
      toast.success(`Ball ${data.ballNumber} started`);
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'current'] });
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'over-balls'] });
      setCurrentBall({
        matchId,
        inningsNumber,
        overNumber: data.overNumber,
        ballNumber: data.ballNumber,
        status: data.status,
        startTime: new Date(data.startTime),
        currentBatsmen: {
          striker: data.strikerId,
          nonStriker: data.nonStrikerId
        },
        currentBowler: data.bowlerId,
        isPowerplay: data.isPowerplay
      });
      setIsBallInProgress(true);
    },
    onError: (error: any) => {
      // toast.error(error.response?.data?.message || 'Failed to start ball');
    },
  });

  // Confirm ball mutation
  const confirmBallMutation = useMutation({
    mutationFn: ({ 
      overNumber, 
      ballNumber, 
      confirmation 
    }: { 
      overNumber: number; 
      ballNumber: number; 
      confirmation: BallConfirmation;
    }) =>
      ballService.confirmBall(matchId, inningsNumber, overNumber, ballNumber, confirmation),
    onSuccess: (data) => {
      const resultText = data.result ? ` - ${data.result.replace('_', ' ')}` : '';
      toast.success(`Ball ${data.ballNumber} confirmed${resultText}`);
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'current'] });
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'over-balls'] });
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'over-summary'] });
      queryClient.invalidateQueries({ queryKey: ['match', matchId] });
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, inningsNumber] });
      setIsBallInProgress(false);
      setCurrentBall(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to confirm ball');
    },
  });

  // Complete ball mutation
  const completeBallMutation = useMutation({
    mutationFn: ({ overNumber, ballNumber }: { overNumber: number; ballNumber: number }) =>
      ballService.completeBall(matchId, inningsNumber, overNumber, ballNumber),
    onSuccess: (data) => {
      toast.success(`Ball ${data.ballNumber} completed`);
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'current'] });
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'over-balls'] });
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'over-summary'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete ball');
    },
  });

  // Quick ball result mutation (for fast scoring)
  const quickBallResultMutation = useMutation({
    mutationFn: ({ 
      overNumber, 
      ballNumber, 
      result, 
      runsScored = 0 
    }: { 
      overNumber: number; 
      ballNumber: number; 
      result: BallResult; 
      runsScored?: number;
    }) =>
      ballService.quickBallResult(matchId, inningsNumber, overNumber, ballNumber, result, runsScored),
    onSuccess: (data) => {
      const resultText = data.result ? ` - ${data.result.replace('_', ' ')}` : '';
      toast.success(`Ball ${data.ballNumber} scored${resultText}`);
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'current'] });
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'over-balls'] });
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'over-summary'] });
      queryClient.invalidateQueries({ queryKey: ['match', matchId] });
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, inningsNumber] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to score ball');
    },
  });

  // Undo last ball mutation
  const undoLastBallMutation = useMutation({
    mutationFn: () => ballService.undoLastBall(matchId, inningsNumber),
    onSuccess: (data) => {
      toast.success('Last ball undone');
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'current'] });
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'over-balls'] });
      queryClient.invalidateQueries({ queryKey: ['ball', matchId, inningsNumber, 'over-summary'] });
      queryClient.invalidateQueries({ queryKey: ['match', matchId] });
      queryClient.invalidateQueries({ queryKey: ['innings', matchId, inningsNumber] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to undo last ball');
    },
  });

  // Helper functions
  const startBall = useCallback((overNumber: number, ballNumber: number) => {
    startBallMutation.mutate({ overNumber, ballNumber });
  }, [startBallMutation]);

  const confirmBall = useCallback((overNumber: number, ballNumber: number, confirmation: BallConfirmation) => {
    confirmBallMutation.mutate({ overNumber, ballNumber, confirmation });
  }, [confirmBallMutation]);

  const completeBall = useCallback((overNumber: number, ballNumber: number) => {
    completeBallMutation.mutate({ overNumber, ballNumber });
  }, [completeBallMutation]);

  const quickBallResult = useCallback((overNumber: number, ballNumber: number, result: BallResult, runsScored: number = 0) => {
    quickBallResultMutation.mutate({ overNumber, ballNumber, result, runsScored });
  }, [quickBallResultMutation]);

  const undoLastBall = useCallback(() => {
    undoLastBallMutation.mutate();
  }, [undoLastBallMutation]);

  // Auto-start next ball when over changes
  useEffect(() => {
    if (ballInProgress && !isBallInProgress) {
      // Over completed, auto-start next ball
      const nextOver = ballInProgress.overNumber + 1;
      const nextBall = 1;
      startBall(nextOver, nextBall);
    }
  }, [ballInProgress, isBallInProgress, startBall]);

  return {
    // Data
    currentBall: ballInProgress,
    currentOverBalls,
    overSummary,
    isBallInProgress,
    
    // Loading states
    isLoading: isLoadingCurrentBall || isLoadingOverBalls || isLoadingOverSummary,
    isStarting: startBallMutation.isPending,
    isConfirming: confirmBallMutation.isPending,
    isCompleting: completeBallMutation.isPending,
    isQuickScoring: quickBallResultMutation.isPending,
    isUndoing: undoLastBallMutation.isPending,

    // Actions
    startBall,
    confirmBall,
    completeBall,
    quickBallResult,
    undoLastBall,

    // Helper functions
    getBallStatus: (ballNumber: number) => {
      return currentOverBalls.find(ball => ball.ballNumber === ballNumber)?.status;
    },
    
    getBallResult: (ballNumber: number) => {
      return currentOverBalls.find(ball => ball.ballNumber === ballNumber)?.result;
    },

    isOverComplete: () => {
      return currentOverBalls.length >= 6 || overSummary?.isComplete;
    },

    getNextBallNumber: () => {
      return currentOverBalls.length + 1;
    },

    getCurrentOverNumber: () => {
      return ballInProgress?.overNumber || 1;
    }
  };
};
