import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaCrown,
  FaTrophy,
  FaChartLine,
  FaCalendar,
  FaFlag,
} from "react-icons/fa";

interface PlayerProfileProps {}

const PlayerProfile: React.FC<PlayerProfileProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock player data - replace with actual API call
  const mockPlayer = {
    id: id || "1",
    name: "Virat Kohli",
    shortName: "V Kohli",
    photoUrl: "https://example.com/virat-kohli.jpg",
    nationality: "India",
    role: "Batsman",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm medium",
    dateOfBirth: "1988-11-05",
    height: "5'9\"",
    teams: ["India", "Royal Challengers Bangalore"],
    currentTeam: "India",
    careerHighlights: [
      "ICC Cricketer of the Year 2017, 2018",
      "Fastest to 10,000 ODI runs",
      "Most centuries in successful run chases",
      "Highest run-scorer in T20 World Cup 2014",
    ],
  };

  const mockStats = {
    batting: {
      test: {
        matches: 113,
        runs: 8676,
        average: 49.29,
        hundreds: 29,
        fifties: 30,
        highest: 254,
      },
      odi: {
        matches: 292,
        runs: 13848,
        average: 58.96,
        hundreds: 50,
        fifties: 72,
        highest: 183,
      },
      t20: {
        matches: 115,
        runs: 4008,
        average: 52.73,
        hundreds: 1,
        fifties: 30,
        highest: 122,
      },
    },
    bowling: {
      test: {
        matches: 113,
        wickets: 0,
        average: 0,
        economy: 0,
        best: "0/0",
      },
      odi: {
        matches: 292,
        wickets: 5,
        average: 166.2,
        economy: 6.23,
        best: "1/13",
      },
      t20: {
        matches: 115,
        wickets: 4,
        average: 51.25,
        economy: 6.97,
        best: "1/13",
      },
    },
  };

  const mockRecentMatches = [
    {
      id: "1",
      date: "2025-01-15",
      format: "ODI",
      opponent: "Australia",
      runs: 85,
      balls: 72,
      wickets: 0,
      result: "Won",
      venue: "MCG",
    },
    {
      id: "2",
      date: "2025-01-12",
      format: "T20",
      opponent: "England",
      runs: 52,
      balls: 35,
      wickets: 0,
      result: "Won",
      venue: "Lords",
    },
    {
      id: "3",
      date: "2025-01-08",
      format: "Test",
      opponent: "South Africa",
      runs: 123,
      balls: 145,
      wickets: 0,
      result: "Drawn",
      venue: "Centurion",
    },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: FaCrown },
    { id: "batting", label: "Batting", icon: FaChartLine },
    { id: "bowling", label: "Bowling", icon: FaTrophy },
    { id: "recent", label: "Recent Matches", icon: FaCalendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Player Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Player Photo */}
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
              <FaCrown className="text-4xl text-gray-600" />
            </div>

            {/* Player Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{mockPlayer.name}</h1>
              <p className="text-xl text-blue-200 mb-2">
                {mockPlayer.shortName}
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <FaFlag className="text-yellow-400" />
                  <span>{mockPlayer.nationality}</span>
                </div>
                <span className="text-blue-200">•</span>
                <span>{mockPlayer.role}</span>
                <span className="text-blue-200">•</span>
                <span>{mockPlayer.battingStyle}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="text-center">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">50</div>
                  <div className="text-sm text-blue-200">ODI Hundreds</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    58.96
                  </div>
                  <div className="text-sm text-blue-200">ODI Average</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="text-sm" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Career Highlights */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Career Highlights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPlayer.careerHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Performance */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Recent Performance
                  </h3>
                  <div className="space-y-4">
                    {mockRecentMatches.slice(0, 3).map((match) => (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">
                            {match.opponent}
                          </div>
                          <div className="text-sm text-gray-600">
                            {match.format} • {match.venue}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">
                            {match.runs} ({match.balls})
                          </div>
                          <div
                            className={`text-sm ${
                              match.result === "Won"
                                ? "text-green-600"
                                : match.result === "Lost"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {match.result}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Batting Tab */}
            {activeTab === "batting" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Batting Statistics
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Format
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Matches
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Runs
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Average
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          100s
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          50s
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          HS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 font-medium text-gray-900">Test</td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.test.matches}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.test.runs.toLocaleString()}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.test.average}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.test.hundreds}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.test.fifties}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.test.highest}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 font-medium text-gray-900">ODI</td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.odi.matches}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.odi.runs.toLocaleString()}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.odi.average}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.odi.hundreds}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.odi.fifties}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.odi.highest}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium text-gray-900">T20</td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.t20.matches}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.t20.runs.toLocaleString()}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.t20.average}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.t20.hundreds}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.t20.fifties}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.batting.t20.highest}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bowling Tab */}
            {activeTab === "bowling" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Bowling Statistics
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Format
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Matches
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Wickets
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Average
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Economy
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-900">
                          Best
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 font-medium text-gray-900">Test</td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.test.matches}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.test.wickets}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.test.average || "N/A"}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.test.economy || "N/A"}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.test.best}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 font-medium text-gray-900">ODI</td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.odi.matches}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.odi.wickets}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.odi.average}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.odi.economy}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.odi.best}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 font-medium text-gray-900">T20</td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.t20.matches}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.t20.wickets}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.t20.average}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.t20.economy}
                        </td>
                        <td className="py-3 text-gray-700">
                          {mockStats.bowling.t20.best}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent Matches Tab */}
            {activeTab === "recent" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Recent Matches
                </h3>
                <div className="space-y-4">
                  {mockRecentMatches.map((match) => (
                    <div
                      key={match.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {match.opponent}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {match.format} • {match.venue}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            match.result === "Won"
                              ? "bg-green-100 text-green-800"
                              : match.result === "Lost"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {match.result}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Runs:</span>
                          <span className="font-semibold text-gray-900 ml-2">
                            {match.runs} ({match.balls})
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <span className="font-semibold text-gray-900 ml-2">
                            {new Date(match.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Player Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Player Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name:</span>
                  <span className="font-medium text-gray-900">
                    {mockPlayer.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(mockPlayer.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Height:</span>
                  <span className="font-medium text-gray-900">
                    {mockPlayer.height}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium text-gray-900">
                    {mockPlayer.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Batting Style:</span>
                  <span className="font-medium text-gray-900">
                    {mockPlayer.battingStyle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bowling Style:</span>
                  <span className="font-medium text-gray-900">
                    {mockPlayer.bowlingStyle}
                  </span>
                </div>
              </div>
            </div>

            {/* Teams */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Teams</h3>
              <div className="space-y-2">
                {mockPlayer.teams.map((team, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{team}</span>
                    {team === mockPlayer.currentTeam && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockStats.batting.odi.hundreds}
                  </div>
                  <div className="text-xs text-gray-600">ODI Hundreds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mockStats.batting.odi.runs.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">ODI Runs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {mockStats.batting.test.hundreds}
                  </div>
                  <div className="text-xs text-gray-600">Test Hundreds</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {mockStats.batting.test.runs.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Test Runs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
