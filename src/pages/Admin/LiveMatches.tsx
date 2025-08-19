import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaPlay,
  FaPause,
  FaStop,
  FaEdit,
  FaEye,
  FaRocket,
  FaUsers,
  FaTrophy,
  FaClock,
  FaMapMarkerAlt,
  FaChartBar,
  FaCog,
  FaComment,
  FaUserFriends,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

// Match Status Enum
export const MatchStatus = {
  SCHEDULED: "scheduled",
  TOSS: "toss",
  IN_PROGRESS: "in_progress",
  PAUSED: "paused",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  ABANDONED: "abandoned",
} as const;

export type MatchStatusType = (typeof MatchStatus)[keyof typeof MatchStatus];

interface LiveMatch {
  _id: string;
  name: string;
  venue: string;
  startTime: string;
  status: MatchStatusType;
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
  powerPlay?: {
    teamA: {
      powerPlayOvers: number;
      powerPlayRuns: number;
      powerPlayWickets: number;
      powerPlayCompleted: boolean;
      powerPlayStartOver: number;
      powerPlayEndOver: number;
    };
    teamB: {
      powerPlayOvers: number;
      powerPlayRuns: number;
      powerPlayWickets: number;
      powerPlayCompleted: boolean;
      powerPlayStartOver: number;
      powerPlayEndOver: number;
    };
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Type for the API response
type LiveMatchResponse = LiveMatch[] | { data: LiveMatch[] };

const LiveMatches: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);

  // Fetch live matches using admin API
  const {
    data: liveMatchesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["live-matches"],
    queryFn: async () => {
      const response = await adminApi.getLiveMatches();
      console.log("LiveMatches API Response:", response);
      return response;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // 10 seconds
  });

  // Update match status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({
      matchId,
      statusData,
    }: {
      matchId: string;
      statusData: any;
    }) => adminApi.updateMatchStatus(matchId, statusData),
    onSuccess: () => {
      toast.success("Match status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["live-matches"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update match status"
      );
    },
  });

  const handleStatusUpdate = (matchId: string, status: MatchStatusType) => {
    const statusData: any = { status };

    // Add additional data based on status
    if (status === MatchStatus.IN_PROGRESS) {
      statusData.currentInnings = 1;
      statusData.currentOver = 0;
      statusData.currentBall = 0;
    }

    updateStatusMutation.mutate({ matchId, statusData });
  };

  const handleMatchAction = (match: LiveMatch, action: string) => {
    switch (action) {
      case "score":
        navigate(`/admin/matches/${match._id}/scoring`);
        break;
      case "stats":
        navigate(`/admin/matches/${match._id}/stats`);
        break;
      case "squad":
        navigate(`/admin/matches/${match._id}/squad`);
        break;
      case "commentary":
        navigate(`/admin/matches/${match._id}/commentary`);
        break;
      case "venue":
        navigate(`/admin/matches/${match._id}/venue`);
        break;
      case "scorecard":
        navigate(`/admin/matches/${match._id}/scorecard`);
        break;
      case "details":
        navigate(`/admin/matches/${match._id}`);
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status: MatchStatusType) => {
    switch (status) {
      case MatchStatus.SCHEDULED:
        return "bg-yellow-100 text-yellow-800";
      case MatchStatus.TOSS:
        return "bg-blue-100 text-blue-800";
      case MatchStatus.IN_PROGRESS:
        return "bg-red-100 text-red-800";
      case MatchStatus.PAUSED:
        return "bg-orange-100 text-orange-800";
      case MatchStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case MatchStatus.CANCELLED:
        return "bg-gray-100 text-gray-800";
      case MatchStatus.ABANDONED:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDisplayText = (status: MatchStatusType) => {
    switch (status) {
      case MatchStatus.SCHEDULED:
        return "SCHEDULED";
      case MatchStatus.TOSS:
        return "TOSS";
      case MatchStatus.IN_PROGRESS:
        return "LIVE";
      case MatchStatus.PAUSED:
        return "PAUSED";
      case MatchStatus.COMPLETED:
        return "COMPLETED";
      case MatchStatus.CANCELLED:
        return "CANCELLED";
      case MatchStatus.ABANDONED:
        return "ABANDONED";
      default:
        return String(status).toUpperCase();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatOver = (overs: number) => {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${fullOvers}.${balls}`;
  };

  // Get default score if not available
  const getDefaultScore = () => ({
    teamA: { runs: 0, wickets: 0, overs: 0 },
    teamB: { runs: 0, wickets: 0, overs: 0 }
  });

  console.log("liveMatchesData:", liveMatchesData);
  // Handle both AdminApiResponse structure and direct array response
  const liveMatches = Array.isArray(liveMatchesData) 
    ? liveMatchesData 
    : liveMatchesData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Error loading live matches:{" "}
              {(error as any)?.message || "Unknown error"}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FaRocket className="mr-3 text-green-600" />
                Live Matches
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all currently live matches and their scoring
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FaClock className="mr-2" />
                Refresh
              </button>
              <span className="text-sm text-gray-500">
                {liveMatches.length} live match
                {liveMatches.length !== 1 ? "es" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Live Matches Grid */}
        {liveMatches.length === 0 ? (
          <div className="text-center py-12">
            <FaRocket className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No Live Matches
            </h3>
            <p className="mt-2 text-gray-500">
              There are currently no matches in progress.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {liveMatches.map((match: any) => {
              const score = match.score || getDefaultScore();
              return (
                <div
                  key={match._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                >
                  {/* Match Header */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg truncate">
                        {match.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          match.status
                        )}`}
                      >
                        {getStatusDisplayText(match.status)}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <FaMapMarkerAlt className="mr-1" />
                      <span className="truncate">{match.venue}</span>
                    </div>
                  </div>

                  {/* Teams and Score */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center flex-1">
                        <div className="font-semibold text-lg">
                          {match.teamAId.name}
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {score.teamA.runs}/{score.teamA.wickets}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatOver(score.teamA.overs)} overs
                        </div>
                      </div>
                      <div className="text-center mx-4">
                        <div className="text-sm text-gray-500">VS</div>
                        <div className="text-xs text-gray-400">
                          {match.matchType} • {match.overs} overs
                        </div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="font-semibold text-lg">
                          {match.teamBId.name}
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {score.teamB.runs}/{score.teamB.wickets}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatOver(score.teamB.overs)} overs
                        </div>
                      </div>
                    </div>

                    {/* Match Progress */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Current Innings:</span>
                        <span className="font-semibold">
                          {match.currentInnings === 1
                            ? `${match.teamAId.shortName} Batting`
                            : `${match.teamBId.shortName} Batting`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Current Over:</span>
                        <span className="font-semibold">
                          {match.currentOver}.{match.currentBall}
                        </span>
                      </div>
                      {match.tossWinner && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-600">Toss:</span>
                          <span className="font-semibold">
                            {match.tossWinner.shortName} chose to{" "}
                            {match.tossDecision}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* Status Controls */}
                      <div className="flex items-center space-x-1">
                        {match.status === MatchStatus.IN_PROGRESS && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(match._id, MatchStatus.PAUSED)
                              }
                              className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 flex items-center justify-center"
                            >
                              <FaPause className="mr-1" />
                              Pause
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(
                                  match._id,
                                  MatchStatus.COMPLETED
                                )
                              }
                              className="flex-1 px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 flex items-center justify-center"
                            >
                              <FaStop className="mr-1" />
                              End
                            </button>
                          </>
                        )}
                        {match.status === MatchStatus.PAUSED && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                match._id,
                                MatchStatus.IN_PROGRESS
                              )
                            }
                            className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center justify-center"
                          >
                            <FaPlay className="mr-1" />
                            Resume
                          </button>
                        )}
                        {match.status === MatchStatus.SCHEDULED && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(match._id, MatchStatus.TOSS)
                            }
                            className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 flex items-center justify-center"
                          >
                            <FaPlay className="mr-1" />
                            Start Toss
                          </button>
                        )}
                        {match.status === MatchStatus.TOSS && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                match._id,
                                MatchStatus.IN_PROGRESS
                              )
                            }
                            className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center justify-center"
                          >
                            <FaPlay className="mr-1" />
                            Start Match
                          </button>
                        )}
                      </div>

                      {/* Management Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleMatchAction(match, "score")}
                          className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center"
                        >
                          <FaRocket className="mr-1" />
                          Ball Update
                        </button>
                        <button
                          onClick={() => handleMatchAction(match, "commentary")}
                          className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 flex items-center justify-center"
                        >
                          <FaComment className="mr-1" />
                          Commentary
                        </button>
                        <button
                          onClick={() => handleMatchAction(match, "squad")}
                          className="px-3 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 flex items-center justify-center"
                        >
                          <FaUserFriends className="mr-1" />
                          Squad
                        </button>
                        <button
                          onClick={() => handleMatchAction(match, "scorecard")}
                          className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center justify-center"
                        >
                          <FaChartBar className="mr-1" />
                          Scorecard
                        </button>
                        <button
                          onClick={() => handleMatchAction(match, "venue")}
                          className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 flex items-center justify-center"
                        >
                          <FaMapMarkerAlt className="mr-1" />
                          Venue
                        </button>
                        <button
                          onClick={() => handleMatchAction(match, "details")}
                          className="px-3 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center justify-center"
                        >
                          <FaEye className="mr-1" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatches;
