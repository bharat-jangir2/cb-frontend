import React from "react";

interface ScorecardProps {
  match: any;
  innings: any[];
}

export const Scorecard: React.FC<ScorecardProps> = ({ match, innings }) => {
  const currentInnings = innings?.find(
    (inning) => inning.inningsNumber === match?.currentInnings
  );

  const formatOver = (overs: number) => {
    const fullOvers = Math.floor(overs);
    const balls = Math.round((overs - fullOvers) * 10);
    return `${fullOvers}.${balls}`;
  };

  return (
    <div className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {innings?.map((inning) => (
            <div key={inning.inningsNumber} className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {inning.battingTeam?.name || `Team ${inning.inningsNumber}`}
              </div>

              <div className="text-4xl font-bold text-green-600 mb-2">
                {inning.runs}/{inning.wickets}
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div>Overs: {formatOver(inning.overs)}</div>
                <div>Run Rate: {inning.runRate?.toFixed(2)}</div>
                {inning.requiredRunRate > 0 && (
                  <div>Required RR: {inning.requiredRunRate?.toFixed(2)}</div>
                )}
              </div>

              {/* Power Play Info */}
              {inning.currentPowerPlay?.isActive && (
                <div className="mt-3 p-2 bg-yellow-100 rounded-md">
                  <div className="text-xs font-medium text-yellow-800">
                    Power Play Active
                  </div>
                  <div className="text-xs text-yellow-600">
                    Over {inning.currentPowerPlay.startOver}-
                    {inning.currentPowerPlay.endOver}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Players */}
        {currentInnings && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-500">Striker</div>
                <div className="font-medium">
                  {currentInnings.currentPlayers?.striker?.name || "Not Set"}
                </div>
                {currentInnings.currentPlayers?.striker && (
                  <div className="text-xs text-gray-600">
                    {currentInnings.currentPlayers.striker.runs} (
                    {currentInnings.currentPlayers.striker.balls})
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500">Non-Striker</div>
                <div className="font-medium">
                  {currentInnings.currentPlayers?.nonStriker?.name || "Not Set"}
                </div>
                {currentInnings.currentPlayers?.nonStriker && (
                  <div className="text-xs text-gray-600">
                    {currentInnings.currentPlayers.nonStriker.runs} (
                    {currentInnings.currentPlayers.nonStriker.balls})
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-500">Bowler</div>
                <div className="font-medium">
                  {currentInnings.currentPlayers?.bowler?.name || "Not Set"}
                </div>
                {currentInnings.currentPlayers?.bowler && (
                  <div className="text-xs text-gray-600">
                    {currentInnings.currentPlayers.bowler.wickets}/
                    {currentInnings.currentPlayers.bowler.runs}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
