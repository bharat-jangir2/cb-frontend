import React from 'react';
import { FaPlay, FaStop, FaCheck, FaClock, FaTrophy, FaUsers, FaChartLine, FaTrash, FaPause } from 'react-icons/fa';
import type { Innings } from '../../types/innings';
import { InningsStatus, InningsResult } from '../../types/innings';

interface InningsOverviewProps {
  matchId: string;
  innings: Innings[];
  selectedInnings: Innings | null;
  selectedInningsNumber: number | null;
  onInningsChange: (inningsNumber: number) => void;
  onStartInnings?: (inningsNumber: number) => void;
  onEndInnings?: (inningsNumber: number, result: InningsResult) => void;
  onDeleteInnings?: (inningsNumber: number) => void;
  isAdmin?: boolean;
}

export const InningsOverviewPanel: React.FC<InningsOverviewProps> = ({
  matchId,
  innings,
  selectedInnings,
  selectedInningsNumber,
  onInningsChange,
  onStartInnings,
  onEndInnings,
  onDeleteInnings,
  isAdmin = false,
}) => {
  const getStatusIcon = (status: InningsStatus) => {
    switch (status) {
      case InningsStatus.IN_PROGRESS:
        return <FaPlay className="w-4 h-4 text-green-600" />;
      case InningsStatus.PAUSED:
        return <FaPause className="w-4 h-4 text-yellow-600" />;
      case InningsStatus.COMPLETED:
      case InningsStatus.DECLARED:
        return <FaCheck className="w-4 h-4 text-blue-600" />;
      case InningsStatus.NOT_STARTED:
        return <FaClock className="w-4 h-4 text-gray-400" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: InningsStatus) => {
    switch (status) {
      case InningsStatus.IN_PROGRESS:
        return 'bg-green-100 text-green-800 border-green-200';
      case InningsStatus.PAUSED:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case InningsStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case InningsStatus.DECLARED:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case InningsStatus.NOT_STARTED:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getInningsByNumber = (inningsNumber: number): Innings | undefined => {
    return innings.find(i => i.inningsNumber === inningsNumber);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaTrophy className="mr-2 text-indigo-600" />
          Innings Overview
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Selected:</span>
          <span className="text-sm font-medium text-indigo-600">
            {selectedInningsNumber ? `Innings ${selectedInningsNumber}` : 'None'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* All Innings */}
        {innings.map((inning) => (
          <div
            key={inning.inningsNumber}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedInningsNumber === inning.inningsNumber
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => onInningsChange(inning.inningsNumber)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(inning.status)}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Innings {inning.inningsNumber}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {inning.battingTeam?.name || 'Unknown'} vs {inning.bowlingTeam?.name || 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {inning.runs || 0}/{inning.wickets || 0}
                  </div>
                  <div className="text-sm text-gray-600">
                    {inning.overs || 0} overs
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inning.status)}`}>
                    {inning.status.replace('_', ' ').toUpperCase()}
                  </span>
                  
                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      {inning.status === InningsStatus.NOT_STARTED && onStartInnings && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartInnings(inning.inningsNumber);
                          }}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Start Innings"
                        >
                          <FaPlay className="w-3 h-3" />
                        </button>
                      )}
                      
                      {inning.status === InningsStatus.IN_PROGRESS && onEndInnings && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEndInnings(inning.inningsNumber, InningsResult.ALL_OUT);
                          }}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="End Innings"
                        >
                          <FaStop className="w-3 h-3" />
                        </button>
                      )}
                      
                      {onDeleteInnings && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteInnings(inning.inningsNumber);
                          }}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete Innings"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {inning.status === InningsStatus.COMPLETED && inning.result && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Result: {getResultText(inning.result)}
                  {inning.resultDescription && ` - ${inning.resultDescription}`}
                </span>
              </div>
            )}
          </div>
        ))}
        
        {innings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FaTrophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No innings created yet.</p>
            {isAdmin && (
              <p className="text-sm mt-2">Click "New Innings" to create the first innings.</p>
            )}
          </div>
        )}
      </div>

      {/* Match Summary */}
      {innings.length > 1 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
            <FaChartLine className="mr-2 text-gray-600" />
            Match Summary
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {innings.reduce((total, inning) => total + (inning.runs || 0), 0)}
              </div>
              <div className="text-gray-600">Total Runs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {innings.reduce((total, inning) => total + (inning.wickets || 0), 0)}
              </div>
              <div className="text-gray-600">Total Wickets</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {innings.reduce((total, inning) => total + (inning.boundaries || 0), 0)}
              </div>
              <div className="text-gray-600">Total Boundaries</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {innings.reduce((total, inning) => total + (inning.sixes || 0), 0)}
              </div>
              <div className="text-gray-600">Total Sixes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
