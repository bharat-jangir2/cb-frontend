import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCrown, FaTrophy, FaCalendar, FaUsers } from "react-icons/fa";

const Series = () => {
  const navigate = useNavigate();

  const mockSeries = [
    {
      id: 1,
      name: "ICC Cricket World Cup 2023",
      type: "ODI",
      status: "completed",
      teams: ["India", "Australia", "England", "Pakistan"],
      startDate: "2023-10-05",
      endDate: "2023-11-19",
    },
    {
      id: 2,
      name: "T20 World Cup 2024",
      type: "T20",
      status: "upcoming",
      teams: ["India", "Australia", "England", "Pakistan", "South Africa"],
      startDate: "2024-06-01",
      endDate: "2024-06-29",
    },
    {
      id: 3,
      name: "Border-Gavaskar Trophy 2024-25",
      type: "Test",
      status: "ongoing",
      teams: ["India", "Australia"],
      startDate: "2024-12-01",
      endDate: "2025-01-15",
    },
  ];

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
                    className="text-yellow-300 border-b-2 border-yellow-300"
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
            <h1 className="text-3xl font-bold">Cricket Series</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSeries.map((series) => (
            <div
              key={series.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/series/${series.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FaTrophy className="text-yellow-500 text-xl" />
                    <span className="text-sm font-medium text-gray-600">
                      {series.type}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      series.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : series.status === "ongoing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {series.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {series.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FaCalendar className="text-gray-400" />
                    <span>
                      {new Date(series.startDate).toLocaleDateString()} -{" "}
                      {new Date(series.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaUsers className="text-gray-400" />
                    <span>{series.teams.length} Teams</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {series.teams.slice(0, 3).map((team, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {team}
                      </span>
                    ))}
                    {series.teams.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{series.teams.length - 3} more
                      </span>
                    )}
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

export default Series;
