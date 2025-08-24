import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCrown,
  FaUser,
  FaArrowLeft,
  FaUsers,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import Scoreboard from "../components/scorecard/Scoreboard";
import OverProgress from "../components/scorecard/OverProgress";
import Commentary from "../components/scorecard/Commentary";
import ProbabilityBar from "../components/scorecard/ProbabilityBar";
import ProjectedScore from "../components/scorecard/ProjectedScore";
import MatchInfoCard from "../components/scorecard/MatchInfoCard";
import PlayingXI from "../components/matches/PlayingXI";
import WebSocketStatus from "../components/common/WebSocketStatus";
import { useScorecardWebSocket } from "../hooks/useScorecardWebSocket";
import { unifiedScorecardService } from "../services/unified-scorecard.service";
import { scorecardService } from "../services/scorecard.service";
import type { 
  UnifiedScorecard, 
  LiveScorecard, 
  InningsScorecard,
  CommentaryEntry,
  PartnershipSummary 
} from "../types/scorecard";

interface LiveMatchPageProps {}

const LiveMatchPage: React.FC<LiveMatchPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("live");
  const [commentaryFilter, setCommentaryFilter] = useState("All");
  const [liveData, setLiveData] = useState<LiveScorecard | null>(null);
  const [scorecardData, setScorecardData] = useState<UnifiedScorecard | null>(null);
  const [commentaryData, setCommentaryData] = useState<CommentaryEntry[]>([]);
  const [partnershipData, setPartnershipData] = useState<PartnershipSummary[]>([]);

  // Add viewport meta tag for mobile optimization
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }
  }, []);

  // Fetch unified scorecard data
  const {
    data: scorecard,
    isLoading: scorecardLoading,
    error: scorecardError,
    refetch: refetchScorecard,
  } = useQuery({
    queryKey: ["scorecard", id],
    queryFn: () => unifiedScorecardService.getScorecard(id!),
    enabled: !!id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch live scorecard data
  const {
    data: liveScorecard,
    isLoading: liveScorecardLoading,
    error: liveScorecardError,
    refetch: refetchLiveScorecard,
  } = useQuery({
    queryKey: ["liveScorecard", id],
    queryFn: () => unifiedScorecardService.getLiveScorecard(id!),
    enabled: !!id,
    refetchInterval: 5000, // Refetch every 5 seconds for live data
  });

  // Fetch commentary data
  const {
    data: commentary,
    isLoading: commentaryLoading,
    error: commentaryError,
  } = useQuery({
    queryKey: ["commentary", id],
    queryFn: () => unifiedScorecardService.getCommentary(id!),
    enabled: !!id,
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch partnerships data
  const {
    data: partnerships,
    isLoading: partnershipsLoading,
    error: partnershipsError,
  } = useQuery({
    queryKey: ["partnerships", id],
    queryFn: () => unifiedScorecardService.getPartnerships(id!),
    enabled: !!id,
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  // WebSocket integration for real-time updates
  const {
    joinScorecard,
    leaveScorecard,
    getScorecard,
    getLiveScorecard,
    getConnectionStatus,
    reconnect,
    isConnected,
  } = useScorecardWebSocket({
    matchId: id!,
    enabled: !!id,
    onScorecardUpdate: (scorecard: UnifiedScorecard) => {
      console.log("Live scorecard update received:", scorecard);
      setScorecardData(scorecard);
      refetchScorecard();
    },
    onLiveScorecardUpdate: (liveScorecard: LiveScorecard) => {
      console.log("Live scorecard update received:", liveScorecard);
      setLiveData(liveScorecard);
      refetchLiveScorecard();
    },
    onCommentaryAdded: (data) => {
      console.log("New commentary received:", data);
      if (data.commentary) {
        setCommentaryData(prev => [data.commentary, ...prev]);
      }
    },
    onPartnershipUpdate: (data) => {
      console.log("Partnership update received:", data);
      if (data.partnership) {
        setPartnershipData(prev => [data.partnership, ...prev]);
      }
    },
    onMatchStatusChange: (data) => {
      console.log("Match status changed:", data);
      refetchScorecard();
      refetchLiveScorecard();
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
    },
  });

  // Update state when data changes
  useEffect(() => {
    if (scorecard) {
      setScorecardData(scorecard);
    }
  }, [scorecard]);

  useEffect(() => {
    if (liveScorecard) {
      setLiveData(liveScorecard);
    }
  }, [liveScorecard]);

  useEffect(() => {
    if (commentary) {
      setCommentaryData(commentary);
    }
  }, [commentary]);

  useEffect(() => {
    if (partnerships) {
      setPartnershipData(partnerships);
    }
  }, [partnerships]);

  // Prepare data for components
  const currentMatch = scorecardData?.matchSummary;
  const currentInnings = scorecardData?.innings?.find(
    (inning) => inning.inningNumber === liveData?.currentInnings
  );

  // Transform data for Scoreboard component
  const teamAData = {
    name: currentMatch?.teamA?.name || "Team A",
    shortName: currentMatch?.teamA?.shortName || "A",
    runs: liveData?.teamAScore?.runs || 0,
    wickets: liveData?.teamAScore?.wickets || 0,
    overs: liveData?.teamAScore?.overs || 0,
    isBatting: liveData?.currentInnings === 1,
  };

  const teamBData = {
    name: currentMatch?.teamB?.name || "Team B",
    shortName: currentMatch?.teamB?.shortName || "B",
    runs: liveData?.teamBScore?.runs || 0,
    wickets: liveData?.teamBScore?.wickets || 0,
    overs: liveData?.teamBScore?.overs || 0,
    isBatting: liveData?.currentInnings === 2,
  };

  // Calculate derived values
  const currentRR = liveData?.currentRunRate || 0;
  const requiredRR = liveData?.requiredRunRate || 0;
  const target = teamAData.isBatting ? undefined : teamAData.runs;
  const remainingRuns = liveData?.remainingRuns || 0;
  const remainingBalls = liveData?.remainingBalls || 0;
  const lastBall = liveData?.lastBall?.runs || 0;
  const status = currentMatch?.status === "in_progress" ? "live" : 
                 currentMatch?.status === "abandoned" ? "completed" : 
                 (currentMatch?.status || "scheduled");

  // Transform commentary data for Commentary component
  const transformedCommentary = commentaryData.map((entry) => ({
    id: entry.ball,
    over: entry.over,
    ball: entry.ballNumber,
    runs: entry.runs,
    bowler: entry.bowlerName,
    batsman: entry.batsmanName,
    description: entry.comment,
    isHighlight: entry.event.includes("FOUR") || entry.event.includes("SIX") || entry.event.includes("WICKET"),
    isWicket: entry.event.includes("WICKET"),
    isFour: entry.event.includes("FOUR"),
    isSix: entry.event.includes("SIX"),
  }));

  // Transform current players data
  const currentPlayers = [];
  if (liveData?.currentBatsmen?.striker) {
    currentPlayers.push({
      name: liveData.currentBatsmen.striker.name,
      role: "Batsman",
      score: `${liveData.currentBatsmen.striker.runs} (${liveData.currentBatsmen.striker.balls})`,
      isStriker: true,
      type: "batsman",
    });
  }
  if (liveData?.currentBatsmen?.nonStriker) {
    currentPlayers.push({
      name: liveData.currentBatsmen.nonStriker.name,
      role: "Batsman",
      score: `${liveData.currentBatsmen.nonStriker.runs} (${liveData.currentBatsmen.nonStriker.balls})`,
      isStriker: false,
      type: "batsman",
    });
  }
  if (liveData?.currentBowler) {
    currentPlayers.push({
      name: liveData.currentBowler.name,
      role: "Bowler",
      score: `${liveData.currentBowler.wickets}/${liveData.currentBowler.runs}`,
      isStriker: false,
      type: "bowler",
    });
  }

  // Transform overs data for OverProgress component
  const oversData = [];
  if (currentInnings) {
    // Create mock overs data based on current innings
    // In a real implementation, this would come from ball-by-ball data
    for (let i = Math.max(1, liveData?.currentOver || 1); i >= Math.max(1, (liveData?.currentOver || 1) - 2); i--) {
      oversData.push({
        overNumber: i,
        balls: [
          { runs: Math.floor(Math.random() * 7), isWicket: false },
          { runs: Math.floor(Math.random() * 7), isWicket: false },
          { runs: Math.floor(Math.random() * 7), isWicket: false },
          { runs: Math.floor(Math.random() * 7), isWicket: false },
          { runs: Math.floor(Math.random() * 7), isWicket: false },
          { runs: Math.floor(Math.random() * 7), isWicket: false },
        ],
        isCurrentOver: i === liveData?.currentOver,
      });
    }
  }

  const tabs = [
    { id: "matchinfo", label: "Match Info" },
    { id: "live", label: "Live Score" },
    { id: "scorecard", label: "Scorecard" },
    { id: "commentary", label: "Commentary" },
    { id: "stats", label: "Stats Corner" },
    { id: "batting", label: "Batting" },
    { id: "bowling", label: "Bowling" },
    { id: "fall", label: "Fall of Wickets" },
    { id: "ballbyball", label: "Ball by Ball" },
    { id: "partnerships", label: "Partnerships" },
    { id: "powerplays", label: "Power Plays" },
  ];

  // Loading state
  if (scorecardLoading || liveScorecardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading live match data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (scorecardError || liveScorecardError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load match data</p>
          <button
            onClick={() => {
              refetchScorecard();
              refetchLiveScorecard();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors text-xs sm:text-sm lg:text-base p-1 sm:p-2 -m-1 sm:-m-2 rounded-lg hover:bg-blue-800/50"
              >
                <FaArrowLeft className="text-xs sm:text-sm" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="text-base sm:text-lg lg:text-xl font-bold">
                CREX
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
              <div className="flex items-center space-x-1 bg-red-500/20 px-1 sm:px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium">LIVE</span>
              </div>
                <WebSocketStatus 
                  isConnected={isConnected}
                  lastUpdateTime={liveData?.lastUpdateTime ? new Date(liveData.lastUpdateTime) : undefined}
                  matchId={id}
                />
              <button className="p-1 sm:p-2 hover:bg-blue-800 rounded-lg transition-colors">
                <FaExpand className="text-xs sm:text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Title */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-1 sm:py-2 lg:py-3">
          <h1 className="text-xs sm:text-sm lg:text-lg font-semibold text-gray-900 text-center">
            {teamAData.name} vs {teamBData.name}, {currentMatch?.format || "ODI"} Match Live
          </h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex space-x-0.5 sm:space-x-1 lg:space-x-4 overflow-x-auto scrollbar-hide pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 sm:py-3 lg:py-4 px-2 sm:px-3 lg:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-6 pb-20">
        {activeTab === "live" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
            {/* Left Column - Scoreboard & Players */}
            <div className="space-y-2 sm:space-y-4 lg:space-y-6">
              {/* Scoreboard */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <Scoreboard
                  teamA={teamAData}
                  teamB={teamBData}
                  currentRR={currentRR}
                  requiredRR={requiredRR}
                  target={target}
                  remainingRuns={remainingRuns}
                  remainingBalls={remainingBalls}
                  lastBall={lastBall}
                  status={status}
                />
              </div>

              {/* Current Players & Partnership */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 transform transition-all duration-200 hover:shadow-md">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                  Current Players & Partnership
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  {currentPlayers.length > 0 ? (
                    currentPlayers.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 sm:space-x-3"
                    >
                      <div
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-sm ${
                          player.isStriker
                            ? "bg-green-100 border-2 border-green-400"
                            : "bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {player.type === "bowler" ? (
                          <FaUser className="text-gray-600 text-xs sm:text-lg" />
                        ) : (
                          <FaCrown className="text-gray-600 text-xs sm:text-lg" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <span className="font-medium text-gray-900 text-xs sm:text-base truncate">
                            {player.name}
                          </span>
                          {player.isStriker && (
                            <span className="text-xs bg-green-100 text-green-800 px-1 sm:px-2 py-1 rounded-full flex-shrink-0">
                              STRIKER
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {player.role}
                        </div>
                        <div className="text-xs sm:text-base font-semibold text-gray-900">
                          {player.score}
                        </div>
                      </div>
                    </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <FaSpinner className="animate-spin text-gray-400 text-xl mx-auto mb-2" />
                      <p className="text-sm">Loading current players...</p>
                    </div>
                  )}
                </div>
                {partnershipData.length > 0 && (
                <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-gray-200">
                  <div className="text-xs sm:text-sm text-gray-600">
                    Partnership
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-gray-900">
                      {partnershipData[0]?.runs || 0} runs ({partnershipData[0]?.balls || 0} balls)
                  </div>
                </div>
                )}
              </div>

              {/* Over Progress */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 transform transition-all duration-200 hover:shadow-md">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                  Over Progress
                </h3>
                <div className="space-y-2 sm:space-y-4">
                  {oversData.length > 0 ? (
                    oversData.map((over) => (
                    <OverProgress
                      key={over.overNumber}
                      overNumber={over.overNumber}
                      balls={over.balls}
                      isCurrentOver={over.isCurrentOver}
                    />
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <FaSpinner className="animate-spin text-gray-400 text-xl mx-auto mb-2" />
                      <p className="text-sm">Loading over progress...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Center Column - Commentary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-6 transform transition-all duration-200 hover:shadow-md h-fit">
                <Commentary
                  entries={transformedCommentary}
                  activeFilter={commentaryFilter}
                  onFilterChange={setCommentaryFilter}
                />
              </div>
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-2 sm:space-y-4 lg:space-y-6 lg:col-span-1">
              {/* Win Probability */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <ProbabilityBar
                  teamAProbability={65}
                  teamBProbability={35}
                  teamAName={teamAData.name}
                  teamBName={teamBData.name}
                />
              </div>

              {/* Projected Score */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <ProjectedScore
                  currentScore={teamAData.isBatting ? teamAData.runs : teamBData.runs}
                  currentOvers={teamAData.isBatting ? teamAData.overs : teamBData.overs}
                  totalOvers={currentMatch?.format === "T20" ? 20 : 50}
                />
              </div>

              {/* Playing XI Preview */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Playing XI Preview
                    </h3>
                                         <button
                       onClick={() => setActiveTab("matchinfo")}
                       className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                     >
                       View Full
                     </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Team A:</span>
                      <span className="font-medium">
                        {teamAData.name} XI
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Team B:</span>
                      <span className="font-medium">
                        {teamBData.name} XI
                      </span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">
                        <FaUsers className="mr-1" />
                        <span>Tap "View Full" to see complete squad</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        )}

        {/* MatchInfo Tab Content */}
        {activeTab === "matchinfo" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Match Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <MatchInfoCard
                  venue={currentMatch?.venue || "TBD"}
                  date={currentMatch?.startTime ? new Date(currentMatch.startTime).toLocaleDateString() : "TBD"}
                  time={currentMatch?.startTime ? new Date(currentMatch.startTime).toLocaleTimeString() : "TBD"}
                  series={currentMatch?.matchType || "TBD"}
                  format={currentMatch?.format || "ODI"}
                  toss={currentMatch?.toss ? { winner: currentMatch.toss.winner, decision: currentMatch.toss.electedTo } : { winner: "TBD", decision: "TBD" }}
                  umpires={["TBD", "TBD"]}
                  matchReferee="TBD"
                />

                {/* Additional Match Details */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                    Match Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Total Overs:
                      </span>
                      <span className="text-sm font-medium">
                        {currentMatch?.format === "T20" ? 20 : currentMatch?.format === "TEST" ? "Unlimited" : 50}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Current Status:
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {currentMatch?.status?.replace("_", " ") || "TBD"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        WebSocket Status:
                      </span>
                      <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Last Update:
                      </span>
                      <span className="text-sm font-medium">
                        {liveData?.lastUpdateTime ? new Date(liveData.lastUpdateTime).toLocaleTimeString() : "TBD"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Playing XI Section */}
            <PlayingXI matchId={id || "1"} />
          </div>
        )}

        {/* Scorecard Tab Content */}
        {activeTab === "scorecard" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Full Scorecard
              </h2>

              {scorecardData?.innings && scorecardData.innings.length > 0 ? (
                scorecardData.innings.map((inning) => (
                  <div key={inning.inningNumber} className="mb-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">
                      {inning.teamName} Batting
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-900">
                          Batsman
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          R
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          B
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          4s
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          6s
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          SR
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                          {inning.batting.map((batsman) => (
                            <tr key={batsman.playerId} className="border-b border-gray-100">
                        <td className="py-2 font-medium text-gray-900">
                                {batsman.playerName}
                        </td>
                              <td className="py-2 text-right text-gray-700">{batsman.runs}</td>
                              <td className="py-2 text-right text-gray-700">{batsman.balls}</td>
                              <td className="py-2 text-right text-gray-700">{batsman.fours}</td>
                              <td className="py-2 text-right text-gray-700">{batsman.sixes}</td>
                        <td className="py-2 text-right text-gray-700">
                                {batsman.strikeRate.toFixed(2)}
                        </td>
                      </tr>
                          ))}
                    </tbody>
                  </table>
              </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-3 mt-6">
                      {inning.teamName} Bowling
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-900">
                          Bowler
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          O
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          M
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          R
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          W
                        </th>
                        <th className="text-right py-2 font-medium text-gray-900">
                          ECO
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                          {inning.bowling.map((bowler) => (
                            <tr key={bowler.playerId} className="border-b border-gray-100">
                        <td className="py-2 font-medium text-gray-900">
                                {bowler.playerName}
                        </td>
                              <td className="py-2 text-right text-gray-700">{bowler.overs}</td>
                              <td className="py-2 text-right text-gray-700">{bowler.maidens}</td>
                              <td className="py-2 text-right text-gray-700">{bowler.runsConceded}</td>
                              <td className="py-2 text-right text-gray-700">{bowler.wickets}</td>
                              <td className="py-2 text-right text-gray-700">{bowler.economy.toFixed(2)}</td>
                      </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaSpinner className="animate-spin text-gray-400 text-2xl mx-auto mb-2" />
                  <p className="text-sm">Loading scorecard data...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Commentary Tab Content */}
        {activeTab === "commentary" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Live Commentary
              </h2>
              <Commentary
                entries={transformedCommentary}
                activeFilter={commentaryFilter}
                onFilterChange={setCommentaryFilter}
              />
            </div>
          </div>
        )}

        {/* Other tabs would be implemented here */}
        {activeTab !== "live" &&
          activeTab !== "matchinfo" &&
          activeTab !== "scorecard" &&
          activeTab !== "commentary" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-8 transform transition-all duration-200 hover:shadow-md">
              <div className="text-center text-gray-500">
                <div className="text-xl sm:text-2xl font-bold mb-2">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </div>
                <p className="text-sm sm:text-base">
                  This tab will be implemented with detailed {activeTab}{" "}
                  information using live data.
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Bottom Navigation Tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            <button
              onClick={() => setActiveTab("matchinfo")}
              className={`flex flex-col items-center py-3 px-4 transition-colors ${
                activeTab === "matchinfo"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="w-6 h-6 mb-1">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium">Match Info</span>
            </button>

            <button
              onClick={() => setActiveTab("live")}
              className={`flex flex-col items-center py-3 px-4 transition-colors ${
                activeTab === "live"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="w-6 h-6 mb-1 relative">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse absolute -top-1 -right-1"></div>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium">Live</span>
            </button>

            <button
              onClick={() => setActiveTab("scorecard")}
              className={`flex flex-col items-center py-3 px-4 transition-colors ${
                activeTab === "scorecard"
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="w-6 h-6 mb-1">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium">Scorecard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMatchPage;
