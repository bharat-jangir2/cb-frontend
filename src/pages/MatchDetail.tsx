import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesApi } from "../services/matches";
import { oddsApi } from "../services/odds";
import { agentsApi } from "../services/agents";
import { socketService } from "../services/socket";
import { useAuthStore } from "../stores/authStore";
import {
  FaRocket,
  FaPlay,
  FaPause,
  FaStop,
  FaUndo,
  FaChartBar,
  FaCog,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");

  // Queries
  const {
    data: match,
    isLoading: matchLoading,
    error: matchError,
  } = useQuery({
    queryKey: ["match", id],
    queryFn: () => {
      console.log("📡 MatchDetail - Fetching match with id:", id);
      return matchesApi.getMatch(id!);
    },
    enabled: !!id,
  });

  // Debug logging for match query
  console.log("🔍 MatchDetail - Match query state:", {
    id,
    isLoading: matchLoading,
    hasData: !!match,
    error: matchError,
  });

  const { data: matchState } = useQuery({
    queryKey: ["matchState", id],
    queryFn: () => matchesApi.getMatchState(id!),
    enabled: !!id,
    refetchInterval: 5000, // Refresh every 5 seconds for live matches
  });

  const { data: balls } = useQuery({
    queryKey: ["matchBalls", id],
    queryFn: () => matchesApi.getMatchBalls(id!),
    enabled: !!id,
  });

  const { data: commentary } = useQuery({
    queryKey: ["matchCommentary", id],
    queryFn: () => matchesApi.getCommentary(id!),
    enabled: !!id,
  });

  const { data: stats } = useQuery({
    queryKey: ["matchStats", id],
    queryFn: () => matchesApi.getMatchStats(id!),
    enabled: !!id,
  });

  const { data: latestOdds } = useQuery({
    queryKey: ["matchOdds", id],
    queryFn: () => oddsApi.getLatestOdds(id!),
    enabled: !!id,
  });

  const { data: agent } = useQuery({
    queryKey: ["matchAgent", id],
    queryFn: () => agentsApi.getMatchAgent(id!),
    enabled: !!id,
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => matchesApi.updateMatchStatus(id!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match", id] });
    },
  });

  const addBallMutation = useMutation({
    mutationFn: (ballData: any) => matchesApi.addBall(id!, ballData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchBalls", id] });
      queryClient.invalidateQueries({ queryKey: ["matchState", id] });
    },
  });

  const undoBallMutation = useMutation({
    mutationFn: () => matchesApi.undoLastBall(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchBalls", id] });
      queryClient.invalidateQueries({ queryKey: ["matchState", id] });
    },
  });

  const startAgentMutation = useMutation({
    mutationFn: () => agentsApi.startAgent(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchAgent", id] });
    },
  });

  const stopAgentMutation = useMutation({
    mutationFn: () => agentsApi.stopAgent(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchAgent", id] });
    },
  });

  const pauseAgentMutation = useMutation({
    mutationFn: () => agentsApi.pauseAgent(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchAgent", id] });
    },
  });

  const resumeAgentMutation = useMutation({
    mutationFn: () => agentsApi.resumeAgent(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchAgent", id] });
    },
  });

  // WebSocket connection
  useEffect(() => {
    if (id && user?.token) {
      socketService.connect(user.token);
      socketService.joinMatch(id);

      // Listen for real-time updates
      socketService.onScoreState((data) => {
        queryClient.setQueryData(["matchState", id], data);
      });

      socketService.onBallApplied((data) => {
        queryClient.invalidateQueries({ queryKey: ["matchBalls", id] });
        queryClient.invalidateQueries({ queryKey: ["matchState", id] });
      });

      socketService.onOddsUpdate((data) => {
        queryClient.setQueryData(["matchOdds", id], data);
      });

      return () => {
        socketService.leaveMatch(id);
      };
    }
  }, [id, user?.token, queryClient]);

  if (matchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cricket-green"></div>
      </div>
    );
  }

  if (!match) {
    console.log("❌ MatchDetail - No match data found");
    return (
      <div className="text-center py-12">
        <FaRocket className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Match not found
        </h3>
      </div>
    );
  }

  // Debug logging for match data
  console.log("🔍 MatchDetail - Match data:", {
    id: match.id,
    title: match.title,
    team1: match.team1,
    team2: match.team2,
    venue: match.venue,
    status: match.status,
    format: match.format,
    date: match.date,
    hasTeam1: !!match.team1,
    hasTeam2: !!match.team2,
    team1Name: match.team1?.name,
    team2Name: match.team2?.name,
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: FaEye },
    { id: "scoring", label: "Live Scoring", icon: FaRocket },
    { id: "commentary", label: "Commentary", icon: FaEdit },
    { id: "stats", label: "Statistics", icon: FaChartBar },
    { id: "odds", label: "Odds", icon: FaChartBar },
    { id: "agents", label: "AI Agents", icon: FaCog },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cricket-green to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {match.title || "Match Details"}
            </h1>
            <p className="text-green-100">
              {match.team1?.name || "Team 1"} vs {match.team2?.name || "Team 2"}{" "}
              • {match.venue || "TBD"}
            </p>
            <p className="text-green-100">
              {match.date
                ? new Date(match.date).toLocaleDateString()
                : "Date TBD"}{" "}
              • {match.format?.toUpperCase() || "T20"}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                match.status === "live"
                  ? "bg-red-500 text-white"
                  : match.status === "completed"
                  ? "bg-green-500 text-white"
                  : match.status === "scheduled"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              {match.status?.toUpperCase() || "UNKNOWN"}
            </span>
          </div>
        </div>
      </div>

      {/* Status Controls (Admin/Scorer only) */}
      {(user?.role === "admin" || user?.role === "scorer") && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Match Controls</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateStatusMutation.mutate("scheduled")}
              className="btn-primary"
              disabled={updateStatusMutation.isPending}
            >
              Set Scheduled
            </button>
            <button
              onClick={() => updateStatusMutation.mutate("live")}
              className="btn-primary"
              disabled={updateStatusMutation.isPending}
            >
              Start Match
            </button>
            <button
              onClick={() => updateStatusMutation.mutate("completed")}
              className="btn-primary"
              disabled={updateStatusMutation.isPending}
            >
              End Match
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-cricket-green text-cricket-green"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Match State */}
              {matchState && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card">
                    <h4 className="font-semibold mb-4">Current State</h4>
                    <div className="space-y-2">
                      <p>Innings: {matchState.currentInnings}</p>
                      <p>
                        Over: {matchState.currentOver}.{matchState.currentBall}
                      </p>
                      <p>
                        Team 1: {matchState.team1Score}/
                        {matchState.team1Wickets} ({matchState.team1Overs}{" "}
                        overs)
                      </p>
                      <p>
                        Team 2: {matchState.team2Score}/
                        {matchState.team2Wickets} ({matchState.team2Overs}{" "}
                        overs)
                      </p>
                    </div>
                  </div>
                  <div className="card">
                    <h4 className="font-semibold mb-4">Latest Odds</h4>
                    {latestOdds ? (
                      <div className="space-y-2">
                        <p>Team 1: {latestOdds.team1Odds}</p>
                        <p>Team 2: {latestOdds.team2Odds}</p>
                        {latestOdds.drawOdds && (
                          <p>Draw: {latestOdds.drawOdds}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Source: {latestOdds.source}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">No odds available</p>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Balls */}
              <div className="card">
                <h4 className="font-semibold mb-4">Recent Balls</h4>
                {balls && balls.length > 0 ? (
                  <div className="space-y-2">
                    {balls
                      .slice(-10)
                      .reverse()
                      .map((ball) => (
                        <div
                          key={ball.id}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <span>
                            Over {ball.over}.{ball.ball}
                          </span>
                          <span className="font-semibold">
                            {ball.runs} runs
                          </span>
                          <span className="text-sm text-gray-500">
                            {ball.commentary}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No balls recorded yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "scoring" && (
            <div className="space-y-6">
              {/* Live Scoring Controls */}
              {(user?.role === "admin" || user?.role === "scorer") && (
                <div className="card">
                  <h4 className="font-semibold mb-4">Live Scoring</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0, 1, 2, 3, 4, 6].map((runs) => (
                      <button
                        key={runs}
                        onClick={() =>
                          addBallMutation.mutate({ runs, over: 1, ball: 1 })
                        }
                        className="btn-primary"
                        disabled={addBallMutation.isPending}
                      >
                        {runs} Runs
                      </button>
                    ))}
                    <button
                      onClick={() => undoBallMutation.mutate()}
                      className="btn-primary"
                      disabled={undoBallMutation.isPending}
                    >
                      <FaUndo className="h-4 w-4 mr-2" />
                      Undo
                    </button>
                  </div>
                </div>
              )}

              {/* Ball History */}
              <div className="card">
                <h4 className="font-semibold mb-4">Ball History</h4>
                {balls && balls.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Over
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Runs
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Extras
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Wicket
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Commentary
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {balls.map((ball) => (
                          <tr key={ball.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {ball.over}.{ball.ball}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {ball.runs}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {ball.extras
                                ? `${ball.extras} (${ball.extraType})`
                                : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {ball.wicket ? ball.wicketType : "-"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {ball.commentary}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No balls recorded yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "commentary" && (
            <div className="card">
              <h4 className="font-semibold mb-4">Live Commentary</h4>
              {commentary && commentary.length > 0 ? (
                <div className="space-y-4">
                  {commentary.map((comment: any) => (
                    <div
                      key={comment.id}
                      className="border-l-4 border-cricket-green pl-4"
                    >
                      <p className="text-sm text-gray-500">
                        {new Date(comment.timestamp).toLocaleTimeString()}
                      </p>
                      <p className="mt-1">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No commentary available</p>
              )}
            </div>
          )}

          {activeTab === "stats" && (
            <div className="card">
              <h4 className="font-semibold mb-4">Match Statistics</h4>
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-2">Batting</h5>
                    {/* Add batting stats here */}
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Bowling</h5>
                    {/* Add bowling stats here */}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Statistics not available</p>
              )}
            </div>
          )}

          {activeTab === "odds" && (
            <div className="card">
              <h4 className="font-semibold mb-4">Betting Odds</h4>
              {latestOdds ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium">
                        {match.team1?.name || "Team 1"}
                      </h5>
                      <p className="text-2xl font-bold text-blue-600">
                        {latestOdds.team1Odds}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h5 className="font-medium">
                        {match.team2?.name || "Team 2"}
                      </h5>
                      <p className="text-2xl font-bold text-green-600">
                        {latestOdds.team2Odds}
                      </p>
                    </div>
                    {latestOdds.drawOdds && (
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium">Draw</h5>
                        <p className="text-2xl font-bold text-gray-600">
                          {latestOdds.drawOdds}
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Source: {latestOdds.source} • Updated:{" "}
                    {new Date(latestOdds.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No odds available</p>
              )}
            </div>
          )}

          {activeTab === "agents" && (
            <div className="card">
              <h4 className="font-semibold mb-4">AI Agent Management</h4>
              {agent ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="font-medium">Agent Status</h5>
                      <p className="text-sm text-gray-500">
                        Last update:{" "}
                        {new Date(agent.lastUpdate).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        agent.status === "running"
                          ? "bg-green-100 text-green-800"
                          : agent.status === "paused"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => startAgentMutation.mutate()}
                      className="btn-primary"
                      disabled={
                        startAgentMutation.isPending ||
                        agent.status === "running"
                      }
                    >
                      <FaPlay className="h-4 w-4 mr-2" />
                      Start
                    </button>
                    <button
                      onClick={() => pauseAgentMutation.mutate()}
                      className="btn-primary"
                      disabled={
                        pauseAgentMutation.isPending ||
                        agent.status !== "running"
                      }
                    >
                      <FaPause className="h-4 w-4 mr-2" />
                      Pause
                    </button>
                    <button
                      onClick={() => resumeAgentMutation.mutate()}
                      className="btn-primary"
                      disabled={
                        resumeAgentMutation.isPending ||
                        agent.status !== "paused"
                      }
                    >
                      <FaPlay className="h-4 w-4 mr-2" />
                      Resume
                    </button>
                    <button
                      onClick={() => stopAgentMutation.mutate()}
                      className="btn-primary"
                      disabled={
                        stopAgentMutation.isPending ||
                        agent.status === "stopped"
                      }
                    >
                      <FaStop className="h-4 w-4 mr-2" />
                      Stop
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No agent found for this match</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
