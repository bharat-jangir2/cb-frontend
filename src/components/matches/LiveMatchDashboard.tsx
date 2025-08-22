import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "../../hooks/useWebSocket";
import { socketService } from "../../services/socket";
import { matchesApi } from "../../services/api";
import { BallByBall } from "./BallByBall";
import { Scorecard } from "./Scorecard";
import { Timeline } from "./Timeline";
import { Partnerships } from "./Partnerships";
import { PlayerStats } from "./PlayerStats";

export const LiveMatchDashboard: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [activeTab, setActiveTab] = useState("scorecard");
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState({
    match: false,
    scorecard: false,
  });

  // Get match data
  const {
    data: match,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => matchesApi.getMatch(matchId!),
    enabled: !!matchId,
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });

  // WebSocket connection
  const { isConnected, isMatchConnected, isScorecardConnected } = useWebSocket({
    matchId: matchId!,
    token: localStorage.getItem("token") || "",
    enabled: !!matchId,
    onMatchStateUpdate: (data) => {
      console.log("📊 Match state update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "match_state", data, timestamp: new Date() },
      ]);
    },
    onScoreUpdate: (data) => {
      console.log("📊 Score update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "score", data, timestamp: new Date() },
      ]);
    },
    onBallUpdate: (data) => {
      console.log("🏏 Ball update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "ball", data, timestamp: new Date() },
      ]);
    },
    onPlayerUpdate: (data) => {
      console.log("👤 Player update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "player", data, timestamp: new Date() },
      ]);
    },
    onOddsUpdate: (data) => {
      console.log("🎲 Odds update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "odds", data, timestamp: new Date() },
      ]);
    },
    onAlertUpdate: (data) => {
      console.log("⚠️ Alert received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "alert", data, timestamp: new Date() },
      ]);
    },
    onStrikeRotationUpdate: (data) => {
      console.log("🔄 Strike rotation update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "strike_rotation", data, timestamp: new Date() },
      ]);
    },
    onCommentaryUpdate: (data) => {
      console.log("💬 Commentary update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "commentary", data, timestamp: new Date() },
      ]);
    },
    onTossUpdate: (data) => {
      console.log("🪙 Toss update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "toss", data, timestamp: new Date() },
      ]);
    },
    onSquadUpdate: (data) => {
      console.log("👥 Squad update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "squad", data, timestamp: new Date() },
      ]);
    },
    onPlayingXIUpdate: (data) => {
      console.log("🏏 Playing XI update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "playing_xi", data, timestamp: new Date() },
      ]);
    },
    onNotificationUpdate: (data) => {
      console.log("🔔 Notification received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "notification", data, timestamp: new Date() },
      ]);
    },
    onScorecardUpdate: (data) => {
      console.log("📊 Scorecard update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "scorecard", data, timestamp: new Date() },
      ]);
    },
    onLiveScorecardUpdate: (data) => {
      console.log("📊 Live scorecard update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "live_scorecard", data, timestamp: new Date() },
      ]);
    },
    onInningsUpdate: (data) => {
      console.log("🏏 Innings update received:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "innings", data, timestamp: new Date() },
      ]);
    },
    onError: (data) => {
      console.error("❌ WebSocket error:", data);
      setRealTimeUpdates((prev) => [
        ...prev,
        { type: "error", data, timestamp: new Date() },
      ]);
    },
  });

  // Monitor connection status
  useEffect(() => {
    const checkConnectionStatus = () => {
      setConnectionStatus({
        match: socketService.isMatchConnected(),
        scorecard: socketService.isScorecardConnected(),
      });
    };

    const interval = setInterval(checkConnectionStatus, 5000);
    checkConnectionStatus();

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: "scorecard", label: "Scorecard", icon: "📊" },
    { id: "ball-by-ball", label: "Ball by Ball", icon: "🏏" },
    { id: "timeline", label: "Timeline", icon: "⏰" },
    { id: "partnerships", label: "Partnerships", icon: "🤝" },
    { id: "player-stats", label: "Player Stats", icon: "👤" },
    { id: "updates", label: "Live Updates", icon: "🔴" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading match data...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load match data</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "scorecard":
        return <Scorecard matchId={matchId!} />;
      case "ball-by-ball":
        return <BallByBall matchId={matchId!} />;
      case "timeline":
        return <Timeline matchId={matchId!} />;
      case "partnerships":
        return <Partnerships matchId={matchId!} />;
      case "player-stats":
        return <PlayerStats matchId={matchId!} />;
      case "updates":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Live Updates</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {realTimeUpdates.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No updates yet</p>
              ) : (
                realTimeUpdates
                  .slice(-20)
                  .reverse()
                  .map((update, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white rounded-lg shadow border-l-4 border-blue-500"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {update.type.replace("_", " ")}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {update.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {update.type === "ball" && (
                          <span>
                            Ball {update.data.ball} of Over {update.data.over}
                          </span>
                        )}
                        {update.type === "score" && (
                          <span>Score: {update.data.score}</span>
                        )}
                        {update.type === "commentary" && (
                          <span>{update.data.commentary}</span>
                        )}
                        {update.type === "notification" && (
                          <span>{update.data.message}</span>
                        )}
                        {update.type === "alert" && (
                          <span className="text-red-600">
                            {update.data.message}
                          </span>
                        )}
                        {update.type === "error" && (
                          <span className="text-red-600">
                            Error: {update.data.message}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        );
      default:
        return <Scorecard matchId={matchId!} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {match.team1} vs {match.team2}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {match.venue} • {match.status}
              </p>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isMatchConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">Match Socket</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isScorecardConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">Scorecard Socket</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
          </div>

          {/* Live Score Display */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {match.score || "0/0"}
                </div>
                <div className="text-sm text-blue-700">
                  {match.overs || "0.0"} overs
                </div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {match.runRate || "0.00"} RPO
                </div>
                <div className="text-sm text-gray-600">Run Rate</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {match.requiredRuns || "0"} runs
                </div>
                <div className="text-sm text-gray-600">Required</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</div>
    </div>
  );
};
