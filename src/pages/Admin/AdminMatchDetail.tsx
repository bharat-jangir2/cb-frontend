import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { Scorecard } from "../../components/scorecard/Scorecard";

const AdminMatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  console.log("🎯 AdminMatchDetail - Rendering with id:", id);
  console.log("🎯 AdminMatchDetail - User role:", user?.role);

  // This is admin-only, so always set isAdmin to true
  const isAdmin = true;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/matches")}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Matches
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Match Management
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href={`/admin/matches/${id}/scoring`}
                className="bg-cricket-green text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Live Scoring
              </a>
              <a
                href={`/admin/matches/${id}/squad`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Squad Management
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Scorecard Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Scorecard isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default AdminMatchDetail;
