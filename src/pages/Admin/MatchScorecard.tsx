import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaChartBar,
  FaUsers,
  FaBatteryHalf,
  FaShieldAlt,
  FaExchangeAlt,
  FaHandPaper,
  FaCrown,
  FaUserTie,
  FaDownload,
  FaPrint,
  FaShare,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

interface PlayerScore {
  playerId: string;
  playerName: string;
  role: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalType?: string;
  bowlerId?: string;
  fielderId?: string;
  captain: boolean;
  viceCaptain: boolean;
  wicketKeeper: boolean;
}

interface BowlingStats {
  playerId: string;
  playerName: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  extras: number;
  wides: number;
  noBalls: number;
}

interface InningsData {
  inningsNumber: number;
  battingTeam: {
    _id: string;
    name: string;
    shortName: string;
  };
  bowlingTeam: {
    _id: string;
    name: string;
    shortName: string;
  };
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  runRate: number;
  extras: number;
  battingScores: PlayerScore[];
  bowlingStats: BowlingStats[];
}

const MatchScorecard: React.FC = () => {
  const { id: matchId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeInnings, setActiveInnings] = useState<number>(1);

  // Fetch match details
  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => adminApi.getMatch(matchId!),
    enabled: !!matchId,
  });

  const match = matchData?.data;

  // Mock innings data - replace with actual API call
  const [inningsData] = useState<InningsData[]>([
    {
      inningsNumber: 1,
      battingTeam: {
        _id: "team1",
        name: "India",
        shortName: "IND",
      },
      bowlingTeam: {
        _id: "team2",
        name: "Australia",
        shortName: "AUS",
      },
      totalRuns: 185,
      totalWickets: 8,
      totalOvers: 20,
      runRate: 9.25,
      extras: 12,
      battingScores: [
        {
          playerId: "player1",
          playerName: "Virat Kohli",
          role: "batsman",
          runs: 85,
          balls: 52,
          fours: 8,
          sixes: 2,
          strikeRate: 163.46,
          isOut: true,
          dismissalType: "caught",
          bowlerId: "bowler1",
          captain: true,
          viceCaptain: false,
          wicketKeeper: false,
        },
        {
          playerId: "player2",
          playerName: "Rohit Sharma",
          role: "batsman",
          runs: 45,
          balls: 32,
          fours: 4,
          sixes: 1,
          strikeRate: 140.63,
          isOut: true,
          dismissalType: "lbw",
          bowlerId: "bowler2",
          captain: false,
          viceCaptain: true,
          wicketKeeper: false,
        },
        {
          playerId: "player3",
          playerName: "MS Dhoni",
          role: "wicket-keeper",
          runs: 28,
          balls: 18,
          fours: 2,
          sixes: 1,
          strikeRate: 155.56,
          isOut: false,
          captain: false,
          viceCaptain: false,
          wicketKeeper: true,
        },
      ],
      bowlingStats: [
        {
          playerId: "bowler1",
          playerName: "Pat Cummins",
          overs: 4,
          maidens: 0,
          runs: 35,
          wickets: 3,
          economy: 8.75,
          extras: 2,
          wides: 1,
          noBalls: 1,
        },
        {
          playerId: "bowler2",
          playerName: "Mitchell Starc",
          overs: 4,
          maidens: 0,
          runs: 42,
          wickets: 2,
          economy: 10.5,
          extras: 3,
          wides: 2,
          noBalls: 1,
        },
      ],
    },
    {
      inningsNumber: 2,
      battingTeam: {
        _id: "team2",
        name: "Australia",
        shortName: "AUS",
      },
      bowlingTeam: {
        _id: "team1",
        name: "India",
        shortName: "IND",
      },
      totalRuns: 0,
      totalWickets: 0,
      totalOvers: 0,
      runRate: 0,
      extras: 0,
      battingScores: [],
      bowlingStats: [],
    },
  ]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "batsman":
        return <FaBatteryHalf className="text-blue-500" />;
      case "bowler":
        return <FaShieldAlt className="text-red-500" />;
      case "all-rounder":
        return <FaExchangeAlt className="text-green-500" />;
      case "wicket-keeper":
        return <FaHandPaper className="text-purple-500" />;
      default:
        return <FaUsers className="text-gray-500" />;
    }
  };

  const formatOver = (overs: number) => {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${fullOvers}.${balls}`;
  };

  if (matchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Match not found</p>
          </div>
        </div>
      </div>
    );
  }

  const currentInnings = inningsData.find(
    (innings) => innings.inningsNumber === activeInnings
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaChartBar className="mr-3 text-green-600" />
                  Match Scorecard
                </h1>
                <p className="text-gray-600 mt-2">
                  {match.name} - {match.venue}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <FaDownload className="mr-2" />
                Download
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center">
                <FaPrint className="mr-2" />
                Print
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                <FaShare className="mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Match Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="font-semibold text-lg">{match.teamAId.name}</div>
              <div className="text-2xl font-bold text-blue-600">
                {match.score?.teamA.runs || 0}/{match.score?.teamA.wickets || 0}
              </div>
              <div className="text-sm text-gray-600">
                {formatOver(match.score?.teamA.overs || 0)} overs
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">VS</div>
              <div className="text-xs text-gray-400">
                {match.matchType} • {match.overs} overs
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Status:{" "}
                <span className="font-semibold capitalize">
                  {match.status.replace("_", " ")}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">{match.teamBId.name}</div>
              <div className="text-2xl font-bold text-blue-600">
                {match.score?.teamB.runs || 0}/{match.score?.teamB.wickets || 0}
              </div>
              <div className="text-sm text-gray-600">
                {formatOver(match.score?.teamB.overs || 0)} overs
              </div>
            </div>
          </div>
        </div>

        {/* Innings Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {inningsData.map((innings) => (
                <button
                  key={innings.inningsNumber}
                  onClick={() => setActiveInnings(innings.inningsNumber)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeInnings === innings.inningsNumber
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {innings.battingTeam.shortName} Innings (
                  {innings.inningsNumber})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {currentInnings && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Batting Scorecard */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaBatteryHalf className="mr-2 text-blue-600" />
                  Batting - {currentInnings.battingTeam.name}
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  {currentInnings.totalRuns}/{currentInnings.totalWickets} (
                  {formatOver(currentInnings.totalOvers)} overs)
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batsman
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        R
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        B
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        4s
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        6s
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SR
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentInnings.battingScores.map((player, index) => (
                      <tr
                        key={player.playerId}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="flex items-center space-x-2">
                              {getRoleIcon(player.role)}
                              <span className="font-medium">
                                {player.playerName}
                              </span>
                              {player.captain && (
                                <FaCrown
                                  className="text-yellow-500 text-xs"
                                  title="Captain"
                                />
                              )}
                              {player.viceCaptain && (
                                <FaUserTie
                                  className="text-blue-500 text-xs"
                                  title="Vice Captain"
                                />
                              )}
                              {player.wicketKeeper && (
                                <FaHandPaper
                                  className="text-purple-500 text-xs"
                                  title="Wicket Keeper"
                                />
                              )}
                            </div>
                            {player.isOut && (
                              <div className="ml-2 text-xs text-gray-500">
                                {player.dismissalType}{" "}
                                {player.bowlerId && `b ${player.bowlerId}`}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">
                          {player.runs}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {player.balls}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {player.fours}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {player.sixes}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {player.strikeRate.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bowling Scorecard */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaShieldAlt className="mr-2 text-red-600" />
                  Bowling - {currentInnings.bowlingTeam.name}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bowler
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        O
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        M
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        R
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        W
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ECO
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentInnings.bowlingStats.map((bowler, index) => (
                      <tr
                        key={bowler.playerId}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <FaShieldAlt className="mr-2 text-red-500" />
                            <span className="font-medium">
                              {bowler.playerName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {formatOver(bowler.overs)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {bowler.maidens}
                        </td>
                        <td className="px-4 py-3 text-center">{bowler.runs}</td>
                        <td className="px-4 py-3 text-center font-medium">
                          {bowler.wickets}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {bowler.economy.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Extras Summary */}
        {currentInnings && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Extras</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {currentInnings.extras}
                </div>
                <div className="text-sm text-gray-600">Total Extras</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {currentInnings.bowlingStats.reduce(
                    (sum, bowler) => sum + bowler.wides,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">Wides</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {currentInnings.bowlingStats.reduce(
                    (sum, bowler) => sum + bowler.noBalls,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600">No Balls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {currentInnings.extras -
                    currentInnings.bowlingStats.reduce(
                      (sum, bowler) => sum + bowler.wides + bowler.noBalls,
                      0
                    )}
                </div>
                <div className="text-sm text-gray-600">Byes/Leg Byes</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchScorecard;
