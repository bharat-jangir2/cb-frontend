import React, { useState } from 'react';
import { FaBolt, FaCog, FaChartBar, FaEye, FaPlus, FaEdit, FaTrash, FaPlay, FaStop, FaPause, FaCheck, FaClock, FaExclamationTriangle, FaUsers, FaTrophy } from 'react-icons/fa';
import { usePowerplay } from '../../hooks/usePowerplay';
import { PowerPlayStatus, PowerPlayType, type PowerPlay, type PowerplayData } from '../../types/powerplay';
import { toast } from 'react-hot-toast';
import { PowerplayConfigForm } from './PowerplayConfigForm';

interface EnhancedPowerplayManagementProps {
  matchId: string;
  currentInnings: number;
}

type ViewType = 'overview' | 'list' | 'config' | 'stats';

export const EnhancedPowerplayManagement: React.FC<EnhancedPowerplayManagementProps> = ({
  matchId,
  currentInnings,
}) => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [selectedPowerplay, setSelectedPowerplay] = useState<PowerPlay | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const {
    currentPowerplay,
    powerplays,
    currentOver,
    isLoading,
    createPowerplay,
    updatePowerplay,
    deletePowerplay,
    activatePowerplay,
    deactivatePowerplay,
    updateCurrentOver,
    isCreating,
    isUpdating,
    isDeleting,
    isActivating,
    isDeactivating,
    matchWithPowerplays,
  } = usePowerplay(matchId);

  const getActivePowerplay = (): PowerPlay | undefined => {
    return powerplays.find(p => p.status === PowerPlayStatus.ACTIVE);
  };

  const getPendingPowerplays = (): PowerPlay[] => {
    return powerplays.filter(p => p.status === PowerPlayStatus.PENDING);
  };

  const getCompletedPowerplays = (): PowerPlay[] => {
    return powerplays.filter(p => p.status === PowerPlayStatus.COMPLETED);
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

  const handleCreatePowerplay = (data: PowerplayData) => {
    if (selectedPowerplay) {
      // Update existing powerplay
      const powerplayIndex = powerplays.findIndex(p => p._id === selectedPowerplay._id);
      if (powerplayIndex !== -1) {
        updatePowerplay({ index: powerplayIndex, data });
      }
    } else {
      // Create new powerplay
      createPowerplay(data);
    }
    setShowCreateForm(false);
    setSelectedPowerplay(null);
  };

  const handleUpdatePowerplay = (index: number, data: Partial<PowerplayData>) => {
    updatePowerplay({ index, data });
    setSelectedPowerplay(null);
  };

  const handleDeletePowerplay = (index: number) => {
    if (confirm('Are you sure you want to delete this powerplay?')) {
      deletePowerplay(index);
    }
  };

  const handleActivatePowerplay = (index: number) => {
    activatePowerplay(index);
  };

  const handleDeactivatePowerplay = () => {
    deactivatePowerplay();
  };

  const getStatusColor = (status: PowerPlayStatus) => {
    switch (status) {
      case PowerPlayStatus.ACTIVE:
        return 'bg-green-100 text-green-800 border-green-200';
      case PowerPlayStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case PowerPlayStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: PowerPlayType) => {
    switch (type) {
      case PowerPlayType.MANDATORY:
        return 'bg-red-100 text-red-800';
      case PowerPlayType.BATTING:
        return 'bg-green-100 text-green-800';
      case PowerPlayType.BOWLING:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activePowerplay = getActivePowerplay();
  const pendingPowerplays = getPendingPowerplays();
  const completedPowerplays = getCompletedPowerplays();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading powerplay data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaBolt className="mr-3 text-green-600" />
              Powerplay Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage match powerplays, status, and configurations
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Current Over</div>
              <div className="text-lg font-semibold text-green-600">
                {currentOver}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCreateForm(true)}
                disabled={isCreating}
                className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                <FaPlus className="mr-1" />
                {isCreating ? 'Creating...' : 'New Powerplay'}
              </button>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Admin Mode
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FaEye },
              { id: 'list', label: 'All Powerplays', icon: FaBolt },
              { id: 'config', label: 'Configuration', icon: FaCog },
              { id: 'stats', label: 'Statistics', icon: FaChartBar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as ViewType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${
                    activeView === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* Current Status */}
              {activePowerplay ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <h3 className="text-xl font-semibold text-green-800">
                        Active Powerplay
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(activePowerplay.type)}`}>
                        {activePowerplay.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {getTimeRemaining(activePowerplay)}
                      </div>
                      <div className="text-sm text-green-500">
                        Over {currentOver} of {activePowerplay.endOver}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-green-600 mb-2">
                      <span>Progress</span>
                      <span>{calculateProgress(activePowerplay)}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(activePowerplay)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <FaUsers className="text-green-600" />
                      <span className="text-green-700">
                        Max {activePowerplay.maxFieldersOutside} fielders outside
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaTrophy className="text-green-600" />
                      <span className="text-green-700">
                        {activePowerplay.stats.runsScored} runs, {activePowerplay.stats.wicketsLost} wickets
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaChartBar className="text-green-600" />
                      <span className="text-green-700">
                        RR: {activePowerplay.stats.runRate.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleDeactivatePowerplay()}
                      disabled={isDeactivating}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                      {isDeactivating ? 'Deactivating...' : 'End Powerplay'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3">
                    <FaClock className="text-gray-400 text-xl" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700">
                        No Active Powerplay
                      </h3>
                      <p className="text-gray-500">
                        Currently in regular play mode
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Powerplay */}
              {pendingPowerplays.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FaClock className="text-blue-500 text-xl" />
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800">
                          Next Powerplay
                        </h3>
                        <p className="text-blue-600">
                          {pendingPowerplays[0].type} powerplay starting at over {pendingPowerplays[0].startOver}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {pendingPowerplays[0].startOver - currentOver} overs until start
                      </div>
                      <button
                        onClick={() => handleActivatePowerplay(0)}
                        disabled={isActivating}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {isActivating ? 'Activating...' : 'Activate Now'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaBolt className="text-yellow-500" />
                    <h4 className="font-medium text-gray-900">Total</h4>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{powerplays.length}</div>
                  <div className="text-sm text-gray-500">Powerplays</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaPlay className="text-green-500" />
                    <h4 className="font-medium text-gray-900">Active</h4>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {powerplays.filter(p => p.status === PowerPlayStatus.ACTIVE).length}
                  </div>
                  <div className="text-sm text-gray-500">Currently running</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaCheck className="text-blue-500" />
                    <h4 className="font-medium text-gray-900">Completed</h4>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {completedPowerplays.length}
                  </div>
                  <div className="text-sm text-gray-500">Finished</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaClock className="text-yellow-500" />
                    <h4 className="font-medium text-gray-900">Pending</h4>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {pendingPowerplays.length}
                  </div>
                  <div className="text-sm text-gray-500">Waiting</div>
                </div>
              </div>
            </div>
          )}

          {/* List Tab */}
          {activeView === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Powerplays</h3>
                <div className="flex space-x-2">
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option value="">All Types</option>
                    <option value="mandatory">Mandatory</option>
                    <option value="batting">Batting</option>
                    <option value="bowling">Bowling</option>
                  </select>
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {powerplays.map((powerplay, index) => (
                  <div
                    key={powerplay._id || index}
                    className={`bg-white border rounded-lg p-4 ${
                      powerplay.status === PowerPlayStatus.ACTIVE
                        ? 'border-green-200 bg-green-50'
                        : powerplay.status === PowerPlayStatus.COMPLETED
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-yellow-200 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            powerplay.status === PowerPlayStatus.ACTIVE
                              ? 'bg-green-500 animate-pulse'
                              : powerplay.status === PowerPlayStatus.COMPLETED
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                          }`}
                        ></div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">
                              {powerplay.type} Powerplay
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(powerplay.type)}`}>
                              {powerplay.type}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(powerplay.status)}`}>
                              {powerplay.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Overs {powerplay.startOver}-{powerplay.endOver} • Max {powerplay.maxFieldersOutside} fielders outside
                          </div>
                          {powerplay.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {powerplay.description}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Progress for active powerplay */}
                        {powerplay.status === PowerPlayStatus.ACTIVE && (
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium text-green-600">
                              {calculateProgress(powerplay)}% complete
                            </div>
                            <div className="text-xs text-green-500">
                              {getTimeRemaining(powerplay)}
                            </div>
                          </div>
                        )}

                        {/* Stats for completed powerplay */}
                        {powerplay.status === PowerPlayStatus.COMPLETED && (
                          <div className="text-right mr-4">
                            <div className="text-sm font-medium text-blue-600">
                              {powerplay.stats.runsScored} runs, {powerplay.stats.wicketsLost} wickets
                            </div>
                            <div className="text-xs text-blue-500">
                              RR: {powerplay.stats.runRate.toFixed(2)}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-1">
                          {powerplay.status === PowerPlayStatus.PENDING && (
                            <button
                              onClick={() => handleActivatePowerplay(index)}
                              disabled={isActivating}
                              className="p-2 text-green-600 hover:text-green-800 disabled:text-gray-400"
                              title="Activate Powerplay"
                            >
                              <FaPlay className="w-4 h-4" />
                            </button>
                          )}

                          {powerplay.status === PowerPlayStatus.ACTIVE && (
                            <button
                              onClick={() => handleDeactivatePowerplay()}
                              disabled={isDeactivating}
                              className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                              title="Deactivate Powerplay"
                            >
                              <FaStop className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedPowerplay(powerplay)}
                            className="p-2 text-blue-600 hover:text-blue-800"
                            title="Edit Powerplay"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeletePowerplay(index)}
                            disabled={isDeleting}
                            className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                            title="Delete Powerplay"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar for active powerplay */}
                    {powerplay.status === PowerPlayStatus.ACTIVE && (
                      <div className="mt-3">
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${calculateProgress(powerplay)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {powerplays.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FaBolt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No powerplays configured yet.</p>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Create First Powerplay
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Configuration Tab */}
          {activeView === 'config' && (
            <div className="space-y-6">
              {showCreateForm ? (
                <PowerplayConfigForm
                  powerplay={selectedPowerplay || undefined}
                  onSubmit={handleCreatePowerplay}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setSelectedPowerplay(null);
                  }}
                  isLoading={isCreating || isUpdating}
                  currentInnings={currentInnings}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Powerplay Configuration</h3>
                    <button
                      onClick={() => setShowCreateForm(true)}
                      disabled={isCreating}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                    >
                      <FaPlus className="mr-2" />
                      {isCreating ? 'Creating...' : 'Add Powerplay'}
                    </button>
                  </div>

                  {/* Powerplay List for Configuration */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Configured Powerplays</h4>
                    {powerplays.length > 0 ? (
                      <div className="space-y-3">
                        {powerplays.map((powerplay, index) => (
                          <div
                            key={powerplay._id || index}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`w-3 h-3 rounded-full ${
                                  powerplay.status === PowerPlayStatus.ACTIVE
                                    ? 'bg-green-500 animate-pulse'
                                    : powerplay.status === PowerPlayStatus.COMPLETED
                                    ? 'bg-blue-500'
                                    : 'bg-yellow-500'
                                }`}></div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h5 className="font-medium text-gray-900">
                                      {powerplay.type} Powerplay
                                    </h5>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(powerplay.type)}`}>
                                      {powerplay.type}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(powerplay.status)}`}>
                                      {powerplay.status}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Overs {powerplay.startOver}-{powerplay.endOver} • Max {powerplay.maxFieldersOutside} fielders outside
                                  </div>
                                  {powerplay.description && (
                                    <div className="text-sm text-gray-500 mt-1">
                                      {powerplay.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedPowerplay(powerplay);
                                    setShowCreateForm(true);
                                  }}
                                  className="p-2 text-blue-600 hover:text-blue-800"
                                  title="Edit Powerplay"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePowerplay(index)}
                                  disabled={isDeleting}
                                  className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                                  title="Delete Powerplay"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FaBolt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No powerplays configured yet.</p>
                        <button
                          onClick={() => setShowCreateForm(true)}
                          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Create First Powerplay
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Statistics Tab */}
          {activeView === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Powerplay Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Overall Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Runs</span>
                      <span className="font-semibold">
                        {powerplays.reduce((sum, p) => sum + p.stats.runsScored, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Wickets</span>
                      <span className="font-semibold">
                        {powerplays.reduce((sum, p) => sum + p.stats.wicketsLost, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Run Rate</span>
                      <span className="font-semibold">
                        {(powerplays.reduce((sum, p) => sum + p.stats.runRate, 0) / Math.max(powerplays.length, 1)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Best Performance</h4>
                  {completedPowerplays.length > 0 ? (
                    <div className="space-y-3">
                      {(() => {
                        const bestPowerplay = completedPowerplays.reduce((best, current) => 
                          current.stats.runsScored > best.stats.runsScored ? current : best
                        );
                        return (
                          <>
                            <div className="text-sm text-gray-600">{bestPowerplay.type} Powerplay</div>
                            <div className="text-2xl font-bold text-green-600">{bestPowerplay.stats.runsScored} runs</div>
                            <div className="text-sm text-gray-500">Overs {bestPowerplay.startOver}-{bestPowerplay.endOver}</div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-gray-500">No completed powerplays yet</div>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Type Breakdown</h4>
                  <div className="space-y-3">
                    {Object.values(PowerPlayType).map(type => {
                      const typePowerplays = powerplays.filter(p => p.type === type);
                      return (
                        <div key={type} className="flex justify-between">
                          <span className="text-gray-600">{type}</span>
                          <span className="font-semibold">{typePowerplays.length}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};
