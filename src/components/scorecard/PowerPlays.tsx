import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { unifiedScorecardService } from "../../services/unified-scorecard.service";
import type { PowerPlayInfo, InningsScorecard } from "../../types/scorecard";
import { FaBolt, FaChartBar, FaClock } from "react-icons/fa";

interface PowerPlaysProps {
  matchId: string;
  innings?: InningsScorecard;
  selectedInnings: number;
  onInningsChange: (innings: number) => void;
  isAdmin?: boolean;
}

export const PowerPlays: React.FC<PowerPlaysProps> = ({
  matchId,
  innings,
  selectedInnings,
  onInningsChange,
  isAdmin = false,
}) => {
  const [activePowerPlay, setActivePowerPlay] = useState<number | null>(null);

  // Fetch power plays data
  const { data: powerPlays, isLoading } = useQuery({
    queryKey: ["powerPlays", matchId, selectedInnings],
    queryFn: () =>
      unifiedScorecardService.getPowerPlays(matchId, selectedInnings),
    enabled: !!matchId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentPowerPlay = powerPlays?.find((pp) => pp.isActive);
  const completedPowerPlays = powerPlays?.filter((pp) => !pp.isActive) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Power Plays</h2>
          <p className="text-gray-600">Power play analysis and statistics</p>
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
        </div>
      </div>

      {/* Current Power Play */}
      {currentPowerPlay && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FaBolt className="text-yellow-500 text-xl" />
              <h3 className="text-lg font-semibold text-yellow-800">
                Current Power Play
              </h3>
            </div>
            <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-yellow-600">Overs</p>
              <p className="text-2xl font-bold text-yellow-800">
                {currentPowerPlay.startOver}-{currentPowerPlay.endOver}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-yellow-600">Runs</p>
              <p className="text-2xl font-bold text-yellow-800">
                {currentPowerPlay.runs}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-yellow-600">Wickets</p>
              <p className="text-2xl font-bold text-yellow-800">
                {currentPowerPlay.wickets}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-yellow-600">Run Rate</p>
              <p className="text-2xl font-bold text-yellow-800">
                {currentPowerPlay.overs > 0
                  ? (currentPowerPlay.runs / currentPowerPlay.overs).toFixed(2)
                  : "0.00"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Power Plays Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Total Power Plays
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {powerPlays?.length || 0}
              </p>
            </div>
            <FaBolt className="text-blue-500 text-xl" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Runs</p>
              <p className="text-2xl font-bold text-green-900">
                {powerPlays?.reduce((sum, pp) => sum + pp.runs, 0) || 0}
              </p>
            </div>
            <FaChartBar className="text-green-500 text-xl" />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Total Wickets
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {powerPlays?.reduce((sum, pp) => sum + pp.wickets, 0) || 0}
              </p>
            </div>
            <FaClock className="text-purple-500 text-xl" />
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Avg Run Rate
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {powerPlays && powerPlays.length > 0
                  ? (
                      powerPlays.reduce((sum, pp) => sum + pp.runs, 0) /
                      powerPlays.reduce((sum, pp) => sum + pp.overs, 0)
                    ).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <FaChartBar className="text-orange-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Power Plays Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Power Play Details
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Power Play
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Runs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Run Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {powerPlays?.map((powerPlay, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    powerPlay.isActive ? "bg-yellow-50" : ""
                  }`}
                  onClick={() =>
                    setActivePowerPlay(activePowerPlay === index ? null : index)
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaBolt
                        className={`text-sm mr-2 ${
                          powerPlay.isActive
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        Power Play {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {powerPlay.startOver}-{powerPlay.endOver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {powerPlay.runs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {powerPlay.wickets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {powerPlay.overs > 0
                      ? (powerPlay.runs / powerPlay.overs).toFixed(2)
                      : "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        powerPlay.isActive
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {powerPlay.isActive ? "ACTIVE" : "COMPLETED"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!powerPlays || powerPlays.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No power play data available for this innings.
          </div>
        )}
      </div>

      {/* Power Play Analysis */}
      {powerPlays && powerPlays.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Power Play Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Best Power Play</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  powerPlays.reduce((best, pp) =>
                    pp.runs > best.runs ? pp : best
                  ).runs
                }{" "}
                runs
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Most Wickets</p>
              <p className="text-2xl font-bold text-red-600">
                {
                  powerPlays.reduce((best, pp) =>
                    pp.wickets > best.wickets ? pp : best
                  ).wickets
                }{" "}
                wickets
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Highest Run Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.max(
                  ...powerPlays.map((pp) =>
                    pp.overs > 0 ? pp.runs / pp.overs : 0
                  )
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
