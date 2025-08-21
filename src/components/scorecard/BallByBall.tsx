import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { scorecardService } from "../../services/scorecard.service";
import type { Ball } from "../../types/matches";

interface BallByBallProps {
  matchId: string;
}

export const BallByBall: React.FC<BallByBallProps> = ({ matchId }) => {
  const [selectedInnings, setSelectedInnings] = useState<number>(1);
  const [selectedOver, setSelectedOver] = useState<number | null>(null);

  // Fetch ball-by-ball data
  const { data: balls, isLoading } = useQuery({
    queryKey: ["balls", matchId, selectedInnings, selectedOver],
    queryFn: () =>
      scorecardService.getBalls(matchId, {
        innings: selectedInnings,
        over: selectedOver || undefined,
        limit: 50,
      }),
    enabled: !!matchId,
  });

  // Get unique overs for filter
  const uniqueOvers = Array.from(
    new Set(balls?.map((ball) => ball.over) || [])
  ).sort((a, b) => a - b);

  const getBallDescription = (ball: Ball) => {
    const { event } = ball;

    switch (event.type) {
      case "runs":
        return `${event.runs} run${event.runs !== 1 ? "s" : ""}`;
      case "wicket":
        return `WICKET! ${event.wicket?.type.replace("_", " ").toUpperCase()}`;
      case "extra":
        return `${event.extras?.type.replace("_", " ").toUpperCase()} - ${
          event.extras?.runs
        } run${event.extras?.runs !== 1 ? "s" : ""}`;
      case "over_change":
        return "Over complete";
      case "innings_change":
        return "Innings change";
      default:
        return "Ball played";
    }
  };

  const getBallColor = (ball: Ball) => {
    const { event } = ball;

    switch (event.type) {
      case "wicket":
        return "bg-red-100 border-red-300 text-red-800";
      case "extra":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "runs":
        if (event.runs === 4)
          return "bg-blue-100 border-blue-300 text-blue-800";
        if (event.runs === 6)
          return "bg-purple-100 border-purple-300 text-purple-800";
        return "bg-green-100 border-green-300 text-green-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Innings
            </label>
            <select
              value={selectedInnings}
              onChange={(e) => setSelectedInnings(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value={1}>1st Innings</option>
              <option value={2}>2nd Innings</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Over
            </label>
            <select
              value={selectedOver || ""}
              onChange={(e) =>
                setSelectedOver(e.target.value ? Number(e.target.value) : null)
              }
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Overs</option>
              {uniqueOvers.map((over) => (
                <option key={over} value={over}>
                  Over {over}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ball Timeline */}
      <div className="space-y-4">
        {balls?.map((ball) => (
          <div
            key={ball._id}
            className="flex items-start space-x-4 p-4 border rounded-lg"
          >
            {/* Ball Number */}
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium ${getBallColor(
                  ball
                )}`}
              >
                {ball.over}.{ball.ball}
              </div>
            </div>

            {/* Ball Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900">
                  {getBallDescription(ball)}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(ball.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {/* Players */}
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Striker:</span>{" "}
                {ball.striker.fullName} |
                <span className="font-medium ml-2">Non-Striker:</span>{" "}
                {ball.nonStriker.fullName} |
                <span className="font-medium ml-2">Bowler:</span>{" "}
                {ball.bowler.fullName}
              </div>

              {/* Commentary */}
              {ball.commentary && (
                <div className="text-sm text-gray-700 italic">
                  "{ball.commentary}"
                </div>
              )}

              {/* Wicket Details */}
              {ball.event.type === "wicket" && ball.event.wicket && (
                <div className="mt-2 p-2 bg-red-50 rounded-md">
                  <div className="text-sm text-red-800">
                    <strong>Wicket Details:</strong>{" "}
                    {ball.event.wicket.description || ball.event.wicket.type}
                    {ball.event.wicket.bowler &&
                      ` - Bowled by ${ball.event.wicket.bowler}`}
                    {ball.event.wicket.caughtBy &&
                      ` - Caught by ${ball.event.wicket.caughtBy}`}
                    {ball.event.wicket.runOutBy &&
                      ` - Run out by ${ball.event.wicket.runOutBy}`}
                    {ball.event.wicket.stumpedBy &&
                      ` - Stumped by ${ball.event.wicket.stumpedBy}`}
                  </div>
                </div>
              )}

              {/* Extra Details */}
              {ball.event.type === "extra" && ball.event.extras && (
                <div className="mt-2 p-2 bg-yellow-50 rounded-md">
                  <div className="text-sm text-yellow-800">
                    <strong>Extra Details:</strong>{" "}
                    {ball.event.extras.description || ball.event.extras.type}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {balls?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No ball-by-ball data available for the selected filters
          </div>
        )}
      </div>
    </div>
  );
};
