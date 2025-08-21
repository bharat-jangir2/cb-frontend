import React from "react";
import type { PlayerMatchStats } from "../../services/scorecard.service";

interface BattingScorecardProps {
  matchId: string;
  playerStats: PlayerMatchStats[];
}

export const BattingScorecard: React.FC<BattingScorecardProps> = ({
  matchId,
  playerStats,
}) => {
  const battingStats =
    playerStats?.filter(
      (stat) => stat.battingBalls > 0 || stat.battingDismissal
    ) || [];

  return (
    <div className="space-y-6">
      {/* Batting Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Batting Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Runs</div>
            <div className="font-semibold">
              {battingStats.reduce((sum, stat) => sum + stat.battingRuns, 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Total Balls</div>
            <div className="font-semibold">
              {battingStats.reduce((sum, stat) => sum + stat.battingBalls, 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Fours</div>
            <div className="font-semibold">
              {battingStats.reduce((sum, stat) => sum + stat.battingFours, 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Sixes</div>
            <div className="font-semibold">
              {battingStats.reduce((sum, stat) => sum + stat.battingSixes, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Batting Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batsman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dismissal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                R
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                B
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                4s
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                6s
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SR
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {battingStats.map((stat) => (
              <tr key={stat._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {stat.player.photoUrl ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={stat.player.photoUrl}
                          alt={stat.player.fullName}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {stat.player.shortName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {stat.player.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stat.player.role}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stat.battingDismissal ? (
                    <span className="text-red-600">
                      {stat.battingDismissal.type
                        .replace("_", " ")
                        .toUpperCase()}
                      {stat.battingDismissal.bowler &&
                        ` b ${stat.battingDismissal.bowler}`}
                      {stat.battingDismissal.caughtBy &&
                        ` c ${stat.battingDismissal.caughtBy}`}
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">not out</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stat.battingRuns}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stat.battingBalls}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stat.battingFours}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stat.battingSixes}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stat.battingStrikeRate?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {battingStats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No batting data available
        </div>
      )}
    </div>
  );
};
