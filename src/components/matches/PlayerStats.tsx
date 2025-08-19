import React from "react";
import { usePlayerStats } from "../../hooks";

interface PlayerStatsProps {
  matchId: string;
  stats?: any;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({
  matchId,
  stats: initialStats,
}) => {
  const { data: stats = initialStats || [] } = usePlayerStats(matchId);

  const battingStats =
    stats?.filter((player: any) => player.battingStats) || [];
  const bowlingStats =
    stats?.filter((player: any) => player.bowlingStats) || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Player Statistics
      </h3>

      {/* Batting Stats */}
      {battingStats.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">Batting</h4>
          <div className="space-y-2">
            {battingStats.slice(0, 5).map((player: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <div className="font-medium text-sm">{player.playerName}</div>
                  <div className="text-xs text-gray-600">{player.teamName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">
                    {player.battingStats.runs} ({player.battingStats.balls})
                  </div>
                  <div className="text-xs text-gray-600">
                    SR: {player.battingStats.strikeRate?.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bowling Stats */}
      {bowlingStats.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Bowling</h4>
          <div className="space-y-2">
            {bowlingStats.slice(0, 5).map((player: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <div className="font-medium text-sm">{player.playerName}</div>
                  <div className="text-xs text-gray-600">{player.teamName}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">
                    {player.bowlingStats.wickets}/{player.bowlingStats.runs}
                  </div>
                  <div className="text-xs text-gray-600">
                    Econ: {player.bowlingStats.economy?.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No player statistics available
        </div>
      )}
    </div>
  );
};
