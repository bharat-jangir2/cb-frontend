import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaUserTie,
  FaBolt,
  FaSpinner,
  FaHandPaper,
  FaUsers,
  FaCrown,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

interface PlayerFilters {
  search?: string;
  role?: string;
  status?: string;
  nationality?: string;
  page?: number;
  limit?: number;
}

const AdminPlayers: React.FC = () => {
  const [filters, setFilters] = useState<PlayerFilters>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch players
  const { data: playersData, isLoading } = useQuery({
    queryKey: ["admin-players", filters],
    queryFn: () => adminApi.getPlayers(filters),
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: (playerId: string) => adminApi.deletePlayer(playerId),
    onSuccess: () => {
      toast.success("Player deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-players"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete player");
    },
  });

  // Create player mutation
  const createPlayerMutation = useMutation({
    mutationFn: (data: any) => adminApi.createPlayer(data),
    onSuccess: () => {
      toast.success("Player created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-players"] });
      setShowCreateModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create player");
    },
  });

  // Update player mutation
  const updatePlayerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updatePlayer(id, data),
    onSuccess: () => {
      toast.success("Player updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-players"] });
      setEditingPlayer(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update player");
    },
  });

  const handleDeletePlayer = (playerId: string) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      deletePlayerMutation.mutate(playerId);
    }
  };

  const handleFilterChange = (key: keyof PlayerFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreatePlayer = (data: any) => {
    createPlayerMutation.mutate(data);
  };

  const handleUpdatePlayer = (id: string, data: any) => {
    updatePlayerMutation.mutate({ id, data });
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Player Management
          </h1>
          <p className="text-gray-600">
            Manage cricket players and their details
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Create Player
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nationality
                </label>
                <input
                  type="text"
                  placeholder="e.g., India, Australia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.nationality || ""}
                  onChange={(e) =>
                    handleFilterChange("nationality", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Per Page
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.limit || 10}
                  onChange={(e) =>
                    handleFilterChange("limit", parseInt(e.target.value))
                  }
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
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
          : (playersData as any)?.data?.map((player: any) => (
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
                          {player.fullName || player.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {player.shortName || "No short name"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Link
                        to={`/admin/players/${player._id}`}
                        className="p-1 text-blue-600 hover:text-blue-900"
                        title="View Player"
                      >
                        <FaEye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setEditingPlayer(player)}
                        className="p-1 text-green-600 hover:text-green-900"
                        title="Edit Player"
                      >
                        <FaEdit className="h-4 w-4" />
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
                    {player.teamId && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Team</span>
                        <span className="text-sm font-medium text-blue-600">
                          {player.team?.name || "Assigned"}
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

      {/* Pagination */}
      {(playersData as any)?.data?.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange((filters.page || 1) - 1)}
              disabled={(filters.page || 1) <= 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from(
              { length: (playersData as any)?.data?.totalPages || 1 },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                  page === (filters.page || 1)
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange((filters.page || 1) + 1)}
              disabled={
                (filters.page || 1) >=
                ((playersData as any)?.data?.totalPages || 1)
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Empty State */}
      {!isLoading &&
        (!(playersData as any)?.data?.data ||
          (playersData as any)?.data?.data?.length === 0) && (
          <div className="text-center py-12">
            <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No players found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first player.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Create Player
              </button>
            </div>
          </div>
        )}

      {/* Create/Edit Player Modal */}
      {(showCreateModal || editingPlayer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingPlayer ? "Edit Player" : "Create New Player"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  fullName: formData.get("fullName") as string,
                  shortName: formData.get("shortName") as string,
                  role: formData.get("role") as string,
                  nationality: formData.get("nationality") as string,
                  status: formData.get("status") as string,
                  dob: formData.get("dob")
                    ? new Date(formData.get("dob") as string)
                    : undefined,
                };

                if (editingPlayer) {
                  handleUpdatePlayer(editingPlayer._id, data);
                } else {
                  handleCreatePlayer(data);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    defaultValue={
                      editingPlayer?.fullName || editingPlayer?.name
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Name *
                  </label>
                  <input
                    type="text"
                    name="shortName"
                    defaultValue={editingPlayer?.shortName}
                    required
                    maxLength={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    name="role"
                    defaultValue={editingPlayer?.role}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Role</option>
                    <option value="batsman">Batsman</option>
                    <option value="bowler">Bowler</option>
                    <option value="all_rounder">All Rounder</option>
                    <option value="wicket_keeper">Wicket Keeper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    defaultValue={
                      editingPlayer?.dob
                        ? new Date(editingPlayer.dob)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    defaultValue={editingPlayer?.nationality}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingPlayer?.status || "active"}
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
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingPlayer(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPlayer ? "Update Player" : "Create Player"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlayers;
