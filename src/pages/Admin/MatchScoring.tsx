import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FaRocket, FaArrowLeft, FaPlay, FaPause, FaStop, FaEdit, FaEye,
  FaUsers, FaTrophy, FaClock, FaMapMarkerAlt, FaChartBar, FaCog,
  FaComment, FaUserFriends, FaSearch, FaCheck, FaTimes, FaPlus,
  FaMinus, FaSave, FaUndo, FaRedo, FaFlag, FaBolt, FaCalculator,
  FaHistory, FaBookmark, FaShare, FaDownload, FaPrint, FaBell,
  FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaQuestionCircle
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

// Tab components
import { ScoringTab } from "../../components/admin/ScoringTab";
import { CommentaryTab } from "../../components/admin/CommentaryTab";
// import SquadTab from "../../components/admin/SquadTab";
// import StatsTab from "../../components/admin/StatsTab";
// import VenueTab from "../../components/admin/VenueTab";
// import SettingsTab from "../../components/admin/SettingsTab";

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

const MatchScoring: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("scoring");
  
  // Fetch match data
  const { data: match, isLoading } = useQuery({
    queryKey: ["match", id],
    queryFn: () => adminApi.getMatch(id || ""),
    enabled: !!id,
  });

  const matchData: any = match?.data;

  // Update match status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status: any) =>
      adminApi.updateMatchStatus(id || "", { status }),
    onSuccess: () => {
      toast.success("Match status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["match", id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update match status");
    },
  });

  const handleStatusUpdate = (status: string) => {
    updateStatusMutation.mutate(status);
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status) {
      case "in_progress": return "bg-red-100 text-red-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplayText = (status: string | undefined) => {
    if (!status) return "UNKNOWN";
    switch (status) {
      case "in_progress": return "LIVE";
      case "scheduled": return "SCHEDULED";
      case "completed": return "COMPLETED";
      case "cancelled": return "CANCELLED";
      default: return status.toUpperCase();
    }
  };

  const tabs = [
    { id: "scoring", name: "Scoring", icon: FaRocket },
    { id: "commentary", name: "Commentary", icon: FaComment },
    { id: "squad", name: "Squad", icon: FaUsers },
    { id: "stats", name: "Stats", icon: FaChartBar },
    { id: "venue", name: "Venue", icon: FaMapMarkerAlt },
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
                <span className="text-sm text-gray-600">Series: latest series</span>
                <span className="text-sm text-gray-600">
                  Live: {matchData?.teamAId?.shortName} vs {matchData?.teamBId?.shortName}
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
              <h1 className="text-2xl font-bold text-gray-900">{matchData?.name}</h1>
              <p className="text-gray-600">{matchData?.venue}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(matchData?.status)}`}>
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
         {activeTab === "scoring" && <ScoringTab matchId={id || ""} match={matchData} />}
         {activeTab === "commentary" && <CommentaryTab matchId={id || ""} />}
         {activeTab === "squad" && <div className="text-center py-8 text-gray-500">Squad Tab - Coming Soon</div>}
         {activeTab === "stats" && <div className="text-center py-8 text-gray-500">Stats Tab - Coming Soon</div>}
         {activeTab === "venue" && <div className="text-center py-8 text-gray-500">Venue Tab - Coming Soon</div>}
         {activeTab === "settings" && <div className="text-center py-8 text-gray-500">Settings Tab - Coming Soon</div>}
       </div>
    </div>
  );
};

export default MatchScoring;
