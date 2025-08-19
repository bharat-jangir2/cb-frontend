import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaRocket, FaFlag, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { adminApi } from "../../services/admin";

interface ScoringTabProps {
  matchId: string;
  match: any;
}

interface BowlerStats {
  playerId: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  extras: number;
}

interface BatsmanStats {
  playerId: string;
  playerName: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalType?: string;
  bowlerId?: string;
  fielderId?: string;
}

export const ScoringTab: React.FC<ScoringTabProps> = ({ matchId, match }) => {
  const queryClient = useQueryClient();
  
  // State for scoring
  const [currentRuns, setCurrentRuns] = useState(0);
  const [currentWickets, setCurrentWickets] = useState(0);
  const [currentOvers, setCurrentOvers] = useState(0);
  const [currentBalls, setCurrentBalls] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedBowler, setSelectedBowler] = useState<string>("");
  const [selectedStriker, setSelectedStriker] = useState<string>("");
  const [selectedNonStriker, setSelectedNonStriker] = useState<string>("");
  const [powerPlayOn, setPowerPlayOn] = useState(false);
  const [currentInnings, setCurrentInnings] = useState(1);

  // Extra runs state
  const [extraRuns, setExtraRuns] = useState({
    ex: 0,
    wd: 0,
    nb: 0,
    lb: 0,
    b: 0,
    p: 0,
  });

  // Odds state
  const [odds, setOdds] = useState({
    session: 12,
    lambi: 10,
  });

  // Mock data for bowlers and batsmen (replace with actual API calls)
  const bowlers: BowlerStats[] = [
    {
      playerId: "1",
      playerName: "Ravichandran Ashwin",
      overs: 1,
      maidens: 0,
      runs: 4,
      wickets: 2,
      economy: 4.0,
      extras: 0,
    },
    {
      playerId: "2",
      playerName: "Ravindra Jadeja",
      overs: 1,
      maidens: 0,
      runs: 4,
      wickets: 2,
      economy: 4.0,
      extras: 0,
    },
    {
      playerId: "3",
      playerName: "Jasprit Bumrah",
      overs: 1,
      maidens: 0,
      runs: 3,
      wickets: 3,
      economy: 3.0,
      extras: 0,
    },
    {
      playerId: "4",
      playerName: "Kuldeep Yadav",
      overs: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      extras: 0,
    },
    {
      playerId: "5",
      playerName: "Mohammed Shami",
      overs: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: 0,
      extras: 0,
    },
  ];

  const batsmen: BatsmanStats[] = [
    {
      playerId: "6",
      playerName: "Kusal Mendis",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
    },
    {
      playerId: "7",
      playerName: "Dhananjaya de Silva",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
    },
    {
      playerId: "8",
      playerName: "Charith Asalanka",
      runs: 2,
      balls: 2,
      fours: 0,
      sixes: 0,
      strikeRate: 100,
      isOut: false,
    },
    {
      playerId: "9",
      playerName: "Nuwan Thushara",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
    },
    {
      playerId: "10",
      playerName: "Lahiru Kumara",
      runs: 4,
      balls: 4,
      fours: 0,
      sixes: 0,
      strikeRate: 100,
      isOut: false,
    },
    {
      playerId: "11",
      playerName: "Asitha Fernando",
      runs: 1,
      balls: 1,
      fours: 0,
      sixes: 0,
      strikeRate: 100,
      isOut: false,
    },
    {
      playerId: "12",
      playerName: "Maheesh Theekshana",
      runs: 2,
      balls: 2,
      fours: 0,
      sixes: 0,
      strikeRate: 100,
      isOut: false,
    },
    {
      playerId: "13",
      playerName: "Matheesha Pathirana",
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: 0,
      isOut: false,
    },
    {
      playerId: "14",
      playerName: "Dushmantha Chameera",
      runs: 2,
      balls: 2,
      fours: 0,
      sixes: 0,
      strikeRate: 100,
      isOut: false,
    },
  ];

  // Update ball mutation
  const updateBallMutation = useMutation({
    mutationFn: (ballData: any) => adminApi.updateMatchBall(matchId, ballData),
    onSuccess: () => {
      toast.success("Ball updated successfully");
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      // Reset form
      setCurrentRuns(0);
      setCurrentWickets(0);
      setCurrentBalls(0);
      setComment("");
      setExtraRuns({ ex: 0, wd: 0, nb: 0, lb: 0, b: 0, p: 0 });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update ball");
    },
  });

  const handleUpdateBall = () => {
    const ballData = {
      runs: currentRuns,
      wickets: currentWickets,
      balls: currentBalls,
      comment,
      extraRuns,
      bowlerId: selectedBowler,
      strikerId: selectedStriker,
      nonStrikerId: selectedNonStriker,
      innings: currentInnings,
    };

    updateBallMutation.mutate(ballData);
  };

  const handleUpdateOdds = () => {
    toast.success("Odds updated successfully");
  };

  const handlePowerPlayToggle = () => {
    setPowerPlayOn(!powerPlayOn);
    toast.success(`Power Play ${!powerPlayOn ? "enabled" : "disabled"}`);
  };

  const formatOver = (overs: number) => {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${fullOvers}.${balls}`;
  };

  return (
    <div className="space-y-6">
      {/* Match Control Panel */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Toss: {match?.tossWinner?.name} Won The Toss and Choo
            </span>
            <button className="px-4 py-2 bg-green-600 text-white rounded text-sm">
              Showing
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm">
              DLS
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Search:</span>
              <input
                type="text"
                className="px-3 py-1 border border-gray-300 rounded text-sm w-48"
                placeholder="Search..."
              />
            </div>
            <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm">
              Update
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePowerPlayToggle}
            className={`px-6 py-2 rounded text-sm font-medium ${
              powerPlayOn
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Power Play {powerPlayOn ? "On" : "Off"}
          </button>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" />
              <span>Odds History</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" defaultChecked />
              <span>commentary</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <input type="checkbox" />
              <span>On Oc</span>
            </label>
          </div>
        </div>
      </div>

      {/* Team Scorecard Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFlag className="h-4 w-4 text-red-600" />
                <span className="font-semibold">{match?.teamAId?.name}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {match?.score?.teamA?.runs || 0}-{match?.score?.teamA?.wickets || 0}
              </div>
              <div className="text-sm text-gray-600">
                CRR: {match?.score?.teamA?.overs ? (match.score.teamA.runs / match.score.teamA.overs).toFixed(1) : "0.0"}
              </div>
            </div>

            <div className="text-gray-500">VS</div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFlag className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">{match?.teamBId?.name}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {match?.score?.teamB?.runs || 0}-{match?.score?.teamB?.wickets || 0}
              </div>
              <div className="text-sm text-gray-600">
                CRR: {match?.score?.teamB?.overs ? (match.score.teamB.runs / match.score.teamB.overs).toFixed(1) : "0.0"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              className="px-3 py-1 border border-gray-300 rounded text-sm w-64"
              placeholder="lahore qalandars won the Toss"
            />
            <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm">
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Betting/Odds Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Odds:</span>
            <select className="px-2 py-1 border border-gray-300 rounded text-sm">
              <option>Select</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Session:</span>
              <input
                type="number"
                value={odds.session}
                onChange={(e) => setOdds({ ...odds, session: Number(e.target.value) })}
                className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
              />
              <span className="text-red-600 text-sm">0</span>
              <button
                onClick={handleUpdateOdds}
                className="px-2 py-1 bg-gray-600 text-white rounded text-sm"
              >
                Update
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">lambi:</span>
              <input
                type="number"
                value={odds.lambi}
                onChange={(e) => setOdds({ ...odds, lambi: Number(e.target.value) })}
                className="px-2 py-1 border border-gray-300 rounded text-sm w-16"
              />
              <span className="text-red-600 text-sm">0</span>
              <button
                onClick={handleUpdateOdds}
                className="px-2 py-1 bg-gray-600 text-white rounded text-sm"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Scoring Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scoreboard (Left Panel) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg">
            <h3 className="font-semibold">Scoreboard</h3>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {match?.tossWinner?.name} Won The Toss and Choose Batting
              </p>
              <div className="flex space-x-2 mb-4">
                <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm">
                  Updateball
                </button>
                <button className="px-3 py-1 bg-gray-600 text-white rounded text-sm">
                  Update
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Runs:</span>
                <input
                  type="number"
                  value={currentRuns}
                  onChange={(e) => setCurrentRuns(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Wickets:</span>
                <input
                  type="number"
                  value={currentWickets}
                  onChange={(e) => setCurrentWickets(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overs:</span>
                <input
                  type="number"
                  value={currentOvers}
                  onChange={(e) => setCurrentOvers(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                />
              </div>
              <button
                onClick={handleUpdateBall}
                className="w-full px-3 py-2 bg-gray-600 text-white rounded text-sm"
              >
                Update
              </button>
            </div>

            <div className="mt-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="comment 2"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                rows={3}
              />
              <button className="w-full mt-2 px-3 py-2 bg-gray-600 text-white rounded text-sm">
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Bowlers (Middle Panel) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-teal-600 text-white px-4 py-3 rounded-t-lg">
            <h3 className="font-semibold">Bowlers</h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">ST</th>
                    <th className="text-left py-2">Bowler</th>
                    <th className="text-left py-2">O</th>
                    <th className="text-left py-2">M</th>
                    <th className="text-left py-2">R</th>
                    <th className="text-left py-2">W</th>
                    <th className="text-left py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {bowlers.map((bowler) => (
                    <tr key={bowler.playerId} className="border-b border-gray-100">
                      <td className="py-2">
                        <input
                          type="radio"
                          name="selectedBowler"
                          checked={selectedBowler === bowler.playerId}
                          onChange={() => setSelectedBowler(bowler.playerId)}
                          className="mr-2"
                        />
                      </td>
                      <td className="py-2 font-medium">{bowler.playerName}</td>
                      <td className="py-2">{bowler.overs}</td>
                      <td className="py-2">{bowler.maidens}</td>
                      <td className="py-2">{bowler.runs}</td>
                      <td className="py-2">{bowler.wickets}</td>
                      <td className="py-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          ⋮
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Batsmen (Right Panel) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-red-600 text-white px-4 py-3 rounded-t-lg">
            <h3 className="font-semibold">Batsmen</h3>
          </div>
          <div className="p-4">
            {/* Extra Runs */}
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2 mb-2">
                {Object.entries(extraRuns).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-1">
                    <span className="text-xs text-gray-600">{key}:</span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setExtraRuns({ ...extraRuns, [key]: Number(e.target.value) })
                      }
                      className="px-1 py-1 border border-gray-300 rounded text-xs w-12"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Batsmen Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">ST</th>
                    <th className="text-left py-2">Strike Batsmen</th>
                    <th className="text-left py-2">Runs</th>
                    <th className="text-left py-2">Balls</th>
                    <th className="text-left py-2">4s</th>
                    <th className="text-left py-2">6s</th>
                    <th className="text-left py-2">TO</th>
                    <th className="text-left py-2">TR</th>
                  </tr>
                </thead>
                <tbody>
                  {batsmen.map((batsman) => (
                    <tr key={batsman.playerId} className="border-b border-gray-100">
                      <td className="py-2">
                        <div className="flex items-center space-x-1">
                          <input type="checkbox" className="mr-1" />
                          <input
                            type="radio"
                            name="selectedStriker"
                            checked={selectedStriker === batsman.playerId}
                            onChange={() => setSelectedStriker(batsman.playerId)}
                          />
                        </div>
                      </td>
                      <td className="py-2 font-medium">{batsman.playerName}</td>
                      <td className="py-2">{batsman.runs}</td>
                      <td className="py-2">{batsman.balls}</td>
                      <td className="py-2">{batsman.fours}</td>
                      <td className="py-2">{batsman.sixes}</td>
                      <td className="py-2">-</td>
                      <td className="py-2">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex space-x-2 mt-4">
              <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm">
                Submit
              </button>
              <button className="flex-1 px-3 py-2 bg-gray-600 text-white rounded text-sm">
                cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 