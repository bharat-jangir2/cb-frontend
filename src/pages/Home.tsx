import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCrown, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Mock data for demonstration
  const mockMatches = [
    {
      id: "1",
      type: "live",
      label: "• Live SA vs AUS 2025",
      format: "2nd ODI",
      teamA: "SA",
      teamB: "AUS",
      scoreA: "184-4",
      oversA: "32.1",
      scoreB: "Yet to bat",
      toss: "SA opt to bat",
      status: "live",
    },
    {
      id: "2",
      type: "upcoming",
      label: "CPL 2025",
      format: "9th T20, Sir Vivian Richards Stadium, North Sound",
      teamA: "Antigua & Barbuda Fa...",
      teamB: "Guyana Amazon Warr...",
      time: "Tomorrow 04:30 AM",
      status: "scheduled",
    },
    {
      id: "3",
      type: "completed",
      label: "CPL 2025",
      format: "8th T20, Warner Park, Basseterre",
      teamA: "SKNP",
      teamB: "BR",
      scoreA: "174-8",
      oversA: "20.0",
      scoreB: "162",
      oversB: "18.2",
      result: "SKNP won by 12 runs",
      status: "completed",
    },
  ];

  const mockNews = {
    title: "BCCI stops Karun Nair from playing",
    headline:
      "Karun Nair Denied Fitness Clearance By BCCI For KSCA Maharaja T20 Trophy 2025",
    summary:
      "Karun Nair will miss the KSCA Maharaja T20 Trophy 2025 after the BCCI Centre of Excellence denied him fitness clearance...",
    timestamp: "8 minutes ago",
    tags: [
      "MYSORE WARRIORS",
      "CENTRAL ZONE",
      "KARUN NAIR",
      "MAHARANI T20 TROPHY",
    ],
  };

  const nextMatch = () => {
    setCurrentMatchIndex((prev) => (prev + 1) % mockMatches.length);
  };

  const prevMatch = () => {
    setCurrentMatchIndex(
      (prev) => (prev - 1 + mockMatches.length) % mockMatches.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Matches for you Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Matches for you
          </h2>

          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevMatch}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>

            <button
              onClick={nextMatch}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <FaArrowRight className="text-gray-600" />
            </button>

            {/* Match Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockMatches.map((match, index) => (
                <div
                  key={match.id}
                  onClick={() => navigate(`/live/${match.id}`)}
                  className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 cursor-pointer hover:shadow-md hover:border-blue-300 ${
                    index === currentMatchIndex ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  {/* Match Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-semibold ${
                          match.status === "live"
                            ? "text-red-600"
                            : match.status === "scheduled"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {match.label}
                      </span>
                      {match.status === "live" && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-red-600 font-medium">
                            LIVE
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{match.format}</p>
                  </div>

                  {/* Match Content */}
                  <div className="space-y-3">
                    {match.status === "live" && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {match.teamA}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {match.scoreA} {match.oversA}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {match.teamB}
                          </span>
                          <span className="text-sm text-gray-600">
                            {match.scoreB}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {match.toss}
                        </div>
                      </>
                    )}

                    {match.status === "scheduled" && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {match.teamA}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {match.teamB}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {match.time}
                        </div>
                      </>
                    )}

                    {match.status === "completed" && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {match.teamA}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {match.scoreA} {match.oversA}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {match.teamB}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {match.scoreB} {match.oversB}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          {match.result}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {mockNews.title}
          </h2>

          <div className="flex flex-col md:flex-row gap-6">
            {/* News Image */}
            <div className="md:w-1/3">
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FaCrown className="text-blue-900 text-xl" />
                  </div>
                  <p className="text-sm text-gray-600">Karun Nair</p>
                  <p className="text-xs text-gray-500">Cricketer</p>
                </div>
              </div>
            </div>

            {/* News Content */}
            <div className="md:w-2/3">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {mockNews.headline}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {mockNews.summary}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {mockNews.timestamp}
                </span>
                <div className="flex flex-wrap gap-2">
                  {mockNews.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
