import React, { useState } from 'react';
import { FaPlay, FaStop, FaFlag, FaPause, FaRedo, FaExclamationTriangle, FaCog, FaUsers } from 'react-icons/fa';
import type { Innings } from '../../types/innings';
import { InningsStatus, InningsResult } from '../../types/innings';

interface InningsControlProps {
  matchId: string;
  innings: Innings | null;
  onInningsStarted: () => void;
  onInningsEnded: (result: InningsResult, description?: string) => void;
  onInningsDeclared: (description?: string) => void;
  onInningsPaused: () => void;
  onInningsResumed: () => void;
  isAdmin?: boolean;
}

export const InningsControlPanel: React.FC<InningsControlProps> = ({
  matchId,
  innings,
  onInningsStarted,
  onInningsEnded,
  onInningsDeclared,
  onInningsPaused,
  onInningsResumed,
  isAdmin = false,
}) => {
  const [showEndModal, setShowEndModal] = useState(false);
  const [showDeclareModal, setShowDeclareModal] = useState(false);
  const [endResult, setEndResult] = useState<InningsResult>(InningsResult.ALL_OUT);
  const [endDescription, setEndDescription] = useState('');
  const [declareDescription, setDeclareDescription] = useState('');

  const handleEndInnings = () => {
    onInningsEnded(endResult, endDescription);
    setShowEndModal(false);
    setEndResult(InningsResult.ALL_OUT);
    setEndDescription('');
  };

  const handleDeclareInnings = () => {
    onInningsDeclared(declareDescription);
    setShowDeclareModal(false);
    setDeclareDescription('');
  };

  const getResultOptions = () => {
    const options = [
      { value: InningsResult.ALL_OUT, label: 'All Out' },
      { value: InningsResult.OVERS_COMPLETED, label: 'Overs Completed' },
    ];

    // Add target reached option only for second innings
    if (innings.inningsNumber === 2) {
      options.push({ value: InningsResult.TARGET_REACHED, label: 'Target Reached' });
    }

    return options;
  };

  if (!isAdmin) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaCog className="mr-2 text-indigo-600" />
            Innings Controls
          </h3>
          <span className="text-sm text-gray-500">Admin Only</span>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FaUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Innings controls are only available to administrators.</p>
        </div>
      </div>
    );
  }

  if (!innings) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaCog className="mr-2 text-indigo-600" />
            Innings Controls
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <FaUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No innings selected. Please select an innings to manage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaCog className="mr-2 text-indigo-600" />
          Innings Controls
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          innings.status === InningsStatus.IN_PROGRESS 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {innings.status ? innings.status.replace('_', ' ').toUpperCase() : 'UNKNOWN'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Primary Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Start Innings */}
          {innings.status === InningsStatus.NOT_STARTED && (
            <button
              onClick={onInningsStarted}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaPlay className="mr-2" />
              Start Innings
            </button>
          )}

          {/* End Innings */}
          {innings.status === InningsStatus.IN_PROGRESS && (
            <button
              onClick={() => setShowEndModal(true)}
              className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaStop className="mr-2" />
              End Innings
            </button>
          )}

          {/* Declare Innings */}
          {innings.status === InningsStatus.IN_PROGRESS && (
            <button
              onClick={() => setShowDeclareModal(true)}
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FaFlag className="mr-2" />
              Declare Innings
            </button>
          )}

          {/* Pause Innings */}
          {innings.status === InningsStatus.IN_PROGRESS && (
            <button
              onClick={onInningsPaused}
              className="flex items-center justify-center px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <FaPause className="mr-2" />
              Pause Innings
            </button>
          )}

          {/* Resume Innings */}
          {innings.status === InningsStatus.PAUSED && (
            <button
              onClick={onInningsResumed}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaRedo className="mr-2" />
              Resume Innings
            </button>
          )}
        </div>

        {/* Emergency Controls */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
            <FaExclamationTriangle className="mr-2 text-orange-600" />
            Emergency Controls
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to force end this innings? This action cannot be undone.')) {
                  onInningsEnded(InningsResult.ALL_OUT, 'Emergency termination');
                }
              }}
              className="flex items-center justify-center px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors text-sm"
            >
              <FaExclamationTriangle className="mr-2" />
              Force End Innings
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to abandon this innings? This action cannot be undone.')) {
                  onInningsEnded(InningsResult.OVERS_COMPLETED, 'Innings abandoned');
                }
              }}
              className="flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
            >
              <FaExclamationTriangle className="mr-2" />
              Abandon Innings
            </button>
          </div>
        </div>

        {/* Current Status */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Current Status</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{innings.runs}</div>
              <div className="text-gray-600">Runs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{innings.wickets}</div>
              <div className="text-gray-600">Wickets</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{innings.overs}</div>
              <div className="text-gray-600">Overs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{innings.runRate ? innings.runRate.toFixed(2) : '0.00'}</div>
              <div className="text-gray-600">Run Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* End Innings Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">End Innings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Reason
                </label>
                <select
                  value={endResult}
                  onChange={(e) => setEndResult(e.target.value as InningsResult)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {getResultOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={endDescription}
                  onChange={(e) => setEndDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional details about the innings end..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleEndInnings}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                End Innings
              </button>
              <button
                onClick={() => setShowEndModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Declare Innings Modal */}
      {showDeclareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Declare Innings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Declaration Reason (Optional)
                </label>
                <textarea
                  value={declareDescription}
                  onChange={(e) => setDeclareDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Reason for declaring the innings..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleDeclareInnings}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Declare Innings
              </button>
              <button
                onClick={() => setShowDeclareModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
