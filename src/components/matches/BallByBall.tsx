import React from "react";
import { useBalls } from "../../hooks";

interface BallByBallProps {
  matchId: string;
  balls?: any[];
}

export const BallByBall: React.FC<BallByBallProps> = ({
  matchId,
  balls: initialBalls,
}) => {
  const { data: balls = initialBalls || [] } = useBalls(matchId, { limit: 20 });

  const getEventIcon = (eventType: string, runs: number) => {
    switch (eventType) {
      case "wicket":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            WICKET
          </span>
        );
      case "runs":
        if (runs === 4) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              4
            </span>
          );
        }
        if (runs === 6) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              6
            </span>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ball by Ball</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {balls.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No balls recorded yet
          </div>
        ) : (
          balls.map((ball: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-600">
                  {ball.over}.{ball.ball}
                </div>

                <div className="flex items-center space-x-2">
                  {getEventIcon(ball.eventType, ball.runs)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {ball.runs} run{ball.runs !== 1 ? "s" : ""}
                </div>
                {ball.commentary && (
                  <div className="text-xs text-gray-600 mt-1 max-w-xs">
                    {ball.commentary}
                  </div>
                )}
                {ball.striker && (
                  <div className="text-xs text-gray-500 mt-1">
                    {ball.striker.name}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
