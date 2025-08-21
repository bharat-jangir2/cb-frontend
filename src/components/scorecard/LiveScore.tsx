import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Match, Innings } from "../../services/scorecard.service";
import { FaCrown, FaUser, FaFilter, FaSort } from "react-icons/fa";

interface LiveScoreProps {
  match: Match;
  innings: Innings[];
}

export const LiveScore: React.FC<LiveScoreProps> = ({ match, innings }) => {
  const navigate = useNavigate();
  console.log("🎯 LiveScore - Match data:", match);
  console.log("🎯 LiveScore - Innings data:", innings);

  const [commentaryFilter, setCommentaryFilter] = useState("all");

  const currentInnings = innings?.find(
    (inning) => inning.inningsNumber === match?.currentInnings
  );

  // Mock data for demonstration - replace with actual API data
  const mockCommentary = [
    {
      over: 6,
      ball: 4,
      runs: 6,
      bowler: "H Martin",
      batsman: "S Khan",
      description: "SIX! Brilliant shot over long-on",
      isHighlight: true,
    },
    {
      over: 6,
      ball: 3,
      runs: 0,
      bowler: "H Martin",
      batsman: "S Khan",
      description: "No run, defended back to bowler",
      isHighlight: false,
    },
    {
      over: 6,
      ball: 2,
      runs: 4,
      bowler: "H Martin",
      batsman: "S Khan",
      description: "FOUR! Beautiful cover drive",
      isHighlight: true,
    },
    {
      over: 6,
      ball: 1,
      runs: 0,
      bowler: "H Martin",
      batsman: "S Khan",
      description: "Dot ball, good length delivery",
      isHighlight: false,
    },
  ];

  const mockOverProgress = {
    over6: [0, 0, 0, 1, 1, 1],
    over7: [0, 4, 4, 1, 6],
  };

  const mockPlayers = [
    {
      name: "S Khan",
      score: "45 (29)",
      type: "batsman",
      isStriker: true,
    },
    {
      name: "S Jahangir",
      score: "32 (12)",
      type: "batsman",
      isStriker: false,
    },
    {
      name: "H Martin",
      score: "0-15 (0.5)",
      type: "bowler",
      isStriker: false,
    },
  ];

  // Use actual match data or fallback to realistic defaults
  const currentScore = match?.score?.teamA || {
    runs: 0,
    wickets: 0,
    overs: 0,
  };

  // Calculate target based on match type (T20 = 20 overs)
  const maxOvers =
    match?.matchType === "T20" ? 20 : match?.matchType === "ODI" ? 50 : 90;
  const targetScore = 132; // This would come from the other team's score
  const remainingRuns = targetScore - (currentScore.runs || 0);
  const remainingBalls =
    maxOvers * 6 - Math.floor((currentScore.overs || 0) * 6);
  const currentRR = (
    (currentScore.runs || 0) / (currentScore.overs || 1)
  ).toFixed(2);
  const requiredRR =
    remainingRuns > 0
      ? (remainingRuns / (remainingBalls / 6)).toFixed(2)
      : "0.00";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Dark Blue Background */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        {/* Navigation Bar */}
        <div className="border-b border-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-8">
                <div
                  className="text-xl font-bold text-yellow-400 cursor-pointer hover:text-yellow-300"
                  onClick={() => navigate("/")}
                >
                  BCCI
                </div>
                <nav className="flex space-x-6 text-sm">
                  <button
                    onClick={() => navigate("/")}
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => navigate("/series")}
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Series
                  </button>
                  <button
                    onClick={() => navigate("/fixtures")}
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Fixtures
                  </button>
                  <button
                    onClick={() => navigate("/stats")}
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Stats Corner
                  </button>
                  <button
                    onClick={() => navigate("/rankings")}
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Rankings
                  </button>
                </nav>
              </div>
              <button className="text-sm hover:text-yellow-300">Dark</button>
            </div>
          </div>
        </div>

        {/* Match Title */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-200 hover:text-white transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-lg font-semibold">
              {match?.teamAId?.name || "India"} vs{" "}
              {match?.teamBId?.name || "Pakistan"},{match?.matchType || "T20"}{" "}
              Match Live
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Live Score Summary */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex items-center justify-between">
            {/* Left - Team Score */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <FaCrown className="text-blue-900 text-xl" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {currentScore.runs || 0}-{currentScore.wickets || 0}
                </div>
                <div className="text-sm text-blue-200">
                  {currentScore.overs || 0} overs
                </div>
              </div>
            </div>

            {/* Center - Last Ball */}
            <div className="text-center">
              <div className="text-6xl font-bold text-yellow-400">
                {match?.status === "in_progress" ? "0" : "-"}
              </div>
              <div className="text-sm text-blue-200">Last Ball</div>
            </div>

            {/* Right - Match Stats */}
            <div className="text-right">
              <div className="text-sm space-y-1">
                <div>CRR: {currentRR}</div>
                <div>RRR: {requiredRR}</div>
              </div>
              <div className="text-sm text-blue-200 mt-2">
                {match?.status === "in_progress" && remainingRuns > 0 ? (
                  <>
                    {match?.teamAId?.name || "Team A"} need {remainingRuns} runs
                    in {remainingBalls} balls
                  </>
                ) : (
                  <>
                    {match?.teamAId?.name || "Team A"} {currentScore.runs || 0}/
                    {currentScore.wickets || 0}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Players & Partnership */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Current Players & Partnership
                </h2>
              </div>

              {/* Player Cards */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {mockPlayers.map((player, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                      {player.type === "bowler" ? (
                        <FaUser className="text-gray-600 text-xl" />
                      ) : (
                        <FaUser className="text-gray-600 text-xl" />
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {player.name}
                    </div>
                    <div className="text-xs text-gray-600">{player.score}</div>
                    {player.isStriker && (
                      <div className="text-xs text-green-600 font-medium">
                        Striker
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center text-sm text-gray-600">
                P'ship: 77(41)
              </div>
            </div>

            {/* Over Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Over Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Over 6
                  </div>
                  <div className="flex space-x-1">
                    {mockOverProgress.over6.map((runs, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-semibold ${
                          runs === 0
                            ? "bg-gray-200 text-gray-600"
                            : runs === 1
                            ? "bg-blue-200 text-blue-800"
                            : runs === 4
                            ? "bg-green-200 text-green-800"
                            : runs === 6
                            ? "bg-purple-200 text-purple-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {runs}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Over 7
                  </div>
                  <div className="flex space-x-1">
                    {mockOverProgress.over7.map((runs, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-semibold ${
                          runs === 0
                            ? "bg-gray-200 text-gray-600"
                            : runs === 1
                            ? "bg-blue-200 text-blue-800"
                            : runs === 4
                            ? "bg-green-200 text-green-800"
                            : runs === 6
                            ? "bg-purple-200 text-purple-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {runs}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Commentary Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Commentary
                </h3>
                <div className="flex space-x-2">
                  {[
                    "All",
                    "Highlights",
                    "Overs",
                    "W",
                    "6s",
                    "4s",
                    "Inn 1",
                    "Inn 2",
                    "Milestone",
                  ].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setCommentaryFilter(filter.toLowerCase())}
                      className={`px-3 py-1 text-xs rounded ${
                        commentaryFilter === filter.toLowerCase()
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mockCommentary.map((comment, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.over}.{comment.ball}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold ${
                          comment.runs === 0
                            ? "bg-gray-200 text-gray-600"
                            : comment.runs === 1
                            ? "bg-blue-200 text-blue-800"
                            : comment.runs === 4
                            ? "bg-green-200 text-green-800"
                            : comment.runs === 6
                            ? "bg-purple-200 text-purple-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {comment.runs}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {comment.bowler} to {comment.batsman}
                    </div>
                    <div className="text-sm text-gray-700">
                      {comment.description}
                    </div>
                  </div>
                ))}

                {/* Over Summary */}
                <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded">
                  <div className="text-sm font-semibold text-green-800">
                    OVER 6
                  </div>
                  <div className="text-sm text-green-700">
                    {match?.teamAId?.name || "Chicago Kingsmen"} 62/0
                  </div>
                  <div className="text-sm text-green-600">
                    Shayan Jahangir 26(11), Sharjeel Khan 36(25)
                  </div>
                  <div className="text-sm text-green-600">
                    Tom Andrews 0-3(1.0)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Probability */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Probability
                </h3>
                <div className="flex space-x-1">
                  <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded">
                    % View
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                    Odds View
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {match?.teamAId?.name || "CK"}
                  </span>
                  <span className="text-sm font-bold text-green-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {match?.teamBId?.name || "NT"}
                  </span>
                  <span className="text-sm font-bold text-red-600">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Projected Score */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Projected Score as per RR.
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Overs</th>
                      <th className="text-left py-2">11.27 RR</th>
                      <th className="text-left py-2">11.00 RR</th>
                      <th className="text-left py-2">12.00 RR</th>
                      <th className="text-left py-2">13.00 RR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">10</td>
                      <td className="py-2">113</td>
                      <td className="py-2">110</td>
                      <td className="py-2">120</td>
                      <td className="py-2">130</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">15</td>
                      <td className="py-2">169</td>
                      <td className="py-2">165</td>
                      <td className="py-2">180</td>
                      <td className="py-2">195</td>
                    </tr>
                    <tr>
                      <td className="py-2">20</td>
                      <td className="py-2">225</td>
                      <td className="py-2">220</td>
                      <td className="py-2">240</td>
                      <td className="py-2">260</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Match Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Match Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-medium">{match?.venue || "TBD"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">
                    {match?.format || match?.matchType || "T20"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      match?.status === "in_progress"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {match?.status === "in_progress"
                      ? "Live"
                      : match?.status || "Unknown"}
                  </span>
                </div>
                {match?.startTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date(match.startTime).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
