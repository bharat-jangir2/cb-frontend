import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FaUsers, FaUserPlus, FaEdit, FaTrash, FaCheck, FaTimes,
  FaUserFriends, FaTrophy, FaStar, FaChild
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

interface SquadTabProps {
  matchId: string;
  match?: any;
}

interface Player {
  _id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  battingStyle?: string;
  bowlingStyle?: string;
  isSelected?: boolean;
  isPlaying?: boolean;
}

const SquadTab: React.FC<SquadTabProps> = ({ matchId, match }) => {
  const [selectedTeam, setSelectedTeam] = useState<'teamA' | 'teamB'>('teamA');
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const queryClient = useQueryClient();

  // Fetch team players
  const { data: teamAPlayers, isLoading: teamALoading } = useQuery({
    queryKey: ["team-a-players", match?.teamAId?._id],
    queryFn: () => adminApi.getTeamPlayers(match?.teamAId?._id || ""),
    enabled: !!match?.teamAId?._id,
  });

  const { data: teamBPlayers, isLoading: teamBLoading } = useQuery({
    queryKey: ["team-b-players", match?.teamBId?._id],
    queryFn: () => adminApi.getTeamPlayers(match?.teamBId?._id || ""),
    enabled: !!match?.teamBId?._id,
  });

  // Mock data for demonstration
  const mockTeamAPlayers: Player[] = [
    { _id: "1", name: "Virat Kohli", role: "batsman", battingStyle: "Right-handed", isSelected: true, isPlaying: true },
    { _id: "2", name: "Rohit Sharma", role: "batsman", battingStyle: "Right-handed", isSelected: true, isPlaying: true },
    { _id: "3", name: "Jasprit Bumrah", role: "bowler", bowlingStyle: "Right-arm fast", isSelected: true, isPlaying: true },
    { _id: "4", name: "Ravindra Jadeja", role: "all-rounder", battingStyle: "Left-handed", bowlingStyle: "Left-arm orthodox", isSelected: true, isPlaying: false },
    { _id: "5", name: "MS Dhoni", role: "wicket-keeper", battingStyle: "Right-handed", isSelected: true, isPlaying: false },
  ];

  const mockTeamBPlayers: Player[] = [
    { _id: "6", name: "Babar Azam", role: "batsman", battingStyle: "Right-handed", isSelected: true, isPlaying: true },
    { _id: "7", name: "Shaheen Afridi", role: "bowler", bowlingStyle: "Left-arm fast", isSelected: true, isPlaying: true },
    { _id: "8", name: "Mohammad Rizwan", role: "wicket-keeper", battingStyle: "Right-handed", isSelected: true, isPlaying: true },
    { _id: "9", name: "Shadab Khan", role: "all-rounder", battingStyle: "Right-handed", bowlingStyle: "Right-arm leg break", isSelected: true, isPlaying: false },
    { _id: "10", name: "Haris Rauf", role: "bowler", bowlingStyle: "Right-arm fast", isSelected: true, isPlaying: false },
  ];

  const currentPlayers = selectedTeam === 'teamA' ? mockTeamAPlayers : mockTeamBPlayers;
  const currentTeamName = selectedTeam === 'teamA' ? match?.teamAId?.name : match?.teamBId?.name;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'batsman': return 'bg-blue-100 text-blue-800';
      case 'bowler': return 'bg-red-100 text-red-800';
      case 'all-rounder': return 'bg-green-100 text-green-800';
      case 'wicket-keeper': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'batsman': return FaTrophy;
      case 'bowler': return FaChild;
      case 'all-rounder': return FaStar;
      case 'wicket-keeper': return FaUserFriends;
      default: return FaUsers;
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Selection</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedTeam('teamA')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedTeam === 'teamA'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {match?.teamAId?.name || 'Team A'}
          </button>
          <button
            onClick={() => setSelectedTeam('teamB')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedTeam === 'teamB'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {match?.teamBId?.name || 'Team B'}
          </button>
        </div>
      </div>

      {/* Full Squad */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Full Squad - {currentTeamName}</h3>
          <button
            onClick={() => setShowAddPlayer(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaUserPlus className="h-4 w-4" />
            <span>Add Player</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPlayers.map((player) => {
            const RoleIcon = getRoleIcon(player.role);
            return (
              <div
                key={player._id}
                className={`border rounded-lg p-4 ${
                  player.isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <RoleIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{player.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {player.isPlaying && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Playing
                      </span>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEdit className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(player.role)}`}>
                    {player.role}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {player.battingStyle && (
                    <div>Batting: {player.battingStyle}</div>
                  )}
                  {player.bowlingStyle && (
                    <div>Bowling: {player.bowlingStyle}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Playing XI */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Playing XI - {currentTeamName}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPlayers.filter(p => p.isPlaying).map((player) => {
            const RoleIcon = getRoleIcon(player.role);
            return (
              <div
                key={player._id}
                className="border border-green-500 rounded-lg p-4 bg-green-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <RoleIcon className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-gray-900">{player.name}</span>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Playing
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(player.role)}`}>
                    {player.role}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {player.battingStyle && (
                    <div>Batting: {player.battingStyle}</div>
                  )}
                  {player.bowlingStyle && (
                    <div>Bowling: {player.bowlingStyle}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Squad Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Squad Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {currentPlayers.filter(p => p.role === 'batsman').length}
            </div>
            <div className="text-sm text-gray-600">Batsmen</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {currentPlayers.filter(p => p.role === 'bowler').length}
            </div>
            <div className="text-sm text-gray-600">Bowlers</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {currentPlayers.filter(p => p.role === 'all-rounder').length}
            </div>
            <div className="text-sm text-gray-600">All-rounders</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {currentPlayers.filter(p => p.role === 'wicket-keeper').length}
            </div>
            <div className="text-sm text-gray-600">Wicket-keepers</div>
          </div>
        </div>
      </div>

      {/* Squad Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Squad Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <FaCheck className="h-4 w-4" />
            <span>Confirm Playing XI</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaUserPlus className="h-4 w-4" />
            <span>Add New Player</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <FaEdit className="h-4 w-4" />
            <span>Edit Squad</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SquadTab; 