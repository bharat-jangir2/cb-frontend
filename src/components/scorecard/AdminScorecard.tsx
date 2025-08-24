import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { unifiedScorecardService } from "../../services/unified-scorecard.service";
import type { UnifiedScorecard } from "../../types/scorecard";
import { useScorecardWebSocket } from "../../hooks/useScorecardWebSocket";
import { LiveScoring } from "./LiveScoring";
import { LiveScore } from "./LiveScore";
import { BattingScorecard } from "./BattingScorecard";
import { BowlingScorecard } from "./BowlingScorecard";
import { BallByBall } from "./BallByBall";

import { Partnerships } from "./Partnerships";
import { FallOfWickets } from "./FallOfWickets";
import { PowerplayTab } from "../admin/PowerplayTab";
import { MatchManagement } from "./MatchManagement";
import { SquadManagement } from "./SquadManagement";
import { VenueManagement } from "./VenueManagement";
import {
  FaRocket,
  FaChartBar,
  FaUsers,
  FaTrophy,
  FaClock,
  FaMapMarkerAlt,
  FaCog,
  FaEdit,
  FaRedo,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Commentary from "./Commentary";

// Interface for the actual API response structure
interface ScorecardApiResponse {
  _id: string;
  matchId: {
    _id: string;
    name: string;
    venue: string;
    startTime: string;
    status: string;
    teamAId: string;
    teamBId: string;
  };
  innings: any[];
  commentary: any[];
  matchSummary: {
    totalOvers: number;
    matchType: string;
    venue: string;
    umpires: any[];
    _id: string;
  };
  lastUpdateTime: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AdminScorecardProps {
  isAdmin?: boolean;
}

export const AdminScorecard: React.FC<AdminScorecardProps> = ({
  isAdmin = true,
}) => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("scoring");
  const [selectedInnings, setSelectedInnings] = useState(1);

  console.log("🎯 AdminScorecard - Rendering with id:", id);
  console.log("🎯 AdminScorecard - isAdmin:", isAdmin);

  // Fetch unified scorecard data
  const {
    data: scorecard,
    isLoading: scorecardLoading,
    error: scorecardError,
  } = useQuery({
    queryKey: ["unifiedScorecard", id],
    queryFn: () => unifiedScorecardService.getScorecard(id!),
    enabled: !!id,
    refetchInterval: (data: any) =>
      data?.matchId?.status === "in_progress" ? 3000 : false,
  });

  // Fetch live scorecard data
  const { data: liveScorecard } = useQuery({
    queryKey: ["liveScorecard", id],
    queryFn: () => unifiedScorecardService.getLiveScorecard(id!),
    enabled: !!id && (scorecard as any)?.matchId?.status === "in_progress",
    refetchInterval: 2000, // Refresh every 2 seconds for live matches
  });

  // Refresh scorecard mutation
  const refreshMutation = useMutation({
    mutationFn: () => unifiedScorecardService.refreshScorecard(id!),
    onSuccess: () => {
      toast.success("Scorecard refreshed successfully");
      queryClient.invalidateQueries({ queryKey: ["unifiedScorecard", id] });
    },
    onError: (error) => {
      toast.error("Failed to refresh scorecard");
      console.error("Refresh error:", error);
    },
  });

  // WebSocket integration for real-time updates
  const { isConnected } = useScorecardWebSocket({
    matchId: id!,
    enabled: !!id,
    onScorecardUpdate: (updatedScorecard) => {
      console.log(
        "🎯 AdminScorecard - Scorecard updated via WebSocket:",
        updatedScorecard
      );
      toast.success("Scorecard updated in real-time");
    },
    onLiveScorecardUpdate: (updatedLiveScorecard) => {
      console.log(
        "🎯 AdminScorecard - Live scorecard updated via WebSocket:",
        updatedLiveScorecard
      );
    },
    onBallAdded: (data) => {
      console.log("🎯 AdminScorecard - Ball added via WebSocket:", data);
      toast.success("New ball added");
    },
    onError: (error) => {
      toast.error(`WebSocket error: ${error.message}`);
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
    console.log("❌ AdminScorecard - No scorecard data found");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">
          Match not found or error loading scorecard
        </div>
      </div>
    );
  }

  console.log("✅ AdminScorecard - Scorecard data loaded:", scorecard);

  // Handle the actual API response structure
  const matchData = (scorecard as any)?.matchId;
  const currentInnings = (scorecard as any)?.innings?.find(
    (inn: any) => inn.inningNumber === selectedInnings
  );
  const isLive = matchData?.status === "in_progress";

  // Define admin tabs
  const tabs = [
    {
      id: "scoring",
      label: "Live Scoring",
      icon: FaRocket,
      component: (
        <LiveScoring
          matchId={id!}
          players={[]}
        />
      ),
    },
    {
      id: "live",
      label: "Live Score",
      icon: FaClock,
      component: (
        <LiveScore
          match={matchData}
          innings={(scorecard as any)?.innings || []}
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
          playerStats={[]}
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
          playerStats={[]}
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
      component: <Commentary entries={[]} />,
    },
    {
      id: "partnerships",
      label: "Partnerships",
      icon: FaUsers,
      component: <Partnerships partnerships={[]} />,
    },
    {
      id: "power-plays",
      label: "Power Plays",
      icon: FaChartBar,
      component: (
        <PowerplayTab
          matchId={id!}
          currentInnings={selectedInnings}
        />
      ),
    },
    {
      id: "management",
      label: "Match Management",
      icon: FaCog,
      component: (
        <MatchManagement
          matchId={id!}
          match={matchData}
          onMatchUpdate={() => {
            queryClient.invalidateQueries({
              queryKey: ["unifiedScorecard", id],
            });
          }}
        />
      ),
    },
    {
      id: "squad",
      label: "Squad Management",
      icon: FaUsers,
      component: <SquadManagement matchId={id!} />,
    },
    {
      id: "venue",
      label: "Venue Management",
      icon: FaMapMarkerAlt,
      component: (
        <VenueManagement
          matchId={id!}
          venue={matchData?.venue || ""}
          onVenueUpdate={() => {
            queryClient.invalidateQueries({
              queryKey: ["unifiedScorecard", id],
            });
          }}
        />
      ),
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">
              {matchData?.name || "Match Details"}
            </h1>
            <p className="text-green-100 text-lg">
              {matchData?.venue || "Venue TBD"}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
                             <span
                 className={`px-3 py-1 rounded-full text-sm font-medium ${
                   isLive
                     ? "bg-green-500"
                     : matchData?.status === "completed"
                     ? "bg-gray-500"
                     : "bg-yellow-500"
                 }`}
               >
                 {matchData?.status?.replace("_", " ").toUpperCase() || "UNKNOWN"}
               </span>
              {isConnected && (
                <span className="px-2 py-1 bg-green-500 rounded-full text-xs">
                  LIVE
                </span>
              )}
            </div>
            <p className="text-green-100 text-sm">
              {matchData?.matchType || "T20"} •{" "}
              {matchData?.matchType || "Match"}
            </p>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-green-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">
                Team A
              </h3>
              {currentInnings && (
                <div className="text-2xl font-bold">
                  {currentInnings.runs || 0}/{currentInnings.wickets || 0} (
                  {currentInnings.overs || 0} overs)
                </div>
              )}
            </div>
            <div className="bg-green-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">
                Team B
              </h3>
              {currentInnings && (
                <div className="text-2xl font-bold">
                  {currentInnings.runs || 0}/{currentInnings.wickets || 0} (
                  {currentInnings.overs || 0} overs)
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <FaRedo
                className={`text-sm ${
                  refreshMutation.isPending ? "animate-spin" : ""
                }`}
              />
              <span>Refresh</span>
            </button>
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
                    ? "border-green-500 text-green-600"
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
