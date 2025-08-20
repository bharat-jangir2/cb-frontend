import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  FaMapMarkerAlt,
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaUsers,
  FaCalendar,
  FaClock,
  FaThermometerHalf,
  FaCloud,
  FaWind,
  FaEye,
  FaCamera,
  FaInfoCircle,
  FaRocket,
  FaChartBar,
} from "react-icons/fa";
import { adminApi } from "../../services/admin";

interface VenueInfo {
  name: string;
  city: string;
  country: string;
  capacity: number;
  established: string;
  surface: string;
  dimensions: {
    length: number;
    width: number;
  };
  facilities: string[];
  description: string;
  image?: string;
}

interface WeatherInfo {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  visibility: number;
}

const MatchVenue: React.FC = () => {
  const { id: matchId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedVenue, setEditedVenue] = useState<Partial<VenueInfo>>({});

  // Fetch match details
  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => adminApi.getMatch(matchId!),
    enabled: !!matchId,
  });

  const match = matchData?.data;

  // Mock venue data - replace with actual API call
  const [venueInfo, setVenueInfo] = useState<VenueInfo>({
    name: "Melbourne Cricket Ground",
    city: "Melbourne",
    country: "Australia",
    capacity: 100024,
    established: "1853",
    surface: "Grass",
    dimensions: {
      length: 172.9,
      width: 147.8,
    },
    facilities: [
      "Floodlights",
      "Practice Nets",
      "Media Center",
      "VIP Boxes",
      "Restaurants",
      "Parking",
    ],
    description:
      "The Melbourne Cricket Ground (MCG) is Australia's largest stadium and one of the most iconic cricket venues in the world. It has hosted numerous international matches, including World Cup finals and Boxing Day Tests.",
  });

  // Mock weather data - replace with actual API call
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo>({
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    visibility: 10,
  });

  // Update venue mutation
  const updateVenueMutation = useMutation({
    mutationFn: (data: Partial<VenueInfo>) => {
      // Replace with actual API call
      return Promise.resolve(data);
    },
    onSuccess: (data) => {
      setVenueInfo({ ...venueInfo, ...data });
      setIsEditing(false);
      toast.success("Venue information updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update venue");
    },
  });

  const handleSave = () => {
    updateVenueMutation.mutate(editedVenue);
  };

  const handleCancel = () => {
    setEditedVenue({});
    setIsEditing(false);
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
                  <FaMapMarkerAlt className="mr-3 text-orange-600" />
                  Venue Information
                </h1>
                <p className="text-gray-600 mt-2">
                  {match.name} - {match.venue}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FaEdit className="mr-2" />
                  Edit Venue
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={updateVenueMutation.isPending}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:opacity-50"
                  >
                    <FaSave className="mr-2" />
                    {updateVenueMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Venue Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Venue Image */}
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <FaMapMarkerAlt className="mx-auto h-16 w-16 mb-4" />
                  <h2 className="text-2xl font-bold">{venueInfo.name}</h2>
                  <p className="text-orange-100">
                    {venueInfo.city}, {venueInfo.country}
                  </p>
                </div>
              </div>

              {/* Venue Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FaInfoCircle className="mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-semibold">
                          {venueInfo.capacity.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Established:</span>
                        <span className="font-semibold">
                          {venueInfo.established}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Surface:</span>
                        <span className="font-semibold">
                          {venueInfo.surface}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="font-semibold">
                          {venueInfo.dimensions.length}m ×{" "}
                          {venueInfo.dimensions.width}m
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FaUsers className="mr-2 text-green-600" />
                      Facilities
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {venueInfo.facilities.map((facility, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {facility}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {venueInfo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather and Match Info */}
          <div className="space-y-6">
            {/* Weather Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaCloud className="mr-2 text-blue-600" />
                Weather Conditions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-semibold flex items-center">
                    <FaThermometerHalf className="mr-1 text-red-500" />
                    {weatherInfo.temperature}°C
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Humidity:</span>
                  <span className="font-semibold">{weatherInfo.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Wind Speed:</span>
                  <span className="font-semibold flex items-center">
                    <FaWind className="mr-1 text-gray-500" />
                    {weatherInfo.windSpeed} km/h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Condition:</span>
                  <span className="font-semibold">{weatherInfo.condition}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Visibility:</span>
                  <span className="font-semibold">
                    {weatherInfo.visibility} km
                  </span>
                </div>
              </div>
            </div>

            {/* Match Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaCalendar className="mr-2 text-purple-600" />
                Match Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Match:</span>
                  <span className="font-semibold text-sm text-right">
                    {match.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-semibold text-sm text-right">
                    {match.venue}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-semibold text-sm text-right">
                    {match.matchType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Overs:</span>
                  <span className="font-semibold text-sm text-right">
                    {match.overs}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-sm text-right capitalize">
                    {match.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaEye className="mr-2 text-indigo-600" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/admin/matches/${matchId}/scoring`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <FaRocket className="mr-2" />
                  Live Scoring
                </button>
                <button
                  onClick={() => navigate(`/admin/matches/${matchId}/stats`)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                >
                  <FaChartBar className="mr-2" />
                  Match Stats
                </button>
                <button
                  onClick={() => navigate(`/admin/matches/${matchId}/squad`)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center"
                >
                  <FaUsers className="mr-2" />
                  Squad Management
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchVenue;
