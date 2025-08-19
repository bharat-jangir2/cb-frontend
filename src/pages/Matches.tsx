import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { matchesApi } from "../services/matches";
import MatchCard from "../components/matches/MatchCard";
import { 
  FaSearch, 
  FaFilter, 
  FaRocket, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEye,
  FaCalendar,
  FaMapMarkerAlt,
  FaTrophy
} from "react-icons/fa";

const Matches = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches", { statusFilter, formatFilter }],
    queryFn: () =>
      matchesApi.getMatches({ status: statusFilter, format: formatFilter }),
  });

  const filteredMatches = matches?.filter(
    (match) =>
      match.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.team2.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <FaRocket className="h-4 w-4 text-red-500" />;
      case 'scheduled':
        return <FaClock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <FaCheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <FaEye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Matches</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Browse and track cricket matches from around the world
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center space-x-2 px-4 py-2 bg-cricket-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FaFilter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-4 sm:p-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search matches, teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-green focus:border-cricket-green"
              />
            </div>

            {/* Filters - Desktop */}
            <div className="hidden sm:flex gap-4">
              {/* Status Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-green focus:border-cricket-green"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Format Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-green focus:border-cricket-green"
                >
                  <option value="all">All Formats</option>
                  <option value="t20">T20</option>
                  <option value="odi">ODI</option>
                  <option value="test">Test</option>
                </select>
              </div>
            </div>

            {/* Filters - Mobile */}
            {showFilters && (
              <div className="sm:hidden space-y-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-green focus:border-cricket-green"
                  >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <select
                    value={formatFilter}
                    onChange={(e) => setFormatFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cricket-green focus:border-cricket-green"
                  >
                    <option value="all">All Formats</option>
                    <option value="t20">T20</option>
                    <option value="odi">ODI</option>
                    <option value="test">Test</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredMatches?.length || 0} matches found
          </p>
        </div>

        {/* Matches List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMatches && filteredMatches.length > 0 ? (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(match.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(match.status)}`}>
                        {match.status.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {match.format.toUpperCase()}
                      </span>
                    </div>
                    <FaEye className="h-4 w-4 text-gray-400" />
                  </div>

                  {/* Match Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {match.title}
                  </h3>

                  {/* Teams */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-cricket-green rounded-full flex items-center justify-center">
                        <FaTrophy className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">{match.team1.name}</span>
                    </div>
                    <span className="text-gray-500 text-sm">vs</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{match.team2.name}</span>
                      <div className="w-8 h-8 bg-cricket-blue rounded-full flex items-center justify-center">
                        <FaTrophy className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaCalendar className="h-4 w-4" />
                      <span>{new Date(match.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="h-4 w-4" />
                      <span className="truncate">{match.venue}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <a
                      href={`/user/matches/${match.id}`}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-cricket-green text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      <FaEye className="h-4 w-4" />
                      <span>View Details</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <FaSearch className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No matches found
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
