import React, { useState } from 'react';
import { FaUsers, FaExchangeAlt, FaEdit, FaSave, FaTimes, FaRocket } from 'react-icons/fa';
import type { Innings, Player } from '../../types/innings';

interface CurrentPlayersProps {
  innings: Innings;
  availablePlayers: Player[];
  onPlayerChange: (position: 'striker' | 'nonStriker' | 'bowler', playerId: string) => void;
  onPlayerSwap: (position1: 'striker' | 'nonStriker', position2: 'striker' | 'nonStriker') => void;
  isAdmin?: boolean;
}

export const CurrentPlayersPanel: React.FC<CurrentPlayersProps> = ({
  innings,
  availablePlayers,
  onPlayerChange,
  onPlayerSwap,
  isAdmin = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStriker, setSelectedStriker] = useState(innings.currentPlayers?.striker?._id || '');
  const [selectedNonStriker, setSelectedNonStriker] = useState(innings.currentPlayers?.nonStriker?._id || '');
  const [selectedBowler, setSelectedBowler] = useState(innings.currentPlayers?.bowler?._id || '');

  const handleSave = () => {
    if (selectedStriker) onPlayerChange('striker', selectedStriker);
    if (selectedNonStriker) onPlayerChange('nonStriker', selectedNonStriker);
    if (selectedBowler) onPlayerChange('bowler', selectedBowler);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSelectedStriker(innings.currentPlayers?.striker?._id || '');
    setSelectedNonStriker(innings.currentPlayers?.nonStriker?._id || '');
    setSelectedBowler(innings.currentPlayers?.bowler?._id || '');
    setIsEditing(false);
  };

  const handleSwap = () => {
    onPlayerSwap('striker', 'nonStriker');
  };

  const getPlayerById = (playerId: string): Player | undefined => {
    return availablePlayers.find(p => p._id === playerId);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!innings.currentPlayers) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaUsers className="mr-2 text-indigo-600" />
            Current Players
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FaRocket className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No current players set for this innings.</p>
          {isAdmin && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Set Players
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaUsers className="mr-2 text-indigo-600" />
          Current Players
        </h3>
        {isAdmin && innings.status === 'in_progress' && (
          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                <FaEdit className="mr-1" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  <FaSave className="mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  <FaTimes className="mr-1" />
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Striker */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h4 className="text-md font-semibold text-green-800 mb-3 flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
            Striker
          </h4>
          
          {isEditing ? (
            <select
              value={selectedStriker}
              onChange={(e) => setSelectedStriker(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Striker</option>
              {availablePlayers.map(player => (
                <option key={player._id} value={player._id}>
                  {player.fullName} ({player.shortName})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-center">
              <div className="text-lg font-bold text-green-800">
                {innings.currentPlayers.striker.fullName}
              </div>
              <div className="text-sm text-green-600">
                {innings.currentPlayers.striker.shortName}
              </div>
            </div>
          )}
        </div>

        {/* Non-Striker */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
            Non-Striker
          </h4>
          
          {isEditing ? (
            <select
              value={selectedNonStriker}
              onChange={(e) => setSelectedNonStriker(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Non-Striker</option>
              {availablePlayers.map(player => (
                <option key={player._id} value={player._id}>
                  {player.fullName} ({player.shortName})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-center">
              <div className="text-lg font-bold text-blue-800">
                {innings.currentPlayers.nonStriker.fullName}
              </div>
              <div className="text-sm text-blue-600">
                {innings.currentPlayers.nonStriker.shortName}
              </div>
            </div>
          )}
        </div>

        {/* Bowler */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <h4 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
            <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
            Bowler
          </h4>
          
          {isEditing ? (
            <select
              value={selectedBowler}
              onChange={(e) => setSelectedBowler(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Bowler</option>
              {availablePlayers.map(player => (
                <option key={player._id} value={player._id}>
                  {player.fullName} ({player.shortName})
                </option>
              ))}
            </select>
          ) : (
            <div className="text-center">
              <div className="text-lg font-bold text-purple-800">
                {innings.currentPlayers.bowler.fullName}
              </div>
              <div className="text-sm text-purple-600">
                {innings.currentPlayers.bowler.shortName}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {isAdmin && innings.status === 'in_progress' && !isEditing && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSwap}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              <FaExchangeAlt className="mr-2" />
              Swap Striker & Non-Striker
            </button>
            
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <FaEdit className="mr-2" />
              Change Players
            </button>
          </div>
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Last Updated:</span>
          <span>{formatTime(innings.currentPlayers.lastUpdated)}</span>
        </div>
      </div>

      {/* Player Statistics Preview */}
      {!isEditing && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Player Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded p-3">
              <div className="font-medium text-green-800 mb-1">Striker</div>
              <div className="text-gray-600">Runs: 45 | Balls: 32</div>
              <div className="text-gray-600">SR: 140.63</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="font-medium text-blue-800 mb-1">Non-Striker</div>
              <div className="text-gray-600">Runs: 23 | Balls: 18</div>
              <div className="text-gray-600">SR: 127.78</div>
            </div>
            <div className="bg-gray-50 rounded p-3">
              <div className="font-medium text-purple-800 mb-1">Bowler</div>
              <div className="text-gray-600">Overs: 3.2 | Wickets: 2</div>
              <div className="text-gray-600">Econ: 8.25</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
