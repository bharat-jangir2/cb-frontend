import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUsers,
  FaTrophy,
  FaCalendar,
  FaChartLine,
  FaFlag,
  FaGlobe,
  FaCrown,
  FaUserTie,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

const TeamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch team details
  const {
    data: teamData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["team", id],
    queryFn: () => adminApi.getTeam(id!),
    enabled: !!id,
  });

  // Fetch team players
  const { data: playersData, isLoading: playersLoading } = useQuery({
    queryKey: ["team-players", id],
    queryFn: () => adminApi.getPlayersByTeam(id!),
    enabled: !!id,
  });

  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: (teamId: string) => adminApi.deleteTeam(teamId),
    onSuccess: () => {
      toast.success("Team deleted successfully");
      navigate("/admin/teams");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete team");
    },
  });

  const handleDeleteTeam = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      deleteTeamMutation.mutate(id!);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error Loading Team</h2>
            <p className="text-red-600 mt-2">
              {error.message || "Failed to load team details"}
            </p>
            <div className="mt-4">
              <Link
                to="/admin/teams"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FaArrowLeft className="mr-2" />
                Back to Teams
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const team = (teamData as any)?.data || teamData;
  const players = (playersData as any)?.data?.data || [];

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-yellow-800 font-semibold">Team Not Found</h2>
            <p className="text-yellow-600 mt-2">
              The team you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-4">
              <Link
                to="/admin/teams"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                <FaArrowLeft className="mr-2" />
                Back to Teams
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/teams"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Teams
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
              <p className="text-gray-600">Team Details & Management</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/admin/teams/${id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaEdit className="mr-2" />
              Edit Team
            </Link>
            <button
              onClick={handleDeleteTeam}
              disabled={deleteTeamMutation.isPending}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <FaTrash className="mr-2" />
              {deleteTeamMutation.isPending ? "Deleting..." : "Delete Team"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Team Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Basic Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FaFlag className="text-gray-400 mr-3 w-5" />
                        <div>
                          <p className="text-sm text-gray-500">Team Name</p>
                          <p className="font-medium">{team.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaCrown className="text-gray-400 mr-3 w-5" />
                        <div>
                          <p className="text-sm text-gray-500">Short Name</p>
                          <p className="font-medium">{team.shortName}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaGlobe className="text-gray-400 mr-3 w-5" />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              team.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {team.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Description
                    </h3>
                    <p className="text-gray-600">
                      {team.description || "No description available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Statistics */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Team Statistics
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaUsers className="text-blue-600 text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {players.length}
                    </div>
                    <div className="text-sm text-gray-500">Total Players</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaTrophy className="text-green-600 text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Tournaments Won</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaCalendar className="text-purple-600 text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Matches Played</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaChartLine className="text-yellow-600 text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0%</div>
                    <div className="text-sm text-gray-500">Win Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Players */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recent Players
                  </h2>
                  <Link
                    to={`/admin/teams/${id}/players`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View All Players
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {playersLoading ? (
                  <div className="animate-pulse space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : players.length > 0 ? (
                  <div className="space-y-3">
                    {players.slice(0, 5).map((player: any) => (
                      <div
                        key={player._id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUserTie className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {player.name || player.fullName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {player.role || "Player"}
                          </p>
                        </div>
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
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaUsers className="mx-auto h-12 w-12 mb-4" />
                    <p>No players found for this team</p>
                    <p className="text-sm">
                      Players will appear here once added to the team
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  to={`/admin/teams/${id}/players`}
                  className="w-full flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaUsers className="mr-3" />
                  Manage Players
                </Link>
                <Link
                  to={`/admin/teams/${id}/edit`}
                  className="w-full flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FaEdit className="mr-3" />
                  Edit Team
                </Link>
                <button
                  onClick={handleDeleteTeam}
                  disabled={deleteTeamMutation.isPending}
                  className="w-full flex items-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <FaTrash className="mr-3" />
                  {deleteTeamMutation.isPending ? "Deleting..." : "Delete Team"}
                </button>
              </div>
            </div>

            {/* Team Info */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Team Info
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(team.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Team ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {team._id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetail;
