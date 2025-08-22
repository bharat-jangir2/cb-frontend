import React, { useState } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { WebSocketStatus } from "../common/WebSocketStatus";
import { socketService, BallData } from "../../services/socket";

interface WebSocketExampleProps {
  matchId: string;
}

export const WebSocketExample: React.FC<WebSocketExampleProps> = ({
  matchId,
}) => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [ballData, setBallData] = useState<Partial<BallData>>({
    over: 1,
    ball: 1,
    innings: 1,
    runs: 0,
    extras: 0,
    extraType: "",
    wicket: false,
    wicketType: "",
    dismissedPlayer: "",
    newBatsman: "",
    commentary: "",
  });

  // WebSocket connection
  const {
    isConnected,
    isMatchConnected,
    isScorecardConnected,
    applyBall,
    undoBall,
    updateStrikeRotation,
    addCommentary,
    addNotification,
  } = useWebSocket({
    matchId,
    token: localStorage.getItem("token") || "",
    enabled: !!matchId,
    onMatchStateUpdate: (data) => {
      console.log("📊 Match state update:", data);
      setUpdates((prev) => [
        ...prev,
        { type: "match_state", data, timestamp: new Date() },
      ]);
    },
    onScoreUpdate: (data) => {
      console.log("📊 Score update:", data);
      setUpdates((prev) => [
        ...prev,
        { type: "score", data, timestamp: new Date() },
      ]);
    },
    onBallUpdate: (data) => {
      console.log("🏏 Ball update:", data);
      setUpdates((prev) => [
        ...prev,
        { type: "ball", data, timestamp: new Date() },
      ]);
    },
    onPlayerUpdate: (data) => {
      console.log("👤 Player update:", data);
      setUpdates((prev) => [
        ...prev,
        { type: "player", data, timestamp: new Date() },
      ]);
    },
    onCommentaryUpdate: (data) => {
      console.log("💬 Commentary update:", data);
      setUpdates((prev) => [
        ...prev,
        { type: "commentary", data, timestamp: new Date() },
      ]);
    },
    onNotificationUpdate: (data) => {
      console.log("🔔 Notification update:", data);
      setUpdates((prev) => [
        ...prev,
        { type: "notification", data, timestamp: new Date() },
      ]);
    },
    onError: (data) => {
      console.error("❌ WebSocket error:", data);
      setUpdates((prev) => [
        ...prev,
        { type: "error", data, timestamp: new Date() },
      ]);
    },
  });

  const handleApplyBall = () => {
    if (ballData.over && ballData.ball && ballData.innings !== undefined) {
      applyBall(ballData as BallData);
      // Reset ball number for next ball
      setBallData((prev) => ({
        ...prev,
        ball: (prev.ball || 1) + 1,
        runs: 0,
        extras: 0,
        extraType: "",
        wicket: false,
        wicketType: "",
        dismissedPlayer: "",
        newBatsman: "",
        commentary: "",
      }));
    }
  };

  const handleAddCommentary = () => {
    const commentary = prompt("Enter commentary:");
    if (commentary) {
      addCommentary({
        over: ballData.over || 1,
        ball: ballData.ball || 1,
        innings: ballData.innings || 1,
        commentary,
        type: "ball",
      });
    }
  };

  const handleAddNotification = () => {
    const message = prompt("Enter notification message:");
    if (message) {
      addNotification({
        type: "info",
        message,
        priority: "normal",
      });
    }
  };

  const handleUpdateStrikeRotation = () => {
    const striker = prompt("Enter striker name:");
    const nonStriker = prompt("Enter non-striker name:");
    const bowler = prompt("Enter bowler name:");

    if (striker && nonStriker && bowler) {
      updateStrikeRotation({
        striker,
        nonStriker,
        bowler,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* WebSocket Status */}
      <WebSocketStatus matchId={matchId} showStats={true} className="mb-4" />

      {/* Connection Status */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Connection Status</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div
              className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>Overall: {isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="text-center">
            <div
              className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                isMatchConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>
              Match: {isMatchConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="text-center">
            <div
              className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                isScorecardConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>
              Scorecard: {isScorecardConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* Ball Scoring Form */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Ball Scoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Over
            </label>
            <input
              type="number"
              value={ballData.over}
              onChange={(e) =>
                setBallData((prev) => ({
                  ...prev,
                  over: parseInt(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ball
            </label>
            <input
              type="number"
              value={ballData.ball}
              onChange={(e) =>
                setBallData((prev) => ({
                  ...prev,
                  ball: parseInt(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Innings
            </label>
            <input
              type="number"
              value={ballData.innings}
              onChange={(e) =>
                setBallData((prev) => ({
                  ...prev,
                  innings: parseInt(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Runs
            </label>
            <input
              type="number"
              value={ballData.runs}
              onChange={(e) =>
                setBallData((prev) => ({
                  ...prev,
                  runs: parseInt(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extras
            </label>
            <input
              type="number"
              value={ballData.extras}
              onChange={(e) =>
                setBallData((prev) => ({
                  ...prev,
                  extras: parseInt(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extra Type
            </label>
            <select
              value={ballData.extraType}
              onChange={(e) =>
                setBallData((prev) => ({ ...prev, extraType: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">None</option>
              <option value="wide">Wide</option>
              <option value="no-ball">No Ball</option>
              <option value="bye">Bye</option>
              <option value="leg-bye">Leg Bye</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={ballData.wicket}
              onChange={(e) =>
                setBallData((prev) => ({ ...prev, wicket: e.target.checked }))
              }
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Wicket</label>
          </div>
        </div>

        {ballData.wicket && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wicket Type
              </label>
              <select
                value={ballData.wicketType}
                onChange={(e) =>
                  setBallData((prev) => ({
                    ...prev,
                    wicketType: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select type</option>
                <option value="bowled">Bowled</option>
                <option value="caught">Caught</option>
                <option value="lbw">LBW</option>
                <option value="run-out">Run Out</option>
                <option value="stumped">Stumped</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dismissed Player
              </label>
              <input
                type="text"
                value={ballData.dismissedPlayer}
                onChange={(e) =>
                  setBallData((prev) => ({
                    ...prev,
                    dismissedPlayer: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commentary
          </label>
          <textarea
            value={ballData.commentary}
            onChange={(e) =>
              setBallData((prev) => ({ ...prev, commentary: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
          />
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleApplyBall}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Apply Ball
          </button>
          <button
            onClick={undoBall}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Undo Last Ball
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleAddCommentary}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Commentary
          </button>
          <button
            onClick={handleAddNotification}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Send Notification
          </button>
          <button
            onClick={handleUpdateStrikeRotation}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Update Strike Rotation
          </button>
          <button
            onClick={() => socketService.getWebSocketStats(matchId)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Get Stats
          </button>
        </div>
      </div>

      {/* Live Updates */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Live Updates</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {updates.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No updates yet</p>
          ) : (
            updates
              .slice(-20)
              .reverse()
              .map((update, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded border-l-4 border-blue-500"
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
    </div>
  );
};
