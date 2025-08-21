import React from "react";
import { useParams } from "react-router-dom";
import { Scorecard } from "../../components/scorecard/Scorecard";

const Scoring: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();

  if (!matchId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">Match ID is required</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Live Match Scoring
              </h1>
              <p className="mt-2 text-gray-600">
                Manage live match scoring, commentary, and scorecard data
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back
              </button>
              <button
                onClick={() =>
                  (window.location.href = `/admin/matches/${matchId}/squad`)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Manage Squad
              </button>
            </div>
          </div>
        </div>

        <Scorecard isAdmin={true} />
      </div>
    </div>
  );
};

export default Scoring;
