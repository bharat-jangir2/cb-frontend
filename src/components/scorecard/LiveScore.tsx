import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Match, Innings } from "../../services/scorecard.service";
import {
  FaCrown,
  FaUser,
  FaFilter,
  FaSort,
  FaArrowLeft,
  FaCircle,
  FaBars,
} from "react-icons/fa";

interface LiveScoreProps {
  match: Match;
  innings: Innings[];
}

export const LiveScore: React.FC<LiveScoreProps> = ({ match, innings }) => {
  const navigate = useNavigate();
  console.log("🎯 LiveScore - Match data:", match);
  console.log("🎯 LiveScore - Innings data:", innings);

  const [commentaryFilter, setCommentaryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("live");

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

  // Ball type styling function - more compact like crex
  const getBallStyle = (runs: number) => {
    switch (runs) {
      case 0:
        return "bg-gray-200 text-gray-700";
      case 1:
        return "bg-blue-100 text-blue-700";
      case 2:
        return "bg-green-100 text-green-700";
      case 3:
        return "bg-yellow-100 text-yellow-700";
      case 4:
        return "bg-purple-100 text-purple-700";
      case 6:
        return "bg-red-100 text-red-700";
      case -1: // Wicket
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Compact Dark Blue Background */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        {/* Navigation Bar */}
        <div className="border-b border-blue-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-6">
                <div
                  className="text-xl font-bold text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors"
                  onClick={() => navigate("/")}
                >
                  CREX
                </div>
                <nav className="hidden md:flex space-x-4 text-sm">
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
              <button className="text-sm hover:text-yellow-300 transition-colors">
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Match Title */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-200 hover:text-white transition-colors flex items-center space-x-2 text-sm"
            >
              <FaArrowLeft className="text-xs" />
              <span>Back</span>
            </button>
            <h1 className="text-base font-semibold text-center flex-1">
              {match?.teamAId?.name || "CK"} Vs {match?.teamBId?.name || "NT"},{" "}
              {match?.matchType || "T20"} Match Live
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Live Score Summary - Compact like crex */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex items-center justify-between">
            {/* Left - Team Score */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {match?.teamAId?.name || "CK"}
                </span>
                <FaCrown className="text-yellow-400 text-sm" />
              </div>
              <div className="text-2xl font-bold text-yellow-400">
                {currentScore.runs || 0}-{currentScore.wickets || 0}
              </div>
              <div className="text-sm text-blue-200">
                {currentScore.overs || 0} overs
              </div>
            </div>

            {/* Center - Last Ball */}
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400">
                {match?.status === "in_progress" ? "6" : "-"}
              </div>
            </div>

            {/* Right - Match Stats */}
            <div className="text-right">
              <div className="text-sm space-y-1">
                <div className="text-yellow-300 font-semibold">
                  CRR: {currentRR}
                </div>
                <div className="text-yellow-300 font-semibold">
                  RRR: {requiredRR}
                </div>
              </div>
              <div className="text-sm text-blue-200 mt-1">
                {match?.status === "in_progress" && remainingRuns > 0 ? (
                  <>
                    {match?.teamAId?.name || "CK"} need {remainingRuns} runs in{" "}
                    {remainingBalls} balls
                  </>
                ) : (
                  <>
                    {match?.teamAId?.name || "CK"} {currentScore.runs || 0}/
                    {currentScore.wickets || 0}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Navigation Tabs - Like crex */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "info", label: "Match info" },
              { id: "live", label: "Live" },
              { id: "scorecard", label: "Scorecard" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Players & Partnership */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Players & Partnership */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Current Players & Partnership
              </h2>

              {/* Player Cards - Compact like crex */}
              <div className="space-y-4 mb-4">
                {mockPlayers.map((player, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                        player.isStriker
                          ? "bg-green-100 border-2 border-green-400"
                          : "bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {player.type === "bowler" ? (
                        <FaUser className="text-gray-600 text-lg" />
                      ) : (
                        <FaUser className="text-gray-600 text-lg" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">
                        {player.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {player.score}
                      </div>
                    </div>
                    {player.isStriker && (
                      <div className="text-xs text-green-600 font-bold">
                        STRIKER
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                  P'ship: 77(41)
                </div>
              </div>
            </div>

            {/* Over Progress - Compact like crex */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${getBallStyle(
                          runs
                        )}`}
                      >
                        {runs === -1 ? "W" : runs}
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${getBallStyle(
                          runs
                        )}`}
                      >
                        {runs === -1 ? "W" : runs}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column - Commentary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Commentary
                </h3>
                <div className="flex flex-wrap gap-1">
                  {[
                    "All",
                    "Highlights",
                    "Overs",
                    "W",
                    "4s",
                    "6s",
                    "Inn 1",
                    "Inn 2",
                    "Milestone",
                  ].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setCommentaryFilter(filter.toLowerCase())}
                      className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                        commentaryFilter === filter.toLowerCase()
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mockCommentary.map((comment, index) => (
                  <div
                    key={index}
                    className="border-l-2 border-blue-500 pl-3 py-2"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.over}.{comment.ball}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${getBallStyle(
                          comment.runs
                        )}`}
                      >
                        {comment.runs}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {comment.bowler} to {comment.batsman}
                    </div>
                    <div
                      className={`text-sm ${
                        comment.isHighlight
                          ? "font-semibold text-gray-800"
                          : "text-gray-700"
                      }`}
                    >
                      {comment.description}
                    </div>
                  </div>
                ))}

                {/* Over Summary */}
                <div className="border-l-2 border-green-500 pl-3 bg-green-50 p-3 rounded-r">
                  <div className="text-sm font-semibold text-green-800 mb-1">
                    OVER 6
                  </div>
                  <div className="text-sm text-green-700 mb-1">
                    {match?.teamAId?.name || "Chicago Kingsmen"} 62/0
                  </div>
                  <div className="text-sm text-green-600 mb-1">
                    Shayan Jahangir 26(11), Sharjeel Khan 36(25)
                  </div>
                  <div className="text-sm text-green-600">
                    Tom Andrews 0-3(1.0)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Probability */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Probability
                </h3>
                <div className="flex space-x-1">
                  <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded font-medium">
                    % View
                  </button>
                  <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200">
                    Odds View
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {match?.teamAId?.name || "CK"}
                  </span>
                  <span className="text-sm font-bold text-green-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {match?.teamBId?.name || "NT"}
                  </span>
                  <span className="text-sm font-bold text-red-600">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: "0%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Projected Score */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Projected Score as per RR.
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-gray-900">
                        Overs
                      </th>
                      <th className="text-left py-2 font-semibold text-gray-900">
                        11.27 RR
                      </th>
                      <th className="text-left py-2 font-semibold text-gray-900">
                        11.00 RR
                      </th>
                      <th className="text-left py-2 font-semibold text-gray-900">
                        12.00 RR
                      </th>
                      <th className="text-left py-2 font-semibold text-gray-900">
                        13.00 RR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium text-gray-900">10</td>
                      <td className="py-2 text-gray-700">112</td>
                      <td className="py-2 text-gray-700">111</td>
                      <td className="py-2 text-gray-700">115</td>
                      <td className="py-2 text-gray-700">118</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 font-medium text-gray-900">15</td>
                      <td className="py-2 text-gray-700">169</td>
                      <td className="py-2 text-gray-700">166</td>
                      <td className="py-2 text-gray-700">175</td>
                      <td className="py-2 text-gray-700">183</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-gray-900">20</td>
                      <td className="py-2 text-gray-700">225</td>
                      <td className="py-2 text-gray-700">221</td>
                      <td className="py-2 text-gray-700">235</td>
                      <td className="py-2 text-gray-700">248</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
