import React from "react";
import { useParams } from "react-router-dom";
import { FaChartBar, FaArrowLeft } from "react-icons/fa";
import { useMatchWithData } from "../../hooks";
import { PlayerStats } from "../../components/matches/PlayerStats";
import { Partnerships } from "../../components/matches/Partnerships";

const MatchStats: React.FC = () => {
  const { id } = useParams();
  const { match, isLoading, error } = useMatchWithData(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">
            Error loading match statistics
          </div>
          <div className="text-gray-600">{error.message}</div>
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
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FaChartBar className="mr-3 text-purple-600" />
                  Match Statistics
                </h1>
                <p className="text-gray-600 mt-2">
                  {match?.name} - Detailed Statistics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PlayerStats matchId={id || ""} />
          <Partnerships matchId={id || ""} />
        </div>
      </div>
    </div>
  );
};

export default MatchStats;
