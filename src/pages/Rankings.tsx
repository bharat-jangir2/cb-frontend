import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaMedal, FaCrown, FaFlag } from "react-icons/fa";

const Rankings = () => {
  const navigate = useNavigate();
  const [selectedFormat, setSelectedFormat] = useState("test");

  const mockTeamRankings = {
    test: [
      { rank: 1, team: "Australia", rating: 128, points: 2560, matches: 20 },
      { rank: 2, team: "India", rating: 120, points: 2400, matches: 20 },
      { rank: 3, team: "England", rating: 116, points: 2320, matches: 20 },
      { rank: 4, team: "South Africa", rating: 110, points: 2200, matches: 20 },
      { rank: 5, team: "New Zealand", rating: 104, points: 2080, matches: 20 },
    ],
    odi: [
      { rank: 1, team: "India", rating: 121, points: 2420, matches: 20 },
      { rank: 2, team: "Australia", rating: 118, points: 2360, matches: 20 },
      { rank: 3, team: "South Africa", rating: 110, points: 2200, matches: 20 },
      { rank: 4, team: "Pakistan", rating: 106, points: 2120, matches: 20 },
      { rank: 5, team: "New Zealand", rating: 101, points: 2020, matches: 20 },
    ],
    t20: [
      { rank: 1, team: "India", rating: 264, points: 5280, matches: 20 },
      { rank: 2, team: "England", rating: 259, points: 5180, matches: 20 },
      { rank: 3, team: "Pakistan", rating: 254, points: 5080, matches: 20 },
      { rank: 4, team: "South Africa", rating: 250, points: 5000, matches: 20 },
      { rank: 5, team: "Australia", rating: 245, points: 4900, matches: 20 },
    ],
  };

  const mockPlayerRankings = {
    batting: [
      {
        rank: 1,
        player: "Kane Williamson",
        team: "New Zealand",
        rating: 883,
        points: 883,
      },
      {
        rank: 2,
        player: "Steve Smith",
        team: "Australia",
        rating: 875,
        points: 875,
      },
      {
        rank: 3,
        player: "Marnus Labuschagne",
        team: "Australia",
        rating: 873,
        points: 873,
      },
      {
        rank: 4,
        player: "Joe Root",
        team: "England",
        rating: 859,
        points: 859,
      },
      {
        rank: 5,
        player: "Virat Kohli",
        team: "India",
        rating: 848,
        points: 848,
      },
    ],
    bowling: [
      {
        rank: 1,
        player: "Pat Cummins",
        team: "Australia",
        rating: 902,
        points: 902,
      },
      {
        rank: 2,
        player: "Kagiso Rabada",
        team: "South Africa",
        rating: 851,
        points: 851,
      },
      {
        rank: 3,
        player: "James Anderson",
        team: "England",
        rating: 845,
        points: 845,
      },
      { rank: 4, player: "R Ashwin", team: "India", rating: 834, points: 834 },
      {
        rank: 5,
        player: "Shaheen Afridi",
        team: "Pakistan",
        rating: 831,
        points: 831,
      },
    ],
  };

  const formats = [
    { id: "test", label: "Test", icon: FaTrophy },
    { id: "odi", label: "ODI", icon: FaMedal },
    { id: "t20", label: "T20I", icon: FaCrown },
  ];

  const categories = [
    { id: "teams", label: "Team Rankings" },
    { id: "batting", label: "Batting Rankings" },
    { id: "bowling", label: "Bowling Rankings" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("teams");

  const getRankingData = () => {
    if (selectedCategory === "teams") {
      return mockTeamRankings[selectedFormat as keyof typeof mockTeamRankings];
    } else {
      return mockPlayerRankings[
        selectedCategory as keyof typeof mockPlayerRankings
      ];
    }
  };

  const getTableHeaders = () => {
    if (selectedCategory === "teams") {
      return ["Rank", "Team", "Rating", "Points", "Matches"];
    } else {
      return ["Rank", "Player", "Team", "Rating", "Points"];
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
                    className="hover:text-yellow-300 transition-colors"
                  >
                    Stats Corner
                  </button>
                  <button
                    onClick={() => navigate("/rankings")}
                    className="text-yellow-300 border-b-2 border-yellow-300"
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
            <h1 className="text-3xl font-bold">ICC Rankings</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Format Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {formats.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFormat === format.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{format.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory === "teams"
                ? "Team"
                : selectedCategory === "batting"
                ? "Batting"
                : "Bowling"}{" "}
              Rankings - {selectedFormat.toUpperCase()}
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
                {getRankingData().map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {item.rank === 1 && (
                          <FaCrown className="text-yellow-500 mr-2" />
                        )}
                        {item.rank === 2 && (
                          <FaMedal className="text-gray-400 mr-2" />
                        )}
                        {item.rank === 3 && (
                          <FaMedal className="text-orange-500 mr-2" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {item.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaFlag className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {item.team || item.player}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.team ? item.team : item.player}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.rating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.points}
                    </td>
                    {selectedCategory === "teams" && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.matches}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performers Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Team</h3>
              <FaCrown className="text-yellow-500 text-xl" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {selectedFormat === "test"
                  ? "Australia"
                  : selectedFormat === "odi"
                  ? "India"
                  : "India"}
              </div>
              <div className="text-sm text-gray-600">
                Rating:{" "}
                {selectedFormat === "test"
                  ? "128"
                  : selectedFormat === "odi"
                  ? "121"
                  : "264"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Batsman
              </h3>
              <FaTrophy className="text-yellow-500 text-xl" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Kane Williamson
              </div>
              <div className="text-sm text-gray-600">Rating: 883</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Top Bowler
              </h3>
              <FaTrophy className="text-yellow-500 text-xl" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                Pat Cummins
              </div>
              <div className="text-sm text-gray-600">Rating: 902</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rankings;
