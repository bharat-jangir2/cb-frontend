import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unifiedScorecardService } from "../../services/unified-scorecard.service";
import { FaCog, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface MatchManagementProps {
  matchId: string;
  match: any;
  onMatchUpdate: () => void;
}

export const MatchManagement: React.FC<MatchManagementProps> = ({
  matchId,
  match,
  onMatchUpdate,
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: match?.status || "scheduled",
    venue: match?.venue || "",
    pitchCondition: match?.pitchCondition || "",
    weather: match?.weather || "",
    result: match?.result || "",
  });

  // Update match mutation
  const updateMatchMutation = useMutation({
    mutationFn: (data: any) =>
      unifiedScorecardService.refreshScorecard(matchId),
    onSuccess: () => {
      toast.success("Match updated successfully");
      setIsEditing(false);
      onMatchUpdate();
      queryClient.invalidateQueries({
        queryKey: ["unifiedScorecard", matchId],
      });
    },
    onError: (error) => {
      toast.error("Failed to update match");
      console.error("Update error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMatchMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      status: match?.status || "scheduled",
      venue: match?.venue || "",
      pitchCondition: match?.pitchCondition || "",
      weather: match?.weather || "",
      result: match?.result || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Match Management</h2>
          <p className="text-gray-600">Manage match settings and status</p>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <FaEdit className="text-sm" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSubmit}
                disabled={updateMatchMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <FaSave className="text-sm" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <FaTimes className="text-sm" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Match Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Match Information
        </h3>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Match Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter venue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pitch Condition
                </label>
                <select
                  value={formData.pitchCondition}
                  onChange={(e) =>
                    setFormData({ ...formData, pitchCondition: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select condition</option>
                  <option value="batting_friendly">Batting Friendly</option>
                  <option value="bowling_friendly">Bowling Friendly</option>
                  <option value="neutral">Neutral</option>
                  <option value="spinning">Spinning</option>
                  <option value="seaming">Seaming</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weather
                </label>
                <select
                  value={formData.weather}
                  onChange={(e) =>
                    setFormData({ ...formData, weather: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select weather</option>
                  <option value="sunny">Sunny</option>
                  <option value="cloudy">Cloudy</option>
                  <option value="overcast">Overcast</option>
                  <option value="rainy">Rainy</option>
                  <option value="windy">Windy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Result
              </label>
              <textarea
                value={formData.result}
                onChange={(e) =>
                  setFormData({ ...formData, result: e.target.value })
                }
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter match result"
              />
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Match Status
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      match?.status === "in_progress"
                        ? "bg-green-100 text-green-800"
                        : match?.status === "completed"
                        ? "bg-gray-100 text-gray-800"
                        : match?.status === "abandoned"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {match?.status?.replace("_", " ").toUpperCase() ||
                      "SCHEDULED"}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venue
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {match?.venue || "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pitch Condition
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {match?.pitchCondition || "Not specified"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weather
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {match?.weather || "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Match Result
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {match?.result || "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Match Format
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {match?.format || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setFormData({ ...formData, status: "in_progress" });
              updateMatchMutation.mutate({
                ...formData,
                status: "in_progress",
              });
            }}
            disabled={
              match?.status === "in_progress" || updateMatchMutation.isPending
            }
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            Start Match
          </button>

          <button
            onClick={() => {
              setFormData({ ...formData, status: "completed" });
              updateMatchMutation.mutate({ ...formData, status: "completed" });
            }}
            disabled={
              match?.status === "completed" || updateMatchMutation.isPending
            }
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            End Match
          </button>

          <button
            onClick={() => {
              setFormData({ ...formData, status: "abandoned" });
              updateMatchMutation.mutate({ ...formData, status: "abandoned" });
            }}
            disabled={
              match?.status === "abandoned" || updateMatchMutation.isPending
            }
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            Abandon Match
          </button>
        </div>
      </div>

      {/* Match Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Match Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Overs</p>
            <p className="text-2xl font-bold text-blue-600">
              {match?.format === "T20" ? 20 : match?.format === "ODI" ? 50 : 90}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Power Plays</p>
            <p className="text-2xl font-bold text-green-600">
              {match?.format === "T20" ? 2 : match?.format === "ODI" ? 3 : 0}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">DRS Available</p>
            <p className="text-2xl font-bold text-purple-600">
              {match?.format === "TEST" ? "Unlimited" : "2 per innings"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Match Type</p>
            <p className="text-2xl font-bold text-orange-600">
              {match?.matchType || "Regular"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
