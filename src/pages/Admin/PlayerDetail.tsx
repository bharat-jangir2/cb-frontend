import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUserTie,
  FaBolt,
  FaSpinner,
  FaHandPaper,
  FaTrophy,
  FaCalendar,
  FaChartLine,
  FaFlag,
  FaGlobe,
  FaCrown,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

const PlayerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch player details
  const {
    data: playerData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["player", id],
    queryFn: () => adminApi.getPlayer(id!),
    enabled: !!id,
  });

  // Delete player mutation
  const deletePlayerMutation = useMutation({
    mutationFn: (playerId: string) => adminApi.deletePlayer(playerId),
    onSuccess: () => {
      toast.success("Player deleted successfully");
      navigate("/admin/players");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete player");
    },
  });

  const handleDeletePlayer = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this player? This action cannot be undone."
      )
    ) {
      deletePlayerMutation.mutate(id!);
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
            <h2 className="text-red-800 font-semibold">Error Loading Player</h2>
            <p className="text-red-600 mt-2">
              {error.message || "Failed to load player details"}
            </p>
            <div className="mt-4">
              <Link
                to="/admin/players"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <FaArrowLeft className="mr-2" />
                Back to Players
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const player = (playerData as any)?.data || playerData;

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-yellow-800 font-semibold">Player Not Found</h2>
            <p className="text-yellow-600 mt-2">
              The player you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-4">
              <Link
                to="/admin/players"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                <FaArrowLeft className="mr-2" />
                Back to Players
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/players"
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Players
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {player.fullName || player.name}
              </h1>
              <p className="text-gray-600">Player Details & Management</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/admin/players/${id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaEdit className="mr-2" />
              Edit Player
            </Link>
            <button
              onClick={handleDeletePlayer}
              disabled={deletePlayerMutation.isPending}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <FaTrash className="mr-2" />
              {deletePlayerMutation.isPending ? "Deleting..." : "Delete Player"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Player Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Player Information
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
                        <FaUserTie className="text-gray-400 mr-3 w-5" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">
                            {player.fullName || player.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaCrown className="text-gray-400 mr-3 w-5" />
                        <div>
                          <p className="text-sm text-gray-500">Short Name</p>
                          <p className="font-medium">
                            {player.shortName || "Not set"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaCrown className="text-gray-400 mr-3 w-5" />
                        <div>
                          <p className="text-sm text-gray-500">Role</p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                              player.role
                            )}`}
                          >
                            {player.role || "Unknown"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaGlobe className="text-gray-400 mr-3 w-5" />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              player.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {player.status || "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Additional Information
                    </h3>
                    <div className="space-y-3">
                      {player.nationality && (
                        <div className="flex items-center">
                          <FaFlag className="text-gray-400 mr-3 w-5" />
                          <div>
                            <p className="text-sm text-gray-500">Nationality</p>
                            <p className="font-medium">{player.nationality}</p>
                          </div>
                        </div>
                      )}
                      {player.dob && (
                        <div className="flex items-center">
                          <FaBirthdayCake className="text-gray-400 mr-3 w-5" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Date of Birth
                            </p>
                            <p className="font-medium">
                              {new Date(player.dob).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {player.address && (
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-gray-400 mr-3 w-5" />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">{player.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Player Statistics */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Player Statistics
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaTrophy className="text-blue-600 text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Matches Played</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaChartLine className="text-green-600 text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Runs Scored</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaSpinner className="text-purple-600 text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Wickets Taken</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <FaHandPaper className="text-yellow-600 text-xl" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-500">Catches</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Information */}
            {player.teamId && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Team Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {player.team?.name || "Team"}
                      </h3>
                      <p className="text-gray-600">
                        {player.team?.shortName || "Team Short Name"}
                      </p>
                    </div>
                    <Link
                      to={`/admin/teams/${player.teamId}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Team
                    </Link>
                  </div>
                </div>
              </div>
            )}
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
                  to={`/admin/players/${id}/edit`}
                  className="w-full flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaEdit className="mr-3" />
                  Edit Player
                </Link>
                {player.teamId && (
                  <Link
                    to={`/admin/teams/${player.teamId}`}
                    className="w-full flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FaUsers className="mr-3" />
                    View Team
                  </Link>
                )}
                <button
                  onClick={handleDeletePlayer}
                  disabled={deletePlayerMutation.isPending}
                  className="w-full flex items-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <FaTrash className="mr-3" />
                  {deletePlayerMutation.isPending
                    ? "Deleting..."
                    : "Delete Player"}
                </button>
              </div>
            </div>

            {/* Player Info */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Player Info
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Player ID</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {player._id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {new Date(player.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">
                    {new Date(player.updatedAt).toLocaleDateString()}
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

export default PlayerDetail;
