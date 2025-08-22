import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCrown,
  FaUser,
  FaArrowLeft,
} from "react-icons/fa";
import Scoreboard from "../components/scorecard/Scoreboard";
import OverProgress from "../components/scorecard/OverProgress";
import Commentary from "../components/scorecard/Commentary";
import ProbabilityBar from "../components/scorecard/ProbabilityBar";
import ProjectedScore from "../components/scorecard/ProjectedScore";
import MatchInfoCard from "../components/scorecard/MatchInfoCard";

interface LiveMatchPageProps {}

const LiveMatchPage: React.FC<LiveMatchPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live");
  const [commentaryFilter, setCommentaryFilter] = useState("All");

  // Add viewport meta tag for mobile optimization
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }
  }, []);

  // Mock data - replace with actual API calls
  const mockMatch = {
    id: id || "1",
    teamA: {
      name: "India",
      shortName: "IND",
      runs: 184,
      wickets: 4,
      overs: 32.1,
      isBatting: true,
    },
    teamB: {
      name: "Australia",
      shortName: "AUS",
      runs: 0,
      wickets: 0,
      overs: 0,
      isBatting: false,
    },
    currentRR: 5.73,
    requiredRR: 8.5,
    target: 320,
    remainingRuns: 136,
    remainingBalls: 107,
    lastBall: 4,
    status: "live" as const,
    venue: "Melbourne Cricket Ground",
    date: "2025-01-20",
    time: "14:30",
    series: "Border-Gavaskar Trophy 2025",
    format: "ODI",
    toss: {
      winner: "India",
      decision: "bat",
    },
    umpires: ["Kumar Dharmasena", "Richard Kettleborough"],
    matchReferee: "Jeff Crowe",
  };

  const mockOvers = [
    {
      overNumber: 32,
      balls: [
        { runs: 1, isWicket: false },
        { runs: 0, isWicket: false },
        { runs: 4, isWicket: false },
        { runs: 2, isWicket: false },
        { runs: 0, isWicket: false },
        { runs: 1, isWicket: false },
      ],
      isCurrentOver: true,
    },
    {
      overNumber: 31,
      balls: [
        { runs: 0, isWicket: false },
        { runs: 1, isWicket: false },
        { runs: 0, isWicket: false },
        { runs: 4, isWicket: false },
        { runs: 0, isWicket: false },
        { runs: 1, isWicket: false },
      ],
      isCurrentOver: false,
    },
    {
      overNumber: 30,
      balls: [
        { runs: 1, isWicket: false },
        { runs: 0, isWicket: false },
        { runs: 2, isWicket: false },
        { runs: 0, isWicket: false },
        { runs: 1, isWicket: false },
        { runs: 0, isWicket: false },
      ],
      isCurrentOver: false,
    },
  ];

  const mockCommentary = [
    {
      id: "1",
      over: 32,
      ball: 6,
      runs: 1,
      bowler: "Pat Cummins",
      batsman: "Virat Kohli",
      description: "Single taken. Good running between the wickets.",
      isHighlight: false,
      isWicket: false,
      isFour: false,
      isSix: false,
    },
    {
      id: "2",
      over: 32,
      ball: 5,
      runs: 0,
      bowler: "Pat Cummins",
      batsman: "Virat Kohli",
      description:
        "Dot ball. Good length delivery, defended back to the bowler.",
      isHighlight: false,
      isWicket: false,
      isFour: false,
      isSix: false,
    },
    {
      id: "3",
      over: 32,
      ball: 4,
      runs: 2,
      bowler: "Pat Cummins",
      batsman: "Virat Kohli",
      description: "Two runs! Excellent placement through the covers.",
      isHighlight: true,
      isWicket: false,
      isFour: false,
      isSix: false,
    },
    {
      id: "4",
      over: 32,
      ball: 3,
      runs: 4,
      bowler: "Pat Cummins",
      batsman: "Virat Kohli",
      description: "FOUR! Beautiful cover drive! That's a boundary.",
      isHighlight: true,
      isWicket: false,
      isFour: true,
      isSix: false,
    },
    {
      id: "5",
      over: 32,
      ball: 2,
      runs: 0,
      bowler: "Pat Cummins",
      batsman: "Virat Kohli",
      description: "Dot ball. Yorker length, dug out safely.",
      isHighlight: false,
      isWicket: false,
      isFour: false,
      isSix: false,
    },
    {
      id: "6",
      over: 32,
      ball: 1,
      runs: 1,
      bowler: "Pat Cummins",
      batsman: "Virat Kohli",
      description: "Single taken. Good length delivery, worked to mid-wicket.",
      isHighlight: false,
      isWicket: false,
      isFour: false,
      isSix: false,
    },
  ];

  const mockCurrentPlayers = [
    {
      name: "Virat Kohli",
      role: "Batsman",
      score: "85 (72)",
      isStriker: true,
      type: "batsman",
    },
    {
      name: "Rohit Sharma",
      role: "Batsman",
      score: "45 (38)",
      isStriker: false,
      type: "batsman",
    },
    {
      name: "Pat Cummins",
      role: "Bowler",
      score: "2/45",
      isStriker: false,
      type: "bowler",
    },
  ];

  const tabs = [
    { id: "matchinfo", label: "Match Info" },
    { id: "live", label: "Live Score" },
    { id: "scorecard", label: "Scorecard" },
    { id: "commentary", label: "Commentary" },
    { id: "stats", label: "Stats Corner" },
    { id: "batting", label: "Batting" },
    { id: "bowling", label: "Bowling" },
    { id: "fall", label: "Fall of Wickets" },
    { id: "ballbyball", label: "Ball by Ball" },
    { id: "partnerships", label: "Partnerships" },
    { id: "powerplays", label: "Power Plays" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors text-xs sm:text-sm lg:text-base p-1 sm:p-2 -m-1 sm:-m-2 rounded-lg hover:bg-blue-800/50"
              >
                <FaArrowLeft className="text-xs sm:text-sm" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="text-base sm:text-lg lg:text-xl font-bold">
                CREX
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              <div className="flex items-center space-x-1 bg-red-500/20 px-1 sm:px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">LIVE</span>
              </div>
              <button className="p-1 sm:p-2 hover:bg-blue-800 rounded-lg transition-colors">
                <FaExpand className="text-xs sm:text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-1 sm:py-2 lg:py-3">
          <h1 className="text-xs sm:text-sm lg:text-lg font-semibold text-gray-900 text-center">
            {mockMatch.teamA.name} vs {mockMatch.teamB.name}, {mockMatch.format}{" "}
            Match Live
          </h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex space-x-0.5 sm:space-x-1 lg:space-x-4 overflow-x-auto scrollbar-hide pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 sm:py-3 lg:py-4 px-2 sm:px-3 lg:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-6 pb-20">
        {activeTab === "live" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            {/* Left Column - Scoreboard & Players */}
            <div className="space-y-2 sm:space-y-4 lg:space-y-6">
              {/* Scoreboard */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <Scoreboard
                  teamA={mockMatch.teamA}
                  teamB={mockMatch.teamB}
                  currentRR={mockMatch.currentRR}
                  requiredRR={mockMatch.requiredRR}
                  target={mockMatch.target}
                  remainingRuns={mockMatch.remainingRuns}
                  remainingBalls={mockMatch.remainingBalls}
                  lastBall={mockMatch.lastBall}
                  status={mockMatch.status}
                />
              </div>

              {/* Current Players & Partnership */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 transform transition-all duration-200 hover:shadow-md">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                  Current Players & Partnership
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  {mockCurrentPlayers.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 sm:space-x-3"
                    >
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm ${
                          player.isStriker
                            ? "bg-green-100 border-2 border-green-400"
                            : "bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {player.type === "bowler" ? (
                          <FaUser className="text-gray-600 text-xs sm:text-lg" />
                        ) : (
                          <FaCrown className="text-gray-600 text-xs sm:text-lg" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="font-medium text-gray-900 text-xs sm:text-base truncate">
                            {player.name}
                          </span>
                          {player.isStriker && (
                            <span className="text-xs bg-green-100 text-green-800 px-1 sm:px-2 py-1 rounded-full flex-shrink-0">
                              STRIKER
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {player.role}
                        </div>
                        <div className="text-xs sm:text-base font-semibold text-gray-900">
                          {player.score}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-200">
                  <div className="text-xs sm:text-sm text-gray-600">
                    Partnership
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-gray-900">
                    130 runs (15.2 overs)
                  </div>
                </div>
              </div>

              {/* Over Progress */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 transform transition-all duration-200 hover:shadow-md">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                  Over Progress
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  {mockOvers.map((over) => (
                    <OverProgress
                      key={over.overNumber}
                      overNumber={over.overNumber}
                      balls={over.balls}
                      isCurrentOver={over.isCurrentOver}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column - Commentary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 transform transition-all duration-200 hover:shadow-md h-fit">
                <Commentary
                  entries={mockCommentary}
                  activeFilter={commentaryFilter}
                  onFilterChange={setCommentaryFilter}
                />
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-2 sm:space-y-4 lg:space-y-6 lg:col-span-1">
              {/* Win Probability */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <ProbabilityBar
                  teamAProbability={65}
                  teamBProbability={35}
                  teamAName={mockMatch.teamA.name}
                  teamBName={mockMatch.teamB.name}
                />
              </div>

              {/* Projected Score */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <ProjectedScore
                  currentScore={mockMatch.teamA.runs}
                  currentOvers={mockMatch.teamA.overs}
                  totalOvers={50}
                />
              </div>

              {/* Match Info */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <MatchInfoCard
                  venue={mockMatch.venue}
                  date={mockMatch.date}
                  time={mockMatch.time}
                  series={mockMatch.series}
                  format={mockMatch.format}
                  toss={mockMatch.toss}
                  umpires={mockMatch.umpires}
                  matchReferee={mockMatch.matchReferee}
                />
              </div>
            </div>
          </div>
        )}

        {/* MatchInfo Tab Content */}
        {activeTab === "matchinfo" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Match Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <MatchInfoCard
                  venue={mockMatch.venue}
                  date={mockMatch.date}
                  time={mockMatch.time}
                  series={mockMatch.series}
                  format={mockMatch.format}
                  toss={mockMatch.toss}
                  umpires={mockMatch.umpires}
                  matchReferee={mockMatch.matchReferee}
                />

                {/* Additional Match Details */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Match Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Overs:
                      </span>
                      <span className="text-sm font-medium">50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Power Play 1:
                      </span>
                      <span className="text-sm font-medium">Overs 1-10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Power Play 2:
                      </span>
                      <span className="text-sm font-medium">Overs 11-40</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Power Play 3:
                      </span>
                      <span className="text-sm font-medium">Overs 41-50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scorecard Tab Content */}
        {activeTab === "scorecard" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Full Scorecard
              </h2>

              {/* Team A Batting */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  {mockMatch.teamA.name} Batting
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-900">
                          Batsman
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          R
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          B
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          4s
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          6s
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          SR
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium text-gray-900">
                          Virat Kohli
                        </td>
                        <td className="py-2 text-right text-gray-700">85</td>
                        <td className="py-2 text-right text-gray-700">72</td>
                        <td className="py-2 text-right text-gray-700">8</td>
                        <td className="py-2 text-right text-gray-700">2</td>
                        <td className="py-2 text-right text-gray-700">
                          118.06
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium text-gray-900">
                          Rohit Sharma
                        </td>
                        <td className="py-2 text-right text-gray-700">45</td>
                        <td className="py-2 text-right text-gray-700">38</td>
                        <td className="py-2 text-right text-gray-700">4</td>
                        <td className="py-2 text-right text-gray-700">1</td>
                        <td className="py-2 text-right text-gray-700">
                          118.42
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team B Bowling */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                  {mockMatch.teamB.name} Bowling
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-900">
                          Bowler
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          O
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          M
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          R
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          W
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          ECO
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium text-gray-900">
                          Pat Cummins
                        </td>
                        <td className="py-2 text-right text-gray-700">8.1</td>
                        <td className="py-2 text-right text-gray-700">0</td>
                        <td className="py-2 text-right text-gray-700">45</td>
                        <td className="py-2 text-right text-gray-700">2</td>
                        <td className="py-2 text-right text-gray-700">5.51</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-medium text-gray-900">
                          Mitchell Starc
                        </td>
                        <td className="py-2 text-right text-gray-700">8.0</td>
                        <td className="py-2 text-right text-gray-700">0</td>
                        <td className="py-2 text-right text-gray-700">52</td>
                        <td className="py-2 text-right text-gray-700">1</td>
                        <td className="py-2 text-right text-gray-700">6.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would be implemented here */}
        {activeTab !== "live" &&
          activeTab !== "matchinfo" &&
          activeTab !== "scorecard" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8 transform transition-all duration-200 hover:shadow-md">
              <div className="text-center text-gray-500">
                <div className="text-xl sm:text-2xl font-bold mb-2">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </div>
                <p className="text-sm sm:text-base">
                  This tab will be implemented with detailed {activeTab}{" "}
                  information.
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Bottom Navigation Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab("matchinfo")}
              className={`flex flex-col items-center py-3 px-4 transition-colors ${
                activeTab === "matchinfo"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="w-6 h-6 mb-1">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium">Match Info</span>
            </button>

            <button
              onClick={() => setActiveTab("live")}
              className={`flex flex-col items-center py-3 px-4 transition-colors ${
                activeTab === "live"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="w-6 h-6 mb-1 relative">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse absolute -top-1 -right-1"></div>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium">Live</span>
            </button>

            <button
              onClick={() => setActiveTab("scorecard")}
              className={`flex flex-col items-center py-3 px-4 transition-colors ${
                activeTab === "scorecard"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="w-6 h-6 mb-1">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Scorecard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMatchPage;
