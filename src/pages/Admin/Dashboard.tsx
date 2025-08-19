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
          .then((res) => ({ total: res.data.length || 0 })),
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
    queryFn: () => adminApi.getMatches({ limit: 5, sort: "-createdAt" }),
  });

  // Fetch system health
  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ["system-health"],
    queryFn: async () => {
      const [scraperHealth, selectorHealth] = await Promise.all([
        adminApi.getScraperHealth(),
        adminApi.getSelectorHealth(),
      ]);
      return { scraper: scraperHealth.data, selector: selectorHealth.data };
    },
  });

  // Quick actions
  const quickActions = [
    {
      title: "Create Match",
      description: "Schedule a new cricket match",
      icon: FaPlus,
      link: "/admin/matches/create",
      color: "bg-green-500",
    },
    {
      title: "Manage Teams",
      description: "Add or update team information",
      icon: FaTrophy,
      link: "/admin/teams",
      color: "bg-blue-500",
    },
    {
      title: "Add Players",
      description: "Register new players",
      icon: FaUsers,
      link: "/admin/players",
      color: "bg-purple-500",
    },
    {
      title: "Manage Users",
      description: "User management and permissions",
      icon: FaUsers,
      link: "/admin/users",
      color: "bg-orange-500",
    },
    {
      title: "AI Agents",
      description: "Monitor and control AI agents",
      icon: FaRocket,
      link: "/admin/system/agents",
      color: "bg-red-500",
    },
    {
      title: "System Settings",
      description: "Configure system parameters",
      icon: FaCog,
      link: "/admin/settings",
      color: "bg-gray-500",
    },
  ];

  const handleGlobalCommand = async (command: string) => {
    try {
      await adminApi.executeGlobalCommand({ command });
      toast.success(`Command "${command}" executed successfully`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to execute command");
    }
  };

  const handleAutomationForAll = async () => {
    try {
      await adminApi.executeAutomationForAll();
      toast.success("Automation started for all matches");
    } catch (error: any) {
      toast.error("Failed to start automation");
    }
  };

  if (statsLoading || matchesLoading || healthLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your cricket platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaTrophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Matches</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalMatches || 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">
              {stats?.liveMatches || 0} Live
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalUsers || 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600 font-medium">
              {stats?.totalTeams || 0} Teams
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaRocket className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.activeAgents || 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-purple-600 font-medium">
              {stats?.totalPlayers || 0} Players
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FaNewspaper className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">News Articles</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalNews || 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-orange-600 font-medium">
              {stats?.totalTournaments || 0} Tournaments
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* System Health & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* System Health */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaServer className="mr-2 text-blue-500" />
            System Health
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaNetworkWired className="mr-2 text-green-500" />
                <span className="font-medium">Scraper Status</span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  systemHealth?.scraper?.status === "healthy"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {systemHealth?.scraper?.status || "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FaShieldAlt className="mr-2 text-blue-500" />
                <span className="font-medium">Selector Status</span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  systemHealth?.selector?.status === "healthy"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {systemHealth?.selector?.status || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaCog className="mr-2 text-purple-500" />
            Global Controls
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => handleGlobalCommand("refresh_all")}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaSync className="mr-2" />
              Refresh All Data
            </button>
            <button
              onClick={handleAutomationForAll}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaPlay className="mr-2" />
              Start All Automation
            </button>
            <button
              onClick={() => handleGlobalCommand("stop_all")}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaStop className="mr-2" />
              Stop All Agents
            </button>
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Matches
          </h2>
          <Link
            to="/admin/matches"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentMatches?.data?.matches?.map((match: any) => (
                <tr key={match.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {match.team1?.name} vs {match.team2?.name}
                      </div>
                      <div className="text-sm text-gray-500">{match.venue}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        match.status === "live"
                          ? "bg-red-100 text-red-800"
                          : match.status === "upcoming"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {match.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(match.startTime).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaBell className="mr-2 text-yellow-500" />
          System Alerts
        </h2>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <FaExclamationTriangle className="text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Scraper Performance Alert
              </p>
              <p className="text-xs text-yellow-600">
                Some data sources are responding slowly
              </p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <FaBell className="text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                New Match Scheduled
              </p>
              <p className="text-xs text-blue-600">
                India vs Australia T20 match added to schedule
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
