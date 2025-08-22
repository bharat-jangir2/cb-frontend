import React from "react";

interface Ball {
  runs: number;
  isWicket?: boolean;
  isExtra?: boolean;
  extraType?: "wide" | "no-ball" | "bye" | "leg-bye";
  extraRuns?: number;
}

interface OverProgressProps {
  overNumber: number;
  balls: Ball[];
  isCurrentOver?: boolean;
  className?: string;
}

const OverProgress: React.FC<OverProgressProps> = ({
  overNumber,
  balls,
  isCurrentOver = false,
  className = "",
}) => {
  const getBallStyle = (ball: Ball) => {
    if (ball.isWicket) {
      return "bg-red-200 text-red-800 border-red-400";
    }

    switch (ball.runs) {
      case 0:
        return "bg-gray-200 text-gray-700 border-gray-300";
      case 1:
        return "bg-blue-100 text-blue-700 border-blue-300";
      case 2:
        return "bg-green-100 text-green-700 border-green-300";
      case 3:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case 4:
        return "bg-purple-100 text-purple-700 border-purple-300";
      case 6:
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getBallText = (ball: Ball) => {
    if (ball.isWicket) {
      return "W";
    }
    if (ball.isExtra) {
      return ball.extraType === "wide"
        ? "Wd"
        : ball.extraType === "no-ball"
        ? "Nb"
        : "B";
    }
    return ball.runs.toString();
  };

  const getBallTooltip = (ball: Ball, index: number) => {
    const ballNumber = index + 1;
    if (ball.isWicket) {
      return `${overNumber}.${ballNumber} - Wicket`;
    }
    if (ball.isExtra) {
      const extraText =
        ball.extraType === "wide"
          ? "Wide"
          : ball.extraType === "no-ball"
          ? "No Ball"
          : ball.extraType === "bye"
          ? "Bye"
          : "Leg Bye";
      return `${overNumber}.${ballNumber} - ${extraText} (${
        ball.runs + (ball.extraRuns || 0)
      } runs)`;
    }
    return `${overNumber}.${ballNumber} - ${ball.runs} run${
      ball.runs !== 1 ? "s" : ""
    }`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs sm:text-sm font-medium ${
              isCurrentOver ? "text-green-600" : "text-gray-700"
            }`}
          >
            Over {overNumber}
          </span>
          {isCurrentOver && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="text-xs sm:text-sm text-gray-600">
          Total:{" "}
          {balls.reduce(
            (sum, ball) => sum + ball.runs + (ball.extraRuns || 0),
            0
          )}
        </div>
      </div>

      <div className="flex space-x-1">
        {balls.map((ball, index) => (
          <div
            key={index}
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold cursor-pointer transition-all hover:scale-110 ${getBallStyle(
              ball
            )}`}
            title={getBallTooltip(ball, index)}
          >
            {getBallText(ball)}
          </div>
        ))}

        {/* Fill remaining balls if less than 6 */}
        {balls.length < 6 &&
          Array.from({ length: 6 - balls.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400"
            >
              -
            </div>
          ))}
      </div>
    </div>
  );
};

export default OverProgress;
