import React, { useState, useEffect } from "react";
import {
  socketService,
  BallData,
  StrikeRotation,
  CommentaryData,
  TossInfo,
  SquadData,
  PlayingXIData,
  NotificationData,
} from "../../services/socket";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useAuthStore } from "../../stores/authStore";

interface WebSocketManagementProps {
  matchId: string;
  webSocketStats?: any;
  connectionStatus: {
    match: boolean;
    scorecard: boolean;
  };
}

export const WebSocketManagement: React.FC<WebSocketManagementProps> = ({
  matchId,
  webSocketStats,
  connectionStatus,
}) => {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState("ball-scoring");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // WebSocket hook
  const {
    isConnected,
    isMatchConnected,
    isScorecardConnected,
    applyBall,
    undoBall,
    updatePlayer,
    updateStrikeRotation,
    addCommentary,
    updateToss,
    updateSquad,
    updatePlayingXI,
    addNotification,
  } = useWebSocket({
    matchId,
    token: localStorage.getItem("token") || "",
    enabled: !!matchId,
    onAlertUpdate: (data) => {
      setAlerts((prev) => [...prev, { ...data, timestamp: new Date() }]);
    },
    onNotificationUpdate: (data) => {
      setNotifications((prev) => [...prev, { ...data, timestamp: new Date() }]);
    },
  });

  // Ball scoring form state
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

  // Strike rotation form state
  const [strikeRotation, setStrikeRotation] = useState<StrikeRotation>({
    striker: "",
    nonStriker: "",
    bowler: "",
  });

  // Commentary form state
  const [commentaryData, setCommentaryData] = useState<CommentaryData>({
    over: 1,
    ball: 1,
    innings: 1,
    commentary: "",
    type: "ball",
  });

  // Toss form state
  const [tossInfo, setTossInfo] = useState<TossInfo>({
    winner: "",
    decision: "",
    electedTo: "",
  });

  // Squad form state
  const [squadData, setSquadData] = useState<SquadData>({
    team1Squad: [],
    team2Squad: [],
  });

  // Playing XI form state
  const [playingXIData, setPlayingXIData] = useState<PlayingXIData>({
    team1PlayingXI: [],
    team2PlayingXI: [],
  });

  // Notification form state
  const [notificationData, setNotificationData] = useState<NotificationData>({
    type: "info",
    message: "",
    priority: "normal",
  });

  const sections = [
    { id: "ball-scoring", label: "Ball Scoring", icon: "🏏" },
    { id: "strike-rotation", label: "Strike Rotation", icon: "🔄" },
    { id: "commentary", label: "Commentary", icon: "💬" },
    { id: "toss", label: "Toss Management", icon: "🪙" },
    { id: "squad", label: "Squad Management", icon: "👥" },
    { id: "playing-xi", label: "Playing XI", icon: "🏏" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "alerts", label: "Alerts", icon: "⚠️" },
  ];

  const handleApplyBall = () => {
    if (
      matchId &&
      ballData.over &&
      ballData.ball &&
      ballData.innings !== undefined
    ) {
      applyBall(ballData as BallData);
      // Reset form
      setBallData({
        over: ballData.over,
        ball: ballData.ball + 1,
        innings: ballData.innings,
        runs: 0,
        extras: 0,
        extraType: "",
        wicket: false,
        wicketType: "",
        dismissedPlayer: "",
        newBatsman: "",
        commentary: "",
      });
    }
  };

  const handleUpdateStrikeRotation = () => {
    if (
      matchId &&
      strikeRotation.striker &&
      strikeRotation.nonStriker &&
      strikeRotation.bowler
    ) {
      updateStrikeRotation(strikeRotation);
    }
  };

  const handleAddCommentary = () => {
    if (matchId && commentaryData.commentary) {
      addCommentary(commentaryData);
      setCommentaryData((prev) => ({ ...prev, commentary: "" }));
    }
  };

  const handleUpdateToss = () => {
    if (matchId && tossInfo.winner && tossInfo.decision && tossInfo.electedTo) {
      updateToss(tossInfo);
    }
  };

  const handleUpdateSquad = () => {
    if (
      matchId &&
      squadData.team1Squad.length > 0 &&
      squadData.team2Squad.length > 0
    ) {
      updateSquad(squadData);
    }
  };

  const handleUpdatePlayingXI = () => {
    if (
      matchId &&
      playingXIData.team1PlayingXI.length > 0 &&
      playingXIData.team2PlayingXI.length > 0
    ) {
      updatePlayingXI(playingXIData);
    }
  };

  const handleAddNotification = () => {
    if (matchId && notificationData.message) {
      addNotification(notificationData);
      setNotificationData({ type: "info", message: "", priority: "normal" });
    }
  };

  const renderBallScoring = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ball Scoring</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
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
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Extra Type
          </label>
          <select
            value={ballData.extraType}
            onChange={(e) =>
              setBallData((prev) => ({ ...prev, extraType: e.target.value }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">None</option>
            <option value="wide">Wide</option>
            <option value="no-ball">No Ball</option>
            <option value="bye">Bye</option>
            <option value="leg-bye">Leg Bye</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Wicket
          </label>
          <input
            type="checkbox"
            checked={ballData.wicket}
            onChange={(e) =>
              setBallData((prev) => ({ ...prev, wicket: e.target.checked }))
            }
            className="mt-2 h-4 w-4 text-blue-600"
          />
        </div>
      </div>

      {ballData.wicket && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wicket Type
            </label>
            <select
              value={ballData.wicketType}
              onChange={(e) =>
                setBallData((prev) => ({ ...prev, wicketType: e.target.value }))
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select type</option>
              <option value="bowled">Bowled</option>
              <option value="caught">Caught</option>
              <option value="lbw">LBW</option>
              <option value="run-out">Run Out</option>
              <option value="stumped">Stumped</option>
              <option value="hit-wicket">Hit Wicket</option>
              <option value="obstructing">Obstructing</option>
              <option value="handled-ball">Handled Ball</option>
              <option value="timed-out">Timed Out</option>
              <option value="retired-out">Retired Out</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Commentary
        </label>
        <textarea
          value={ballData.commentary}
          onChange={(e) =>
            setBallData((prev) => ({ ...prev, commentary: e.target.value }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
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
  );

  const renderStrikeRotation = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Strike Rotation</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Striker
          </label>
          <input
            type="text"
            value={strikeRotation.striker}
            onChange={(e) =>
              setStrikeRotation((prev) => ({
                ...prev,
                striker: e.target.value,
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Non-Striker
          </label>
          <input
            type="text"
            value={strikeRotation.nonStriker}
            onChange={(e) =>
              setStrikeRotation((prev) => ({
                ...prev,
                nonStriker: e.target.value,
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bowler
          </label>
          <input
            type="text"
            value={strikeRotation.bowler}
            onChange={(e) =>
              setStrikeRotation((prev) => ({ ...prev, bowler: e.target.value }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>
      <button
        onClick={handleUpdateStrikeRotation}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Update Strike Rotation
      </button>
    </div>
  );

  const renderCommentary = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Add Commentary</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Over
          </label>
          <input
            type="number"
            value={commentaryData.over}
            onChange={(e) =>
              setCommentaryData((prev) => ({
                ...prev,
                over: parseInt(e.target.value),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ball
          </label>
          <input
            type="number"
            value={commentaryData.ball}
            onChange={(e) =>
              setCommentaryData((prev) => ({
                ...prev,
                ball: parseInt(e.target.value),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Innings
          </label>
          <input
            type="number"
            value={commentaryData.innings}
            onChange={(e) =>
              setCommentaryData((prev) => ({
                ...prev,
                innings: parseInt(e.target.value),
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={commentaryData.type}
            onChange={(e) =>
              setCommentaryData((prev) => ({ ...prev, type: e.target.value }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="ball">Ball</option>
            <option value="over">Over</option>
            <option value="innings">Innings</option>
            <option value="match">Match</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Commentary
        </label>
        <textarea
          value={commentaryData.commentary}
          onChange={(e) =>
            setCommentaryData((prev) => ({
              ...prev,
              commentary: e.target.value,
            }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
        />
      </div>
      <button
        onClick={handleAddCommentary}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Commentary
      </button>
    </div>
  );

  const renderToss = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Toss Management</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Winner
          </label>
          <input
            type="text"
            value={tossInfo.winner}
            onChange={(e) =>
              setTossInfo((prev) => ({ ...prev, winner: e.target.value }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Decision
          </label>
          <select
            value={tossInfo.decision}
            onChange={(e) =>
              setTossInfo((prev) => ({ ...prev, decision: e.target.value }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select decision</option>
            <option value="bat">Bat</option>
            <option value="bowl">Bowl</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Elected To
          </label>
          <select
            value={tossInfo.electedTo}
            onChange={(e) =>
              setTossInfo((prev) => ({ ...prev, electedTo: e.target.value }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select</option>
            <option value="bat">Bat</option>
            <option value="bowl">Bowl</option>
          </select>
        </div>
      </div>
      <button
        onClick={handleUpdateToss}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Update Toss
      </button>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Send Notification</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={notificationData.type}
            onChange={(e) =>
              setNotificationData((prev) => ({ ...prev, type: e.target.value }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            value={notificationData.priority}
            onChange={(e) =>
              setNotificationData((prev) => ({
                ...prev,
                priority: e.target.value,
              }))
            }
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          value={notificationData.message}
          onChange={(e) =>
            setNotificationData((prev) => ({
              ...prev,
              message: e.target.value,
            }))
          }
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
          rows={3}
        />
      </div>
      <button
        onClick={handleAddNotification}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Send Notification
      </button>

      {/* Recent Notifications */}
      <div className="mt-8">
        <h4 className="text-md font-semibold mb-4">Recent Notifications</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {notifications.map((notification, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded border">
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      notification.type === "error"
                        ? "bg-red-100 text-red-800"
                        : notification.type === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : notification.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {notification.type.toUpperCase()}
                  </span>
                  <span
                    className={`ml-2 inline-block px-2 py-1 text-xs rounded ${
                      notification.priority === "urgent"
                        ? "bg-red-100 text-red-800"
                        : notification.priority === "high"
                        ? "bg-orange-100 text-orange-800"
                        : notification.priority === "normal"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {notification.priority.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {notification.timestamp?.toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-2 text-sm">{notification.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">System Alerts</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="p-3 bg-red-50 border border-red-200 rounded"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <span className="text-red-600 mr-2">⚠️</span>
                <span className="font-medium text-red-800">Review Needed</span>
              </div>
              <span className="text-xs text-gray-500">
                {alert.timestamp?.toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-2 text-sm text-red-700">{alert.message}</p>
          </div>
        ))}
        {alerts.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No alerts at the moment
          </p>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "ball-scoring":
        return renderBallScoring();
      case "strike-rotation":
        return renderStrikeRotation();
      case "commentary":
        return renderCommentary();
      case "toss":
        return renderToss();
      case "notifications":
        return renderNotifications();
      case "alerts":
        return renderAlerts();
      default:
        return <div>Select a section to manage WebSocket operations</div>;
    }
  };

  if (!matchId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Please select a match to manage WebSocket operations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">WebSocket Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isMatchConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm">
              Match Socket: {isMatchConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isScorecardConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm">
              Scorecard Socket:{" "}
              {isScorecardConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm">
              Overall: {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white p-4 rounded-lg shadow">
        <nav className="flex space-x-4 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                activeSection === section.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-2">{section.icon}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow">{renderContent()}</div>
    </div>
  );
};
