import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FaUsers,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCrown,
  FaUserTie,
  FaHandPaper,
  FaBatteryHalf,
  FaCheck,
  FaTimes,
  FaExchangeAlt,
  FaUserPlus,
  FaUserMinus,
  FaListOl,
  FaShieldAlt,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

const MatchSquad: React.FC = () => {
  const { id: matchId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"squad" | "playing-xi">("squad");
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  // Fetch match details
  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => adminApi.getMatch(matchId!),
    enabled: !!matchId,
  });

  const match = matchData?.data;

  // Fetch teams
  const { data: teamsData } = useQuery({
    queryKey: ["teams"],
    queryFn: () => adminApi.getTeams(),
  });

  const teams = teamsData?.data?.data || [];

  // Set default selected team
  useEffect(() => {
    if (match && teams.length > 0 && !selectedTeam) {
      setSelectedTeam(match.team1Id || teams[0].id);
    }
  }, [match, teams, selectedTeam]);

  // Fetch players for selected team
  const { data: playersData, isLoading: playersLoading } = useQuery({
    queryKey: ["players", selectedTeam],
    queryFn: () => adminApi.getPlayers({ teamId: selectedTeam }),
    enabled: !!selectedTeam,
  });

  const players = playersData?.data?.data || [];

  // Mock squad data for demonstration
  const [squadPlayers, setSquadPlayers] = useState<string[]>([]);
  const [playingXIPlayers, setPlayingXIPlayers] = useState<string[]>([]);
  const [captain, setCaptain] = useState<string>("");
  const [viceCaptain, setViceCaptain] = useState<string>("");
  const [wicketKeeper, setWicketKeeper] = useState<string>("");
  const [battingOrder, setBattingOrder] = useState<string[]>([]);

  // Helper functions
  const isPlayerInSquad = (playerId: string) => {
    return squadPlayers.includes(playerId);
  };

  const isPlayerInPlayingXI = (playerId: string) => {
    return playingXIPlayers.includes(playerId);
  };

  const getPlayerRole = (player: any) => {
    const roleMap: { [key: string]: string } = {
      batsman: "Batsman",
      bowler: "Bowler",
      "all-rounder": "All-Rounder",
      "wicket-keeper": "Wicket-Keeper",
    };
    return roleMap[player.role] || player.role;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "batsman":
        return <FaBatteryHalf className="text-blue-500" />;
      case "bowler":
        return <FaShieldAlt className="text-red-500" />;
      case "all-rounder":
        return <FaExchangeAlt className="text-green-500" />;
      case "wicket-keeper":
        return <FaHandPaper className="text-purple-500" />;
      default:
        return <FaUsers className="text-gray-500" />;
    }
  };

  const handleToggleSquadPlayer = (playerId: string) => {
    const newSquad = isPlayerInSquad(playerId)
      ? squadPlayers.filter((id) => id !== playerId)
      : [...squadPlayers, playerId];

    setSquadPlayers(newSquad);
    toast.success(
      isPlayerInSquad(playerId)
        ? "Player removed from squad"
        : "Player added to squad"
    );
  };

  const handleTogglePlayingXIPlayer = (playerId: string) => {
    const newPlayingXI = isPlayerInPlayingXI(playerId)
      ? playingXIPlayers.filter((id) => id !== playerId)
      : [...playingXIPlayers, playerId];

    setPlayingXIPlayers(newPlayingXI);
    toast.success(
      isPlayerInPlayingXI(playerId)
        ? "Player removed from Playing XI"
        : "Player added to Playing XI"
    );
  };

  const handleSetCaptain = (playerId: string) => {
    setCaptain(playerId);
    toast.success("Captain updated");
  };

  const handleSetViceCaptain = (playerId: string) => {
    setViceCaptain(playerId);
    toast.success("Vice Captain updated");
  };

  const handleSetWicketKeeper = (playerId: string) => {
    setWicketKeeper(playerId);
    toast.success("Wicket Keeper updated");
  };

  const handleUpdateBattingOrder = (playerId: string, position: number) => {
    const newOrder = [...battingOrder];

    // Remove player from current position
    const currentIndex = newOrder.indexOf(playerId);
    if (currentIndex > -1) {
      newOrder.splice(currentIndex, 1);
    }

    // Add player to new position
    newOrder.splice(position - 1, 0, playerId);

    setBattingOrder(newOrder);
    toast.success("Batting order updated");
  };

  if (matchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Match not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaUsers className="mr-3 text-indigo-600" />
                  Match Squad Management
                </h1>
                <p className="text-gray-600 mt-2">Squad management for match</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Selection */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Select Team</h3>
            <div className="flex space-x-4">
              {teams.map((team: any) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team.id)}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    selectedTeam === team.id
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{team.name}</div>
                  <div className="text-sm opacity-75">{team.shortName}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedTeam && (
          <>
            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("squad")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "squad"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FaUsers className="inline mr-2" />
                    Squad Management
                  </button>
                  <button
                    onClick={() => setActiveTab("playing-xi")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "playing-xi"
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FaListOl className="inline mr-2" />
                    Playing XI
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            {activeTab === "squad" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Players */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Available Players</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Select players to add to the squad
                    </p>
                  </div>
                  <div className="p-6">
                    {playersLoading ? (
                      <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-16 bg-gray-200 rounded"
                          ></div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {players.map((player: any) => (
                          <div
                            key={player.id}
                            className={`p-4 border rounded-lg transition-colors ${
                              isPlayerInSquad(player.id)
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <FaUsers className="text-gray-500" />
                                </div>
                                <div>
                                  <div className="font-semibold">
                                    {player.name}
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    {getRoleIcon(player.role)}
                                    <span>{getPlayerRole(player)}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  handleToggleSquadPlayer(player.id)
                                }
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                  isPlayerInSquad(player.id)
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                              >
                                {isPlayerInSquad(player.id) ? (
                                  <>
                                    <FaUserMinus className="inline mr-1" />
                                    Remove
                                  </>
                                ) : (
                                  <>
                                    <FaUserPlus className="inline mr-1" />
                                    Add
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Squad Players */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Squad Players</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Players selected for the match
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {squadPlayers.length > 0 ? (
                        squadPlayers.map((playerId) => {
                          const player = players.find(
                            (p: any) => p.id === playerId
                          );
                          if (!player) return null;

                          return (
                            <div
                              key={player.id}
                              className="p-4 border border-green-500 rounded-lg bg-green-50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <FaUsers className="text-gray-500" />
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      {player.name}
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      {getRoleIcon(player.role)}
                                      <span>{getPlayerRole(player)}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {isPlayerInPlayingXI(player.id) && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                      Playing XI
                                    </span>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleToggleSquadPlayer(player.id)
                                    }
                                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                  >
                                    <FaUserMinus className="inline mr-1" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <FaUsers className="mx-auto h-12 w-12 mb-4" />
                          <p>No players in squad yet</p>
                          <p className="text-sm">
                            Select players from the available list
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">
                    Playing XI Management
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Select playing XI and set batting order, captain,
                    vice-captain, and wicket-keeper
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Squad Players for Playing XI Selection */}
                    <div>
                      <h4 className="font-semibold mb-4">Select Playing XI</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {squadPlayers.map((playerId) => {
                          const player = players.find(
                            (p: any) => p.id === playerId
                          );
                          if (!player) return null;

                          const isInPlayingXI = isPlayerInPlayingXI(player.id);
                          const isCaptain = captain === player.id;
                          const isViceCaptain = viceCaptain === player.id;
                          const isWicketKeeper = wicketKeeper === player.id;

                          return (
                            <div
                              key={player.id}
                              className={`p-4 border rounded-lg transition-colors ${
                                isInPlayingXI
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <FaUsers className="text-gray-500 text-sm" />
                                  </div>
                                  <div>
                                    <div className="font-semibold text-sm">
                                      {player.name}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {getPlayerRole(player)}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() =>
                                    handleTogglePlayingXIPlayer(player.id)
                                  }
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    isInPlayingXI
                                      ? "bg-red-500 text-white hover:bg-red-600"
                                      : "bg-blue-500 text-white hover:bg-blue-600"
                                  }`}
                                >
                                  {isInPlayingXI ? "Remove" : "Add"}
                                </button>
                              </div>

                              {isInPlayingXI && (
                                <div className="space-y-2">
                                  {/* Role Buttons */}
                                  <div className="flex flex-wrap gap-1">
                                    <button
                                      onClick={() =>
                                        handleSetCaptain(player.id)
                                      }
                                      className={`px-2 py-1 rounded text-xs ${
                                        isCaptain
                                          ? "bg-yellow-500 text-white"
                                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      }`}
                                      title="Captain"
                                    >
                                      <FaCrown className="inline mr-1" />C
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleSetViceCaptain(player.id)
                                      }
                                      className={`px-2 py-1 rounded text-xs ${
                                        isViceCaptain
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      }`}
                                      title="Vice Captain"
                                    >
                                      <FaUserTie className="inline mr-1" />
                                      VC
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleSetWicketKeeper(player.id)
                                      }
                                      className={`px-2 py-1 rounded text-xs ${
                                        isWicketKeeper
                                          ? "bg-purple-500 text-white"
                                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      }`}
                                      title="Wicket Keeper"
                                    >
                                      <FaHandPaper className="inline mr-1" />
                                      WK
                                    </button>
                                  </div>

                                  {/* Batting Position */}
                                  <div className="flex items-center space-x-2">
                                    <label className="text-xs text-gray-600">
                                      Batting:
                                    </label>
                                    <select
                                      value={
                                        battingOrder.indexOf(player.id) + 1 ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleUpdateBattingOrder(
                                          player.id,
                                          parseInt(e.target.value)
                                        )
                                      }
                                      className="px-2 py-1 text-xs border rounded"
                                    >
                                      <option value="">-</option>
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
                                        (pos) => (
                                          <option key={pos} value={pos}>
                                            {pos}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Playing XI Summary */}
                    {playingXIPlayers.length > 0 && (
                      <div className="border-t pt-6">
                        <h4 className="font-semibold mb-4">
                          Playing XI Summary
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2">
                                Batting Order
                              </h5>
                              <div className="space-y-1">
                                {battingOrder.map((playerId, index) => {
                                  const player = players.find(
                                    (p: any) => p.id === playerId
                                  );
                                  if (!player) return null;

                                  return (
                                    <div
                                      key={playerId}
                                      className="flex items-center space-x-2 text-sm"
                                    >
                                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                                        {index + 1}
                                      </span>
                                      <span>{player.name}</span>
                                      {captain === playerId && (
                                        <FaCrown
                                          className="text-yellow-500 text-xs"
                                          title="Captain"
                                        />
                                      )}
                                      {viceCaptain === playerId && (
                                        <FaUserTie
                                          className="text-blue-500 text-xs"
                                          title="Vice Captain"
                                        />
                                      )}
                                      {wicketKeeper === playerId && (
                                        <FaHandPaper
                                          className="text-purple-500 text-xs"
                                          title="Wicket Keeper"
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Team Roles</h5>
                              <div className="space-y-2 text-sm">
                                {captain && (
                                  <div className="flex items-center space-x-2">
                                    <FaCrown className="text-yellow-500" />
                                    <span>
                                      Captain:{" "}
                                      {
                                        players.find(
                                          (p: any) => p.id === captain
                                        )?.name
                                      }
                                    </span>
                                  </div>
                                )}
                                {viceCaptain && (
                                  <div className="flex items-center space-x-2">
                                    <FaUserTie className="text-blue-500" />
                                    <span>
                                      Vice Captain:{" "}
                                      {
                                        players.find(
                                          (p: any) => p.id === viceCaptain
                                        )?.name
                                      }
                                    </span>
                                  </div>
                                )}
                                {wicketKeeper && (
                                  <div className="flex items-center space-x-2">
                                    <FaHandPaper className="text-purple-500" />
                                    <span>
                                      Wicket Keeper:{" "}
                                      {
                                        players.find(
                                          (p: any) => p.id === wicketKeeper
                                        )?.name
                                      }
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MatchSquad;
