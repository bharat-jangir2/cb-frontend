import React from "react";

interface ProjectedScoreProps {
  currentScore: number;
  currentOvers: number;
  totalOvers: number;
  className?: string;
}

const ProjectedScore: React.FC<ProjectedScoreProps> = ({
  currentScore,
  currentOvers,
  totalOvers,
  className = "",
}) => {
  const remainingOvers = totalOvers - currentOvers;
  const currentRR = currentOvers > 0 ? currentScore / currentOvers : 0;

  const projectedScores = [
    {
      label: "Current RR",
      rr: currentRR.toFixed(2),
      projected: Math.round(currentScore + currentRR * remainingOvers),
    },
    {
      label: "11.00 RR",
      rr: "11.00",
      projected: Math.round(currentScore + 11 * remainingOvers),
    },
    {
      label: "12.00 RR",
      rr: "12.00",
      projected: Math.round(currentScore + 12 * remainingOvers),
    },
    {
      label: "13.00 RR",
      rr: "13.00",
      projected: Math.round(currentScore + 13 * remainingOvers),
    },
  ];

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Projected Score
        </h3>
        <div className="text-xs sm:text-sm text-gray-600">Based on RR</div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                Run Rate
              </th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                Projected
              </th>
              <th className="text-left py-2 sm:py-3 px-3 sm:px-4 font-semibold text-gray-900 text-xs sm:text-sm">
                Remaining
              </th>
            </tr>
          </thead>
          <tbody>
            {projectedScores.map((score, index) => (
              <tr
                key={index}
                className={`border-b border-gray-100 ${
                  index === 0 ? "bg-blue-50" : ""
                }`}
              >
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div className="text-xs sm:text-sm font-medium text-gray-900">
                    {score.label}
                  </div>
                  <div className="text-xs text-gray-600">{score.rr} RR</div>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div className="text-sm sm:text-lg font-bold text-gray-900">
                    {score.projected}
                  </div>
                </td>
                <td className="py-2 sm:py-3 px-3 sm:px-4">
                  <div className="text-xs sm:text-sm text-gray-600">
                    +{score.projected - currentScore}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Current Stats */}
      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div>
            <div className="text-gray-600">Current Score</div>
            <div className="font-semibold text-gray-900">{currentScore}</div>
          </div>
          <div>
            <div className="text-gray-600">Overs</div>
            <div className="font-semibold text-gray-900">
              {currentOvers}/{totalOvers}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Remaining</div>
            <div className="font-semibold text-gray-900">
              {remainingOvers} overs
            </div>
          </div>
          <div>
            <div className="text-gray-600">Current RR</div>
            <div className="font-semibold text-gray-900">
              {currentRR.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
        <div className="font-medium text-yellow-800 mb-1">Note:</div>
        <div className="text-yellow-700">
          Projections are based on current run rate and remaining overs. Actual
          score may vary based on match conditions and team performance.
        </div>
      </div>
    </div>
  );
};

export default ProjectedScore;
