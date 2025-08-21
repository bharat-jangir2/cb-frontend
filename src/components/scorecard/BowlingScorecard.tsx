import React from "react";
import type { PlayerMatchStats } from "../../services/scorecard.service";

interface BowlingScorecardProps {
  matchId: string;
  playerStats: PlayerMatchStats[];
}

export const BowlingScorecard: React.FC<BowlingScorecardProps> = ({
  matchId,
  playerStats,
}) => {
  const bowlingStats =
    playerStats?.filter(
      (stat) => stat.bowlingOvers > 0 || stat.bowlingBalls > 0
    ) || [];

  return (
    <div className="space-y-6">
      {/* Bowling Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Bowling Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Wickets</div>
            <div className="font-semibold">
              {bowlingStats.reduce((sum, stat) => sum + stat.bowlingWickets, 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Total Overs</div>
            <div className="font-semibold">
              {bowlingStats.reduce((sum, stat) => sum + stat.bowlingOvers, 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Total Runs</div>
            <div className="font-semibold">
              {bowlingStats.reduce((sum, stat) => sum + stat.bowlingRuns, 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Maidens</div>
            <div className="font-semibold">
              {bowlingStats.reduce((sum, stat) => sum + stat.bowlingMaidens, 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Bowling Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bowler
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                O
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                M
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                R
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                W
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Econ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SR
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bowlingStats.map((stat) => (
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
                  {stat.bowlingOvers}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stat.bowlingMaidens}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stat.bowlingRuns}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stat.bowlingWickets}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stat.bowlingEconomy?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stat.bowlingAverage?.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stat.bowlingStrikeRate?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bowlingStats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No bowling data available
        </div>
      )}
    </div>
  );
};
