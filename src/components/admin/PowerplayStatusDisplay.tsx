import React from 'react';
import { FaBolt, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { PowerPlayStatus, PowerPlayType, type CurrentPowerPlay, type PowerPlay, type PowerplayData } from '../../types/powerplay';

interface PowerplayStatusDisplayProps {
  currentPowerplay: CurrentPowerPlay | null;
  powerplays: PowerPlay[];
  currentOver: number;
}

export const PowerplayStatusDisplay: React.FC<PowerplayStatusDisplayProps> = ({
  currentPowerplay,
  powerplays,
  currentOver,
}) => {
  const getActivePowerplay = (): PowerPlay | undefined => {
    return powerplays.find(p => p.status === PowerPlayStatus.ACTIVE);
  };

  const getNextPowerplay = (): PowerPlay | undefined => {
    return powerplays.find(p => p.status === PowerPlayStatus.PENDING);
  };

  const calculateProgress = (powerplay: PowerPlay): number => {
    if (currentOver < powerplay.startOver) return 0;
    if (currentOver > powerplay.endOver) return 100;
    
    const totalOvers = powerplay.endOver - powerplay.startOver;
    const completedOvers = currentOver - powerplay.startOver;
    return Math.round((completedOvers / totalOvers) * 100);
  };

  const getTimeRemaining = (powerplay: PowerPlay): string => {
    if (currentOver >= powerplay.endOver) return 'Completed';
    
    const remainingOvers = powerplay.endOver - currentOver;
    if (remainingOvers <= 0) return 'Ending';
    
    return `${remainingOvers} over${remainingOvers > 1 ? 's' : ''} remaining`;
  };

  const activePowerplay = getActivePowerplay();
  const nextPowerplay = getNextPowerplay();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Powerplay Status</h3>
        <div className="flex items-center space-x-2">
          <FaBolt className="text-yellow-500" />
          <span className="text-sm text-gray-600">Powerplay Management</span>
        </div>
      </div>

      {/* Current Powerplay Status */}
      {activePowerplay ? (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="text-lg font-semibold text-green-800">
                  Powerplay Active
                </h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {activePowerplay.type}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600">
                  {getTimeRemaining(activePowerplay)}
                </div>
                <div className="text-xs text-green-500">
                  Over {currentOver} of {activePowerplay.endOver}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-green-600 mb-1">
                <span>Progress</span>
                <span>{calculateProgress(activePowerplay)}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress(activePowerplay)}%` }}
                ></div>
              </div>
            </div>

            {/* Fielder Restrictions */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <FaExclamationTriangle className="text-orange-500" />
                <span className="text-green-700">
                  Max {activePowerplay.maxFieldersOutside} fielders outside circle
                </span>
              </div>
              <div className="text-green-600 font-medium">
                {activePowerplay.description || 'Active Powerplay'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <FaClock className="text-gray-400" />
              <div>
                <h4 className="text-lg font-semibold text-gray-700">
                  No Active Powerplay
                </h4>
                <p className="text-sm text-gray-500">
                  Currently in regular play mode
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Powerplay */}
      {nextPowerplay && !activePowerplay && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaClock className="text-blue-500" />
                <div>
                  <h4 className="text-md font-semibold text-blue-800">
                    Next Powerplay
                  </h4>
                  <p className="text-sm text-blue-600">
                    {nextPowerplay.type} powerplay starting at over {nextPowerplay.startOver}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-600">
                  {nextPowerplay.startOver - currentOver} over{nextPowerplay.startOver - currentOver > 1 ? 's' : ''} until start
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {nextPowerplay.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Powerplay Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaBolt className="text-yellow-500" />
            <h5 className="font-medium text-gray-900">Total Powerplays</h5>
          </div>
          <div className="text-2xl font-bold text-gray-900">{powerplays.length}</div>
          <div className="text-sm text-gray-500">
            {powerplays.filter(p => p.status === PowerPlayStatus.COMPLETED).length} completed
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaCheckCircle className="text-green-500" />
            <h5 className="font-medium text-gray-900">Completed</h5>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {powerplays.filter(p => p.status === PowerPlayStatus.COMPLETED).length}
          </div>
          <div className="text-sm text-gray-500">
            {powerplays.filter(p => p.status === PowerPlayStatus.COMPLETED).length > 0 
              ? 'Powerplays finished' 
              : 'None completed yet'
            }
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FaClock className="text-blue-500" />
            <h5 className="font-medium text-gray-900">Pending</h5>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {powerplays.filter(p => p.status === PowerPlayStatus.PENDING).length}
          </div>
          <div className="text-sm text-gray-500">
            {powerplays.filter(p => p.status === PowerPlayStatus.PENDING).length > 0 
              ? 'Powerplays waiting' 
              : 'All scheduled'
            }
          </div>
        </div>
      </div>

      {/* Quick Powerplay List */}
      {powerplays.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-900 mb-3">All Powerplays</h4>
          <div className="space-y-2">
            {powerplays.map((powerplay, index) => (
              <div
                key={powerplay._id || index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  powerplay.status === PowerPlayStatus.ACTIVE
                    ? 'bg-green-50 border-green-200'
                    : powerplay.status === PowerPlayStatus.COMPLETED
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      powerplay.status === PowerPlayStatus.ACTIVE
                        ? 'bg-green-500 animate-pulse'
                        : powerplay.status === PowerPlayStatus.COMPLETED
                        ? 'bg-gray-400'
                        : 'bg-yellow-500'
                    }`}
                  ></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {powerplay.type} Powerplay
                    </div>
                    <div className="text-xs text-gray-500">
                      Overs {powerplay.startOver}-{powerplay.endOver}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium ${
                    powerplay.status === PowerPlayStatus.ACTIVE
                      ? 'text-green-600'
                      : powerplay.status === PowerPlayStatus.COMPLETED
                      ? 'text-gray-600'
                      : 'text-yellow-600'
                  }`}>
                    {powerplay.status}
                  </div>
                  {powerplay.status === PowerPlayStatus.ACTIVE && (
                    <div className="text-xs text-green-500">
                      {calculateProgress(powerplay)}% complete
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
