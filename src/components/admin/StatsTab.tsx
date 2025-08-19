import React from "react";
import {
  FaChartBar, FaChartLine, FaChartPie, FaTrophy, FaUser,
  FaBolt, FaClock, FaCalculator, FaPercentage, FaArrowUp, FaArrowDown
} from "react-icons/fa";

interface StatsTabProps {
  matchId: string;
}

const StatsTab: React.FC<StatsTabProps> = ({ matchId }) => {
  // Mock data for demonstration
  const matchStats = {
    totalRuns: 156,
    totalWickets: 8,
    runRate: 7.8,
    overs: 20,
    extras: 12,
    boundaries: 18,
    sixes: 6,
    dotBalls: 24
  };

  const playerStats = {
    topBatsmen: [
      { name: "Virat Kohli", runs: 45, balls: 32, fours: 4, sixes: 1, strikeRate: 140.6 },
      { name: "Rohit Sharma", runs: 38, balls: 28, fours: 3, sixes: 2, strikeRate: 135.7 },
      { name: "Babar Azam", runs: 42, balls: 35, fours: 5, sixes: 0, strikeRate: 120.0 }
    ],
    topBowlers: [
      { name: "Jasprit Bumrah", overs: 4, wickets: 3, runs: 28, economy: 7.0, maidens: 0 },
      { name: "Shaheen Afridi", overs: 4, wickets: 2, runs: 32, economy: 8.0, maidens: 0 },
      { name: "Ravindra Jadeja", overs: 4, wickets: 2, runs: 35, economy: 8.75, maidens: 0 }
    ]
  };

  const overByOverStats = [
    { over: 1, runs: 8, wickets: 0, extras: 1 },
    { over: 2, runs: 12, wickets: 0, extras: 0 },
    { over: 3, runs: 6, wickets: 1, extras: 0 },
    { over: 4, runs: 15, wickets: 0, extras: 2 },
    { over: 5, runs: 9, wickets: 0, extras: 0 },
    { over: 6, runs: 11, wickets: 1, extras: 1 },
    { over: 7, runs: 7, wickets: 0, extras: 0 },
    { over: 8, runs: 13, wickets: 0, extras: 0 },
    { over: 9, runs: 5, wickets: 1, extras: 0 },
    { over: 10, runs: 16, wickets: 0, extras: 1 },
    { over: 11, runs: 8, wickets: 0, extras: 0 },
    { over: 12, runs: 12, wickets: 1, extras: 0 },
    { over: 13, runs: 9, wickets: 0, extras: 0 },
    { over: 14, runs: 14, wickets: 0, extras: 1 },
    { over: 15, runs: 6, wickets: 1, extras: 0 },
    { over: 16, runs: 11, wickets: 0, extras: 0 },
    { over: 17, runs: 8, wickets: 1, extras: 0 },
    { over: 18, runs: 13, wickets: 0, extras: 1 },
    { over: 19, runs: 7, wickets: 1, extras: 0 },
    { over: 20, runs: 10, wickets: 0, extras: 0 }
  ];

  const extrasBreakdown = {
    wides: 8,
    noBalls: 2,
    byes: 1,
    legByes: 1
  };

  const partnershipInfo = {
    current: { runs: 45, balls: 32, players: "Virat Kohli & Rohit Sharma" },
    highest: { runs: 78, balls: 45, players: "Virat Kohli & Rohit Sharma" },
    required: { runs: 24, overs: 3.2, rate: 7.2 }
  };

  return (
    <div className="space-y-6">
      {/* Match Overview Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaChartBar className="mr-2" />
          Match Overview Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{matchStats.totalRuns}</div>
            <div className="text-sm text-gray-600">Total Runs</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{matchStats.totalWickets}</div>
            <div className="text-sm text-gray-600">Wickets</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{matchStats.runRate}</div>
            <div className="text-sm text-gray-600">Run Rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{matchStats.overs}</div>
            <div className="text-sm text-gray-600">Overs</div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Batsmen */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaTrophy className="mr-2" />
            Top Batsmen
          </h3>
          <div className="space-y-3">
            {playerStats.topBatsmen.map((batsman, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{batsman.name}</div>
                    <div className="text-sm text-gray-600">
                      {batsman.runs} runs ({batsman.balls} balls)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{batsman.strikeRate}</div>
                  <div className="text-sm text-gray-600">
                    {batsman.fours}x4, {batsman.sixes}x6
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Bowlers */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaBolt className="mr-2" />
            Top Bowlers
          </h3>
          <div className="space-y-3">
            {playerStats.topBowlers.map((bowler, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{bowler.name}</div>
                    <div className="text-sm text-gray-600">
                      {bowler.overs} overs, {bowler.wickets} wickets
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{bowler.economy}</div>
                  <div className="text-sm text-gray-600">
                    {bowler.runs} runs, {bowler.maidens} maidens
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Over by Over Analysis */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaChartLine className="mr-2" />
          Over by Over Analysis
        </h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {overByOverStats.map((over) => (
            <div
              key={over.over}
              className={`text-center p-2 rounded-lg text-sm ${
                over.runs >= 10
                  ? "bg-green-100 text-green-800"
                  : over.runs >= 6
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="font-bold">{over.over}</div>
              <div>{over.runs}</div>
              {over.wickets > 0 && (
                <div className="text-xs text-red-600">W: {over.wickets}</div>
              )}
              {over.extras > 0 && (
                <div className="text-xs text-blue-600">E: {over.extras}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Extras Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaCalculator className="mr-2" />
          Extras Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{extrasBreakdown.wides}</div>
            <div className="text-sm text-gray-600">Wides</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{extrasBreakdown.noBalls}</div>
            <div className="text-sm text-gray-600">No Balls</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{extrasBreakdown.byes}</div>
            <div className="text-sm text-gray-600">Byes</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{extrasBreakdown.legByes}</div>
            <div className="text-sm text-gray-600">Leg Byes</div>
          </div>
        </div>
      </div>

      {/* Partnership Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaUser className="mr-2" />
          Partnership Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{partnershipInfo.current.runs}</div>
            <div className="text-sm text-gray-600">Current Partnership</div>
            <div className="text-xs text-gray-500">{partnershipInfo.current.players}</div>
            <div className="text-xs text-gray-500">{partnershipInfo.current.balls} balls</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{partnershipInfo.highest.runs}</div>
            <div className="text-sm text-gray-600">Highest Partnership</div>
            <div className="text-xs text-gray-500">{partnershipInfo.highest.players}</div>
            <div className="text-xs text-gray-500">{partnershipInfo.highest.balls} balls</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">{partnershipInfo.required.runs}</div>
            <div className="text-sm text-gray-600">Required Runs</div>
            <div className="text-xs text-gray-500">{partnershipInfo.required.overs} overs</div>
            <div className="text-xs text-gray-500">RR: {partnershipInfo.required.rate}</div>
          </div>
        </div>
      </div>

      {/* Required Run Rate */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaPercentage className="mr-2" />
          Required Run Rate
        </h3>
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{partnershipInfo.required.rate}</div>
            <div className="text-sm text-gray-600">Required Run Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{matchStats.runRate}</div>
            <div className="text-sm text-gray-600">Current Run Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{partnershipInfo.required.overs}</div>
            <div className="text-sm text-gray-600">Overs Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab; 