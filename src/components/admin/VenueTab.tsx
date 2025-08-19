import React, { useState } from "react";
import {
  FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaThermometerHalf,
  FaTint, FaWind, FaSun, FaCloud, FaBuilding, FaUsers,
  FaRuler, FaLightbulb, FaInfoCircle
} from "react-icons/fa";

interface VenueTabProps {
  matchId: string;
  match?: any;
}

const VenueTab: React.FC<VenueTabProps> = ({ matchId, match }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [venueInfo, setVenueInfo] = useState({
    name: "Eden Gardens",
    city: "Kolkata",
    country: "India",
    capacity: 68000,
    established: 1864,
    surface: "Grass",
    dimensions: "174m x 149m",
    floodlights: true,
    description: "One of the most iconic cricket stadiums in the world, known for its passionate crowd and rich history."
  });

  const handleSave = () => {
    // Here you would typically save to the backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setVenueInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Venue Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            Venue Information
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaEdit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FaSave className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <FaTimes className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={venueInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg">{venueInfo.name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={venueInfo.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg">{venueInfo.city}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              {isEditing ? (
                <input
                  type="text"
                  value={venueInfo.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg">{venueInfo.country}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              {isEditing ? (
                <input
                  type="number"
                  value={venueInfo.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg">{venueInfo.capacity.toLocaleString()}</div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established</label>
              {isEditing ? (
                <input
                  type="number"
                  value={venueInfo.established}
                  onChange={(e) => handleInputChange('established', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg">{venueInfo.established}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surface Type</label>
              {isEditing ? (
                <select
                  value={venueInfo.surface}
                  onChange={(e) => handleInputChange('surface', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Grass">Grass</option>
                  <option value="Clay">Clay</option>
                  <option value="Synthetic">Synthetic</option>
                  <option value="Mixed">Mixed</option>
                </select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg">{venueInfo.surface}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Boundary Dimensions</label>
              {isEditing ? (
                <input
                  type="text"
                  value={venueInfo.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg">{venueInfo.dimensions}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Floodlights</label>
              {isEditing ? (
                <select
                  value={venueInfo.floodlights ? 'true' : 'false'}
                  onChange={(e) => handleInputChange('floodlights', e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg flex items-center">
                  {venueInfo.floodlights ? (
                    <>
                      <FaLightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                      <span>Available</span>
                    </>
                  ) : (
                    <>
                      <FaSun className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Not Available</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          {isEditing ? (
            <textarea
              value={venueInfo.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ) : (
            <div className="px-3 py-2 bg-gray-50 rounded-lg">{venueInfo.description}</div>
          )}
        </div>
      </div>

      {/* Weather Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaThermometerHalf className="mr-2" />
          Weather Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FaThermometerHalf className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">28°C</div>
            <div className="text-sm text-gray-600">Temperature</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FaTint className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">65%</div>
            <div className="text-sm text-gray-600">Humidity</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <FaWind className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-600">12 km/h</div>
            <div className="text-sm text-gray-600">Wind Speed</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <FaSun className="h-5 w-5 text-yellow-500" />
            <span className="text-gray-700">Partly Cloudy</span>
          </div>
        </div>
      </div>

      {/* Pitch Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaInfoCircle className="mr-2" />
          Pitch Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pitch Type</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">Batting friendly</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Average Score</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">165-180 runs</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pitch Behavior</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">Good for batting, some assistance for spinners</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Boundary Dimensions</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">
                <div>Long: 74m</div>
                <div>Square: 65m</div>
                <div>Straight: 69m</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pitch Condition</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">Fresh wicket, good bounce</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Used</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg">3 days ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaBuilding className="mr-2" />
          Facilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <FaUsers className="h-5 w-5 text-green-600" />
            <span className="text-gray-700">VIP Boxes</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <FaBuilding className="h-5 w-5 text-blue-600" />
            <span className="text-gray-700">Media Center</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <FaRuler className="h-5 w-5 text-purple-600" />
            <span className="text-gray-700">Practice Nets</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <FaLightbulb className="h-5 w-5 text-yellow-600" />
            <span className="text-gray-700">Floodlights</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <FaThermometerHalf className="h-5 w-5 text-red-600" />
            <span className="text-gray-700">Air Conditioning</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
            <FaInfoCircle className="h-5 w-5 text-indigo-600" />
            <span className="text-gray-700">Information Desk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueTab; 