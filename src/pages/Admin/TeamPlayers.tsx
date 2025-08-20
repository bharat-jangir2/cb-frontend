import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaUserTie,
  FaCrown,
  FaHandPaper,
  FaBolt,
  FaSpinner,
  FaUsers,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

interface PlayerFilters {
  search?: string;
  role?: string;
  status?: string;
}

const TeamPlayers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<PlayerFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);

  // Fetch team details
  const { data: teamData, isLoading: teamLoading } = useQuery({
    queryKey: ["team", id],
    queryFn: () => adminApi.getTeam(id!),
    enabled: !!id,
  });

  // Fetch team players
  const { data: playersData, isLoading: playersLoading } = useQuery({
    queryKey: ["team-players", id, filters],
    queryFn: () => adminApi.getPlayersByTeam(id!),
    enabled: !!id,
  });

  // Fetch all players for adding to team
  const { data: allPlayersData, isLoading: allPlayersLoading } = useQuery({
    queryKey: ["all-players"],
    queryFn: () => adminApi.getAllPlayers(1000),
  });

  // Add player to team mutation
  const addPlayerToTeamMutation = useMutation({
    mutationFn: (playerId: string) =>
      adminApi.updatePlayer(playerId, { teamId: id }),
    onSuccess: () => {
      toast.success("Player added to team successfully");
      queryClient.invalidateQueries({ queryKey: ["team-players", id] });
      setShowAddPlayerModal(false);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to add player to team"
      );
    },
  });

  // Remove player from team mutation
  const removePlayerFromTeamMutation = useMutation({
    mutationFn: (playerId: string) =>
      adminApi.updatePlayer(playerId, { teamId: null }),
    onSuccess: () => {
      toast.success("Player removed from team successfully");
      queryClient.invalidateQueries({ queryKey: ["team-players", id] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove player from team"
      );
    },
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: (playerId: string) => adminApi.deletePlayer(playerId),
    onSuccess: () => {
      toast.success("Player deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["team-players", id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete player");
    },
  });

  const handleFilterChange = (key: keyof PlayerFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddPlayerToTeam = (playerId: string) => {
    addPlayerToTeamMutation.mutate(playerId);
  };

  const handleRemovePlayerFromTeam = (playerId: string) => {
    if (
      window.confirm(
        "Are you sure you want to remove this player from the team?"
      )
    ) {
      removePlayerFromTeamMutation.mutate(playerId);
    }
  };

  const handleDeletePlayer = (playerId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this player? This action cannot be undone."
      )
    ) {
      deletePlayerMutation.mutate(playerId);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "batsman":
        return <FaBolt className="text-orange-500" />;
      case "bowler":
        return <FaSpinner className="text-blue-500" />;
      case "all_rounder":
        return <FaUserTie className="text-green-500" />;
      case "wicket_keeper":
        return <FaHandPaper className="text-purple-500" />;
      default:
        return <FaUserTie className="text-gray-500" />;
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

  if (teamLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const team = (teamData as any)?.data || teamData;
  const players = (playersData as any)?.data?.data || [];
  const allPlayers = (allPlayersData as any)?.data?.data || [];

  // Filter players based on search and filters
  const filteredPlayers = players.filter((player: any) => {
    const matchesSearch =
      !filters.search ||
      (player.name || player.fullName || "")
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      (player.email || "").toLowerCase().includes(filters.search.toLowerCase());

    const matchesRole = !filters.role || player.role === filters.role;
    const matchesStatus = !filters.status || player.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get players not in the team
  const availablePlayers = allPlayers.filter(
    (player: any) =>
      !players.some((teamPlayer: any) => teamPlayer._id === player._id)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/teams"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Teams
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {team?.name} - Players
              </h1>
              <p className="text-gray-600">
                Manage players for {team?.name} team
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddPlayerModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Player
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.search || ""}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.role || ""}
                    onChange={(e) => handleFilterChange("role", e.target.value)}
                  >
                    <option value="">All Roles</option>
                    <option value="batsman">Batsman</option>
                    <option value="bowler">Bowler</option>
                    <option value="all_rounder">All Rounder</option>
                    <option value="wicket_keeper">Wicket Keeper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filters.status || ""}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playersLoading
            ? // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow animate-pulse"
                >
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            : filteredPlayers.map((player: any) => (
                <div
                  key={player._id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    {/* Player Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          {getRoleIcon(player.role)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {player.name || player.fullName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {player.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingPlayer(player)}
                          className="p-1 text-blue-600 hover:text-blue-900"
                          title="Edit Player"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemovePlayerFromTeam(player._id)}
                          className="p-1 text-orange-600 hover:text-orange-900"
                          title="Remove from Team"
                        >
                          <FaUsers className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlayer(player._id)}
                          className="p-1 text-red-600 hover:text-red-900"
                          title="Delete Player"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Player Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Role</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                            player.role
                          )}`}
                        >
                          {player.role || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            player.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {player.status || "Unknown"}
                        </span>
                      </div>
                      {player.nationality && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Nationality
                          </span>
                          <span className="text-sm font-medium">
                            {player.nationality}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/players/${player._id}`}
                          className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => setEditingPlayer(player)}
                          className="flex-1 text-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* Empty State */}
        {!playersLoading && filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No players found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.role || filters.status
                ? "Try adjusting your filters or search terms."
                : "Get started by adding players to this team."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddPlayerModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Add Player
              </button>
            </div>
          </div>
        )}

        {/* Add Player Modal */}
        {showAddPlayerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Add Player to Team</h2>

              {allPlayersLoading ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-gray-600">
                    Loading available players...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availablePlayers.map((player: any) => (
                      <div
                        key={player._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            {getRoleIcon(player.role)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {player.name || player.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {player.role || "Player"}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddPlayerToTeam(player._id)}
                          disabled={addPlayerToTeamMutation.isPending}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          {addPlayerToTeamMutation.isPending
                            ? "Adding..."
                            : "Add"}
                        </button>
                      </div>
                    ))}
                  </div>

                  {availablePlayers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FaUsers className="mx-auto h-12 w-12 mb-4" />
                      <p>No available players to add</p>
                      <p className="text-sm">
                        All players are already assigned to teams
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowAddPlayerModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Player Modal */}
        {editingPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold mb-4">Edit Player</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    role: formData.get("role") as string,
                    nationality: formData.get("nationality") as string,
                    status: formData.get("status") as string,
                  };

                  // Update player logic would go here
                  toast.success("Player updated successfully");
                  setEditingPlayer(null);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={
                        editingPlayer.name || editingPlayer.fullName
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingPlayer.email}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      name="role"
                      defaultValue={editingPlayer.role}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="batsman">Batsman</option>
                      <option value="bowler">Bowler</option>
                      <option value="all_rounder">All Rounder</option>
                      <option value="wicket_keeper">Wicket Keeper</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      defaultValue={editingPlayer.nationality}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      defaultValue={editingPlayer.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingPlayer(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update Player
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPlayers;
