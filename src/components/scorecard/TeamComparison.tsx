import React from "react";
import { FaChartBar, FaTrophy, FaUsers, FaBolt } from "react-icons/fa";

interface TeamComparisonProps {
  comparison?: {
    teamA: {
      totalRuns: number;
      totalWickets: number;
      totalOvers: number;
      runRate: number;
      boundaries: number;
      sixes: number;
    };
    teamB: {
      totalRuns: number;
      totalWickets: number;
      totalOvers: number;
      runRate: number;
      boundaries: number;
      sixes: number;
    };
  };
}

export const TeamComparison: React.FC<TeamComparisonProps> = ({
  comparison,
}) => {
  if (!comparison) {
    return (
      <div className="text-center py-8 text-gray-500">
        No team comparison data available.
      </div>
    );
  }

  const teamA = comparison.teamA;
  const teamB = comparison.teamB;

  // Calculate winners for each metric
  const getWinner = (
    valueA: number,
    valueB: number,
    higherIsBetter: boolean = true
  ) => {
    if (higherIsBetter) {
      return valueA > valueB ? "A" : valueB > valueA ? "B" : "tie";
    } else {
      return valueA < valueB ? "A" : valueB < valueA ? "B" : "tie";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Comparison</h2>
        <p className="text-gray-600">Statistical comparison between teams</p>
      </div>

      {/* Overall Performance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Overall Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team A */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-blue-900">Team A</h4>
              <FaUsers className="text-blue-500 text-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Total Runs:</span>
                <span className="font-semibold text-blue-900">
                  {teamA.totalRuns}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Wickets Lost:</span>
                <span className="font-semibold text-blue-900">
                  {teamA.totalWickets}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Overs:</span>
                <span className="font-semibold text-blue-900">
                  {teamA.totalOvers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Run Rate:</span>
                <span className="font-semibold text-blue-900">
                  {teamA.runRate.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-green-900">Team B</h4>
              <FaUsers className="text-green-500 text-xl" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Total Runs:</span>
                <span className="font-semibold text-green-900">
                  {teamB.totalRuns}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Wickets Lost:</span>
                <span className="font-semibold text-green-900">
                  {teamB.totalWickets}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Overs:</span>
                <span className="font-semibold text-green-900">
                  {teamB.totalOvers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Run Rate:</span>
                <span className="font-semibold text-green-900">
                  {teamB.runRate.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Detailed Comparison
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-500 uppercase tracking-wider">
                  Team A
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-500 uppercase tracking-wider">
                  Team B
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Winner
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Total Runs */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaChartBar className="text-gray-400 text-sm mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Total Runs
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {teamA.totalRuns}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-green-600">
                    {teamB.totalRuns}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getWinner(teamA.totalRuns, teamB.totalRuns) === "A"
                        ? "bg-blue-100 text-blue-800"
                        : getWinner(teamA.totalRuns, teamB.totalRuns) === "B"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getWinner(teamA.totalRuns, teamB.totalRuns) === "A"
                      ? "Team A"
                      : getWinner(teamA.totalRuns, teamB.totalRuns) === "B"
                      ? "Team B"
                      : "Tie"}
                  </span>
                </td>
              </tr>

              {/* Run Rate */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaBolt className="text-gray-400 text-sm mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Run Rate
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {teamA.runRate.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-green-600">
                    {teamB.runRate.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getWinner(teamA.runRate, teamB.runRate) === "A"
                        ? "bg-blue-100 text-blue-800"
                        : getWinner(teamA.runRate, teamB.runRate) === "B"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getWinner(teamA.runRate, teamB.runRate) === "A"
                      ? "Team A"
                      : getWinner(teamA.runRate, teamB.runRate) === "B"
                      ? "Team B"
                      : "Tie"}
                  </span>
                </td>
              </tr>

              {/* Boundaries */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaTrophy className="text-gray-400 text-sm mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Boundaries
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {teamA.boundaries}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-green-600">
                    {teamB.boundaries}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getWinner(teamA.boundaries, teamB.boundaries) === "A"
                        ? "bg-blue-100 text-blue-800"
                        : getWinner(teamA.boundaries, teamB.boundaries) === "B"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getWinner(teamA.boundaries, teamB.boundaries) === "A"
                      ? "Team A"
                      : getWinner(teamA.boundaries, teamB.boundaries) === "B"
                      ? "Team B"
                      : "Tie"}
                  </span>
                </td>
              </tr>

              {/* Sixes */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaBolt className="text-gray-400 text-sm mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Sixes
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {teamA.sixes}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-green-600">
                    {teamB.sixes}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getWinner(teamA.sixes, teamB.sixes) === "A"
                        ? "bg-blue-100 text-blue-800"
                        : getWinner(teamA.sixes, teamB.sixes) === "B"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getWinner(teamA.sixes, teamB.sixes) === "A"
                      ? "Team A"
                      : getWinner(teamA.sixes, teamB.sixes) === "B"
                      ? "Team B"
                      : "Tie"}
                  </span>
                </td>
              </tr>

              {/* Wickets Lost (lower is better) */}
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FaUsers className="text-gray-400 text-sm mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      Wickets Lost
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {teamA.totalWickets}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-semibold text-green-600">
                    {teamB.totalWickets}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      getWinner(
                        teamA.totalWickets,
                        teamB.totalWickets,
                        false
                      ) === "A"
                        ? "bg-blue-100 text-blue-800"
                        : getWinner(
                            teamA.totalWickets,
                            teamB.totalWickets,
                            false
                          ) === "B"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getWinner(
                      teamA.totalWickets,
                      teamB.totalWickets,
                      false
                    ) === "A"
                      ? "Team A"
                      : getWinner(
                          teamA.totalWickets,
                          teamB.totalWickets,
                          false
                        ) === "B"
                      ? "Team B"
                      : "Tie"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Team A Wins</p>
              <p className="text-2xl font-bold text-blue-900">
                {
                  [
                    getWinner(teamA.totalRuns, teamB.totalRuns),
                    getWinner(teamA.runRate, teamB.runRate),
                    getWinner(teamA.boundaries, teamB.boundaries),
                    getWinner(teamA.sixes, teamB.sixes),
                    getWinner(teamA.totalWickets, teamB.totalWickets, false),
                  ].filter((winner) => winner === "A").length
                }
              </p>
            </div>
            <FaUsers className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Team B Wins</p>
              <p className="text-2xl font-bold text-green-900">
                {
                  [
                    getWinner(teamA.totalRuns, teamB.totalRuns),
                    getWinner(teamA.runRate, teamB.runRate),
                    getWinner(teamA.boundaries, teamB.boundaries),
                    getWinner(teamA.sixes, teamB.sixes),
                    getWinner(teamA.totalWickets, teamB.totalWickets, false),
                  ].filter((winner) => winner === "B").length
                }
              </p>
            </div>
            <FaUsers className="text-green-500 text-xl" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Ties</p>
              <p className="text-2xl font-bold text-purple-900">
                {
                  [
                    getWinner(teamA.totalRuns, teamB.totalRuns),
                    getWinner(teamA.runRate, teamB.runRate),
                    getWinner(teamA.boundaries, teamB.boundaries),
                    getWinner(teamA.sixes, teamB.sixes),
                    getWinner(teamA.totalWickets, teamB.totalWickets, false),
                  ].filter((winner) => winner === "tie").length
                }
              </p>
            </div>
            <FaTrophy className="text-purple-500 text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
