import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBallUpdate, BALL_ACTIONS } from '../contexts/BallUpdateContext';
import { ballUpdateService } from '../services/ballUpdateService';
import type { BallUpdateData, CurrentBall } from '../types/ballUpdate';

export function useBallUpdateOperations(matchId: string, userId: string, inningsNumber: number = 1) {
  const { dispatch, actions } = useBallUpdate();

  // Query for current ball
  const { data: currentBall, isLoading: isLoadingCurrentBall, error: currentBallError } = useQuery({
    queryKey: ['currentBall', matchId, inningsNumber],
    queryFn: () => ballUpdateService.getCurrentBall(matchId, inningsNumber),
    refetchInterval: 2000, // Refetch every 2 seconds for real-time updates
    enabled: !!matchId && !!inningsNumber,
  });

  const handleBallUpdate = useCallback(async (updateData: BallUpdateData) => {
    try {
      console.log('Starting ball update operation:', updateData);
      dispatch({ type: actions.SET_LOADING, payload: true });
      dispatch({ type: actions.SET_ERROR, payload: null });

      const result = await ballUpdateService.updateBall(matchId, updateData);
      console.log('Ball update operation completed:', result);

      // Update context based on response
      if (result.ball) {
        dispatch({ 
          type: actions.SET_CURRENT_BALL, 
          payload: result.ball 
        });
      }

      if (result.matchStats) {
        dispatch({ 
          type: actions.UPDATE_MATCH_STATS, 
          payload: result.matchStats 
        });
      }

      // Clear any previous errors on success
      dispatch({ type: actions.SET_ERROR, payload: null });
      return result;
    } catch (error: any) {
      console.error('Ball update operation failed:', error);
      const errorMessage = error.message || 'Ball update failed';
      dispatch({ type: actions.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: actions.SET_LOADING, payload: false });
    }
  }, [matchId, dispatch, actions]);

  const startBall = useCallback(async (inningsNumber: number, overNumber: number, ballNumber: number, players?: { strikerId: string; nonStrikerId: string; bowlerId: string }) => {
    return handleBallUpdate({
      updateType: 'start_ball',
      inningsNumber,
      overNumber,
      ballNumber,
      strikerId: players?.strikerId,
      nonStrikerId: players?.nonStrikerId,
      bowlerId: players?.bowlerId,
      updatedBy: userId
    });
  }, [handleBallUpdate, userId]);

  const markBallInAir = useCallback(async (
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    ballInAirData: BallUpdateData['ballInAirData']
  ) => {
    return handleBallUpdate({
      updateType: 'ball_in_air',
      inningsNumber,
      overNumber,
      ballNumber,
      ballInAirData,
      updatedBy: userId
    });
  }, [handleBallUpdate, userId]);

  const recordRuns = useCallback(async (
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    runEventData: BallUpdateData['runEventData'], 
    notes: string = ''
  ) => {
    return handleBallUpdate({
      updateType: 'runs',
      inningsNumber,
      overNumber,
      ballNumber,
      runEventData,
      notes,
      updatedBy: userId
    });
  }, [handleBallUpdate, userId]);

  const recordBoundary = useCallback(async (
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    runEventData: BallUpdateData['runEventData'], 
    notes: string = ''
  ) => {
    return handleBallUpdate({
      updateType: 'boundary',
      inningsNumber,
      overNumber,
      ballNumber,
      runEventData,
      notes,
      updatedBy: userId
    });
  }, [handleBallUpdate, userId]);

  const recordWicket = useCallback(async (
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    wicketEventData: BallUpdateData['wicketEventData'], 
    notes: string = ''
  ) => {
    return handleBallUpdate({
      updateType: 'wicket',
      inningsNumber,
      overNumber,
      ballNumber,
      wicketEventData,
      notes,
      updatedBy: userId
    });
  }, [handleBallUpdate, userId]);

  const recordExtra = useCallback(async (
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    extraEventData: BallUpdateData['extraEventData'], 
    notes: string = ''
  ) => {
    return handleBallUpdate({
      updateType: 'extra',
      inningsNumber,
      overNumber,
      ballNumber,
      extraEventData,
      notes,
      updatedBy: userId
    });
  }, [handleBallUpdate, userId]);

  const completeBall = useCallback(async (
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    notes: string = ''
  ) => {
    return handleBallUpdate({
      updateType: 'complete_ball',
      inningsNumber,
      overNumber,
      ballNumber,
      notes,
      updatedBy: userId
    });
  }, [handleBallUpdate, userId]);

  const cancelBall = useCallback(async (
    inningsNumber: number, 
    overNumber: number, 
    ballNumber: number, 
    notes: string = ''
  ) => {
    return handleBallUpdate({
      updateType: 'cancel_ball',
      inningsNumber,
      overNumber,
      ballNumber,
      notes,
      updatedBy: userId
    });
  }, [handleBallUpdate, userId]);

  return {
    startBall,
    markBallInAir,
    recordRuns,
    recordBoundary,
    recordWicket,
    recordExtra,
    completeBall,
    cancelBall,
    handleBallUpdate,
    currentBall,
    isLoadingCurrentBall,
    currentBallError
  };
}
