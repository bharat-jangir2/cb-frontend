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
  FaFlag,
  FaUsers,
  FaTrophy,
  FaGlobe,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

interface TeamFilters {
  search?: string;
  page?: number;
  limit?: number;
}

const AdminTeams: React.FC = () => {
  const [filters, setFilters] = useState<TeamFilters>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch teams
  const { data: teamsData, isLoading } = useQuery({
    queryKey: ["admin-teams", filters],
    queryFn: () => adminApi.getTeams(filters),
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: (teamId: string) => adminApi.deleteTeam(teamId),
    onSuccess: () => {
      toast.success("Team deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete team");
    },
  });

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: (data: any) => adminApi.createTeam(data),
    onSuccess: () => {
      toast.success("Team created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      setShowCreateModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create team");
    },
  });

  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateTeam(id, data),
    onSuccess: () => {
      toast.success("Team updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-teams"] });
      setEditingTeam(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update team");
    },
  });

  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      deleteTeamMutation.mutate(teamId);
    }
  };

  const handleFilterChange = (key: keyof TeamFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreateTeam = (data: any) => {
    createTeamMutation.mutate(data);
  };

  const handleUpdateTeam = (id: string, data: any) => {
    updateTeamMutation.mutate({ id, data });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">
            Manage cricket teams and their details
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Create Team
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
                placeholder="Search teams..."
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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

      {/* Teams Grid */}
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
          : teamsData?.data?.teams?.map((team: any) => (
              <div
                key={team.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  {/* Team Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {team.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {team.shortName}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingTeam(team)}
                        className="p-1 text-blue-600 hover:text-blue-900"
                        title="Edit Team"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="p-1 text-red-600 hover:text-red-900"
                        title="Delete Team"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Team Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaGlobe className="mr-2" />
                      <span>{team.country}</span>
                    </div>
                    {team.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {team.description}
                      </p>
                    )}
                  </div>

                  {/* Team Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {team.playerCount || 0}
                        </div>
                        <div className="text-xs text-gray-500">Players</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {team.matchCount || 0}
                        </div>
                        <div className="text-xs text-gray-500">Matches</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/teams/${team.id}`}
                        className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/admin/teams/${team.id}/players`}
                        className="flex-1 text-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                      >
                        Players
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      {teamsData?.data?.totalPages > 1 && (
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
              { length: teamsData?.data?.totalPages || 1 },
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
                (filters.page || 1) >= (teamsData?.data?.totalPages || 1)
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
        (!teamsData?.data?.teams || teamsData.data.teams.length === 0) && (
          <div className="text-center py-12">
            <FaTrophy className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No teams found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first team.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Create Team
              </button>
            </div>
          </div>
        )}

      {/* Create/Edit Team Modal */}
      {(showCreateModal || editingTeam) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingTeam ? "Edit Team" : "Create New Team"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get("name") as string,
                  shortName: formData.get("shortName") as string,
                  description: formData.get("description") as string,
                };

                if (editingTeam) {
                  handleUpdateTeam(editingTeam.id, data);
                } else {
                  handleCreateTeam(data);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTeam?.name}
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
                    defaultValue={editingTeam?.shortName}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingTeam?.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTeam(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTeam ? "Update Team" : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeams;
