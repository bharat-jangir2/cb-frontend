import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { matchesApi } from "../services/matches";
import MatchCard from "../components/matches/MatchCard";
import { FaSearch, FaFilter } from "react-icons/fa";

const Matches = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formatFilter, setFormatFilter] = useState("all");

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
          <p className="text-gray-600">
            Browse and track cricket matches from around the world
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search matches, teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Format Filter */}
          <div className="lg:w-48">
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">All Formats</option>
              <option value="t20">T20</option>
              <option value="odi">ODI</option>
              <option value="test">Test</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matches List */}
      <div className="card">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredMatches && filteredMatches.length > 0 ? (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No matches found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
