import React, { useState } from 'react';
import { FaBolt, FaPlay, FaStop, FaExclamationTriangle, FaUndo, FaCog } from 'react-icons/fa';
import { PowerPlayStatus, type PowerPlay } from '../../types/powerplay';

interface PowerplayControlPanelProps {
  matchId: string;
  powerplays: PowerPlay[];
  currentPowerplay: any;
  onActivatePowerplay: (index: number) => void;
  onDeactivatePowerplay: () => void;
  onUpdateCurrentOver: (over: number) => void;
  currentOver: number;
  isLoading?: boolean;
}

export const PowerplayControlPanel: React.FC<PowerplayControlPanelProps> = ({
  matchId,
  powerplays,
  currentPowerplay,
  onActivatePowerplay,
  onDeactivatePowerplay,
  onUpdateCurrentOver,
  currentOver,
  isLoading = false,
}) => {
  const [showEmergencyControls, setShowEmergencyControls] = useState(false);
  const [manualOver, setManualOver] = useState(currentOver);

  const getPendingPowerplays = (): PowerPlay[] => {
    return powerplays.filter(p => p.status === PowerPlayStatus.PENDING);
  };

  const getActivePowerplay = (): PowerPlay | undefined => {
    return powerplays.find(p => p.status === PowerPlayStatus.ACTIVE);
  };

  const handleManualOverUpdate = () => {
    onUpdateCurrentOver(manualOver);
  };

  const handleEmergencyActivate = (powerplayIndex: number) => {
    if (window.confirm('Are you sure you want to force activate this powerplay? This will override automatic management.')) {
      onActivatePowerplay(powerplayIndex);
    }
  };

  const handleEmergencyDeactivate = () => {
    if (window.confirm('Are you sure you want to force deactivate the current powerplay? This will override automatic management.')) {
      onDeactivatePowerplay();
    }
  };

  const pendingPowerplays = getPendingPowerplays();
  const activePowerplay = getActivePowerplay();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Powerplay Controls</h3>
        <div className="flex items-center space-x-2">
          <FaBolt className="text-yellow-500" />
          <span className="text-sm text-gray-600">Manual Control</span>
        </div>
      </div>

      {/* Current Over Control */}
      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-blue-900 mb-3">Current Over Management</h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-blue-700">Current Over:</label>
              <input
                type="number"
                value={manualOver}
                onChange={(e) => setManualOver(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.1"
              />
            </div>
            <button
              onClick={handleManualOverUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              disabled={isLoading}
            >
              Update Over
            </button>
            <div className="text-sm text-blue-600">
              Auto-management will trigger based on this over
            </div>
          </div>
        </div>
      </div>

      {/* Manual Powerplay Activation */}
      {pendingPowerplays.length > 0 && (
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-yellow-900 mb-3">Manual Powerplay Activation</h4>
            <div className="space-y-3">
              {pendingPowerplays.map((powerplay, index) => {
                const originalIndex = powerplays.findIndex(p => p._id === powerplay._id);
                return (
                  <div key={powerplay._id || index} className="flex items-center justify-between p-3 bg-white rounded border border-yellow-200">
                    <div>
                      <div className="font-medium text-yellow-800">
                        {powerplay.type} Powerplay
                      </div>
                      <div className="text-sm text-yellow-600">
                        Overs {powerplay.startOver}-{powerplay.endOver} • Max {powerplay.maxFieldersOutside} fielders
                      </div>
                    </div>
                    <button
                      onClick={() => handleEmergencyActivate(originalIndex)}
                      className="flex items-center px-3 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                      disabled={isLoading}
                    >
                      <FaPlay className="mr-2" />
                      Activate Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Manual Powerplay Deactivation */}
      {activePowerplay && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-md font-medium text-red-900 mb-3">Manual Powerplay Deactivation</h4>
            <div className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
              <div>
                <div className="font-medium text-red-800">
                  {activePowerplay.type} Powerplay (Active)
                </div>
                <div className="text-sm text-red-600">
                  Overs {activePowerplay.startOver}-{activePowerplay.endOver} • Max {activePowerplay.maxFieldersOutside} fielders
                </div>
              </div>
              <button
                onClick={handleEmergencyDeactivate}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                disabled={isLoading}
              >
                <FaStop className="mr-2" />
                Deactivate Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Controls */}
      <div className="mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-md font-medium text-gray-900">Emergency Controls</h4>
            <button
              onClick={() => setShowEmergencyControls(!showEmergencyControls)}
              className="flex items-center px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              <FaCog className="mr-2" />
              {showEmergencyControls ? 'Hide' : 'Show'} Emergency Controls
            </button>
          </div>
          
          {showEmergencyControls && (
            <div className="space-y-3">
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <FaExclamationTriangle className="text-orange-500" />
                  <span className="text-sm font-medium text-orange-800">Emergency Override</span>
                </div>
                <p className="text-sm text-orange-700 mb-3">
                  These controls allow you to override automatic powerplay management. Use with caution.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm('This will reset all powerplay states to pending. Continue?')) {
                        // This would need to be implemented in the backend
                        alert('Reset functionality needs backend implementation');
                      }
                    }}
                    className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                    disabled={isLoading}
                  >
                    <FaUndo className="mr-2" />
                    Reset All Powerplays
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm('This will skip to the next powerplay. Continue?')) {
                        // This would need to be implemented in the backend
                        alert('Skip functionality needs backend implementation');
                      }
                    }}
                    className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    <FaBolt className="mr-2" />
                    Skip to Next Powerplay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-3">Control Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Current Over:</span>
            <span className="ml-2 text-gray-900">{currentOver}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Active Powerplay:</span>
            <span className="ml-2 text-gray-900">
              {activePowerplay ? `${activePowerplay.type} (Overs ${activePowerplay.startOver}-${activePowerplay.endOver})` : 'None'}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Pending Powerplays:</span>
            <span className="ml-2 text-gray-900">{pendingPowerplays.length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Auto-management:</span>
            <span className="ml-2 text-green-600 font-medium">Enabled</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Processing powerplay changes...
          </div>
        </div>
      )}
    </div>
  );
};
