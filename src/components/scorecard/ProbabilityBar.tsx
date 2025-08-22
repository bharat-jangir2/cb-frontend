import React from "react";

interface ProbabilityBarProps {
  teamAProbability: number; // 0-100
  teamBProbability: number; // 0-100
  teamAName: string;
  teamBName: string;
  className?: string;
}

const ProbabilityBar: React.FC<ProbabilityBarProps> = ({
  teamAProbability,
  teamBProbability,
  teamAName,
  teamBName,
  className = "",
}) => {
  const totalProbability = teamAProbability + teamBProbability;
  const normalizedTeamA =
    totalProbability > 0 ? (teamAProbability / totalProbability) * 100 : 50;
  const normalizedTeamB =
    totalProbability > 0 ? (teamBProbability / totalProbability) * 100 : 50;

  const getTeamAColor = () => {
    if (normalizedTeamA > 60) return "bg-green-500";
    if (normalizedTeamA > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTeamBColor = () => {
    if (normalizedTeamB > 60) return "bg-green-500";
    if (normalizedTeamB > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Win Probability
        </h3>
        <div className="text-xs sm:text-sm text-gray-600">Live Prediction</div>
      </div>

      {/* Probability Bar */}
      <div className="relative">
        <div className="flex h-6 sm:h-8 bg-gray-200 rounded-lg overflow-hidden">
          {/* Team A Bar */}
          <div
            className={`${getTeamAColor()} transition-all duration-500 ease-out flex items-center justify-center`}
            style={{ width: `${normalizedTeamA}%` }}
          >
            {normalizedTeamA > 15 && (
              <span className="text-white text-xs sm:text-sm font-semibold px-1 sm:px-2">
                {normalizedTeamA.toFixed(1)}%
              </span>
            )}
          </div>

          {/* Team B Bar */}
          <div
            className={`${getTeamBColor()} transition-all duration-500 ease-out flex items-center justify-center`}
            style={{ width: `${normalizedTeamB}%` }}
          >
            {normalizedTeamB > 15 && (
              <span className="text-white text-xs sm:text-sm font-semibold px-1 sm:px-2">
                {normalizedTeamB.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        {/* Team Labels */}
        <div className="flex justify-between mt-2">
          <div className="text-left">
            <div className="text-xs sm:text-sm font-medium text-gray-900">
              {teamAName}
            </div>
            <div className="text-xs text-gray-600">
              {normalizedTeamA.toFixed(1)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs sm:text-sm font-medium text-gray-900">
              {teamBName}
            </div>
            <div className="text-xs text-gray-600">
              {normalizedTeamB.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Probability Factors */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-xs font-medium text-gray-700 mb-2">
          Key Factors
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Required Run Rate:</span>
            <span className="font-medium">8.5</span>
          </div>
          <div className="flex justify-between">
            <span>Overs Remaining:</span>
            <span className="font-medium">12.3</span>
          </div>
          <div className="flex justify-between">
            <span>Wickets in Hand:</span>
            <span className="font-medium">6</span>
          </div>
          <div className="flex justify-between">
            <span>Pitch Condition:</span>
            <span className="font-medium text-green-600">Batting Friendly</span>
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-600">
          Probability updated 30 seconds ago
        </span>
      </div>
    </div>
  );
};

export default ProbabilityBar;
