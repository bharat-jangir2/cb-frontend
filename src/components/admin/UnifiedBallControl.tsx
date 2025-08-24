import React, { useState, useEffect } from 'react';
import { useBallUpdate } from '../../contexts/BallUpdateContext';
import { useBallUpdateOperations } from '../../hooks/useBallUpdateOperations';
import { PlayerManagement } from './PlayerManagement';
import { toast } from 'react-hot-toast';
import { FaRocket, FaPlay, FaRunning, FaTimes, FaCheck, FaUser } from 'react-icons/fa';

interface Player {
  _id: string;
  fullName: string;
  shortName: string;
  role: 'batsman' | 'bowler' | 'all_rounder' | 'wicket_keeper';
  nationality: string;
  battingStyle?: string;
  bowlingStyle?: string;
  photoUrl?: string;
}

interface CurrentPlayers {
  striker: Player | null;
  nonStriker: Player | null;
  bowler: Player | null;
}

interface UnifiedBallControlProps {
  matchId: string;
  userId: string;
  currentInnings: number;
  currentOver: number;
  currentBall: number;
}

export function UnifiedBallControl({ 
  matchId, 
  userId, 
  currentInnings, 
  currentOver, 
  currentBall 
}: UnifiedBallControlProps) {
  const { ballStatus, loading, error, dispatch, actions } = useBallUpdate();
  const ballOperations = useBallUpdateOperations(matchId, userId, currentInnings);
  
  const [runs, setRuns] = useState(1);
  const [runType, setRunType] = useState('single');
  const [wicketType, setWicketType] = useState('bowled');
  const [currentPlayers, setCurrentPlayers] = useState<CurrentPlayers>({
    striker: null,
    nonStriker: null,
    bowler: null
  });

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch({ type: actions.SET_ERROR, payload: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch, actions]);

  const handleStartBall = async () => {
    try {
      // Check if all players are set
      if (!currentPlayers.striker || !currentPlayers.nonStriker || !currentPlayers.bowler) {
        toast.error('Please set all players (striker, non-striker, and bowler) before starting a ball');
        return;
      }

      // Clear any previous errors before starting
      dispatch({ type: actions.SET_ERROR, payload: null });
      await ballOperations.startBall(currentInnings, currentOver, currentBall, {
        strikerId: currentPlayers.striker._id,
        nonStrikerId: currentPlayers.nonStriker._id,
        bowlerId: currentPlayers.bowler._id
      });
      toast.success('Ball started successfully');
      // Clear any remaining errors on success
      dispatch({ type: actions.SET_ERROR, payload: null });
    } catch (error: any) {
      toast.error(error.message || 'Failed to start ball');
    }
  };

  const handleRecordRuns = async () => {
    try {
      // Check if striker is set
      if (!currentPlayers.striker) {
        toast.error('Please set the striker before recording runs');
        return;
      }

      // Clear any previous errors before starting
      dispatch({ type: actions.SET_ERROR, payload: null });
      await ballOperations.recordRuns(
        currentInnings, 
        currentOver, 
        currentBall, 
        { runs, runType, strikerId: currentPlayers.striker._id }, 
        'Runs recorded'
      );
      toast.success(`${runs} run(s) recorded`);
      // Clear any remaining errors on success
      dispatch({ type: actions.SET_ERROR, payload: null });
    } catch (error: any) {
      toast.error(error.message || 'Failed to record runs');
    }
  };

  const handleRecordWicket = async () => {
    try {
      // Check if required players are set
      if (!currentPlayers.striker || !currentPlayers.bowler) {
        toast.error('Please set both striker and bowler before recording a wicket');
        return;
      }

      // Clear any previous errors before starting
      dispatch({ type: actions.SET_ERROR, payload: null });
      await ballOperations.recordWicket(
        currentInnings, 
        currentOver, 
        currentBall, 
        { wicketType, dismissedPlayerId: currentPlayers.striker._id, bowlerId: currentPlayers.bowler._id, dismissalMethod: wicketType }, 
        'Wicket taken!'
      );
      toast.success('Wicket recorded!');
      // Clear any remaining errors on success
      dispatch({ type: actions.SET_ERROR, payload: null });
    } catch (error: any) {
      toast.error(error.message || 'Failed to record wicket');
    }
  };

  const handleCompleteBall = async () => {
    try {
      // Clear any previous errors before starting
      dispatch({ type: actions.SET_ERROR, payload: null });
      await ballOperations.completeBall(currentInnings, currentOver, currentBall, 'Ball completed');
      toast.success('Ball completed');
      // Clear any remaining errors on success
      dispatch({ type: actions.SET_ERROR, payload: null });
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete ball');
    }
  };

  const handlePlayersChange = (players: CurrentPlayers) => {
    setCurrentPlayers(players);
  };

  return (
    <div className="space-y-6">
      {/* Player Management Section */}
      <PlayerManagement
        matchId={matchId}
        currentPlayers={currentPlayers}
        onPlayersChange={handlePlayersChange}
        isAdmin={true}
      />

      {/* Ball Control Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FaRocket className="mr-3 text-blue-600" />
          Unified Ball Control
        </h3>
        
        {/* Status Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Ball Status:</p>
              <p className="font-semibold text-blue-600">
                {ballOperations.currentBall?.status?.toUpperCase() || ballStatus.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Position:</p>
              <p className="font-semibold text-gray-900">
                Over {ballOperations.currentBall?.over || currentOver}.{ballOperations.currentBall?.ball || currentBall}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Innings:</p>
              <p className="font-semibold text-gray-900">{currentInnings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loading:</p>
              <p className="font-semibold text-gray-900">
                {ballOperations.isLoadingCurrentBall ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
          
          {/* Current Ball Details */}
          {ballOperations.currentBall && ballOperations.currentBall.status !== 'not_started' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Current Ball Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Started:</span>
                  <span className="ml-2 text-blue-900">
                    {ballOperations.currentBall.ballStartedAt ? 
                      new Date(ballOperations.currentBall.ballStartedAt).toLocaleTimeString() : 
                      'Not started'
                    }
                  </span>
                </div>
                {ballOperations.currentBall.runs !== undefined && (
                  <div>
                    <span className="text-gray-600">Runs:</span>
                    <span className="ml-2 text-blue-900">{ballOperations.currentBall.runs}</span>
                  </div>
                )}
                {ballOperations.currentBall.commentary && (
                  <div className="col-span-2 md:col-span-3">
                    <span className="text-gray-600">Commentary:</span>
                    <span className="ml-2 text-blue-900">{ballOperations.currentBall.commentary}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* No Ball Started Message */}
          {ballOperations.currentBall?.status === 'not_started' && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 font-medium">
                {ballOperations.currentBall.message || 'No ball has been started for this position yet'}
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {(error || ballOperations.currentBallError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium">Error:</p>
                <p>{error || ballOperations.currentBallError?.message}</p>
              </div>
              <button
                onClick={() => dispatch({ type: actions.SET_ERROR, payload: null })}
                className="ml-4 text-red-400 hover:text-red-600 text-lg font-bold"
                title="Dismiss error"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {(loading || ballOperations.isLoadingCurrentBall) && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-center">
            {loading ? 'Processing ball update...' : 'Loading current ball...'}
          </div>
        )}

        {/* Control Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <button 
            onClick={handleStartBall}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            <FaPlay className="mr-2" />
            Start Ball
          </button>

          <button 
            onClick={handleRecordRuns}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
          >
            <FaRunning className="mr-2" />
            Record Runs
          </button>

          <button 
            onClick={handleRecordWicket}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
          >
            <FaTimes className="mr-2" />
            Record Wicket
          </button>

          <button 
            onClick={handleCompleteBall}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center"
          >
            <FaCheck className="mr-2" />
            Complete Ball
          </button>
        </div>

        {/* Data Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Run Data</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Runs</label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={runs}
                  onChange={(e) => setRuns(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Run Type</label>
                <select
                  value={runType}
                  onChange={(e) => setRunType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="triple">Triple</option>
                  <option value="four">Four</option>
                  <option value="six">Six</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Wicket Data</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Wicket Type</label>
                <select
                  value={wicketType}
                  onChange={(e) => setWicketType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="bowled">Bowled</option>
                  <option value="caught">Caught</option>
                  <option value="lbw">LBW</option>
                  <option value="run_out">Run Out</option>
                  <option value="stumped">Stumped</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
