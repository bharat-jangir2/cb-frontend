import React from "react";
import { FaCrown } from "react-icons/fa";

interface ScoreboardProps {
  teamA: {
    name: string;
    shortName: string;
    runs: number;
    wickets: number;
    overs: number;
    isBatting?: boolean;
  };
  teamB: {
    name: string;
    shortName: string;
    runs: number;
    wickets: number;
    overs: number;
    isBatting?: boolean;
  };
  currentRR?: number;
  requiredRR?: number;
  target?: number;
  remainingRuns?: number;
  remainingBalls?: number;
  lastBall?: number;
  status: "live" | "completed" | "scheduled";
}

const Scoreboard: React.FC<ScoreboardProps> = ({
  teamA,
  teamB,
  currentRR = 0,
  requiredRR = 0,
  target = 0,
  remainingRuns = 0,
  remainingBalls = 0,
  lastBall = 0,
  status,
}) => {
  const battingTeam = teamA.isBatting ? teamA : teamB;
  const bowlingTeam = teamA.isBatting ? teamB : teamA;

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-4 sm:p-6 rounded-lg">
      <div className="flex items-center justify-between">
        {/* Left - Team Score */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-xs sm:text-sm font-medium">
              {battingTeam.shortName}
            </span>
            {battingTeam.isBatting && (
              <FaCrown className="text-yellow-400 text-xs sm:text-sm" />
            )}
          </div>
          <div className="text-lg sm:text-2xl font-bold text-yellow-400">
            {battingTeam.runs}-{battingTeam.wickets}
          </div>
          <div className="text-xs sm:text-sm text-blue-200">
            {battingTeam.overs} overs
          </div>
        </div>

        {/* Center - Last Ball */}
        <div className="text-center flex-1">
          <div className="text-3xl sm:text-5xl font-bold text-yellow-400">
            {status === "live" ? lastBall : "-"}
          </div>
        </div>

        {/* Right - Match Stats */}
        <div className="text-right flex-1">
          <div className="text-xs sm:text-sm space-y-1">
            <div className="text-yellow-300 font-semibold">
              CRR: {currentRR.toFixed(2)}
            </div>
            {status === "live" && target > 0 && (
              <div className="text-yellow-300 font-semibold">
                RRR: {requiredRR.toFixed(2)}
              </div>
            )}
          </div>
          <div className="text-xs sm:text-sm text-blue-200 mt-1">
            {status === "live" && target > 0 ? (
              <>
                {battingTeam.shortName} need {remainingRuns} runs in{" "}
                {remainingBalls} balls
              </>
            ) : status === "completed" ? (
              <>
                {battingTeam.shortName} {battingTeam.runs}/{battingTeam.wickets}
              </>
            ) : (
              <>
                {teamA.shortName} vs {teamB.shortName}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Target Info */}
      {status === "live" && target > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-700/50">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-blue-200">Target</div>
            <div className="text-lg sm:text-xl font-bold text-yellow-400">
              {target}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;
