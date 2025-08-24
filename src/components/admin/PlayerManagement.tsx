import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { matchesApi } from '../../services/matches';
import { toast } from 'react-hot-toast';
import { FaUser, FaExchangeAlt, FaBolt, FaSpinner, FaHandPaper } from 'react-icons/fa';

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

interface PlayerManagementProps {
  matchId: string;
  currentPlayers: CurrentPlayers;
  onPlayersChange: (players: CurrentPlayers) => void;
  isAdmin?: boolean;
}

export function PlayerManagement({ 
  matchId, 
  currentPlayers, 
  onPlayersChange, 
  isAdmin = false 
}: PlayerManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStriker, setSelectedStriker] = useState<string>('');
  const [selectedNonStriker, setSelectedNonStriker] = useState<string>('');
  const [selectedBowler, setSelectedBowler] = useState<string>('');

  // Fetch match players
  const { data: matchPlayers, isLoading, error } = useQuery({
    queryKey: ['match-players', matchId],
    queryFn: () => matchesApi.getMatchPlayers(matchId),
    enabled: !!matchId,
  });

  const players = matchPlayers || [];

  // Initialize selections when current players change
  useEffect(() => {
    setSelectedStriker(currentPlayers.striker?._id || '');
    setSelectedNonStriker(currentPlayers.nonStriker?._id || '');
    setSelectedBowler(currentPlayers.bowler?._id || '');
  }, [currentPlayers]);

  const handleSave = () => {
    const striker = players.find(p => p._id === selectedStriker) || null;
    const nonStriker = players.find(p => p._id === selectedNonStriker) || null;
    const bowler = players.find(p => p._id === selectedBowler) || null;

    if (!striker || !nonStriker || !bowler) {
      toast.error('Please select all three players (striker, non-striker, and bowler)');
      return;
    }

    if (striker._id === nonStriker._id) {
      toast.error('Striker and non-striker cannot be the same player');
      return;
    }

    onPlayersChange({ striker, nonStriker, bowler });
    setIsEditing(false);
    toast.success('Players updated successfully');
  };

  const handleCancel = () => {
    setSelectedStriker(currentPlayers.striker?._id || '');
    setSelectedNonStriker(currentPlayers.nonStriker?._id || '');
    setSelectedBowler(currentPlayers.bowler?._id || '');
    setIsEditing(false);
  };

  const handleSwap = () => {
    const newStriker = selectedNonStriker;
    const newNonStriker = selectedStriker;
    setSelectedStriker(newStriker);
    setSelectedNonStriker(newNonStriker);
  };

  const getPlayerById = (playerId: string): Player | undefined => {
    return players.find(p => p._id === playerId);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'batsman':
        return <FaBolt className="text-orange-500" />;
      case 'bowler':
        return <FaSpinner className="text-blue-500" />;
      case 'all_rounder':
        return <FaUser className="text-green-500" />;
      case 'wicket_keeper':
        return <FaHandPaper className="text-purple-500" />;
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-blue-500 text-xl" />
          <span className="ml-2 text-gray-600">Loading players...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <FaUser className="text-gray-400 text-4xl mx-auto mb-2" />
          <p className="text-gray-600">Failed to load players</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <FaUser className="text-gray-400 text-4xl mx-auto mb-2" />
          <p className="text-gray-600">No players available for this match</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <FaUser className="mr-3 text-blue-600" />
          Current Players
        </h3>
        {isAdmin && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            {isEditing ? 'Cancel' : 'Edit Players'}
          </button>
        )}
      </div>

      {isEditing ? (
        // Edit Mode
        <div className="space-y-6">
          {/* Striker Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FaBolt className="mr-2 text-orange-500" />
              Striker (Batsman)
            </h4>
            <select
              value={selectedStriker}
              onChange={(e) => setSelectedStriker(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Striker</option>
              {filterBatsmen().map((player) => (
                <option key={player._id} value={player._id}>
                  {player.fullName} ({player.shortName}) - {player.role}
                </option>
              ))}
            </select>
          </div>

          {/* Non-Striker Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FaUser className="mr-2 text-gray-500" />
              Non-Striker (Batsman)
            </h4>
            <select
              value={selectedNonStriker}
              onChange={(e) => setSelectedNonStriker(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Non-Striker</option>
              {filterBatsmen().map((player) => (
                <option key={player._id} value={player._id}>
                  {player.fullName} ({player.shortName}) - {player.role}
                </option>
              ))}
            </select>
          </div>

          {/* Bowler Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FaSpinner className="mr-2 text-blue-500" />
              Bowler
            </h4>
            <select
              value={selectedBowler}
              onChange={(e) => setSelectedBowler(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Bowler</option>
              {filterBowlers().map((player) => (
                <option key={player._id} value={player._id}>
                  {player.fullName} ({player.shortName}) - {player.role}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Players
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSwap}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <FaExchangeAlt className="mr-2" />
              Swap Batsmen
            </button>
          </div>
        </div>
      ) : (
        // Display Mode
        <div className="space-y-4">
          {/* Current Players Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Striker */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FaBolt className="text-orange-500 mr-2" />
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
                <FaSpinner className="text-blue-500 mr-2" />
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

          {/* Warning if players not set */}
          {(!currentPlayers.striker || !currentPlayers.nonStriker || !currentPlayers.bowler) && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
              <p className="font-medium">⚠️ Players Required</p>
              <p className="text-sm">Please set all three players (striker, non-striker, and bowler) before starting a ball.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
