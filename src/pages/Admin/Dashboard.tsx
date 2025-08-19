import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaRocket,
  FaUsers,
  FaTrophy,
  FaNewspaper,
  FaGamepad,
  FaChartLine,
  FaCog,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlay,
  FaPause,
  FaStop,
  FaSync,
  FaServer,
  FaNetworkWired,
  FaShieldAlt,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaFlag,
  FaBolt,
  FaCalculator,
  FaHistory,
  FaBookmark,
  FaShare,
  FaDownload,
  FaPrint,
  FaCog as FaSettings,
  FaInfoCircle,
  FaQuestionCircle,
  FaArrowRight,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

interface DashboardStats {
  totalMatches: number;
  liveMatches: number;
  totalTeams: number;
  totalPlayers: number;
  totalUsers: number;
  activeAgents: number;
  totalNews: number;
  totalTournaments: number;
}

const AdminDashboard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debug logging
  console.log("AdminDashboard component rendered");

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      console.log("Fetching admin stats...");
      const [
        matches,
        liveMatches,
        teams,
        players,
        users,
        agents,
        news,
        tournaments,
      ] = await Promise.all([
        adminApi
          .getMatches({ limit: 1 })
          .then((res) => ({ total: res.data.total || 0 })),
        adminApi
          .getLiveMatches()
          .then((res) => ({ total: Array.isArray(res) ? res.length : res.data?.length || 0 })),
        adminApi
          .getTeams({ limit: 1 })
          .then((res) => ({ total: res.data.total || 0 })),
        adminApi
          .getPlayers({ limit: 1 })
          .then((res) => ({ total: res.data.total || 0 })),
        adminApi
          .getUsers({ limit: 1 })
          .then((res) => ({ total: res.data.total || 0 })),
        adminApi
          .getAllAgents()
          .then((res) => ({ total: res.data.active || 0 })),
        adminApi
          .getNews({ limit: 1 })
          .then((res) => ({ total: res.data.total || 0 })),
        adminApi
          .getTournaments({ limit: 1 })
          .then((res) => ({ total: res.data.total || 0 })),
      ]);

      return {
        totalMatches: matches.total,
        liveMatches: liveMatches.total,
        totalTeams: teams.total,
        totalPlayers: players.total,
        totalUsers: users.total,
        activeAgents: agents.total,
        totalNews: news.total,
        totalTournaments: tournaments.total,
      };
    },
  });

  // Fetch recent matches
  const { data: recentMatches, isLoading: matchesLoading } = useQuery({
    queryKey: ["recent-matches"],
    queryFn: async () => {
      const response = await adminApi.getMatches({ limit: 5 });
      return response.data;
    },
  });

  // Fetch live matches
  const { data: liveMatches, isLoading: liveMatchesLoading } = useQuery({
    queryKey: ["live-matches"],
    queryFn: async () => {
      const response = await adminApi.getLiveMatches();
      return Array.isArray(response) ? response : response.data || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case "in_progress":
        return "LIVE";
      case "scheduled":
        return "SCHEDULED";
      case "completed":
        return "COMPLETED";
      case "cancelled":
        return "CANCELLED";
      default:
        return status.toUpperCase();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage cricket matches, teams, players, and system settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <FaPlus className="mr-2" />
                Create Match
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                <FaRocket className="mr-2" />
                Live Scoring
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <FaRocket className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Live Matches</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.liveMatches || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaTrophy className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalMatches || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaUsers className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalTeams || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaChartLine className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Matches Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaRocket className="mr-3 text-red-600" />
              Live Matches
            </h2>
            <Link
              to="/admin/matches/live"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {liveMatchesLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : liveMatches && liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {liveMatches.slice(0, 4).map((match: any) => (
                <div
                  key={match._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {match.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          match.status
                        )}`}
                      >
                        {getStatusDisplayText(match.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            {match.teamAId?.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {match.score?.teamA?.runs || 0}/{match.score?.teamA?.wickets || 0}
                          </div>
                        </div>
                        <div className="text-gray-500">VS</div>
                        <div className="text-center">
                          <div className="font-semibold text-gray-900">
                            {match.teamBId?.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {match.score?.teamB?.runs || 0}/{match.score?.teamB?.wickets || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{match.venue}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{formatTime(match.startTime)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/matches/${match._id}/scoring`}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 text-center"
                      >
                        <FaRocket className="inline mr-1" />
                        Score
                      </Link>
                      <Link
                        to={`/admin/matches/${match._id}`}
                        className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 text-center"
                      >
                        <FaEye className="inline mr-1" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FaRocket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Live Matches
              </h3>
              <p className="text-gray-600">
                There are currently no matches in progress.
              </p>
            </div>
          )}
        </div>

        {/* Recent Matches Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaClock className="mr-3 text-blue-600" />
              Recent Matches
            </h2>
            <Link
              to="/admin/matches"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>

          {matchesLoading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Match History
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search matches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="in_progress">Live</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Match
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teams
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentMatches?.map((match: any) => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {match.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {match.format} • {match.overs} overs
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {match.team1?.name} vs {match.team2?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {match.venue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(match.startTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              match.status
                            )}`}
                          >
                            {getStatusDisplayText(match.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/admin/matches/${match.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <FaEye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/admin/matches/${match.id}/edit`}
                              className="text-green-600 hover:text-green-900"
                            >
                              <FaEdit className="h-4 w-4" />
                            </Link>
                            {match.status === "scheduled" && (
                              <Link
                                to={`/admin/matches/${match.id}/scoring`}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaRocket className="h-4 w-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaPlus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Create Match
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Schedule a new cricket match with teams, venue, and format.
            </p>
            <Link
              to="/admin/matches/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Match
              <FaArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaUsers className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                Manage Teams
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Add, edit, and manage cricket teams and their players.
            </p>
            <Link
              to="/admin/teams"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Manage Teams
              <FaArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaCog className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900">
                System Settings
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Configure system settings, user permissions, and preferences.
            </p>
            <Link
              to="/admin/settings"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Settings
              <FaArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
