import React from "react";
import { FaTrophy, FaCrown, FaStar, FaFire } from "react-icons/fa";

interface MatchHighlightsProps {
  highlights?: {
    highestScore: any;
    bestBowling: any;
    bestPartnership: any;
    fastestFifty?: any;
    fastestHundred?: any;
    mostSixes: any;
    mostFours: any;
  };
}

export const MatchHighlights: React.FC<MatchHighlightsProps> = ({
  highlights,
}) => {
  if (!highlights) {
    return (
      <div className="text-center py-8 text-gray-500">
        No highlights available for this match.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Match Highlights</h2>
        <p className="text-gray-600">Key performances and achievements</p>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Highest Score */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">
              Highest Score
            </h3>
            <FaCrown className="text-blue-500 text-xl" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {highlights.highestScore?.runs || 0}
            </div>
            <div className="text-sm text-blue-700">
              {highlights.highestScore?.playerName || "N/A"}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {highlights.highestScore?.balls || 0} balls •{" "}
              {highlights.highestScore?.strikeRate || 0} SR
            </div>
          </div>
        </div>

        {/* Best Bowling */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-900">
              Best Bowling
            </h3>
            <FaTrophy className="text-green-500 text-xl" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {highlights.bestBowling?.wickets || 0}/
              {highlights.bestBowling?.runsConceded || 0}
            </div>
            <div className="text-sm text-green-700">
              {highlights.bestBowling?.playerName || "N/A"}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {highlights.bestBowling?.overs || 0} overs •{" "}
              {highlights.bestBowling?.economy || 0} econ
            </div>
          </div>
        </div>

        {/* Best Partnership */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-900">
              Best Partnership
            </h3>
            <FaStar className="text-purple-500 text-xl" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {highlights.bestPartnership?.runs || 0}
            </div>
            <div className="text-sm text-purple-700">
              {highlights.bestPartnership?.player1Name || "N/A"} &{" "}
              {highlights.bestPartnership?.player2Name || "N/A"}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              {highlights.bestPartnership?.balls || 0} balls •{" "}
              {highlights.bestPartnership?.quality || "N/A"}
            </div>
          </div>
        </div>

        {/* Fastest Fifty */}
        {highlights.fastestFifty && (
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-900">
                Fastest Fifty
              </h3>
              <FaFire className="text-yellow-500 text-xl" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {highlights.fastestFifty?.balls || 0} balls
              </div>
              <div className="text-sm text-yellow-700">
                {highlights.fastestFifty?.playerName || "N/A"}
              </div>
              <div className="text-xs text-yellow-600 mt-1">
                50 runs in {highlights.fastestFifty?.balls || 0} balls
              </div>
            </div>
          </div>
        )}

        {/* Fastest Hundred */}
        {highlights.fastestHundred && (
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-900">
                Fastest Hundred
              </h3>
              <FaFire className="text-red-500 text-xl" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {highlights.fastestHundred?.balls || 0} balls
              </div>
              <div className="text-sm text-red-700">
                {highlights.fastestHundred?.playerName || "N/A"}
              </div>
              <div className="text-xs text-red-600 mt-1">
                100 runs in {highlights.fastestHundred?.balls || 0} balls
              </div>
            </div>
          </div>
        )}

        {/* Most Sixes */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-orange-900">
              Most Sixes
            </h3>
            <FaFire className="text-orange-500 text-xl" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {highlights.mostSixes?.sixes || 0}
            </div>
            <div className="text-sm text-orange-700">
              {highlights.mostSixes?.playerName || "N/A"}
            </div>
            <div className="text-xs text-orange-600 mt-1">
              {highlights.mostSixes?.runs || 0} runs •{" "}
              {highlights.mostSixes?.strikeRate || 0} SR
            </div>
          </div>
        </div>

        {/* Most Fours */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-indigo-900">
              Most Fours
            </h3>
            <FaStar className="text-indigo-500 text-xl" />
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {highlights.mostFours?.fours || 0}
            </div>
            <div className="text-sm text-indigo-700">
              {highlights.mostFours?.playerName || "N/A"}
            </div>
            <div className="text-xs text-indigo-600 mt-1">
              {highlights.mostFours?.runs || 0} runs •{" "}
              {highlights.mostFours?.strikeRate || 0} SR
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Boundaries</p>
            <p className="text-2xl font-bold text-blue-600">
              {(highlights.mostFours?.fours || 0) +
                (highlights.mostSixes?.sixes || 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Best Strike Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {Math.max(
                highlights.highestScore?.strikeRate || 0,
                highlights.mostSixes?.strikeRate || 0,
                highlights.mostFours?.strikeRate || 0
              ).toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Best Economy</p>
            <p className="text-2xl font-bold text-purple-600">
              {highlights.bestBowling?.economy || 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Partnership Quality</p>
            <p className="text-2xl font-bold text-orange-600">
              {highlights.bestPartnership?.quality || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
