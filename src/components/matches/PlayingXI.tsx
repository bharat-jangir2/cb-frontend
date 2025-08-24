import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../services/admin";
import type { 
  EnhancedPlayingXIData, 
  EnhancedSquadData, 
  PlayingXIPlayer, 
  EnhancedPlayer 
} from "../../services/admin";
import {
  FaUser,
  FaCrown,
  FaStar,
  FaChild,
  FaSpinner,
  FaUsers,
  FaTrophy,
  FaBolt,
  FaHandPaper,
} from "react-icons/fa";

interface PlayingXIProps {
  matchId: string;
}

const PlayingXI: React.FC<PlayingXIProps> = ({ matchId }) => {
  const [activeTeam, setActiveTeam] = useState<"A" | "B">("A");

  // Fetch Playing XI
  const {
    data: playingXIData,
    isLoading: playingXILoading,
    error: playingXIError,
  } = useQuery({
    queryKey: ["playing-xi", matchId],
    queryFn: () => adminApi.getPlayingXI(matchId),
    enabled: !!matchId,
  });

  // Fetch Squad
  const {
    data: squadData,
    isLoading: squadLoading,
    error: squadError,
  } = useQuery({
    queryKey: ["match-squad", matchId],
    queryFn: () => adminApi.getMatchSquad(matchId),
    enabled: !!matchId,
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "batsman":
        return <FaBolt className="text-orange-500" />;
      case "bowler":
        return <FaSpinner className="text-blue-500" />;
      case "all_rounder":
        return <FaTrophy className="text-green-500" />;
      case "wicket_keeper":
        return <FaHandPaper className="text-purple-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "batsman":
        return "bg-orange-100 text-orange-800";
      case "bowler":
        return "bg-blue-100 text-blue-800";
      case "all_rounder":
        return "bg-green-100 text-green-800";
      case "wicket_keeper":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "batsman":
        return "Batsman";
      case "bowler":
        return "Bowler";
      case "all_rounder":
        return "All Rounder";
      case "wicket_keeper":
        return "Wicket Keeper";
      default:
        return role;
    }
  };

  if (playingXILoading || squadLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-blue-500 text-xl" />
          <span className="ml-2 text-gray-600">Loading Playing XI...</span>
        </div>
      </div>
    );
  }

  if (playingXIError || squadError) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center py-8">
          <FaUsers className="text-gray-400 text-4xl mx-auto mb-2" />
          <p className="text-gray-600">Failed to load Playing XI data</p>
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

  // Handle the actual API response structure
  const playingXI = playingXIData as unknown as EnhancedPlayingXIData;
  const squad = squadData as unknown as EnhancedSquadData;

  if (!playingXI) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-center py-8">
          <FaUsers className="text-gray-400 text-4xl mx-auto mb-2" />
          <p className="text-gray-600">No Playing XI data available</p>
        </div>
      </div>
    );
  }

  const currentTeamData = playingXI[`team${activeTeam}`];
  const currentSquadData = squad?.[`team${activeTeam}`] || [];
  
  // Check if current team has any players
  const hasTeamData = currentTeamData && currentTeamData.players && currentTeamData.players.length > 0;
  
  // Get playing XI player IDs for bench calculation
  const playingXIPlayerIds = hasTeamData ? currentTeamData.players.map((p: PlayingXIPlayer) => p._id) : [];
  const benchPlayers = currentSquadData.filter(
    (player: EnhancedPlayer) => !playingXIPlayerIds.includes(player._id)
  );

  // Get team names (you might want to fetch this from match data)
  const getTeamName = (team: string) => {
    // This could be enhanced by fetching team names from match data
    return team === "A" ? "Team A" : "Team B";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Playing XI & Squad
      </h3>

      {/* Team Toggle */}
      <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTeam("A")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTeam === "A"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {getTeamName("A")} {playingXI.teamA?.players?.length > 0 && `(${playingXI.teamA.players.length})`}
        </button>
        <button
          onClick={() => setActiveTeam("B")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTeam === "B"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {getTeamName("B")} {playingXI.teamB?.players?.length > 0 && `(${playingXI.teamB.players.length})`}
        </button>
      </div>

      {!hasTeamData ? (
        <div className="text-center py-8 text-gray-500">
          <FaUsers className="text-2xl mx-auto mb-2" />
          <p className="text-sm">No Playing XI data available for {getTeamName(activeTeam)}</p>
          {squad && currentSquadData.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Squad data available but Playing XI not set
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Playing XI */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-semibold text-gray-900">
                Playing XI ({currentTeamData.players.length})
              </h4>
              <div className="flex items-center space-x-2">
                {currentTeamData.captain && (
                  <div className="flex items-center text-xs text-blue-600">
                    <FaCrown className="mr-1" />
                    <span>Captain</span>
                  </div>
                )}
                {currentTeamData.viceCaptain && (
                  <div className="flex items-center text-xs text-green-600">
                    <FaStar className="mr-1" />
                    <span>Vice Captain</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {currentTeamData.players.map((player: PlayingXIPlayer, index: number) => (
                <div
                  key={player._id}
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {getRoleIcon(player.role)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 text-sm truncate">
                        {player.fullName}
                      </span>
                      {currentTeamData.captain?._id === player._id && (
                        <FaCrown className="text-blue-600 text-xs" />
                      )}
                      {currentTeamData.viceCaptain?._id === player._id && (
                        <FaStar className="text-green-600 text-xs" />
                      )}
                      {currentTeamData.wicketKeeper?._id === player._id && (
                        <FaHandPaper className="text-purple-600 text-xs" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          player.role
                        )}`}
                      >
                        {getRoleIcon(player.role)}
                        <span className="ml-1">{getRoleDisplayName(player.role)}</span>
                      </span>
                      <span className="text-xs text-gray-500">
                        {player.nationality}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Captain & Vice Captain Info */}
            {(currentTeamData.captain || currentTeamData.viceCaptain) && (
              <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                  <h5 className="text-sm font-semibold text-white flex items-center">
                    <FaCrown className="mr-2" />
                    Leadership
                  </h5>
                </div>
                <div className="p-4 space-y-3">
                  {currentTeamData.captain && (
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FaCrown className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <div className="text-xs text-blue-600 font-medium">Captain</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {currentTeamData.captain.fullName}
                        </div>
                      </div>
                    </div>
                  )}
                  {currentTeamData.viceCaptain && (
                    <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <FaStar className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <div className="text-xs text-green-600 font-medium">Vice Captain</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {currentTeamData.viceCaptain.fullName}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Batting Order */}
            {currentTeamData.battingOrder && currentTeamData.battingOrder.length > 0 && (
              <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
                  <h5 className="text-sm font-semibold text-white flex items-center">
                    <FaBolt className="mr-2" />
                    Batting Order
                  </h5>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    {currentTeamData.battingOrder.map((player: PlayingXIPlayer, index: number) => (
                      <div key={player._id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">{player.fullName}</div>
                          <div className="text-xs text-gray-500 capitalize">{player.role}</div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {getRoleDisplayName(player.role)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bench Players */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              Bench Players ({benchPlayers.length})
            </h4>

            {benchPlayers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaUsers className="text-2xl mx-auto mb-2" />
                <p className="text-sm">
                  {currentSquadData.length > 0 
                    ? "All squad players are in Playing XI" 
                    : "No squad data available"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {benchPlayers.map((player: EnhancedPlayer) => (
                  <div
                    key={player._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {getRoleIcon(player.role)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {player.fullName}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            player.role
                          )}`}
                        >
                          {getRoleIcon(player.role)}
                          <span className="ml-1">{getRoleDisplayName(player.role)}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {player.nationality}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Squad Summary */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-medium text-gray-900 mb-2">
                Squad Summary
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Squad:</span>
                  <span className="font-medium">{currentSquadData.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Playing XI:</span>
                  <span className="font-medium">{hasTeamData ? currentTeamData.players.length : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">On Bench:</span>
                  <span className="font-medium">{benchPlayers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Batsmen:</span>
                  <span className="font-medium">
                    {currentSquadData.filter((p: EnhancedPlayer) => p.role === "batsman").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bowlers:</span>
                  <span className="font-medium">
                    {currentSquadData.filter((p: EnhancedPlayer) => p.role === "bowler").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">All Rounders:</span>
                  <span className="font-medium">
                    {currentSquadData.filter((p: EnhancedPlayer) => p.role === "all_rounder").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wicket Keepers:</span>
                  <span className="font-medium">
                    {currentSquadData.filter((p: EnhancedPlayer) => p.role === "wicket_keeper").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayingXI;
