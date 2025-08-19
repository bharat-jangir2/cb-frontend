import React from "react";
import { usePartnerships } from "../../hooks";

interface PartnershipsProps {
  matchId: string;
  partnerships?: any;
}

export const Partnerships: React.FC<PartnershipsProps> = ({
  matchId,
  partnerships: initialPartnerships,
}) => {
  const { data: partnerships = initialPartnerships || [] } =
    usePartnerships(matchId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Partnerships</h3>

      <div className="space-y-3">
        {partnerships.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No partnerships recorded yet
          </div>
        ) : (
          partnerships.slice(0, 5).map((partnership: any, index: number) => (
            <div key={index} className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm font-medium text-gray-900">
                  {partnership.player1.name} & {partnership.player2.name}
                </div>
                <div className="text-sm font-bold text-green-600">
                  {partnership.partnershipRuns} runs
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-600">
                <div>
                  {partnership.player1.name}: {partnership.player1.runs} runs
                </div>
                <div>
                  {partnership.player2.name}: {partnership.player2.runs} runs
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                <div>{partnership.partnershipBalls} balls</div>
                <div>Wicket {partnership.wicketNumber}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
