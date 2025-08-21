import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaPlay,
  FaTrophy,
} from "react-icons/fa";

const Fixtures = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const mockFixtures = [
    {
      id: 1,
      teamA: "India",
      teamB: "Pakistan",
      date: "2025-01-15",
      time: "14:30",
      venue: "Melbourne Cricket Ground",
      format: "T20",
      status: "upcoming",
      series: "T20 World Cup 2024",
    },
    {
      id: 2,
      teamA: "Australia",
      teamB: "England",
      date: "2025-01-18",
      time: "10:00",
      venue: "Lord's Cricket Ground",
      format: "Test",
      status: "upcoming",
      series: "Ashes 2024-25",
    },
    {
      id: 3,
      teamA: "South Africa",
      teamB: "New Zealand",
      date: "2025-01-20",
      time: "15:00",
      venue: "Newlands Cricket Ground",
      format: "ODI",
      status: "upcoming",
      series: "ICC Super League",
    },
    {
      id: 4,
      teamA: "India",
      teamB: "Australia",
      date: "2025-01-22",
      time: "19:30",
      venue: "Wankhede Stadium",
      format: "T20",
      status: "upcoming",
      series: "Border-Gavaskar Trophy",
    },
  ];

  const filters = [
    { id: "all", label: "All Matches" },
    { id: "t20", label: "T20" },
    { id: "odi", label: "ODI" },
    { id: "test", label: "Test" },
    { id: "upcoming", label: "Upcoming" },
  ];

  const filteredFixtures = mockFixtures.filter((fixture) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "upcoming") return fixture.status === "upcoming";
    return fixture.format.toLowerCase() === selectedFilter;
  });

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
                    className="text-yellow-300 border-b-2 border-yellow-300"
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
            <h1 className="text-3xl font-bold">Match Fixtures</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fixtures List */}
        <div className="space-y-4">
          {filteredFixtures.map((fixture) => (
            <div
              key={fixture.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/match/${fixture.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FaTrophy className="text-yellow-500 text-lg" />
                    <span className="text-sm font-medium text-gray-600">
                      {fixture.series}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      fixture.format === "T20"
                        ? "bg-purple-100 text-purple-800"
                        : fixture.format === "ODI"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {fixture.format}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {fixture.teamA}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">VS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {fixture.teamB}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FaCalendar className="text-gray-400" />
                    <span>{new Date(fixture.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-gray-400" />
                    <span>{fixture.time} IST</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-gray-400" />
                    <span className="truncate">{fixture.venue}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {fixture.status === "upcoming"
                        ? "Upcoming Match"
                        : fixture.status}
                    </span>
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                      <FaPlay className="text-sm" />
                      <span className="text-sm font-medium">View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fixtures;
