import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FaRocket,
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaStop,
  FaEdit,
  FaEye,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaChartBar,
  FaCog,
  FaComment,
  FaUserFriends,
  FaSearch,
  FaCheck,
  FaTimes,
  FaPlus,
  FaMinus,
  FaSave,
  FaUndo,
  FaRedo,
  FaFlag,
  FaBolt,
  FaCalculator,
  FaHistory,
  FaBookmark,
  FaShare,
  FaDownload,
  FaPrint,
  FaBell,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

// Tab components
import { ScoringTab } from "../../components/admin/ScoringTab";
import { CommentaryTab } from "../../components/admin/CommentaryTab";
import { EnhancedPowerplayManagement } from "../../components/admin/EnhancedPowerplayManagement";
import { InningsManagement } from "../../components/innings/InningsManagement";

interface MatchData {
  _id: string;
  name: string;
  venue: string;
  startTime: string;
  status: string;
  teamAId: {
    _id: string;
    name: string;
    shortName: string;
  };
  teamBId: {
    _id: string;
    name: string;
    shortName: string;
  };
  tossWinner?: {
    _id: string;
    name: string;
    shortName: string;
  };
  tossDecision?: string;
  matchType: string;
  overs: number;
  currentInnings: number;
  currentOver: number;
  currentBall: number;
  score?: {
    teamA: { runs: number; wickets: number; overs: number };
    teamB: { runs: number; wickets: number; overs: number };
  };
  isActive: boolean;
}

// Squad Tab Component
const SquadTab: React.FC<{ matchId: string; match: any }> = ({
  matchId,
  match,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <FaUsers className="mr-2 text-indigo-600" />
          Squad Management
        </h3>
        <button
          onClick={() => navigate(`/admin/matches/${matchId}/squad`)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
        >
          <FaEdit className="mr-2" />
          Manage Squad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team A Squad */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            {match?.teamAId?.name} Squad
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Players:</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Playing XI:</span>
              <span className="font-medium">11</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Captain:</span>
              <span className="font-medium">Virat Kohli</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Wicket Keeper:</span>
              <span className="font-medium">MS Dhoni</span>
            </div>
          </div>
        </div>

        {/* Team B Squad */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            {match?.teamBId?.name} Squad
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Players:</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Playing XI:</span>
              <span className="font-medium">11</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Captain:</span>
              <span className="font-medium">Pat Cummins</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Wicket Keeper:</span>
              <span className="font-medium">Alex Carey</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <FaInfoCircle className="text-blue-600 mr-2" />
          <p className="text-sm text-blue-800">
            Click "Manage Squad" to view and edit team squads, playing XI, and
            player roles.
          </p>
        </div>
      </div>
    </div>
  );
};

// Stats Tab Component
const StatsTab: React.FC<{ matchId: string; match: any }> = ({
  matchId,
  match,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <FaChartBar className="mr-2 text-green-600" />
          Match Statistics
        </h3>
        <button
          onClick={() => navigate(`/admin/matches/${matchId}/stats`)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
        >
          <FaEye className="mr-2" />
          View Full Stats
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Batting Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Top Batsmen</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Virat Kohli</span>
              <span className="font-medium">85 (52)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rohit Sharma</span>
              <span className="font-medium">45 (32)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>MS Dhoni</span>
              <span className="font-medium">28* (18)</span>
            </div>
          </div>
        </div>

        {/* Bowling Stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Top Bowlers</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pat Cummins</span>
              <span className="font-medium">3/35 (4)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Mitchell Starc</span>
              <span className="font-medium">2/42 (4)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Adam Zampa</span>
              <span className="font-medium">2/28 (4)</span>
            </div>
          </div>
        </div>

        {/* Match Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Match Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Runs:</span>
              <span className="font-medium">185</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Wickets:</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Run Rate:</span>
              <span className="font-medium">9.25</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Extras:</span>
              <span className="font-medium">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Venue Tab Component
const VenueTab: React.FC<{ matchId: string; match: any }> = ({
  matchId,
  match,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <FaMapMarkerAlt className="mr-2 text-orange-600" />
          Venue Information
        </h3>
        <button
          onClick={() => navigate(`/admin/matches/${matchId}/venue`)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
        >
          <FaEye className="mr-2" />
          View Full Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Venue Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Venue Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Venue:</span>
              <span className="font-medium">
                {match?.venue || "Melbourne Cricket Ground"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Capacity:</span>
              <span className="font-medium">100,024</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Surface:</span>
              <span className="font-medium">Grass</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Established:</span>
              <span className="font-medium">1853</span>
            </div>
          </div>
        </div>

        {/* Weather Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            Weather Conditions
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Temperature:</span>
              <span className="font-medium">22°C</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Humidity:</span>
              <span className="font-medium">65%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Wind Speed:</span>
              <span className="font-medium">12 km/h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Condition:</span>
              <span className="font-medium">Partly Cloudy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-orange-50 rounded-lg">
        <div className="flex items-center">
          <FaInfoCircle className="text-orange-600 mr-2" />
          <p className="text-sm text-orange-800">
            Click "View Full Details" to see complete venue information,
            facilities, and weather updates.
          </p>
        </div>
      </div>
    </div>
  );
};



// Settings Tab Component
const SettingsTab: React.FC<{ matchId: string; match: any }> = ({
  matchId,
  match,
}) => {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    notifications: true,
    soundAlerts: false,
    commentaryAutoSave: true,
    ballByBallUpdates: true,
    powerPlayAlerts: true,
    milestoneAlerts: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    toast.success("Setting updated successfully");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h1>bharat</h1>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center">
          <FaCog className="mr-2 text-purple-600" />
          Match Settings
        </h3>
        <button
          onClick={() => toast.success("Settings saved successfully")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
        >
          <FaSave className="mr-2" />
          Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">General Settings</h4>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Auto Refresh
              </label>
              <p className="text-xs text-gray-500">
                Automatically refresh match data
              </p>
            </div>
            <button
              onClick={() =>
                handleSettingChange("autoRefresh", !settings.autoRefresh)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoRefresh ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoRefresh ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Notifications
              </label>
              <p className="text-xs text-gray-500">Enable push notifications</p>
            </div>
            <button
              onClick={() =>
                handleSettingChange("notifications", !settings.notifications)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Sound Alerts
              </label>
              <p className="text-xs text-gray-500">
                Play sound for important events
              </p>
            </div>
            <button
              onClick={() =>
                handleSettingChange("soundAlerts", !settings.soundAlerts)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundAlerts ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundAlerts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Match Specific Settings */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Match Settings</h4>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Ball-by-Ball Updates
              </label>
              <p className="text-xs text-gray-500">Real-time ball updates</p>
            </div>
            <button
              onClick={() =>
                handleSettingChange(
                  "ballByBallUpdates",
                  !settings.ballByBallUpdates
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.ballByBallUpdates ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.ballByBallUpdates ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Power Play Alerts
              </label>
              <p className="text-xs text-gray-500">Notify during power play</p>
            </div>
            <button
              onClick={() =>
                handleSettingChange(
                  "powerPlayAlerts",
                  !settings.powerPlayAlerts
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.powerPlayAlerts ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.powerPlayAlerts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Milestone Alerts
              </label>
              <p className="text-xs text-gray-500">Alert for 50s, 100s, etc.</p>
            </div>
            <button
              onClick={() =>
                handleSettingChange(
                  "milestoneAlerts",
                  !settings.milestoneAlerts
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.milestoneAlerts ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.milestoneAlerts ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Refresh Interval Setting */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Refresh Interval
            </label>
            <p className="text-xs text-gray-500">
              How often to refresh match data (seconds)
            </p>
          </div>
          <select
            value={settings.refreshInterval}
            onChange={(e) =>
              handleSettingChange("refreshInterval", parseInt(e.target.value))
            }
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={10}>10 seconds</option>
            <option value={30}>30 seconds</option>
            <option value={60}>1 minute</option>
            <option value={120}>2 minutes</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const MatchScoring: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Tab state
  const [activeTab, setActiveTab] = useState("scoring");
  const [showTossModal, setShowTossModal] = useState(false);
  const [tossData, setTossData] = useState({
    winner: "",
    decision: "bat" as "bat" | "bowl",
  });

  // Fetch match data
  const { data: match, isLoading } = useQuery({
    queryKey: ["match", id],
    queryFn: () => adminApi.getMatch(id || ""),
    enabled: !!id,
  });

  const matchData: any = match;
  
  // Debug logging for match data
  console.log('🔧 MatchScoring - matchData:', matchData);
  console.log('🔧 MatchScoring - currentInnings:', matchData?.currentInnings);
  console.log('🔧 MatchScoring - match status:', matchData?.status);

  // Update match status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (statusData: {
      status: "scheduled" | "toss" | "in_progress" | "paused" | "completed" | "cancelled" | "abandoned";
      tossWinner?: string;
      tossDecision?: "bat" | "bowl";
      currentInnings?: number;
      currentOver?: number;
      currentBall?: number;
    }) => adminApi.updateMatchStatus(id || "", statusData),
    onSuccess: () => {
      toast.success("Match status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["match", id] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update match status"
      );
    },
  });

  const handleStatusUpdate = (status: "scheduled" | "toss" | "in_progress" | "paused" | "completed" | "cancelled" | "abandoned") => {
    // Show toss modal if starting match without toss
    if (status === "in_progress" && !matchData?.tossWinner) {
      setShowTossModal(true);
      return;
    }

    const statusData: {
      status: "scheduled" | "toss" | "in_progress" | "paused" | "completed" | "cancelled" | "abandoned";
      tossWinner?: string;
      tossDecision?: "bat" | "bowl";
      currentInnings?: number;
      currentOver?: number;
      currentBall?: number;
    } = {
      status,
      currentInnings: matchData?.currentInnings || 1,
      currentOver: matchData?.currentOver || 0,
      currentBall: matchData?.currentBall || 0,
    };

    updateStatusMutation.mutate(statusData);
  };

  const handleTossSubmit = () => {
    if (!tossData.winner) {
      toast.error("Please select toss winner");
      return;
    }

    const statusData = {
      status: "in_progress" as const,
      tossWinner: tossData.winner,
      tossDecision: tossData.decision,
      currentInnings: 1,
      currentOver: 0,
      currentBall: 0,
    };

    updateStatusMutation.mutate(statusData);
    setShowTossModal(false);
    setTossData({ winner: "", decision: "bat" });
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status) {
      case "in_progress":
        return "bg-red-100 text-red-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplayText = (status: string | undefined) => {
    if (!status) return "UNKNOWN";
    switch (status) {
      case "in_progress":
        return "LIVE";
      case "scheduled":
        return "SCHEDULED";
      case "completed":
        return "COMPLETED";
      case "cancelled":
        return "CANCELLED";
      default:
        return status.toUpperCase();
    }
  };

  const tabs = [
    { id: "scoring", name: "Scoring", icon: FaRocket },
    { id: "commentary", name: "Commentary", icon: FaComment },
    { id: "squad", name: "Squad", icon: FaUsers },
    { id: "stats", name: "Stats", icon: FaChartBar },
    { id: "venue", name: "Venue", icon: FaMapMarkerAlt },
    { id: "powerplay", name: "Powerplay", icon: FaBolt },
    { id: "innings", name: "Innings", icon: FaUsers },
    { id: "settings", name: "Settings", icon: FaCog },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Series: latest series
                </span>
                <span className="text-sm text-gray-600">
                  Live: {matchData?.teamAId?.shortName} vs{" "}
                  {matchData?.teamBId?.shortName}
                </span>
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded">
                  LIVE
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm">
                Info
              </button>
              <button
                onClick={() => navigate(`/admin/matches/${id}/scoring`)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Scorecard
              </button>
              <button
                onClick={() => setActiveTab("powerplay")}
                className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 flex items-center"
              >
                <FaBolt className="mr-1" />
                Powerplay
              </button>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm">
                Squad
              </button>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm">
                Squads
              </button>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm">
                Scorecards
              </button>
              <button className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm">
                Select All
              </button>

              <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option>Live</option>
              </select>

              <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                <option>Inn: {matchData?.currentInnings || 1}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Match Info */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {matchData?.name}
              </h1>
              <p className="text-gray-600">{matchData?.venue}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  matchData?.status
                )}`}
              >
                {getStatusDisplayText(matchData?.status)}
              </span>
              <div className="flex space-x-2">
                {matchData?.status === "scheduled" && (
                  <button
                    onClick={() => handleStatusUpdate("in_progress")}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Start Match
                  </button>
                )}
                {matchData?.status === "in_progress" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate("paused")}
                      className="px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("completed")}
                      className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      End Match
                    </button>
                  </>
                )}
                {matchData?.status === "paused" && (
                  <button
                    onClick={() => handleStatusUpdate("in_progress")}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Resume
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "scoring" && (
          <ScoringTab matchId={id || ""} match={matchData} />
        )}
        {activeTab === "commentary" && <CommentaryTab matchId={id || ""} />}
        {activeTab === "squad" && (
          <SquadTab matchId={id || ""} match={matchData} />
        )}
        {activeTab === "stats" && (
          <StatsTab matchId={id || ""} match={matchData} />
        )}
        {activeTab === "venue" && (
          <VenueTab matchId={id || ""} match={matchData} />
        )}
                    {activeTab === "powerplay" && (
              <EnhancedPowerplayManagement
                matchId={id || ""}
                currentInnings={matchData?.currentInnings || 1}
              />
            )}
        {activeTab === "innings" && (
          <InningsManagement 
            matchId={id || ""} 
            isAdmin={true}
            teamAId={matchData?.teamAId?._id}
            teamBId={matchData?.teamBId?._id}
          />
        )}
        {activeTab === "settings" && (
          <SettingsTab matchId={id || ""} match={matchData} />
        )}
      </div>

      {/* Toss Modal */}
      {showTossModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Toss Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toss Winner
                </label>
                <select
                  value={tossData.winner}
                  onChange={(e) => setTossData({ ...tossData, winner: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select team</option>
                  <option value={matchData?.teamAId?._id}>
                    {matchData?.teamAId?.name}
                  </option>
                  <option value={matchData?.teamBId?._id}>
                    {matchData?.teamBId?.name}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toss Decision
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="bat"
                      checked={tossData.decision === "bat"}
                      onChange={(e) => setTossData({ ...tossData, decision: e.target.value as "bat" | "bowl" })}
                      className="mr-2"
                    />
                    <span>Bat</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="bowl"
                      checked={tossData.decision === "bowl"}
                      onChange={(e) => setTossData({ ...tossData, decision: e.target.value as "bat" | "bowl" })}
                      className="mr-2"
                    />
                    <span>Bowl</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleTossSubmit}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Start Match
              </button>
              <button
                onClick={() => setShowTossModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchScoring;
