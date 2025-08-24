import React from 'react';
import { UnifiedBallControl } from '../components/admin/UnifiedBallControl';
import { MatchStatsDisplay } from '../components/admin/MatchStatsDisplay';

export default function TestBallUpdate() {
  const matchId = '68a4bca3e5dbb94da94b99c1';
  const userId = '68a4b7e5e5dbb94da94b9923';
  const currentInnings = 1;
  const currentOver = 1;
  const currentBall = 1;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Unified Ball Update System Test
          </h1>
          <p className="text-gray-600">
            Test the new unified ball update system that uses a single API endpoint for all ball operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <UnifiedBallControl
              matchId={matchId}
              userId={userId}
              currentInnings={currentInnings}
              currentOver={currentOver}
              currentBall={currentBall}
            />
          </div>
          
          <div>
            <MatchStatsDisplay />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">How it works</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Single API Endpoint</h3>
              <p className="text-gray-600">
                All ball updates go through <code className="bg-gray-100 px-2 py-1 rounded">POST /api/matches/:id/ball/update</code>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Update Types</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li><code className="bg-gray-100 px-1 rounded">start_ball</code> - Initialize a new ball</li>
                <li><code className="bg-gray-100 px-1 rounded">ball_in_air</code> - Mark ball as in air</li>
                <li><code className="bg-gray-100 px-1 rounded">runs</code> - Record runs scored</li>
                <li><code className="bg-gray-100 px-1 rounded">boundary</code> - Record boundary</li>
                <li><code className="bg-gray-100 px-1 rounded">wicket</code> - Record wicket</li>
                <li><code className="bg-gray-100 px-1 rounded">extra</code> - Record extras</li>
                <li><code className="bg-gray-100 px-1 rounded">complete_ball</code> - Complete the ball</li>
                <li><code className="bg-gray-100 px-1 rounded">cancel_ball</code> - Cancel the ball</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Automatic Updates</h3>
              <p className="text-gray-600">
                The backend automatically updates match statistics, player statistics, and ball counts based on the update type.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">4. Real-time State</h3>
              <p className="text-gray-600">
                The frontend maintains real-time state through React Context and automatically updates the UI when ball operations are performed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
