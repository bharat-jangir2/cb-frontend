import React, { useState, useEffect } from "react";
import { socketService } from "../../services/socket";

interface WebSocketStatusProps {
  matchId?: string;
  showStats?: boolean;
  showReconnectionControls?: boolean;
  className?: string;
}

export const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  matchId,
  showStats = false,
  showReconnectionControls = false,
  className = "",
}) => {
  const [connectionStatus, setConnectionStatus] = useState({
    match: false,
    scorecard: false,
  });
  const [reconnectionStatus, setReconnectionStatus] = useState({
    isReconnecting: false,
    matchAttempts: 0,
    scorecardAttempts: 0,
  });
  const [stats, setStats] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Monitor connection status
  useEffect(() => {
    const checkConnectionStatus = () => {
      const newStatus = {
        match: socketService.isMatchConnected(),
        scorecard: socketService.isScorecardConnected(),
      };
      setConnectionStatus(newStatus);
      setLastUpdate(new Date());

      // Get reconnection status
      const reconnectStatus = socketService.getReconnectionStatus();
      setReconnectionStatus(reconnectStatus);
    };

    // Check immediately
    checkConnectionStatus();

    // Check every 5 seconds
    const interval = setInterval(checkConnectionStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  // Get WebSocket statistics
  useEffect(() => {
    if (showStats && matchId) {
      const handleWebSocketStats = (data: any) => {
        setStats(data);
      };

      socketService.onMatch("websocket.stats", handleWebSocketStats);

      // Get initial stats
      socketService.getWebSocketStats(matchId);

      return () => {
        socketService.offMatch("websocket.stats");
      };
    }
  }, [showStats, matchId]);

  const getStatusColor = (isConnected: boolean) => {
    return isConnected ? "bg-green-500" : "bg-red-500";
  };

  const getStatusText = (isConnected: boolean) => {
    return isConnected ? "Connected" : "Disconnected";
  };

  const getReconnectionColor = (isReconnecting: boolean) => {
    return isReconnecting ? "bg-yellow-500" : "bg-gray-400";
  };

  const handleForceReconnect = (namespace?: "match" | "scorecard") => {
    socketService.forceReconnect(namespace);
  };

  const handleUpdateReconnectionConfig = () => {
    // Example: Update reconnection config
    socketService.updateReconnectionConfig({
      maxAttempts: 15,
      initialDelay: 2000,
      maxDelay: 60000,
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          WebSocket Status
        </h3>
        {lastUpdate && (
          <span className="text-xs text-gray-500">
            Last update: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Connection Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(
                connectionStatus.match
              )}`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              Match Socket
            </span>
          </div>
          <span
            className={`text-sm ${
              connectionStatus.match ? "text-green-600" : "text-red-600"
            }`}
          >
            {getStatusText(connectionStatus.match)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(
                connectionStatus.scorecard
              )}`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              Scorecard Socket
            </span>
          </div>
          <span
            className={`text-sm ${
              connectionStatus.scorecard ? "text-green-600" : "text-red-600"
            }`}
          >
            {getStatusText(connectionStatus.scorecard)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(
                connectionStatus.match && connectionStatus.scorecard
              )}`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              Overall Status
            </span>
          </div>
          <span
            className={`text-sm ${
              connectionStatus.match && connectionStatus.scorecard
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {getStatusText(
              connectionStatus.match && connectionStatus.scorecard
            )}
          </span>
        </div>

        {/* Reconnection Status */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${getReconnectionColor(
                reconnectionStatus.isReconnecting
              )}`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              Reconnection Status
            </span>
          </div>
          <span
            className={`text-sm ${
              reconnectionStatus.isReconnecting
                ? "text-yellow-600"
                : "text-gray-600"
            }`}
          >
            {reconnectionStatus.isReconnecting ? "Reconnecting..." : "Idle"}
          </span>
        </div>

        {/* Reconnection Attempts */}
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <span>Match attempts:</span>
            <span className="ml-1 font-medium">
              {reconnectionStatus.matchAttempts}
            </span>
          </div>
          <div>
            <span>Scorecard attempts:</span>
            <span className="ml-1 font-medium">
              {reconnectionStatus.scorecardAttempts}
            </span>
          </div>
        </div>
      </div>

      {/* Reconnection Controls */}
      {showReconnectionControls && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Reconnection Controls
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleForceReconnect("match")}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Reconnect Match
            </button>
            <button
              onClick={() => handleForceReconnect("scorecard")}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Reconnect Scorecard
            </button>
            <button
              onClick={() => handleForceReconnect()}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              Reconnect All
            </button>
            <button
              onClick={handleUpdateReconnectionConfig}
              className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
            >
              Update Config
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      {showStats && stats && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Connected Clients:</span>
              <span className="ml-2 font-medium">
                {stats.connectedClients || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Match Room:</span>
              <span className="ml-2 font-medium">{stats.matchRoom || 0}</span>
            </div>
            <div>
              <span className="text-gray-600">Scorecard Room:</span>
              <span className="ml-2 font-medium">
                {stats.scorecardRoom || 0}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Event Rate:</span>
              <span className="ml-2 font-medium">
                {stats.eventRate || 0}/min
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {matchId && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => socketService.getWebSocketStats(matchId)}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Refresh Stats
            </button>
            <button
              onClick={() => {
                socketService.joinMatch(matchId);
                socketService.joinScorecard(matchId);
              }}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
            >
              Join Rooms
            </button>
            <button
              onClick={() => {
                socketService.leaveMatch(matchId);
                socketService.leaveScorecard(matchId);
              }}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              Leave Rooms
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
