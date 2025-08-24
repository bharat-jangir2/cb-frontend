import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBallUpdate } from '../../contexts/BallUpdateContext';
import { useBallUpdateOperations } from '../../hooks/useBallUpdateOperations';
import { BattingScorecard } from '../scorecard/BattingScorecard';
import { BowlingScorecard } from '../scorecard/BowlingScorecard';
import { LiveScoring } from '../scorecard/LiveScoring';
import { matchesApi } from '../../services/matches';
import { toast } from 'react-hot-toast';
import { FaRocket, FaPlay, FaRunning, FaTimes, FaCheck, FaUser, FaChartBar, FaUsers } from 'react-icons/fa';

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

interface EnhancedBallControlProps {
  matchId: string;
  userId: string;
  currentInnings: number;
  currentOver: number;
  currentBall: number;
}

export function EnhancedBallControl({ 
  matchId, 
  userId, 
  currentInnings, 
  currentOver, 
  currentBall 
}: EnhancedBallControlProps) {
  const { ballStatus, loading, error, dispatch, actions } = useBallUpdate();
  const ballOperations = useBallUpdateOperations(matchId, userId, currentInnings);
  
  const [activeTab, setActiveTab] = useState<'control' | 'batting' | 'bowling' | 'scoring'>('control');
  const [currentPlayers, setCurrentPlayers] = useState<CurrentPlayers>({
    striker: null,
    nonStriker: null,
    bowler: null
  });

  // Fetch match players
  const { data: matchPlayers, isLoading: playersLoading } = useQuery({
    queryKey: ['match-players', matchId],
    queryFn: () => matchesApi.getMatchPlayers(matchId),
    enabled: !!matchId,
  });

  const players = matchPlayers || [];

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

  const handlePlayersChange = (players: CurrentPlayers) => {
    setCurrentPlayers(players);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'batsman':
        return <FaUsers className="text-orange-500" />;
      case 'bowler':
        return <FaChartBar className="text-blue-500" />;
      case 'all_rounder':
        return <FaUser className="text-green-500" />;
      case 'wicket_keeper':
        return <FaUser className="text-purple-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'batsman':
        return 'bg-orange-100 text-orange-800';
      case 'bowler':
        return 'bg-blue-100 text-blue-800';
      case 'all_rounder':
        return 'bg-green-100 text-green-800';
      case 'wicket_keeper':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filterBatsmen = () => players.filter(p => 
    p.role === 'batsman' || p.role === 'all_rounder' || p.role === 'wicket_keeper'
  );

  const filterBowlers = () => players.filter(p => 
    p.role === 'bowler' || p.role === 'all_rounder'
  );

  const tabs = [
    {
      id: 'control',
      label: 'Ball Control',
      icon: FaRocket,
      component: (
        <div className="space-y-6">
          {/* Player Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaUser className="mr-3 text-blue-600" />
              Current Players
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Striker */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaUsers className="text-orange-500 mr-2" />
                  <h4 className="font-semibold text-orange-900">Striker</h4>
                </div>
                {currentPlayers.striker ? (
                  <div>
                    <p className="font-medium text-gray-900">{currentPlayers.striker.fullName}</p>
                    <p className="text-sm text-gray-600">{currentPlayers.striker.shortName}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(currentPlayers.striker.role)}`}>
                      {currentPlayers.striker.role}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Not set</p>
                )}
              </div>

              {/* Non-Striker */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaUser className="text-gray-500 mr-2" />
                  <h4 className="font-semibold text-gray-900">Non-Striker</h4>
                </div>
                {currentPlayers.nonStriker ? (
                  <div>
                    <p className="font-medium text-gray-900">{currentPlayers.nonStriker.fullName}</p>
                    <p className="text-sm text-gray-600">{currentPlayers.nonStriker.shortName}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(currentPlayers.nonStriker.role)}`}>
                      {currentPlayers.nonStriker.role}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Not set</p>
                )}
              </div>

              {/* Bowler */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaChartBar className="text-blue-500 mr-2" />
                  <h4 className="font-semibold text-blue-900">Bowler</h4>
                </div>
                {currentPlayers.bowler ? (
                  <div>
                    <p className="font-medium text-gray-900">{currentPlayers.bowler.fullName}</p>
                    <p className="text-sm text-gray-600">{currentPlayers.bowler.shortName}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(currentPlayers.bowler.role)}`}>
                      {currentPlayers.bowler.role}
                    </span>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Not set</p>
                )}
              </div>
            </div>

            {/* Player Selection Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Striker Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Striker</label>
                <select
                  value={currentPlayers.striker?._id || ''}
                  onChange={(e) => {
                    const player = players.find(p => p._id === e.target.value);
                    setCurrentPlayers(prev => ({ ...prev, striker: player || null }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Striker</option>
                  {filterBatsmen().map((player) => (
                    <option key={player._id} value={player._id}>
                      {player.fullName} ({player.shortName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Non-Striker Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Non-Striker</label>
                <select
                  value={currentPlayers.nonStriker?._id || ''}
                  onChange={(e) => {
                    const player = players.find(p => p._id === e.target.value);
                    setCurrentPlayers(prev => ({ ...prev, nonStriker: player || null }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Non-Striker</option>
                  {filterBatsmen().map((player) => (
                    <option key={player._id} value={player._id}>
                      {player.fullName} ({player.shortName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Bowler Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Bowler</label>
                <select
                  value={currentPlayers.bowler?._id || ''}
                  onChange={(e) => {
                    const player = players.find(p => p._id === e.target.value);
                    setCurrentPlayers(prev => ({ ...prev, bowler: player || null }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Bowler</option>
                  {filterBowlers().map((player) => (
                    <option key={player._id} value={player._id}>
                      {player.fullName} ({player.shortName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Warning if players not set */}
            {(!currentPlayers.striker || !currentPlayers.nonStriker || !currentPlayers.bowler) && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                <p className="font-medium">⚠️ Players Required</p>
                <p className="text-sm">Please set all three players (striker, non-striker, and bowler) before starting a ball.</p>
              </div>
            )}
          </div>

          {/* Ball Control */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaRocket className="mr-3 text-blue-600" />
              Ball Control
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button 
                onClick={handleStartBall}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              >
                <FaPlay className="mr-2" />
                Start Ball
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'batting',
      label: 'Batting Stats',
      icon: FaUsers,
      component: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <BattingScorecard
            matchId={matchId}
            playerStats={[]} // This would come from the scorecard service
          />
        </div>
      )
    },
    {
      id: 'bowling',
      label: 'Bowling Stats',
      icon: FaChartBar,
      component: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <BowlingScorecard
            matchId={matchId}
            playerStats={[]} // This would come from the scorecard service
          />
        </div>
      )
    },
    {
      id: 'scoring',
      label: 'Live Scoring',
      icon: FaRocket,
      component: (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <LiveScoring
            matchId={matchId}
            players={players}
          />
        </div>
      )
    }
  ];

  if (playersLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading players...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
}
