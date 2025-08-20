import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaChartLine,
  FaTrophy,
  FaUsers,
  FaBolt,
  FaSpinner,
  FaHandPaper,
  FaUserTie,
  FaCalendar,
  FaChartBar,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

const PlayerStats: React.FC = () => {
  // Fetch player statistics
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["player-stats"],
    queryFn: () => adminApi.getPlayers({ limit: 1000 }),
  });

  const players = (statsData as any)?.data?.data || [];

  // Calculate statistics
  const totalPlayers = players.length;
  const activePlayers = players.filter(
    (p: any) => p.status === "active"
  ).length;
  const inactivePlayers = totalPlayers - activePlayers;

  const roleStats = players.reduce((acc: any, player: any) => {
    const role = player.role || "unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const nationalityStats = players.reduce((acc: any, player: any) => {
    const nationality = player.nationality || "Unknown";
    acc[nationality] = (acc[nationality] || 0) + 1;
    return acc;
  }, {});

  const topNationalities = Object.entries(nationalityStats)
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5);

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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Player Statistics
          </h1>
          <p className="text-gray-600">Overview of player data and analytics</p>
        </div>
        <Link
          to="/admin/players"
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Players
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Players</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlayers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-green-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Players
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {activePlayers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FaChartBar className="text-red-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Inactive Players
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {inactivePlayers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaTrophy className="text-purple-600 text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalPlayers > 0
                  ? Math.round((activePlayers / totalPlayers) * 100)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Role Distribution
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(roleStats).map(([role, count]: [string, any]) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      {getRoleIcon(role)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {role === "unknown" ? "Unknown Role" : role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {Math.round((count / totalPlayers) * 100)}% of total
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                        role
                      )}`}
                    >
                      {role === "unknown" ? "Unknown" : role}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nationality Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Top Nationalities
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topNationalities.map(([nationality, count]: [string, any]) => (
                <div
                  key={nationality}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <FaUsers className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{nationality}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round((count / totalPlayers) * 100)}% of total
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Players */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Players
            </h2>
            <Link
              to="/admin/players"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Players
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.slice(0, 6).map((player: any) => (
              <div
                key={player._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      {getRoleIcon(player.role)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {player.fullName || player.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {player.shortName || "No short name"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                      player.role
                    )}`}
                  >
                    {player.role || "Unknown"}
                  </span>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
