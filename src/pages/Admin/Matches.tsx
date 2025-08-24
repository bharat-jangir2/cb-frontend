import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaTrophy,
  FaPlay,
  FaPause,
  FaStop,
  FaRocket,
  FaTimes,
  FaFlag,
  FaBolt,
} from "react-icons/fa";
import { useMatches, useUpdateMatchStatus, useDeleteMatch } from "../../hooks";

interface MatchFilters {
  status?: string;
  format?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const AdminMatches: React.FC = () => {
  const [filters, setFilters] = useState<MatchFilters>({
    page: 1,
    limit: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const queryClient = useQueryClient();

  // Debug logging
  console.log("AdminMatches component rendered");

  // Fetch matches using new modular hooks
  const { data: matchesData, isLoading, error } = useMatches(filters);

  // Debug logging for matches data
  console.log("🏏 ~ matchesData:", matchesData);
  console.log("🏏 ~ matchesData structure:", {
    hasData: !!matchesData,
    hasDataData: !!matchesData?.data,
    hasDataDataArray: !!matchesData?.data?.data,
    matchesLength: matchesData?.data?.length || 0,
    total: matchesData?.total || 0,
    totalPages: matchesData?.totalPages || 0,
    fullStructure: JSON.stringify(matchesData, null, 2),
  });

  if (error) {
    console.error("❌ Error fetching matches:", error);
  }

  // Delete match mutation using new modular hooks
  const deleteMatchMutation = useDeleteMatch();

  // Update match status mutation using new modular hooks
  const updateStatusMutation = useUpdateMatchStatus();

  const handleDeleteMatch = (matchId: string) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      deleteMatchMutation.mutate(matchId);
    }
  };

  const handleStatusUpdate = (matchId: string, status: string) => {
    const statusData: any = { status };

    // Add additional data based on status
    if (status === "in_progress") {
      statusData.currentInnings = 1;
      statusData.currentOver = 0;
      statusData.currentBall = 0;
    }

    updateStatusMutation.mutate({ matchId, statusData });
  };

  const handleFilterChange = (key: keyof MatchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFormatColor = (format: string) => {
    switch (format?.toLowerCase()) {
      case "t20":
        return "bg-purple-100 text-purple-800";
      case "odi":
        return "bg-blue-100 text-blue-800";
      case "test":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Match Management</h1>
          <p className="text-gray-600">
            Manage all cricket matches and their details
          </p>
        </div>
        <Link
          to="/admin/matches/create"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Create Match
        </Link>
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
                placeholder="Search matches..."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Format
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.format || ""}
                  onChange={(e) => handleFilterChange("format", e.target.value)}
                >
                  <option value="">All Formats</option>
                  <option value="T20">T20</option>
                  <option value="ODI">ODI</option>
                  <option value="Test">Test</option>
                </select>
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

      {/* Matches Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading matches...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Venue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    console.log("🏏 Rendering matches:", matchesData?.data);
                    console.log(
                      "🏏 Alternative data path:",
                      matchesData?.data?.data
                    );
                    const matches = matchesData?.data || [];
                    console.log("🏏 Final matches array:", matches);
                    return matches.map((match: any) => (
                      <tr key={match._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {match.teamAId?.name} vs {match.teamBId?.name}
                            </div>
                            {match.name && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <FaTrophy className="mr-1" />
                                {match.name}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getFormatColor(
                              match.matchType
                            )}`}
                          >
                            {match.matchType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              match.status
                            )}`}
                          >
                            {match.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <FaCalendar className="mr-1 text-gray-400" />
                              {new Date(match.startTime).toLocaleDateString()}
                            </div>
                            <div className="flex items-center mt-1">
                              <FaMapMarkerAlt className="mr-1 text-gray-400" />
                              {match.venue}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/admin/matches/${match._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <FaEye className="h-4 w-4" />
                            </Link>
                            {match.status === "in_progress" && (
                              <Link
                                to={`/admin/matches/${match._id}/scoring`}
                                className="text-purple-600 hover:text-purple-900"
                                title="Live Scoring"
                              >
                                <FaRocket className="h-4 w-4" />
                              </Link>
                            )}
                            <Link
                              to={`/admin/matches/${match._id}/powerplay`}
                              className="text-orange-600 hover:text-orange-900"
                              title="Powerplay Management"
                            >
                              <FaBolt className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/admin/matches/${match._id}/edit`}
                              className="text-green-600 hover:text-green-900"
                              title="Edit Match"
                            >
                              <FaEdit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteMatch(match._id)}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="Delete Match"
                              disabled={deleteMatchMutation.isPending}
                            >
                              {deleteMatchMutation.isPending ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <FaTrash className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          {/* Status Controls */}
                          <div className="flex items-center space-x-1 mt-2">
                            {match.status === "scheduled" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(match._id, "in_progress")
                                  }
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                  title="Start Match"
                                  disabled={updateStatusMutation.isPending}
                                >
                                  {updateStatusMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                                  ) : (
                                    <FaPlay className="h-3 w-3" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(match._id, "cancelled")
                                  }
                                  className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                  title="Cancel Match"
                                  disabled={updateStatusMutation.isPending}
                                >
                                  {updateStatusMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                                  ) : (
                                    <FaTimes className="h-3 w-3" />
                                  )}
                                </button>
                              </>
                            )}
                            {match.status === "in_progress" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(match._id, "completed")
                                  }
                                  className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                  title="Complete Match"
                                  disabled={updateStatusMutation.isPending}
                                >
                                  {updateStatusMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                  ) : (
                                    <FaStop className="h-3 w-3" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(match._id, "paused")
                                  }
                                  className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                                  title="Pause Match"
                                  disabled={updateStatusMutation.isPending}
                                >
                                  {updateStatusMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600"></div>
                                  ) : (
                                    <FaPause className="h-3 w-3" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(match._id, "abandoned")
                                  }
                                  className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                                  title="Abandon Match"
                                  disabled={updateStatusMutation.isPending}
                                >
                                  {updateStatusMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
                                  ) : (
                                    <FaFlag className="h-3 w-3" />
                                  )}
                                </button>
                              </>
                            )}
                            {match.status === "paused" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(match._id, "in_progress")
                                  }
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                  title="Resume Match"
                                  disabled={updateStatusMutation.isPending}
                                >
                                  {updateStatusMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                                  ) : (
                                    <FaPlay className="h-3 w-3" />
                                  )}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(match._id, "abandoned")
                                  }
                                  className="text-orange-600 hover:text-orange-900 disabled:opacity-50"
                                  title="Abandon Match"
                                  disabled={updateStatusMutation.isPending}
                                >
                                  {updateStatusMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
                                  ) : (
                                    <FaFlag className="h-3 w-3" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {matchesData?.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange((filters.page || 1) - 1)}
                    disabled={(filters.page || 1) <= 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange((filters.page || 1) + 1)}
                    disabled={
                      (filters.page || 1) >= (matchesData?.totalPages || 1)
                    }
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {((filters.page || 1) - 1) * (filters.limit || 10) + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          (filters.page || 1) * (filters.limit || 10),
                          matchesData?.total || 0
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {matchesData?.data?.total || 0}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {Array.from(
                        { length: matchesData?.totalPages || 1 },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === (filters.page || 1)
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Empty State */}
      {!isLoading &&
        (!matchesData?.matches || matchesData?.matches.length === 0) && (
          <div className="text-center py-12">
            <FaTrophy className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No matches found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first match.
            </p>
            <div className="mt-6">
              <Link
                to="/admin/matches/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Create Match
              </Link>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminMatches;
