import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaUsers, FaBolt, FaEye, FaChartBar, FaClock, FaFlag, FaRocket } from 'react-icons/fa';
import type { Innings, InningsUpdateData } from '../../types/innings';
import { InningsStatus, InningsResult } from '../../types/innings';

interface InningsDetailsProps {
  innings: Innings;
  onInningsUpdate: (updateData: InningsUpdateData) => void;
  isAdmin?: boolean;
}

export const InningsDetailsPanel: React.FC<InningsDetailsProps> = ({
  innings,
  onInningsUpdate,
  isAdmin = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<InningsUpdateData>({});

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getResultText = (result: InningsResult) => {
    switch (result) {
      case InningsResult.ALL_OUT:
        return 'All Out';
      case InningsResult.TARGET_REACHED:
        return 'Target Reached';
      case InningsResult.OVERS_COMPLETED:
        return 'Overs Completed';
      case InningsResult.DECLARATION:
        return 'Declared';
      default:
        return '';
    }
  };

  const handleEdit = () => {
    setEditData({
      runs: innings.runs,
      wickets: innings.wickets,
      overs: innings.overs,
      extras: innings.extras,
      boundaries: innings.boundaries,
      sixes: innings.sixes,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    onInningsUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleInputChange = (field: keyof InningsUpdateData, value: number) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaRocket className="mr-2 text-indigo-600" />
          Innings {innings.inningsNumber} Details
        </h3>
        {isAdmin && innings.status === InningsStatus.IN_PROGRESS && (
          <div className="flex space-x-2">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                <FaEdit className="mr-1" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  <FaSave className="mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  <FaTimes className="mr-1" />
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <FaUsers className="mr-2 text-gray-600" />
              Teams
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Batting Team:</span>
                <span className="text-sm font-medium">{innings.battingTeam?.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bowling Team:</span>
                <span className="text-sm font-medium">{innings.bowlingTeam?.name || 'Not set'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <FaClock className="mr-2 text-gray-600" />
              Timing
            </h4>
            <div className="space-y-2">
              {innings.startTime && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Start Time:</span>
                  <span className="text-sm font-medium">{formatTime(innings.startTime)}</span>
                </div>
              )}
              {innings.endTime && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">End Time:</span>
                  <span className="text-sm font-medium">{formatTime(innings.endTime)}</span>
                </div>
              )}
              {innings.duration > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium">{formatDuration(innings.duration)}</span>
                </div>
              )}
            </div>
          </div>

          {innings.result && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <FaFlag className="mr-2 text-gray-600" />
                Result
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Result:</span>
                  <span className="text-sm font-medium">{getResultText(innings.result)}</span>
                </div>
                {innings.resultDescription && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Description:</span>
                    <span className="text-sm font-medium">{innings.resultDescription}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <FaChartBar className="mr-2 text-gray-600" />
              Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Runs:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.runs || innings.runs}
                      onChange={(e) => handleInputChange('runs', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  ) : (
                    <span className="text-sm font-medium">{innings.runs}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Wickets:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.wickets || innings.wickets}
                      onChange={(e) => handleInputChange('wickets', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  ) : (
                    <span className="text-sm font-medium">{innings.wickets}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overs:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.1"
                      value={editData.overs || innings.overs}
                      onChange={(e) => handleInputChange('overs', parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  ) : (
                    <span className="text-sm font-medium">{innings.overs}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Extras:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.extras || innings.extras}
                      onChange={(e) => handleInputChange('extras', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  ) : (
                    <span className="text-sm font-medium">{innings.extras}</span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Run Rate:</span>
                  <span className="text-sm font-medium">{innings.runRate ? innings.runRate.toFixed(2) : '0.00'}</span>
                </div>
                {innings.requiredRunRate && innings.requiredRunRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Required RR:</span>
                    <span className="text-sm font-medium text-orange-600">
                      {innings.requiredRunRate.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Boundaries:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.boundaries || innings.boundaries}
                      onChange={(e) => handleInputChange('boundaries', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  ) : (
                    <span className="text-sm font-medium">{innings.boundaries}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sixes:</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.sixes || innings.sixes}
                      onChange={(e) => handleInputChange('sixes', parseInt(e.target.value) || 0)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                  ) : (
                    <span className="text-sm font-medium">{innings.sixes}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Players */}
          {innings.currentPlayers && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <FaUsers className="mr-2 text-gray-600" />
                Current Players
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Striker:</span>
                  <span className="text-sm font-medium">{innings.currentPlayers.striker?.fullName || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Non-Striker:</span>
                  <span className="text-sm font-medium">{innings.currentPlayers.nonStriker?.fullName || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Bowler:</span>
                  <span className="text-sm font-medium">{innings.currentPlayers.bowler?.fullName || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-sm font-medium">
                    {innings.currentPlayers.lastUpdated ? formatTime(innings.currentPlayers.lastUpdated) : 'Not set'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Power Play Information */}
          {innings.currentPowerPlay && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                <FaBolt className="mr-2 text-gray-600" />
                Power Play
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-medium ${
                    innings.currentPowerPlay.isActive ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {innings.currentPowerPlay.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {innings.currentPowerPlay.type && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium">{innings.currentPowerPlay.type}</span>
                  </div>
                )}
                {innings.currentPowerPlay.startOver && innings.currentPowerPlay.endOver && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Overs:</span>
                    <span className="text-sm font-medium">
                      {innings.currentPowerPlay.startOver}-{innings.currentPowerPlay.endOver}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Max Fielders Outside:</span>
                  <span className="text-sm font-medium">{innings.currentPowerPlay.maxFieldersOutside}</span>
                </div>
              </div>
            </div>
          )}

          {/* DRS Reviews */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <FaEye className="mr-2 text-gray-600" />
              DRS Reviews
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Used:</span>
                <span className="text-sm font-medium">{innings.drsReviewsUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Remaining:</span>
                <span className="text-sm font-medium">{innings.drsReviewsRemaining}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
