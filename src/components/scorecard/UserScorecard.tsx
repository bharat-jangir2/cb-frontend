import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { unifiedScorecardService } from "../../services/unified-scorecard.service";
import type { UnifiedScorecard } from "../../types/scorecard";
import { useScorecardWebSocket } from "../../hooks/useScorecardWebSocket";
import { LiveScore } from "./LiveScore";
import Commentary from "./Commentary";
import {
  FaRocket,
  FaChartBar,
  FaUsers,
  FaTrophy,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

interface UserScorecardProps {
  isAdmin?: boolean;
}

export const UserScorecard: React.FC<UserScorecardProps> = ({
  isAdmin = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("live");

  console.log("🎯 UserScorecard - Rendering with id:", id);
  console.log("🎯 UserScorecard - isAdmin:", isAdmin);

  // Fetch unified scorecard data
  const {
    data: scorecard,
    isLoading: scorecardLoading,
    error: scorecardError,
  } = useQuery({
    queryKey: ["unifiedScorecard", id],
    queryFn: () => unifiedScorecardService.getScorecard(id!),
    enabled: !!id,
    refetchInterval: (data) =>
      data?.matchSummary?.status === "in_progress" ? 5000 : false,
  });

  // Fetch live scorecard data
  const { data: liveScorecard, isLoading: liveLoading } = useQuery({
    queryKey: ["liveScorecard", id],
    queryFn: () => unifiedScorecardService.getLiveScorecard(id!),
    enabled: !!id && scorecard?.matchSummary?.status === "in_progress",
    refetchInterval: 3000, // Refresh every 3 seconds for live matches
  });

  // WebSocket integration for real-time updates
  const { isConnected } = useScorecardWebSocket({
    matchId: id!,
    enabled: !!id,
    onScorecardUpdate: (updatedScorecard) => {
      console.log(
        "🎯 UserScorecard - Scorecard updated via WebSocket:",
        updatedScorecard
      );
    },
    onLiveScorecardUpdate: (updatedLiveScorecard) => {
      console.log(
        "🎯 UserScorecard - Live scorecard updated via WebSocket:",
        updatedLiveScorecard
      );
    },
  });

  if (scorecardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (scorecardError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">
            Error loading scorecard
          </div>
          <div className="text-gray-600">
            {scorecardError.message || "Failed to load match data"}
          </div>
        </div>
      </div>
    );
  }

  if (!scorecard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-600 text-xl font-semibold mb-2">
            No scorecard data available
          </div>
        </div>
      </div>
    );
  }

  const isLive = scorecard?.matchSummary?.status === "in_progress";

  // Mock commentary data - replace with actual API call
  const mockCommentaryEntries = [
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
  ];

  // Mock match data for LiveScore component
  const mockMatch = {
    _id: id || "1",
    teamAId: { name: "India", shortName: "IND" },
    teamBId: { name: "Australia", shortName: "AUS" },
    venue: "Melbourne Cricket Ground",
    startTime: new Date(),
    status: "in_progress",
    format: "ODI",
    matchType: "ODI",
    overs: 50,
    currentInnings: 1,
    currentOver: 32,
    currentBall: 1,
    score: {
      teamA: { runs: 184, wickets: 4, overs: 32.1 },
      teamB: { runs: 0, wickets: 0, overs: 0 },
    },
  };

  const tabs = [
    {
      id: "live",
      label: "Live Score",
      icon: FaRocket,
      component: (
        <LiveScore match={mockMatch} innings={scorecard?.innings?.[0]} />
      ),
    },
    {
      id: "commentary",
      label: "Commentary",
      icon: FaMapMarkerAlt,
      component: <Commentary entries={mockCommentaryEntries} />,
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">
              {scorecard.matchSummary.name ||
                `${scorecard.matchSummary.teamA?.name || "Team A"} vs ${
                  scorecard.matchSummary.teamB?.name || "Team B"
                }`}
            </h1>
            <p className="text-blue-100 text-lg">
              {scorecard.matchSummary.venue || "Venue TBD"}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isLive
                    ? "bg-green-500"
                    : scorecard.matchSummary.status === "completed"
                    ? "bg-gray-500"
                    : "bg-yellow-500"
                }`}
              >
                {scorecard.matchSummary.status
                  ?.replace("_", " ")
                  .toUpperCase() || "UNKNOWN"}
              </span>
              {isConnected && (
                <span className="px-2 py-1 bg-green-500 rounded-full text-xs">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-blue-100 text-sm">
              {scorecard.matchSummary.format || "Format TBD"} •{" "}
              {scorecard.matchSummary.matchType || "Type TBD"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 px-6 overflow-x-auto">
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

      {/* Tab Content */}
      <div className="p-6">
        {tabs.find((tab) => tab.id === activeTab)?.component || (
          <div className="text-center text-gray-500">
            <div className="text-2xl font-bold mb-2">Tab Not Found</div>
            <p>This tab is not yet implemented.</p>
          </div>
        )}
      </div>
    </div>
  );
};
