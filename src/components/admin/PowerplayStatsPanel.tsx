import React from 'react';
import { FaChartBar, FaChartLine, FaChartPie, FaTrophy, FaBolt } from 'react-icons/fa';
import { PowerPlayStatus, type PowerPlay } from '../../types/powerplay';

interface PowerplayStatsPanelProps {
  powerplays: PowerPlay[];
  currentInnings: number;
}

export const PowerplayStatsPanel: React.FC<PowerplayStatsPanelProps> = ({
  powerplays,
  currentInnings,
}) => {
  const getCompletedPowerplays = (): PowerPlay[] => {
    return powerplays.filter(p => p.status === PowerPlayStatus.COMPLETED);
  };

  const getActivePowerplay = (): PowerPlay | undefined => {
    return powerplays.find(p => p.status === PowerPlayStatus.ACTIVE);
  };

  const calculateTotalStats = () => {
    const completed = getCompletedPowerplays();
    return completed.reduce(
      (acc, powerplay) => ({
        runsScored: acc.runsScored + powerplay.stats.runsScored,
        wicketsLost: acc.wicketsLost + powerplay.stats.wicketsLost,
        oversCompleted: acc.oversCompleted + powerplay.stats.oversCompleted,
        boundaries: acc.boundaries + powerplay.stats.boundaries,
        sixes: acc.sixes + powerplay.stats.sixes,
      }),
      {
        runsScored: 0,
        wicketsLost: 0,
        oversCompleted: 0,
        boundaries: 0,
        sixes: 0,
      }
    );
  };

  const calculateAverageRunRate = () => {
    const completed = getCompletedPowerplays();
    if (completed.length === 0) return 0;
    
    const totalRuns = completed.reduce((sum, p) => sum + p.stats.runsScored, 0);
    const totalOvers = completed.reduce((sum, p) => sum + p.stats.oversCompleted, 0);
    
    return totalOvers > 0 ? (totalRuns / totalOvers) : 0;
  };

  const getBestPowerplay = (): PowerPlay | undefined => {
    const completed = getCompletedPowerplays();
    if (completed.length === 0) return undefined;
    
    return completed.reduce((best, current) => {
      const bestRate = best.stats.oversCompleted > 0 ? best.stats.runsScored / best.stats.oversCompleted : 0;
      const currentRate = current.stats.oversCompleted > 0 ? current.stats.runsScored / current.stats.oversCompleted : 0;
      return currentRate > bestRate ? current : best;
    });
  };

  const totalStats = calculateTotalStats();
  const averageRunRate = calculateAverageRunRate();
  const bestPowerplay = getBestPowerplay();
  const activePowerplay = getActivePowerplay();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Powerplay Statistics</h3>
        <div className="flex items-center space-x-2">
          <FaChartBar className="text-blue-500" />
          <span className="text-sm text-gray-600">Analytics</span>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaBolt className="text-blue-500" />
            <h5 className="font-medium text-blue-900">Total Runs</h5>
          </div>
          <div className="text-2xl font-bold text-blue-600">{totalStats.runsScored}</div>
          <div className="text-sm text-blue-500">
            Across {getCompletedPowerplays().length} powerplays
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaChartLine className="text-green-500" />
            <h5 className="font-medium text-green-900">Avg Run Rate</h5>
          </div>
          <div className="text-2xl font-bold text-green-600">{averageRunRate.toFixed(2)}</div>
          <div className="text-sm text-green-500">
            Runs per over
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaChartPie className="text-purple-500" />
            <h5 className="font-medium text-purple-900">Wickets Lost</h5>
          </div>
          <div className="text-2xl font-bold text-purple-600">{totalStats.wicketsLost}</div>
          <div className="text-sm text-purple-500">
            In powerplay overs
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaTrophy className="text-orange-500" />
            <h5 className="font-medium text-orange-900">Boundaries</h5>
          </div>
          <div className="text-2xl font-bold text-orange-600">{totalStats.boundaries + totalStats.sixes}</div>
          <div className="text-sm text-orange-500">
            {totalStats.boundaries} fours, {totalStats.sixes} sixes
          </div>
        </div>
      </div>

      {/* Best Powerplay Performance */}
      {bestPowerplay && (
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FaTrophy className="text-yellow-500" />
              <h4 className="text-md font-medium text-yellow-900">Best Powerplay Performance</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-yellow-700">Powerplay Type</div>
                <div className="font-medium text-yellow-900">{bestPowerplay.type}</div>
              </div>
              <div>
                <div className="text-sm text-yellow-700">Run Rate</div>
                <div className="font-medium text-yellow-900">
                  {bestPowerplay.stats.oversCompleted > 0 
                    ? (bestPowerplay.stats.runsScored / bestPowerplay.stats.oversCompleted).toFixed(2)
                    : '0.00'
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-yellow-700">Runs Scored</div>
                <div className="font-medium text-yellow-900">{bestPowerplay.stats.runsScored}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Active Powerplay Stats */}
      {activePowerplay && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FaBolt className="text-green-500" />
              <h4 className="text-md font-medium text-green-900">Current Powerplay Stats</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-green-700">Runs</div>
                <div className="text-lg font-bold text-green-900">{activePowerplay.stats.runsScored}</div>
              </div>
              <div>
                <div className="text-sm text-green-700">Wickets</div>
                <div className="text-lg font-bold text-green-900">{activePowerplay.stats.wicketsLost}</div>
              </div>
              <div>
                <div className="text-sm text-green-700">Run Rate</div>
                <div className="text-lg font-bold text-green-900">
                  {activePowerplay.stats.oversCompleted > 0 
                    ? (activePowerplay.stats.runsScored / activePowerplay.stats.oversCompleted).toFixed(2)
                    : '0.00'
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-green-700">Boundaries</div>
                <div className="text-lg font-bold text-green-900">{activePowerplay.stats.boundaries + activePowerplay.stats.sixes}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Powerplay Breakdown */}
      {getCompletedPowerplays().length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">Powerplay Breakdown</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Overs</th>
                  <th className="text-left py-2">Runs</th>
                  <th className="text-left py-2">Wickets</th>
                  <th className="text-left py-2">Run Rate</th>
                  <th className="text-left py-2">4s</th>
                  <th className="text-left py-2">6s</th>
                </tr>
              </thead>
              <tbody>
                {getCompletedPowerplays().map((powerplay, index) => (
                  <tr key={powerplay._id || index} className="border-b border-gray-100">
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        powerplay.type === 'mandatory' 
                          ? 'bg-blue-100 text-blue-800'
                          : powerplay.type === 'batting'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {powerplay.type}
                      </span>
                    </td>
                    <td className="py-2 font-medium">
                      {powerplay.startOver}-{powerplay.endOver}
                    </td>
                    <td className="py-2 font-bold">{powerplay.stats.runsScored}</td>
                    <td className="py-2">{powerplay.stats.wicketsLost}</td>
                    <td className="py-2">
                      {powerplay.stats.oversCompleted > 0 
                        ? (powerplay.stats.runsScored / powerplay.stats.oversCompleted).toFixed(2)
                        : '0.00'
                      }
                    </td>
                    <td className="py-2">{powerplay.stats.boundaries}</td>
                    <td className="py-2">{powerplay.stats.sixes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data State */}
      {getCompletedPowerplays().length === 0 && !activePowerplay && (
        <div className="text-center py-8 text-gray-500">
          <FaChartBar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium">No Powerplay Data</p>
          <p className="text-sm">Statistics will appear once powerplays are completed.</p>
        </div>
      )}
    </div>
  );
};
