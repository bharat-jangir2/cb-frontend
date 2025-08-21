import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { unifiedScorecardService } from "../../services/unified-scorecard.service";
import type { FallOfWicket, InningsScorecard } from "../../types/scorecard";
import { FaCrown, FaTrophy, FaUsers } from "react-icons/fa";

interface FallOfWicketsProps {
  matchId: string;
  innings?: InningsScorecard;
  selectedInnings: number;
  onInningsChange: (innings: number) => void;
  isAdmin?: boolean;
}

export const FallOfWickets: React.FC<FallOfWicketsProps> = ({
  matchId,
  innings,
  selectedInnings,
  onInningsChange,
  isAdmin = false,
}) => {
  const [filterBy, setFilterBy] = useState<"all" | "partnership" | "over">(
    "all"
  );

  // Fetch fall of wickets data
  const { data: fallOfWickets, isLoading } = useQuery({
    queryKey: ["fallOfWickets", matchId, selectedInnings],
    queryFn: () =>
      unifiedScorecardService.getFallOfWickets(matchId, selectedInnings),
    enabled: !!matchId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredWickets =
    fallOfWickets?.filter((wicket) => {
      if (filterBy === "all") return true;
      if (filterBy === "partnership" && wicket.partnership > 50) return true;
      if (filterBy === "over" && wicket.over <= 10) return true;
      return false;
    }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fall of Wickets</h2>
          <p className="text-gray-600">Detailed wicket fall information</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Innings Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Innings:
            </label>
            <select
              value={selectedInnings}
              onChange={(e) => onInningsChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value={1}>1st Innings</option>
              <option value={2}>2nd Innings</option>
            </select>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Wickets</option>
              <option value="partnership">Partnership 50+</option>
              <option value="over">First 10 Overs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Wickets</p>
              <p className="text-2xl font-bold text-blue-900">
                {fallOfWickets?.length || 0}
              </p>
            </div>
            <FaTrophy className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">
                Best Partnership
              </p>
              <p className="text-2xl font-bold text-green-900">
                {Math.max(...(fallOfWickets?.map((w) => w.partnership) || [0]))}
              </p>
            </div>
            <FaUsers className="text-green-500 text-xl" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Average Partnership
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {fallOfWickets && fallOfWickets.length > 0
                  ? Math.round(
                      fallOfWickets.reduce((sum, w) => sum + w.partnership, 0) /
                        fallOfWickets.length
                    )
                  : 0}
              </p>
            </div>
            <FaCrown className="text-purple-500 text-xl" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Total Runs</p>
              <p className="text-2xl font-bold text-orange-900">
                {fallOfWickets?.reduce((sum, w) => sum + w.runs, 0) || 0}
              </p>
            </div>
            <FaTrophy className="text-orange-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Wickets Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Wicket Details
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wicket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batsman
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Runs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partnership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Over
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dismissal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWickets.map((wicket, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">
                        {wicket.wicket}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {wicket.playerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {wicket.runs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {wicket.partnership}
                      {wicket.partnership > 50 && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Good
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {wicket.over}.{wicket.ball}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          wicket.dismissal.type === "caught"
                            ? "bg-blue-100 text-blue-800"
                            : wicket.dismissal.type === "bowled"
                            ? "bg-red-100 text-red-800"
                            : wicket.dismissal.type === "lbw"
                            ? "bg-yellow-100 text-yellow-800"
                            : wicket.dismissal.type === "run_out"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {wicket.dismissal.type.replace("_", " ").toUpperCase()}
                      </span>
                      {wicket.dismissal.bowlerName && (
                        <div className="text-xs text-gray-500 mt-1">
                          b {wicket.dismissal.bowlerName}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWickets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No wickets found for the selected filter.
          </div>
        )}
      </div>

      {/* Partnership Analysis */}
      {fallOfWickets && fallOfWickets.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Partnership Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Highest Partnership</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.max(...fallOfWickets.map((w) => w.partnership))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Lowest Partnership</p>
              <p className="text-2xl font-bold text-red-600">
                {Math.min(...fallOfWickets.map((w) => w.partnership))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Average Partnership</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(
                  fallOfWickets.reduce((sum, w) => sum + w.partnership, 0) /
                    fallOfWickets.length
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
