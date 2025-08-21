import React from "react";
import type { Partnership } from "../../services/scorecard.service";

interface PartnershipsProps {
  partnerships: Partnership[];
}

export const Partnerships: React.FC<PartnershipsProps> = ({ partnerships }) => {
  const getPartnershipQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "average":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPartnershipDuration = (
    startOver: number,
    startBall: number,
    endOver: number,
    endBall: number
  ) => {
    const startTotal = startOver * 6 + startBall;
    const endTotal = endOver * 6 + endBall;
    const duration = endTotal - startTotal;

    const overs = Math.floor(duration / 6);
    const balls = duration % 6;

    if (overs === 0) {
      return `${balls} ball${balls !== 1 ? "s" : ""}`;
    } else if (balls === 0) {
      return `${overs} over${overs !== 1 ? "s" : ""}`;
    } else {
      return `${overs}.${balls} overs`;
    }
  };

  if (!partnerships || partnerships.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No partnership data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Partnerships Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Partnerships Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Partnerships</div>
            <div className="font-semibold">{partnerships.length}</div>
          </div>
          <div>
            <div className="text-gray-600">Highest Partnership</div>
            <div className="font-semibold">
              {Math.max(...partnerships.map((p) => p.runs))} runs
            </div>
          </div>
          <div>
            <div className="text-gray-600">Total Partnership Runs</div>
            <div className="font-semibold">
              {partnerships.reduce((sum, p) => sum + p.runs, 0)} runs
            </div>
          </div>
          <div>
            <div className="text-gray-600">Average Partnership</div>
            <div className="font-semibold">
              {Math.round(
                partnerships.reduce((sum, p) => sum + p.runs, 0) /
                  partnerships.length
              )}{" "}
              runs
            </div>
          </div>
        </div>
      </div>

      {/* Partnerships List */}
      <div className="space-y-4">
        {partnerships.map((partnership) => (
          <div key={partnership._id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-medium text-gray-900">
                  {partnership.player1.fullName} &{" "}
                  {partnership.player2.fullName}
                </h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPartnershipQualityColor(
                    partnership.quality
                  )}`}
                >
                  {partnership.quality.toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(partnership.timestamp).toLocaleDateString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
              <div>
                <div className="text-sm text-gray-600">Runs</div>
                <div className="text-lg font-semibold text-gray-900">
                  {partnership.runs}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Balls</div>
                <div className="text-lg font-semibold text-gray-900">
                  {partnership.balls}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatPartnershipDuration(
                    partnership.startOver,
                    partnership.startBall,
                    partnership.endOver,
                    partnership.endBall
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Run Rate</div>
                <div className="text-lg font-semibold text-gray-900">
                  {partnership.balls > 0
                    ? ((partnership.runs / partnership.balls) * 6).toFixed(2)
                    : "0.00"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-sm text-gray-600">Period</div>
                <div className="text-sm text-gray-900">
                  Over {partnership.startOver}.{partnership.startBall} to{" "}
                  {partnership.endOver}.{partnership.endBall}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Innings</div>
                <div className="text-sm text-gray-900">
                  {partnership.innings}
                </div>
              </div>
            </div>

            {/* Key Moments */}
            {partnership.keyMoments && partnership.keyMoments.length > 0 && (
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">
                  Key Moments
                </div>
                <div className="space-y-1">
                  {partnership.keyMoments.map((moment, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 flex items-start"
                    >
                      <span className="text-blue-500 mr-2">•</span>
                      {moment}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Partnership Statistics */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Partnership Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">
              Quality Distribution
            </div>
            <div className="space-y-1">
              {["excellent", "good", "average", "poor"].map((quality) => {
                const count = partnerships.filter(
                  (p) => p.quality === quality
                ).length;
                const percentage = (
                  (count / partnerships.length) *
                  100
                ).toFixed(1);
                return (
                  <div key={quality} className="flex justify-between text-sm">
                    <span className="capitalize">{quality}</span>
                    <span className="font-medium">
                      {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">
              Top Partnerships
            </div>
            <div className="space-y-1">
              {partnerships
                .sort((a, b) => b.runs - a.runs)
                .slice(0, 3)
                .map((partnership, index) => (
                  <div
                    key={partnership._id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {index + 1}. {partnership.player1.shortName} &{" "}
                      {partnership.player2.shortName}
                    </span>
                    <span className="font-medium">{partnership.runs}r</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-900 mb-2">
              Longest Partnerships
            </div>
            <div className="space-y-1">
              {partnerships
                .sort((a, b) => b.balls - a.balls)
                .slice(0, 3)
                .map((partnership, index) => (
                  <div
                    key={partnership._id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {index + 1}. {partnership.player1.shortName} &{" "}
                      {partnership.player2.shortName}
                    </span>
                    <span className="font-medium">{partnership.balls}b</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
