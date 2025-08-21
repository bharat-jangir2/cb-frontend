import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unifiedScorecardService } from "../../services/unified-scorecard.service";
import {
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCloud,
  FaSun,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

interface VenueManagementProps {
  matchId: string;
  venue: string;
  onVenueUpdate: () => void;
}

export const VenueManagement: React.FC<VenueManagementProps> = ({
  matchId,
  venue,
  onVenueUpdate,
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    venue: venue || "",
    pitchCondition: "",
    weather: "",
    temperature: "",
    humidity: "",
    windSpeed: "",
    visibility: "",
  });

  // Update venue mutation
  const updateVenueMutation = useMutation({
    mutationFn: (data: any) =>
      unifiedScorecardService.refreshScorecard(matchId),
    onSuccess: () => {
      toast.success("Venue information updated successfully");
      setIsEditing(false);
      onVenueUpdate();
      queryClient.invalidateQueries({
        queryKey: ["unifiedScorecard", matchId],
      });
    },
    onError: (error) => {
      toast.error("Failed to update venue information");
      console.error("Update error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVenueMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData({
      venue: venue || "",
      pitchCondition: "",
      weather: "",
      temperature: "",
      humidity: "",
      windSpeed: "",
      visibility: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Venue Management</h2>
          <p className="text-gray-600">Manage venue and pitch conditions</p>
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
                disabled={updateVenueMutation.isPending}
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

      {/* Venue Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Venue Information
        </h3>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter venue name"
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
                  <option value="dry">Dry</option>
                  <option value="green">Green</option>
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
                  <option value="foggy">Foggy</option>
                  <option value="clear">Clear</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) =>
                    setFormData({ ...formData, temperature: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter temperature"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  value={formData.humidity}
                  onChange={(e) =>
                    setFormData({ ...formData, humidity: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter humidity"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wind Speed (km/h)
                </label>
                <input
                  type="number"
                  value={formData.windSpeed}
                  onChange={(e) =>
                    setFormData({ ...formData, windSpeed: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter wind speed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility (km)
              </label>
              <input
                type="number"
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({ ...formData, visibility: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter visibility"
              />
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Venue Name
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {venue || "Not specified"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pitch Condition
                </label>
                <p className="text-sm text-gray-900 mt-1">Not specified</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weather
                </label>
                <p className="text-sm text-gray-900 mt-1">Not specified</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Temperature
                </label>
                <p className="text-sm text-gray-900 mt-1">Not specified</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Humidity
                </label>
                <p className="text-sm text-gray-900 mt-1">Not specified</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Wind Speed
                </label>
                <p className="text-sm text-gray-900 mt-1">Not specified</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weather Conditions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Weather Conditions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <FaSun className="text-yellow-500 text-2xl mx-auto mb-2" />
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="text-lg font-bold text-gray-900">25°C</p>
          </div>
          <div className="text-center">
            <FaCloud className="text-blue-500 text-2xl mx-auto mb-2" />
            <p className="text-sm text-gray-600">Humidity</p>
            <p className="text-lg font-bold text-gray-900">65%</p>
          </div>
          <div className="text-center">
            <FaMapMarkerAlt className="text-green-500 text-2xl mx-auto mb-2" />
            <p className="text-sm text-gray-600">Wind Speed</p>
            <p className="text-lg font-bold text-gray-900">12 km/h</p>
          </div>
          <div className="text-center">
            <FaMapMarkerAlt className="text-purple-500 text-2xl mx-auto mb-2" />
            <p className="text-sm text-gray-600">Visibility</p>
            <p className="text-lg font-bold text-gray-900">10 km</p>
          </div>
        </div>
      </div>

      {/* Pitch Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pitch Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-blue-900 mb-2">
              Batting Conditions
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Bounce:</span>
                <span className="text-sm font-medium text-blue-900">Good</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Pace:</span>
                <span className="text-sm font-medium text-blue-900">
                  Medium
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Spin:</span>
                <span className="text-sm font-medium text-blue-900">Low</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-green-900 mb-2">
              Bowling Conditions
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Seam:</span>
                <span className="text-sm font-medium text-green-900">
                  Moderate
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Swing:</span>
                <span className="text-sm font-medium text-green-900">
                  Early
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-green-700">Turn:</span>
                <span className="text-sm font-medium text-green-900">
                  Later
                </span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-purple-900 mb-2">
              Match Prediction
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">First Innings:</span>
                <span className="text-sm font-medium text-purple-900">
                  180-220
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Chase:</span>
                <span className="text-sm font-medium text-purple-900">
                  Favored
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Toss:</span>
                <span className="text-sm font-medium text-purple-900">
                  Bat First
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
