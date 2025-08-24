import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaCrown, FaArrowLeft, FaArrowRight, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { matchesApi } from "../services/matches";
import type { Match } from "../types/matches";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Fetch live matches from API
  const {
    data: liveMatches,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["live-matches"],
    queryFn: matchesApi.getLiveMatches,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Mock news data (keeping this as is for now)
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

  // Helper function to format match data for display
  const formatMatchForDisplay = (match: Match) => {
    const teamA = match.teamAId;
    const teamB = match.teamBId;
    
    // Format score display
    const formatScore = (score: any) => {
      if (!score || score.runs === undefined) return "Yet to bat";
      return `${score.runs}-${score.wickets || 0} (${score.overs || 0})`;
    };

    // Format overs display
    const formatOvers = (overs: number) => {
      if (!overs) return "0";
      return overs.toString();
    };

    // Get match status display
    const getStatusDisplay = (status: string) => {
      switch (status) {
        case "in_progress":
          return "live";
        case "scheduled":
          return "scheduled";
        case "completed":
          return "completed";
        default:
          return status;
      }
    };

    // Get match type display
    const getMatchTypeDisplay = (matchType: string) => {
      switch (matchType) {
        case "T20":
          return "T20";
        case "ODI":
          return "ODI";
        case "Test":
          return "Test";
        default:
          return matchType;
      }
    };

    return {
      id: match._id,
      type: getStatusDisplay(match.status),
      label: `• Live ${teamA.shortName} vs ${teamB.shortName} 2025`,
      format: `${getMatchTypeDisplay(match.matchType)} Match`,
      teamA: teamA.shortName,
      teamB: teamB.shortName,
      teamAFullName: teamA.name,
      teamBFullName: teamB.name,
      scoreA: formatScore(match.score?.teamA),
      oversA: formatOvers(match.score?.teamA?.overs),
      scoreB: formatScore(match.score?.teamB),
      oversB: formatOvers(match.score?.teamB?.overs),
      toss: `${teamA.shortName} opt to bat`, // This would need to come from match data
      status: getStatusDisplay(match.status),
      venue: match.venue,
      startTime: match.startTime,
      currentInnings: match.currentInnings,
      currentOver: match.currentOver,
      currentBall: match.currentBall,
    };
  };

  const nextMatch = () => {
    if (!liveMatches || liveMatches.length === 0) return;
    setCurrentMatchIndex((prev) => (prev + 1) % liveMatches.length);
  };

  const prevMatch = () => {
    if (!liveMatches || liveMatches.length === 0) return;
    setCurrentMatchIndex(
      (prev) => (prev - 1 + liveMatches.length) % liveMatches.length
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading live matches...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Matches</h2>
          <p className="text-gray-600 mb-4">
            Unable to load live matches. Please check your connection and try again.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No live matches state
  if (!liveMatches || liveMatches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCrown className="text-gray-400 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Live Matches</h2>
            <p className="text-gray-600 mb-6">
              There are currently no live matches. Check back later for updates!
            </p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
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
  }

  const formattedMatches = liveMatches.map(formatMatchForDisplay);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Matches for you Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Live Matches ({formattedMatches.length})
            </h2>
            <button
              onClick={() => refetch()}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <FaSpinner className="text-xs" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="relative">
            {/* Navigation Arrows */}
            {formattedMatches.length > 1 && (
              <>
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
              </>
            )}

            {/* Match Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formattedMatches.map((match, index) => (
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
                    <p className="text-xs text-gray-500 mt-1">{match.venue}</p>
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
                            {match.scoreA}
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
                        <div className="text-xs text-gray-500">
                          Innings {match.currentInnings} • Over {match.currentOver}.{match.currentBall}
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
                          {new Date(match.startTime).toLocaleString()}
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
                            {match.scoreA}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {match.teamB}
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            {match.scoreB}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          Match completed
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
