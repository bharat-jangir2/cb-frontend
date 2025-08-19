import React from "react";
import { useMatchWithData } from "../../hooks";
import { Scorecard } from "./Scorecard";
import { BallByBall } from "./BallByBall";
import { PlayerStats } from "./PlayerStats";
import { Partnerships } from "./Partnerships";
import { Timeline } from "./Timeline";

interface LiveMatchDashboardProps {
  matchId: string;
}

export const LiveMatchDashboard: React.FC<LiveMatchDashboardProps> = ({
  matchId,
}) => {
  const {
    match,
    innings,
    recentBalls,
    playerStats,
    partnerships,
    events,
    isLoading,
    error,
  } = useMatchWithData(matchId);

  // Enable real-time updates (commented out for now)
  // useWebSocket(matchId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">
            Error loading match
          </div>
          <div className="text-gray-600">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Match Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {match?.name}
              </h1>
              <p className="text-gray-600">{match?.venue}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Status</div>
              <div
                className={`text-lg font-semibold ${
                  match?.status === "in_progress"
                    ? "text-green-600"
                    : match?.status === "completed"
                    ? "text-gray-600"
                    : "text-yellow-600"
                }`}
              >
                {match?.status?.replace("_", " ").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Scorecard */}
      <Scorecard match={match} innings={innings} />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ball by Ball */}
          <div className="lg:col-span-2">
            <BallByBall matchId={matchId} balls={recentBalls} />
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            <PlayerStats matchId={matchId} stats={playerStats} />
            <Partnerships matchId={matchId} partnerships={partnerships} />
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-8">
          <Timeline matchId={matchId} events={events} />
        </div>
      </div>
    </div>
  );
};
