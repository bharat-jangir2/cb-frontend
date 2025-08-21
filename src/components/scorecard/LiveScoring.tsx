import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { scorecardService } from "../../services/scorecard.service";
import type { Player } from "../../services/scorecard.service";
import { useWebSocket } from "../../hooks/useWebSocket";
import toast from "react-hot-toast";

interface LiveScoringProps {
  matchId: string;
  players: Player[];
}

export const LiveScoring: React.FC<LiveScoringProps> = ({
  matchId,
  players,
}) => {
  const queryClient = useQueryClient();
  const [selectedBowler, setSelectedBowler] = useState<string>("");
  const [selectedStriker, setSelectedStriker] = useState<string>("");
  const [selectedNonStriker, setSelectedNonStriker] = useState<string>("");
  const [runs, setRuns] = useState<number>(0);
  const [extras, setExtras] = useState<number>(0);
  const [extraType, setExtraType] = useState<string>("");
  const [wicket, setWicket] = useState<boolean>(false);
  const [wicketType, setWicketType] = useState<string>("");
  const [wicketBatsman, setWicketBatsman] = useState<string>("");
  const [wicketDetails, setWicketDetails] = useState<string>("");
  const [commentary, setCommentary] = useState<string>("");
  const [currentOver, setCurrentOver] = useState<number>(1);
  const [currentBall, setCurrentBall] = useState<number>(1);
  const [currentInnings, setCurrentInnings] = useState<number>(1);

  // Get match state
  const { data: matchState } = useQuery({
    queryKey: ["matchState", matchId],
    queryFn: () => scorecardService.getMatchState(matchId),
    enabled: !!matchId,
    refetchInterval: 5000,
  });

  // Update current state from match
  useEffect(() => {
    if (matchState) {
      setCurrentOver(matchState.currentOver || 1);
      setCurrentBall(matchState.currentBall || 1);
      setCurrentInnings(matchState.currentInnings || 1);
    }
  }, [matchState]);

  // WebSocket connection
  const token = localStorage.getItem("token") || "";
  useWebSocket(matchId, token);

  const addBallMutation = useMutation({
    mutationFn: (ballData: any) => scorecardService.addBall(ballData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
      queryClient.invalidateQueries({ queryKey: ["playerStats", matchId] });
      queryClient.invalidateQueries({ queryKey: ["balls", matchId] });
      toast.success("Ball added successfully");
      resetForm();
      updateBallCount();
    },
    onError: (error) => {
      toast.error("Failed to add ball");
      console.error("Add ball error:", error);
    },
  });

  const undoBallMutation = useMutation({
    mutationFn: () => scorecardService.undoLastBall(matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
      queryClient.invalidateQueries({ queryKey: ["playerStats", matchId] });
      queryClient.invalidateQueries({ queryKey: ["balls", matchId] });
      toast.success("Last ball undone");
    },
    onError: (error) => {
      toast.error("Failed to undo ball");
      console.error("Undo ball error:", error);
    },
  });

  const resetForm = () => {
    setRuns(0);
    setExtras(0);
    setExtraType("");
    setWicket(false);
    setWicketType("");
    setWicketBatsman("");
    setWicketDetails("");
    setCommentary("");
  };

  const updateBallCount = () => {
    if (currentBall < 6) {
      setCurrentBall(currentBall + 1);
    } else {
      setCurrentBall(1);
      setCurrentOver(currentOver + 1);
    }
  };

  const handleAddBall = () => {
    if (!selectedBowler || !selectedStriker || !selectedNonStriker) {
      toast.error("Please select bowler and batsmen");
      return;
    }

    if (wicket && !wicketType) {
      toast.error("Please select wicket type");
      return;
    }

    if (extras > 0 && !extraType) {
      toast.error("Please select extra type");
      return;
    }

    const ballData = {
      matchId,
      innings: currentInnings,
      over: currentOver,
      ball: currentBall,
      event: {
        type: wicket ? "wicket" : extras > 0 ? "extra" : "runs",
        runs: runs,
        extras:
          extras > 0
            ? {
                type: extraType,
                runs: extras,
                description: "",
              }
            : undefined,
        wicket: wicket
          ? {
              type: wicketType,
              batsman: wicketBatsman || selectedStriker,
              bowler: selectedBowler,
              description: wicketDetails,
              ...(wicketType === "caught" && { caughtBy: "" }),
              ...(wicketType === "run_out" && { runOutBy: "" }),
              ...(wicketType === "stumped" && { stumpedBy: "" }),
            }
          : undefined,
      },
      striker: selectedStriker,
      nonStriker: selectedNonStriker,
      bowler: selectedBowler,
      commentary: commentary || undefined,
    };

    addBallMutation.mutate(ballData);
  };

  const bowlers = players.filter(
    (p) => p.role === "bowler" || p.role === "all_rounder"
  );
  const batsmen = players.filter(
    (p) =>
      p.role === "batsman" ||
      p.role === "all_rounder" ||
      p.role === "wicket_keeper"
  );

  return (
    <div className="space-y-6">
      {/* Current Match State */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Current Match State
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Innings</div>
            <div className="text-lg font-semibold">{currentInnings}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Over</div>
            <div className="text-lg font-semibold">{currentOver}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Ball</div>
            <div className="text-lg font-semibold">{currentBall}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Status</div>
            <div className="text-lg font-semibold text-green-600">Live</div>
          </div>
        </div>
      </div>

      {/* Player Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bowler Selection */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Bowler</h3>
          <div className="space-y-2">
            {bowlers.map((bowler) => (
              <label key={bowler._id} className="flex items-center">
                <input
                  type="radio"
                  name="bowler"
                  value={bowler._id}
                  checked={selectedBowler === bowler._id}
                  onChange={(e) => setSelectedBowler(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">{bowler.fullName}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Batsmen Selection */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Batsmen</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Striker
              </label>
              <select
                value={selectedStriker}
                onChange={(e) => setSelectedStriker(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select Striker</option>
                {batsmen.map((batsman) => (
                  <option key={batsman._id} value={batsman._id}>
                    {batsman.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Non-Striker
              </label>
              <select
                value={selectedNonStriker}
                onChange={(e) => setSelectedNonStriker(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Select Non-Striker</option>
                {batsmen.map((batsman) => (
                  <option key={batsman._id} value={batsman._id}>
                    {batsman.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Scoring Controls */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Scoring</h3>
          <div className="space-y-3">
            {/* Runs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Runs
              </label>
              <input
                type="number"
                min="0"
                max="6"
                value={runs}
                onChange={(e) => setRuns(parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* Extras */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extras
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  value={extras}
                  onChange={(e) => setExtras(parseInt(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                <select
                  value={extraType}
                  onChange={(e) => setExtraType(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Type</option>
                  <option value="wide">Wide</option>
                  <option value="no_ball">No Ball</option>
                  <option value="bye">Bye</option>
                  <option value="leg_bye">Leg Bye</option>
                </select>
              </div>
            </div>

            {/* Wicket */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={wicket}
                  onChange={(e) => setWicket(e.target.checked)}
                  className="mr-2"
                />
                Wicket
              </label>
              {wicket && (
                <div className="mt-2 space-y-2">
                  <select
                    value={wicketType}
                    onChange={(e) => setWicketType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Wicket Type</option>
                    <option value="bowled">Bowled</option>
                    <option value="caught">Caught</option>
                    <option value="lbw">LBW</option>
                    <option value="run_out">Run Out</option>
                    <option value="stumped">Stumped</option>
                    <option value="hit_wicket">Hit Wicket</option>
                    <option value="obstructing">Obstructing</option>
                    <option value="handled_ball">Handled Ball</option>
                    <option value="timed_out">Timed Out</option>
                    <option value="retired_out">Retired Out</option>
                  </select>

                  <select
                    value={wicketBatsman}
                    onChange={(e) => setWicketBatsman(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Batsman</option>
                    <option value={selectedStriker}>Striker</option>
                    <option value={selectedNonStriker}>Non-Striker</option>
                  </select>

                  <input
                    type="text"
                    value={wicketDetails}
                    onChange={(e) => setWicketDetails(e.target.value)}
                    placeholder="Wicket details (optional)"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              )}
            </div>

            {/* Commentary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentary
              </label>
              <textarea
                value={commentary}
                onChange={(e) => setCommentary(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows={2}
                placeholder="Add commentary..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleAddBall}
          disabled={addBallMutation.isPending}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {addBallMutation.isPending ? "Adding Ball..." : "Add Ball"}
        </button>
        <button
          onClick={() => undoBallMutation.mutate()}
          disabled={undoBallMutation.isPending}
          className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:opacity-50 font-medium"
        >
          {undoBallMutation.isPending ? "Undoing..." : "Undo Last Ball"}
        </button>
        <button
          onClick={resetForm}
          className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 font-medium"
        >
          Reset Form
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              onClick={() => {
                setRuns(run);
                setExtras(0);
                setWicket(false);
              }}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
            >
              {run} Run{run !== 1 ? "s" : ""}
            </button>
          ))}
          <button
            onClick={() => {
              setRuns(0);
              setExtras(1);
              setExtraType("wide");
              setWicket(false);
            }}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
          >
            Wide
          </button>
          <button
            onClick={() => {
              setRuns(0);
              setExtras(1);
              setExtraType("no_ball");
              setWicket(false);
            }}
            className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
          >
            No Ball
          </button>
        </div>
      </div>
    </div>
  );
};
