import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaTrophy,
  FaUser,
  FaCrown,
  FaFilter,
} from "react-icons/fa";

const Stats = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("batting");

  const mockBattingStats = [
    {
      rank: 1,
      player: "Virat Kohli",
      team: "India",
      matches: 254,
      runs: 12169,
      average: 59.07,
      strikeRate: 93.17,
      hundreds: 46,
      fifties: 64,
    },
    {
      rank: 2,
      player: "Rohit Sharma",
      team: "India",
      matches: 237,
      runs: 9845,
      average: 48.98,
      strikeRate: 90.26,
      hundreds: 30,
      fifties: 48,
    },
    {
      rank: 3,
      player: "Kane Williamson",
      team: "New Zealand",
      matches: 161,
      runs: 6554,
      average: 47.83,
      strikeRate: 81.13,
      hundreds: 13,
      fifties: 39,
    },
  ];

  const mockBowlingStats = [
    {
      rank: 1,
      player: "Pat Cummins",
      team: "Australia",
      matches: 69,
      wickets: 239,
      average: 22.59,
      economy: 3.28,
      strikeRate: 41.3,
      bestFigures: "6/23",
    },
    {
      rank: 2,
      player: "Kagiso Rabada",
      team: "South Africa",
      matches: 56,
      wickets: 266,
      average: 22.56,
      economy: 3.85,
      strikeRate: 35.1,
      bestFigures: "7/112",
    },
    {
      rank: 3,
      player: "James Anderson",
      team: "England",
      matches: 183,
      wickets: 690,
      average: 26.42,
      economy: 2.79,
      strikeRate: 56.8,
      bestFigures: "7/42",
    },
  ];

  const categories = [
    { id: "batting", label: "Batting", icon: FaUser },
    { id: "bowling", label: "Bowling", icon: FaChartBar },
    { id: "teams", label: "Team Rankings", icon: FaTrophy },
  ];

  const getStatsData = () => {
    switch (selectedCategory) {
      case "batting":
        return mockBattingStats;
      case "bowling":
        return mockBowlingStats;
      default:
        return mockBattingStats;
    }
  };

  const getTableHeaders = () => {
    switch (selectedCategory) {
      case "batting":
        return [
          "Rank",
          "Player",
          "Team",
          "Matches",
          "Runs",
          "Average",
          "SR",
          "100s",
          "50s",
        ];
      case "bowling":
        return [
          "Rank",
          "Player",
          "Team",
          "Matches",
          "Wickets",
          "Average",
          "Economy",
          "SR",
          "Best",
        ];
      default:
        return [
          "Rank",
          "Player",
          "Team",
          "Matches",
          "Runs",
          "Average",
          "SR",
          "100s",
          "50s",
        ];
    }
  };

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
                    className="text-yellow-300 border-b-2 border-yellow-300"
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

        {/* Page Title */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-blue-200 hover:text-white transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold">Statistics Corner</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory === "batting"
                ? "Batting"
                : selectedCategory === "bowling"
                ? "Bowling"
                : "Team"}{" "}
              Statistics
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {getTableHeaders().map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getStatsData().map((stat, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {stat.rank === 1 && (
                          <FaCrown className="text-yellow-500 mr-2" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {stat.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {stat.player}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{stat.team}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.matches}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.runs || stat.wickets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.average}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.strikeRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.hundreds || stat.economy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.fifties || stat.bestFigures}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Run Scorer
              </h3>
              <FaTrophy className="text-yellow-500 text-xl" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Virat Kohli
              </div>
              <div className="text-sm text-gray-600">12,169 runs</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Most Wickets
              </h3>
              <FaTrophy className="text-yellow-500 text-xl" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Pat Cummins
              </div>
              <div className="text-sm text-gray-600">239 wickets</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Best Average
              </h3>
              <FaTrophy className="text-yellow-500 text-xl" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Virat Kohli
              </div>
              <div className="text-sm text-gray-600">59.07</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
