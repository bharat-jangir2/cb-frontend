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
  FaSave,
  FaUndo,
  FaRedo,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaStar,
  FaStarHalf,
  FaSearch,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";
import type {
  EnhancedPlayer,
  EnhancedSquadData,
  SquadUpdateData,
  EnhancedPlayingXIData,
  PlayingXIPlayer,
  PlayingXIUpdateData,
  CaptainUpdateData,
  ViceCaptainUpdateData,
  BattingOrderUpdateData,
  WicketKeeperUpdateData,
} from "../../services/admin";

const MatchSquad: React.FC = () => {
  const { id: matchId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State management
  const [activeTab, setActiveTab] = useState<"squad" | "playing-xi">("squad");
  const [selectedTeam, setSelectedTeam] = useState<"teamA" | "teamB">("teamA");
  const [selectedSquadPlayers, setSelectedSquadPlayers] = useState<string[]>(
    []
  );
  const [selectedPlayingXIPlayers, setSelectedPlayingXIPlayers] = useState<
    string[]
  >([]);
  const [captain, setCaptain] = useState<string>("");
  const [viceCaptain, setViceCaptain] = useState<string>("");
  const [wicketKeeper, setWicketKeeper] = useState<string>("");
  const [battingOrder, setBattingOrder] = useState<string[]>([]);

  // Helper function to get player details by ID
  const getPlayerById = (playerId: string) => {
    return (allPlayersData as any)?.data?.find((p: any) => p._id === playerId);
  };

  const [activeRoleFilter, setActiveRoleFilter] = useState<
    "all" | "batsman" | "bowler" | "all_rounder" | "wicket_keeper"
  >("all");

  // Pagination and search states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "role" | "nationality">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Queries
  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => adminApi.getMatch(matchId!),
    enabled: !!matchId,
  });

  const {
    data: allPlayersData,
    isLoading: playersLoading,
    error: playersError,
  } = useQuery({
    queryKey: ["all-players"],
    queryFn: () => adminApi.getAllPlayers(1000),
    enabled: true,
  });

  const {
    data: squadData,
    isLoading: squadLoading,
    refetch: refetchSquad,
  } = useQuery({
    queryKey: ["squad", matchId],
    queryFn: async () => {
      const response = await adminApi.getMatchSquad(matchId!);
      console.log("Squad API response:", response);
      const squadStructure = {
        teamA: response?.data?.teamA || response?.teamA || [],
        teamB: response?.data?.teamB || response?.teamB || [],
      };
      console.log("Processed squad structure:", squadStructure);
      return squadStructure;
    },
    enabled: !!matchId,
  });

  const {
    data: playingXIData,
    isLoading: playingXILoading,
    refetch: refetchPlayingXI,
  } = useQuery({
    queryKey: ["playing-xi", matchId],
    queryFn: () => adminApi.getPlayingXI(matchId!),
    enabled: !!matchId,
  });

  // Mutations
  const updateSquadMutation = useMutation({
    mutationFn: async (squadData: SquadUpdateData) => {
      console.log("Updating squad with data:", squadData);

      console.log("Sending squad update:", squadData);
      return adminApi.updateMatchSquad(matchId!, squadData);
    },
    onSuccess: () => {
      toast.success("Squad updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["squad", matchId] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update squad: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  const updatePlayingXIMutation = useMutation({
    mutationFn: async (playingXIData: {
      teamA?: string[];
      teamB?: string[];
    }) => {
      console.log("Updating Playing XI with data:", playingXIData);

      // Only include teams that have players selected
      const enhancedData: PlayingXIUpdateData = {};

      if (playingXIData.teamA && playingXIData.teamA.length > 0) {
        enhancedData.teamA = {
          players: playingXIData.teamA,
          captain: captain || playingXIData.teamA[0],
          viceCaptain: viceCaptain || playingXIData.teamA[0],
          battingOrder:
            battingOrder.length > 0 ? battingOrder : playingXIData.teamA,
          wicketKeeper: wicketKeeper || playingXIData.teamA[0],
        };
      }

      if (playingXIData.teamB && playingXIData.teamB.length > 0) {
        enhancedData.teamB = {
          players: playingXIData.teamB,
          captain: captain || playingXIData.teamB[0],
          viceCaptain: viceCaptain || playingXIData.teamB[0],
          battingOrder:
            battingOrder.length > 0 ? battingOrder : playingXIData.teamB,
          wicketKeeper: wicketKeeper || playingXIData.teamB[0],
        };
      }

      // If no teams have players, send empty structure
      if (Object.keys(enhancedData).length === 0) {
        enhancedData.teamA = {
          players: [],
          captain: "",
          viceCaptain: "",
          battingOrder: [],
          wicketKeeper: "",
        };
        enhancedData.teamB = {
          players: [],
          captain: "",
          viceCaptain: "",
          battingOrder: [],
          wicketKeeper: "",
        };
      }

      return adminApi.updatePlayingXI(matchId!, enhancedData);
    },
    onSuccess: () => {
      toast.success("Playing XI updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["playing-xi", matchId] });
    },
    onError: (error: any) => {
      toast.error(
        `Failed to update Playing XI: ${
          error?.response?.data?.message || error.message
        }`
      );
    },
  });

  // Enhanced Playing XI mutations
  const updateCaptainMutation = useMutation({
    mutationFn: (data: CaptainUpdateData) =>
      adminApi.updateCaptain(matchId!, data),
    onSuccess: () => {
      toast.success("Captain updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["playing-xi", matchId] });
    },
  });

  const updateViceCaptainMutation = useMutation({
    mutationFn: (data: ViceCaptainUpdateData) =>
      adminApi.updateViceCaptain(matchId!, data),
    onSuccess: () => {
      toast.success("Vice-Captain updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["playing-xi", matchId] });
    },
  });

  const updateBattingOrderMutation = useMutation({
    mutationFn: (data: BattingOrderUpdateData) =>
      adminApi.updateBattingOrder(matchId!, data),
    onSuccess: () => {
      toast.success("Batting order updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["playing-xi", matchId] });
    },
  });

  const updateWicketKeeperMutation = useMutation({
    mutationFn: (data: WicketKeeperUpdateData) =>
      adminApi.updateWicketKeeper(matchId!, data),
    onSuccess: () => {
      toast.success("Wicket-Keeper updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["playing-xi", matchId] });
    },
  });

  // Data processing
  const match = matchData?.data || matchData;
  const allPlayers = (allPlayersData as any)?.data || [];
  const teamPlayers = allPlayers;

  // Helper functions
  const getPlayerRole = (player: any) => {
    switch (player.role) {
      case "batsman":
        return "Batsman";
      case "bowler":
        return "Bowler";
      case "all_rounder":
        return "All-Rounder";
      case "wicket_keeper":
        return "Wicket-Keeper";
      default:
        return "Unknown";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "batsman":
        return <FaBatteryHalf className="text-blue-500" />;
      case "bowler":
        return <FaShieldAlt className="text-red-500" />;
      case "all_rounder":
        return <FaExchangeAlt className="text-green-500" />;
      case "wicket_keeper":
        return <FaHandPaper className="text-purple-500" />;
      default:
        return <FaUsers className="text-gray-500" />;
    }
  };

  // Helper functions for large dataset management
  const getFilteredAndSortedPlayers = (players: any[]) => {
    let filtered = players;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (player) =>
          (player.fullName || player.shortName || player.name)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (player.nationality || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (player.role || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (activeRoleFilter !== "all") {
      filtered = filtered.filter((player) => player.role === activeRoleFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = (a.fullName || a.shortName || a.name || "").toLowerCase();
          bValue = (b.fullName || b.shortName || b.name || "").toLowerCase();
          break;
        case "role":
          aValue = (a.role || "").toLowerCase();
          bValue = (b.role || "").toLowerCase();
          break;
        case "nationality":
          aValue = (a.nationality || "").toLowerCase();
          bValue = (b.nationality || "").toLowerCase();
          break;
        default:
          aValue = (a.fullName || a.shortName || a.name || "").toLowerCase();
          bValue = (b.fullName || b.shortName || b.name || "").toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  };

  const getPaginatedPlayers = (players: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return players.slice(startIndex, endIndex);
  };

  const getTotalPages = (players: any[]) => {
    return Math.ceil(players.length / itemsPerPage);
  };

  // Helper function to get team names
  const getTeamName = (team: "teamA" | "teamB") => {
    if (team === "teamA") {
      return (
        (match as any)?.teamAId?.name ||
        (match as any)?.team1Id?.name ||
        "Team A"
      );
    } else {
      return (
        (match as any)?.teamBId?.name ||
        (match as any)?.team2Id?.name ||
        "Team B"
      );
    }
  };

  const isPlayerInSquad = (playerId: string) => {
    return selectedSquadPlayers.includes(playerId);
  };

  const isPlayerInPlayingXI = (playerId: string) => {
    return selectedPlayingXIPlayers.includes(playerId);
  };

  // Event handlers
  const handleToggleSquadPlayer = (playerId: string) => {
    setSelectedSquadPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleTogglePlayingXIPlayer = (playerId: string) => {
    setSelectedPlayingXIPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSetCaptain = (playerId: string) => {
    setCaptain(playerId);
    const team = selectedTeam === "teamA" ? "A" : "B";
    updateCaptainMutation.mutate({ team, captainId: playerId });
  };

  const handleSetViceCaptain = (playerId: string) => {
    setViceCaptain(playerId);
    const team = selectedTeam === "teamA" ? "A" : "B";
    updateViceCaptainMutation.mutate({ team, viceCaptainId: playerId });
  };

  const handleSetWicketKeeper = (playerId: string) => {
    setWicketKeeper(playerId);
    const team = selectedTeam === "teamA" ? "A" : "B";
    updateWicketKeeperMutation.mutate({ team, wicketKeeperId: playerId });
  };

  const handleUpdateBattingOrder = (playerId: string, position: number) => {
    const newOrder = [...battingOrder];
    const existingIndex = newOrder.indexOf(playerId);

    if (existingIndex !== -1) {
      newOrder.splice(existingIndex, 1);
    }

    newOrder.splice(position - 1, 0, playerId);
    setBattingOrder(newOrder);

    // Update batting order via API
    const team = selectedTeam === "teamA" ? "A" : "B";
    updateBattingOrderMutation.mutate({ team, battingOrder: newOrder });
  };

  const handleTeamSwitch = (team: "teamA" | "teamB") => {
    setSelectedTeam(team);
    setSelectedSquadPlayers([]);
    setSelectedPlayingXIPlayers([]);
    setCaptain("");
    setViceCaptain("");
    setWicketKeeper("");
    setBattingOrder([]);
    setCurrentPage(1);
  };

  const handleSaveSquad = () => {
    const squadUpdateData: SquadUpdateData = {
      teamA:
        selectedTeam === "teamA"
          ? selectedSquadPlayers
          : (squadData?.teamA as any)?.map((p: any) =>
              typeof p === "string" ? p : p._id
            ) || [],
      teamB:
        selectedTeam === "teamB"
          ? selectedSquadPlayers
          : (squadData?.teamB as any)?.map((p: any) =>
              typeof p === "string" ? p : p._id
            ) || [],
    };
    updateSquadMutation.mutate(squadUpdateData);
  };

  const handleSavePlayingXI = () => {
    // Enhanced validation for Playing XI components (only if players are selected)
    if (selectedPlayingXIPlayers.length > 0) {
      // Validate captain is selected
      if (!captain) {
        toast.error("Please select a captain for the Playing XI");
        return;
      }

      // Validate vice-captain is selected
      if (!viceCaptain) {
        toast.error("Please select a vice-captain for the Playing XI");
        return;
      }

      // Validate captain ≠ vice-captain
      if (captain === viceCaptain) {
        toast.error("Captain and vice-captain cannot be the same player");
        return;
      }

      // Validate wicket-keeper is selected
      if (!wicketKeeper) {
        toast.error("Please select a wicket-keeper for the Playing XI");
        return;
      }

      // Validate batting order has all players
      if (battingOrder.length !== selectedPlayingXIPlayers.length) {
        toast.error("Batting order must include all Playing XI players");
        return;
      }

      // Validate no duplicates in batting order
      const battingOrderSet = new Set(battingOrder);
      if (battingOrderSet.size !== battingOrder.length) {
        toast.error("Batting order cannot have duplicate players");
        return;
      }

      // Note: Any player can be assigned as wicket-keeper regardless of their original role
      // This allows flexibility in team selection
    }
    // If no players selected, allow empty Playing XI (no validation needed)

    // Prepare data for the mutation (only player IDs)
    const playingXIUpdateData = {
      teamA:
        selectedTeam === "teamA"
          ? selectedPlayingXIPlayers
          : (playingXIData?.data?.teamA as any)?.players?.map((p: any) =>
              typeof p === "string" ? p : p._id
            ) || [],
      teamB:
        selectedTeam === "teamB"
          ? selectedPlayingXIPlayers
          : (playingXIData?.data?.teamB as any)?.players?.map((p: any) =>
              typeof p === "string" ? p : p._id
            ) || [],
    };
    updatePlayingXIMutation.mutate(playingXIUpdateData);
  };

  // Effects
  useEffect(() => {
    if (squadData) {
      const currentSquad =
        selectedTeam === "teamA" ? squadData.teamA : squadData.teamB;
      setSelectedSquadPlayers(
        Array.isArray(currentSquad)
          ? currentSquad.map((p: any) => (typeof p === "string" ? p : p._id))
          : []
      );
    }
  }, [squadData, selectedTeam]);

  useEffect(() => {
    if (playingXIData) {
      console.log("Processing Playing XI data for team:", selectedTeam);
      console.log("Full Playing XI data:", playingXIData);

      const currentPlayingXI =
        selectedTeam === "teamA" ? playingXIData.teamA : playingXIData.teamB;

      console.log("Current team Playing XI:", currentPlayingXI);

      // Extract player IDs from the full player objects
      setSelectedPlayingXIPlayers(
        currentPlayingXI?.players?.map((p: any) =>
          typeof p === "string" ? p : p._id
        ) || []
      );

      // Extract IDs from captain, vice-captain, wicket-keeper objects
      setCaptain(
        currentPlayingXI?.captain
          ? typeof currentPlayingXI.captain === "string"
            ? currentPlayingXI.captain
            : currentPlayingXI.captain._id
          : ""
      );

      setViceCaptain(
        currentPlayingXI?.viceCaptain
          ? typeof currentPlayingXI.viceCaptain === "string"
            ? currentPlayingXI.viceCaptain
            : currentPlayingXI.viceCaptain._id
          : ""
      );

      setWicketKeeper(
        currentPlayingXI?.wicketKeeper
          ? typeof currentPlayingXI.wicketKeeper === "string"
            ? currentPlayingXI.wicketKeeper
            : currentPlayingXI.wicketKeeper._id
          : ""
      );

      // Extract IDs from batting order array
      const extractedBattingOrder =
        currentPlayingXI?.battingOrder?.map((p: any) =>
          typeof p === "string" ? p : p._id
        ) || [];

      setBattingOrder(extractedBattingOrder);

      // Log extracted values for debugging
      console.log("Extracted values:", {
        players:
          currentPlayingXI?.players?.map((p: any) =>
            typeof p === "string" ? p : p._id
          ) || [],
        captain: currentPlayingXI?.captain
          ? typeof currentPlayingXI.captain === "string"
            ? currentPlayingXI.captain
            : currentPlayingXI.captain._id
          : "",
        viceCaptain: currentPlayingXI?.viceCaptain
          ? typeof currentPlayingXI.viceCaptain === "string"
            ? currentPlayingXI.viceCaptain
            : currentPlayingXI.viceCaptain._id
          : "",
        wicketKeeper: currentPlayingXI?.wicketKeeper
          ? typeof currentPlayingXI.wicketKeeper === "string"
            ? currentPlayingXI.wicketKeeper
            : currentPlayingXI.wicketKeeper._id
          : "",
        battingOrder: extractedBattingOrder,
      });
    }
  }, [playingXIData, selectedTeam]);

  useEffect(() => {
    if (match) {
      refetchSquad();
      refetchPlayingXI();
    }
  }, [match, refetchSquad, refetchPlayingXI]);

  // Loading states
  if (matchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Match not found
          </h2>
          <button
            onClick={() => navigate("/admin/matches")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Matches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/matches")}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Match Squad Management
                </h1>
                <p className="text-gray-600">
                  {(match as any)?.name || "Match"} - Manage squad and Playing
                  XI
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {getTeamName("teamA")} vs {getTeamName("teamB")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Status</div>
              <div
                className={`text-lg font-semibold ${
                  (match as any)?.status === "live"
                    ? "text-green-600"
                    : (match as any)?.status === "completed"
                    ? "text-gray-600"
                    : "text-yellow-600"
                }`}
              >
                {(match as any)?.status?.replace("_", " ").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Team Selection */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => handleTeamSwitch("teamA")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTeam === "teamA"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {getTeamName("teamA")} (
              {selectedTeam === "teamA"
                ? selectedSquadPlayers.length
                : (squadData?.teamA as any)?.length || 0}{" "}
              in squad,{" "}
              {(playingXIData?.data?.teamA as any)?.players?.length || 0} in XI)
            </button>
            <button
              onClick={() => handleTeamSwitch("teamB")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTeam === "teamB"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {getTeamName("teamB")} (
              {selectedTeam === "teamB"
                ? selectedSquadPlayers.length
                : (squadData?.teamB as any)?.length || 0}{" "}
              in squad,{" "}
              {(playingXIData?.data?.teamB as any)?.players?.length || 0} in XI)
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("squad")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "squad"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Squad Management
              </button>
              <button
                onClick={() => setActiveTab("playing-xi")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "playing-xi"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Playing XI
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "squad" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Players */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Available Players</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Select players for {getTeamName(selectedTeam)} squad
                </p>
              </div>
              <div className="p-6">
                {/* Search and Sort Controls */}
                <div className="mb-4 space-y-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search players by name, role, or nationality..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>

                  {/* Sort Controls */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">
                        Sort by:
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(
                            e.target.value as "name" | "role" | "nationality"
                          );
                          setCurrentPage(1);
                        }}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="name">Name</option>
                        <option value="role">Role</option>
                        <option value="nationality">Nationality</option>
                      </select>
                      <button
                        onClick={() => {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          setCurrentPage(1);
                        }}
                        className="p-1 text-gray-600 hover:text-gray-800"
                      >
                        {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                      </button>
                    </div>

                    <div className="text-sm text-gray-600">
                      Showing{" "}
                      {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        getFilteredAndSortedPlayers(teamPlayers).length
                      )}{" "}
                      -{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        getFilteredAndSortedPlayers(teamPlayers).length
                      )}{" "}
                      of {getFilteredAndSortedPlayers(teamPlayers).length}{" "}
                      players
                    </div>
                  </div>
                </div>

                {playersLoading ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : playersError ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 mb-2">
                      <FaExclamationTriangle className="mx-auto h-8 w-8" />
                    </div>
                    <p className="text-red-600 font-medium">
                      Failed to load players
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {playersError.message || "Please try refreshing the page"}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Refresh Page
                    </button>
                  </div>
                ) : getFilteredAndSortedPlayers(teamPlayers).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <FaUsers className="mx-auto h-8 w-8" />
                    </div>
                    <p className="text-gray-600 font-medium">
                      {searchTerm
                        ? "No players match your search"
                        : "No players available"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {searchTerm
                        ? `Try adjusting your search terms or filters`
                        : allPlayers.length === 0
                        ? "No players found in the system"
                        : "No players match the current team selection"}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getPaginatedPlayers(
                      getFilteredAndSortedPlayers(teamPlayers)
                    ).map((player: any) => (
                      <div
                        key={player._id}
                        className={`p-4 border rounded-lg transition-colors ${
                          isPlayerInSquad(player._id)
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
                                {player.fullName ||
                                  player.shortName ||
                                  player.name}
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                {getRoleIcon(player.role)}
                                <span>{getPlayerRole(player)}</span>
                                {player.nationality && (
                                  <span className="text-xs text-gray-500">
                                    ({player.nationality})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleSquadPlayer(player._id)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              isPlayerInSquad(player._id)
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                          >
                            {isPlayerInSquad(player._id) ? (
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
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleSaveSquad}
                  disabled={updateSquadMutation.isPending}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {updateSquadMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Squad
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Squad Players */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  {getTeamName(selectedTeam)} Squad Players
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Players selected for the match
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {selectedSquadPlayers.length > 0 ? (
                    selectedSquadPlayers.map((playerId) => {
                      const player = allPlayers.find(
                        (p: any) => p._id === playerId
                      );
                      if (!player) return null;

                      return (
                        <div
                          key={player._id}
                          className="p-4 border border-green-500 rounded-lg bg-green-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <FaUsers className="text-gray-500" />
                              </div>
                              <div>
                                <div className="font-semibold">
                                  {player.fullName || player.name}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  {getRoleIcon(player.role)}
                                  <span>{getPlayerRole(player)}</span>
                                  {player.nationality && (
                                    <span className="text-xs text-gray-500">
                                      ({player.nationality})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isPlayerInPlayingXI(player._id) && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  Playing XI
                                </span>
                              )}
                              <button
                                onClick={() =>
                                  handleToggleSquadPlayer(player._id)
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
        )}

        {activeTab === "playing-xi" && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {getTeamName(selectedTeam)} Playing XI Management
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Select 11 players and assign roles
              </p>
            </div>
            <div className="p-6">
              {/* Step 1: Select Playing XI Players */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4 flex items-center">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                    Step 1
                  </span>
                  Select Playing XI Players ({selectedPlayingXIPlayers.length}
                  /11)
                </h4>

                {selectedPlayingXIPlayers.length < 11 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      Please select exactly 11 players for the Playing XI before
                      assigning roles.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedSquadPlayers.map((playerId) => {
                    const player = allPlayers.find(
                      (p: any) => p._id === playerId
                    );
                    if (!player) return null;

                    const isInPlayingXI = isPlayerInPlayingXI(player._id);
                    const isDisabled =
                      selectedPlayingXIPlayers.length >= 11 && !isInPlayingXI;

                    return (
                      <div
                        key={player._id}
                        className={`p-4 border rounded-lg transition-colors ${
                          isInPlayingXI
                            ? "border-blue-500 bg-blue-50"
                            : isDisabled
                            ? "border-gray-200 bg-gray-50 opacity-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <FaUsers className="text-gray-500 text-sm" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">
                                {player.fullName ||
                                  player.shortName ||
                                  player.name}
                              </div>
                              <div className="text-xs text-gray-600">
                                {getPlayerRole(player)}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleTogglePlayingXIPlayer(player._id)
                            }
                            disabled={isDisabled}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              isInPlayingXI
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : isDisabled
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                          >
                            {isInPlayingXI ? "Remove" : "Add"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Role Assignments (Only show when 11 players selected) */}
              {selectedPlayingXIPlayers.length === 11 && (
                <div className="space-y-6">
                  <h4 className="font-semibold mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                      Step 2
                    </span>
                    Assign Roles & Batting Order
                  </h4>

                  {/* Role Assignment Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Captain */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900 flex items-center">
                          <FaCrown className="mr-2 text-yellow-500" />
                          Captain
                        </h5>
                        {captain && (
                          <button
                            onClick={() => setCaptain("")}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <select
                        value={captain}
                        onChange={(e) => setCaptain(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select Captain</option>
                        {selectedPlayingXIPlayers.map((playerId) => {
                          const player = getPlayerById(playerId);
                          return (
                            <option
                              key={playerId}
                              value={playerId}
                              disabled={viceCaptain === playerId}
                            >
                              {player?.fullName || player?.name}
                            </option>
                          );
                        })}
                      </select>
                      {captain && (
                        <div className="mt-2 text-sm text-gray-600">
                          {getPlayerById(captain)?.fullName ||
                            getPlayerById(captain)?.name}
                        </div>
                      )}
                    </div>

                    {/* Vice-Captain */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900 flex items-center">
                          <FaUserTie className="mr-2 text-blue-500" />
                          Vice-Captain
                        </h5>
                        {viceCaptain && (
                          <button
                            onClick={() => setViceCaptain("")}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <select
                        value={viceCaptain}
                        onChange={(e) => setViceCaptain(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select Vice-Captain</option>
                        {selectedPlayingXIPlayers.map((playerId) => {
                          const player = getPlayerById(playerId);
                          return (
                            <option
                              key={playerId}
                              value={playerId}
                              disabled={captain === playerId}
                            >
                              {player?.fullName || player?.name}
                            </option>
                          );
                        })}
                      </select>
                      {viceCaptain && (
                        <div className="mt-2 text-sm text-gray-600">
                          {getPlayerById(viceCaptain)?.fullName ||
                            getPlayerById(viceCaptain)?.name}
                        </div>
                      )}
                    </div>

                    {/* Wicket-Keeper */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900 flex items-center">
                          <FaHandPaper className="mr-2 text-purple-500" />
                          Wicket-Keeper
                        </h5>
                        {wicketKeeper && (
                          <button
                            onClick={() => setWicketKeeper("")}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">
                        Any player can be assigned as wicket-keeper
                      </p>
                      <select
                        value={wicketKeeper}
                        onChange={(e) => setWicketKeeper(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">
                          Select Wicket-Keeper (any player)
                        </option>
                        {selectedPlayingXIPlayers.map((playerId) => {
                          const player = getPlayerById(playerId);
                          return (
                            <option key={playerId} value={playerId}>
                              {player?.fullName || player?.name} (
                              {getPlayerRole(player)})
                            </option>
                          );
                        })}
                      </select>
                      {wicketKeeper && (
                        <div className="mt-2 text-sm text-gray-600">
                          {getPlayerById(wicketKeeper)?.fullName ||
                            getPlayerById(wicketKeeper)?.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Batting Order */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 flex items-center">
                        <FaListOl className="mr-2 text-green-500" />
                        Batting Order
                      </h5>
                      {battingOrder.length > 0 && (
                        <button
                          onClick={() => setBattingOrder([])}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((position) => (
                        <div
                          key={position}
                          className="flex items-center space-x-2"
                        >
                          <span className="text-sm font-medium text-gray-700 w-8">
                            {position}.
                          </span>
                          <select
                            value={battingOrder[position - 1] || ""}
                            onChange={(e) => {
                              const newOrder = [...battingOrder];
                              if (e.target.value) {
                                newOrder[position - 1] = e.target.value;
                              } else {
                                newOrder.splice(position - 1, 1);
                              }
                              setBattingOrder(newOrder.filter(Boolean));
                            }}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="">Select Player</option>
                            {selectedPlayingXIPlayers.map((playerId) => {
                              const player = getPlayerById(playerId);
                              return (
                                <option key={playerId} value={playerId}>
                                  {player?.fullName || player?.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      ))}
                    </div>
                    {battingOrder.length > 0 && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Current Order:</strong>{" "}
                        {battingOrder
                          .map((playerId, index) => {
                            const player = getPlayerById(playerId);
                            return `${index + 1}. ${
                              player?.fullName || player?.name
                            }`;
                          })
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="border-t pt-6">
                <button
                  onClick={handleSavePlayingXI}
                  disabled={
                    updatePlayingXIMutation.isPending ||
                    selectedPlayingXIPlayers.length !== 11
                  }
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {updatePlayingXIMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      {selectedPlayingXIPlayers.length === 11
                        ? "Save Playing XI"
                        : `Select ${
                            11 - selectedPlayingXIPlayers.length
                          } more player(s)`}
                    </>
                  )}
                </button>
                {selectedPlayingXIPlayers.length > 0 &&
                  selectedPlayingXIPlayers.length < 11 && (
                    <p className="text-sm text-orange-600 mt-2 text-center">
                      Please select exactly 11 players to proceed with role
                      assignments
                    </p>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchSquad;
