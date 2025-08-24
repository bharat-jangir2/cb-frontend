import React from 'react';
import { EnhancedBallControl } from '../components/admin/EnhancedBallControl';

export default function TestEnhancedBallControl() {
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
            Enhanced Ball Control System
          </h1>
          <p className="text-gray-600">
            This page demonstrates the enhanced ball control system that integrates existing scorecard components (BattingScorecard, BowlingScorecard, LiveScoring) with the unified ball update system.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Features:</h2>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• <strong>Ball Control Tab:</strong> Set current players (striker, non-striker, bowler) and start balls</li>
              <li>• <strong>Batting Stats Tab:</strong> View batting statistics using existing BattingScorecard component</li>
              <li>• <strong>Bowling Stats Tab:</strong> View bowling statistics using existing BowlingScorecard component</li>
              <li>• <strong>Live Scoring Tab:</strong> Use existing LiveScoring component for detailed ball-by-ball scoring</li>
              <li>• <strong>Player Management:</strong> Choose bowlers and batsmen from match players</li>
              <li>• <strong>Real-time Updates:</strong> Integrated with the unified ball update system</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-green-900 mb-2">How to Use:</h2>
            <ol className="text-green-800 space-y-1 text-sm">
              <li>1. Go to <strong>"Ball Control"</strong> tab to set current players</li>
              <li>2. Select striker, non-striker, and bowler from the dropdowns</li>
              <li>3. Click <strong>"Start Ball"</strong> to begin a ball</li>
              <li>4. Switch to <strong>"Live Scoring"</strong> tab for detailed scoring</li>
              <li>5. View <strong>"Batting Stats"</strong> and <strong>"Bowling Stats"</strong> for player statistics</li>
            </ol>
          </div>

          <EnhancedBallControl
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
