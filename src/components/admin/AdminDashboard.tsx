import React, { useState, useEffect } from "react";
import { useLiveMatches } from "../../hooks";
import { LiveScoringPanel } from "./LiveScoringPanel";
import { MatchManagement } from "./MatchManagement";
import { PlayerStatsManagement } from "./PlayerStatsManagement";
import { CommentaryTab } from "./CommentaryTab";
import { ScoringTab } from "./ScoringTab";
import StatsTab from "./StatsTab";
import SquadTab from "./SquadTab";
import VenueTab from "./VenueTab";
import SettingsTab from "./SettingsTab";
import { WebSocketManagement } from "./WebSocketManagement";
import { socketService } from "../../services/socket";
import { useAuthStore } from "../../stores/authStore";
import { WebSocketStatus } from "../common/WebSocketStatus";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("websocket-management");
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [webSocketStats, setWebSocketStats] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState({
    match: false,
    scorecard: false,
  });

  const { data: liveMatches } = useLiveMatches();
  const { user } = useAuthStore();

  const tabs = [
    {
      id: "websocket-management",
      label: "WebSocket Management",
      component: WebSocketManagement,
    },
    { id: "live-scoring", label: "Live Scoring", component: LiveScoringPanel },
    { id: "scoring", label: "Ball Scoring", component: ScoringTab },
    { id: "commentary", label: "Commentary", component: CommentaryTab },
    { id: "squad", label: "Squad Management", component: SquadTab },
    { id: "stats", label: "Player Stats", component: StatsTab },
    { id: "venue", label: "Venue Management", component: VenueTab },
    {
      id: "match-management",
      label: "Match Control",
      component: MatchManagement,
    },
    {
      id: "player-stats",
      label: "Player Management",
      component: PlayerStatsManagement,
    },
    { id: "settings", label: "Settings", component: SettingsTab },
  ];

  // Monitor WebSocket connection status
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

  // Get WebSocket statistics
  const getWebSocketStats = () => {
    if (selectedMatchId) {
      socketService.getWebSocketStats(selectedMatchId);
    }
  };

  // Setup WebSocket event listeners for stats
  useEffect(() => {
    const handleWebSocketStats = (data: any) => {
      setWebSocketStats(data);
    };

    socketService.onMatch("websocket.stats", handleWebSocketStats);

    return () => {
      socketService.offMatch("websocket.stats");
    };
  }, []);

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.username || "Admin"}
              </p>
            </div>

            {/* Connection Status & Live Matches */}
            <div className="flex items-center space-x-6">
              {/* WebSocket Connection Status */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      connectionStatus.match ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">Match Socket</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      connectionStatus.scorecard ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    Scorecard Socket
                  </span>
                </div>
              </div>

              {/* Live Matches Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  {liveMatches?.data?.length || 0} live matches
                </span>
              </div>

              {/* WebSocket Stats Button */}
              {selectedMatchId && (
                <button
                  onClick={getWebSocketStats}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Get Stats
                </button>
              )}
            </div>
          </div>

          {/* WebSocket Status Panel */}
          <div className="mb-4">
            <WebSocketStatus
              matchId={selectedMatchId}
              showStats={true}
              showReconnectionControls={true}
              className="mb-4"
            />
          </div>

          {/* Match Selection */}
          {liveMatches?.data && liveMatches.data.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Match for WebSocket Operations:
              </label>
              <select
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a match...</option>
                {liveMatches.data.map((match: any) => (
                  <option key={match.id} value={match.id}>
                    {match.team1} vs {match.team2} - {match.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* WebSocket Statistics */}
          {webSocketStats && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                WebSocket Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Connected Clients:</span>
                  <span className="ml-2 text-blue-700">
                    {webSocketStats.connectedClients || 0}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Match Room:</span>
                  <span className="ml-2 text-blue-700">
                    {webSocketStats.matchRoom || 0}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Scorecard Room:</span>
                  <span className="ml-2 text-blue-700">
                    {webSocketStats.scorecardRoom || 0}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Event Rate:</span>
                  <span className="ml-2 text-blue-700">
                    {webSocketStats.eventRate || 0}/min
                  </span>
                </div>
              </div>
            </div>
          )}

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
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {ActiveComponent && (
          <ActiveComponent
            matchId={selectedMatchId}
            webSocketStats={webSocketStats}
            connectionStatus={connectionStatus}
            match={liveMatches?.data?.find(
              (m: any) => m.id === selectedMatchId
            )}
          />
        )}
      </div>
    </div>
  );
};
