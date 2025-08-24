import React from 'react';
import { useBallUpdate } from '../../contexts/BallUpdateContext';

export function MatchStatsDisplay() {
  const { matchStats, lastUpdate } = useBallUpdate();

  if (!matchStats) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Match Statistics</h3>
        <div className="text-gray-500">No match stats available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Match Statistics</h3>
      <p className="text-sm text-gray-600 mb-4">
        Last Updated: {lastUpdate?.toLocaleTimeString()}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{matchStats.runs || 0}</div>
          <div className="text-sm text-gray-600">Runs</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{matchStats.wickets || 0}</div>
          <div className="text-sm text-gray-600">Wickets</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{matchStats.overs || 0}</div>
          <div className="text-sm text-gray-600">Overs</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{matchStats.extras || 0}</div>
          <div className="text-sm text-gray-600">Extras</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{matchStats.boundaries || 0}</div>
          <div className="text-sm text-gray-600">Boundaries</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{matchStats.sixes || 0}</div>
          <div className="text-sm text-gray-600">Sixes</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {matchStats.runRate ? matchStats.runRate.toFixed(2) : '0.00'}
          </div>
          <div className="text-sm text-gray-600">Run Rate</div>
        </div>
      </div>
    </div>
  );
}
