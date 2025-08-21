import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { unifiedScorecardService } from "../../services/unified-scorecard.service";
import type { UnifiedScorecard } from "../../types/scorecard";
import { useScorecardWebSocket } from "../../hooks/useScorecardWebSocket";
import { LiveScore } from "./LiveScore";
import { BattingScorecard } from "./BattingScorecard";
import { BowlingScorecard } from "./BowlingScorecard";
import { BallByBall } from "./BallByBall";
import { Commentary } from "./Commentary";
import { Partnerships } from "./Partnerships";
import { FallOfWickets } from "./FallOfWickets";
import { PowerPlays } from "./PowerPlays";
import { MatchHighlights } from "./MatchHighlights";
import { TeamComparison } from "./TeamComparison";
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
  const [selectedInnings, setSelectedInnings] = useState(1);

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

  // Fetch match highlights
  const { data: highlights } = useQuery({
    queryKey: ["highlights", id],
    queryFn: () => unifiedScorecardService.getMatchHighlights(id!),
    enabled: !!id && scorecard?.matchSummary?.status === "completed",
  });

  // Fetch team comparison
  const { data: teamComparison } = useQuery({
    queryKey: ["teamComparison", id],
    queryFn: () => unifiedScorecardService.getTeamComparison(id!),
    enabled: !!id,
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

  if (scorecardError || !scorecard) {
    console.log("❌ UserScorecard - No scorecard data found");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">
          Match not found or error loading scorecard
        </div>
      </div>
    );
  }

  console.log("✅ UserScorecard - Scorecard data loaded:", scorecard);

  const currentInnings = scorecard.innings.find(
    (inn) => inn.inningNumber === selectedInnings
  );
  const isLive = scorecard.matchSummary.status === "in_progress";

  // Define tabs based on match status and available data
  const tabs = [
    {
      id: "live",
      label: "Live Score",
      icon: FaRocket,
      component: (
        <LiveScore
          match={scorecard.matchSummary}
          liveScorecard={liveScorecard}
          currentInnings={currentInnings}
          isConnected={isConnected}
        />
      ),
    },
    {
      id: "batting",
      label: "Batting",
      icon: FaUsers,
      component: (
        <BattingScorecard
          matchId={id!}
          innings={currentInnings}
          selectedInnings={selectedInnings}
          onInningsChange={setSelectedInnings}
        />
      ),
    },
    {
      id: "bowling",
      label: "Bowling",
      icon: FaChartBar,
      component: (
        <BowlingScorecard
          matchId={id!}
          innings={currentInnings}
          selectedInnings={selectedInnings}
          onInningsChange={setSelectedInnings}
        />
      ),
    },
    {
      id: "fall-of-wickets",
      label: "Fall of Wickets",
      icon: FaTrophy,
      component: (
        <FallOfWickets
          matchId={id!}
          innings={currentInnings}
          selectedInnings={selectedInnings}
          onInningsChange={setSelectedInnings}
        />
      ),
    },
    {
      id: "ball-by-ball",
      label: "Ball by Ball",
      icon: FaClock,
      component: <BallByBall matchId={id!} />,
    },
    {
      id: "commentary",
      label: "Commentary",
      icon: FaMapMarkerAlt,
      component: <Commentary matchId={id!} />,
    },
    {
      id: "partnerships",
      label: "Partnerships",
      icon: FaUsers,
      component: <Partnerships matchId={id!} />,
    },
    {
      id: "power-plays",
      label: "Power Plays",
      icon: FaChartBar,
      component: (
        <PowerPlays
          matchId={id!}
          innings={currentInnings}
          selectedInnings={selectedInnings}
          onInningsChange={setSelectedInnings}
        />
      ),
    },
  ];

  // Add additional tabs for completed matches
  if (scorecard.matchSummary.status === "completed") {
    tabs.push(
      {
        id: "highlights",
        label: "Highlights",
        icon: FaTrophy,
        component: <MatchHighlights highlights={highlights} />,
      },
      {
        id: "comparison",
        label: "Team Comparison",
        icon: FaChartBar,
        component: <TeamComparison comparison={teamComparison} />,
      }
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">
              {scorecard.matchSummary.name ||
                `${scorecard.matchSummary.teamA.name} vs ${scorecard.matchSummary.teamB.name}`}
            </h1>
            <p className="text-blue-100 text-lg">
              {scorecard.matchSummary.venue}
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
                {scorecard.matchSummary.status.replace("_", " ").toUpperCase()}
              </span>
              {isConnected && (
                <span className="px-2 py-1 bg-green-500 rounded-full text-xs">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-blue-100 text-sm">
              {scorecard.matchSummary.format} •{" "}
              {scorecard.matchSummary.matchType}
            </p>
          </div>
        </div>

        {/* Team Scores Summary */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              {scorecard.matchSummary.teamA.name}
            </h3>
            {currentInnings &&
              currentInnings.teamId === scorecard.matchSummary.teamA._id && (
                <div className="text-2xl font-bold">
                  {currentInnings.runs}/{currentInnings.wickets} (
                  {currentInnings.overs} overs)
                </div>
              )}
          </div>
          <div className="bg-blue-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              {scorecard.matchSummary.teamB.name}
            </h3>
            {currentInnings &&
              currentInnings.teamId === scorecard.matchSummary.teamB._id && (
                <div className="text-2xl font-bold">
                  {currentInnings.runs}/{currentInnings.wickets} (
                  {currentInnings.overs} overs)
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 overflow-x-auto">
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
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};
