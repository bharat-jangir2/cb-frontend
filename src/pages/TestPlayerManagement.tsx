import React from 'react';
import { UnifiedBallControl } from '../components/admin/UnifiedBallControl';

export default function TestPlayerManagement() {
  const matchId = '68a4bca3e5dbb94da94b99c1';
  const userId = '68a4b7e5e5dbb94da94b9923';
  const currentInnings = 1;
  const currentOver = 1;
  const currentBall = 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Player Management & Ball Control Test
          </h1>
          <p className="text-gray-600">
            This page demonstrates the player management functionality integrated with the unified ball control system.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Instructions:</h2>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• First, set the current players (striker, non-striker, and bowler) using the "Edit Players" button</li>
              <li>• Select appropriate players for each position (batsmen for striker/non-striker, bowlers for bowler)</li>
              <li>• Save the player selection</li>
              <li>• Once all players are set, you can start a ball</li>
              <li>• Record runs, wickets, or complete the ball as needed</li>
            </ul>
          </div>

          <UnifiedBallControl
            matchId={matchId}
            userId={userId}
            currentInnings={currentInnings}
            currentOver={currentOver}
            currentBall={currentBall}
          />
        </div>
      </div>
    </div>
  );
}
