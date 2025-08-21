import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCrown,
  FaTrophy,
  FaCalendar,
  FaUsers,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const AdminSeries = () => {
  const navigate = useNavigate();
  const [selectedSeries, setSelectedSeries] = useState(null);

  const mockSeries = [
    {
      id: 1,
      name: "ICC Cricket World Cup 2023",
      type: "ODI",
      status: "completed",
      teams: ["India", "Australia", "England", "Pakistan"],
      startDate: "2023-10-05",
      endDate: "2023-11-19",
      totalMatches: 48,
      completedMatches: 48,
    },
    {
      id: 2,
      name: "T20 World Cup 2024",
      type: "T20",
      status: "upcoming",
      teams: ["India", "Australia", "England", "Pakistan", "South Africa"],
      startDate: "2024-06-01",
      endDate: "2024-06-29",
      totalMatches: 55,
      completedMatches: 0,
    },
    {
      id: 3,
      name: "Border-Gavaskar Trophy 2024-25",
      type: "Test",
      status: "ongoing",
      teams: ["India", "Australia"],
      startDate: "2024-12-01",
      endDate: "2025-01-15",
      totalMatches: 5,
      completedMatches: 2,
    },
  ];

  const handleEditSeries = (series) => {
    setSelectedSeries(series);
    // Navigate to edit page or open modal
    console.log("Edit series:", series);
  };

  const handleDeleteSeries = (seriesId) => {
    if (window.confirm("Are you sure you want to delete this series?")) {
      console.log("Delete series:", seriesId);
    }
  };

  const handleCreateSeries = () => {
    navigate("/admin/series/create");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin")}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Series Management
              </h1>
            </div>
            <button
              onClick={handleCreateSeries}
              className="bg-cricket-green text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <FaPlus className="text-sm" />
              <span>Create Series</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Series
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockSeries.length}
                </p>
              </div>
              <FaTrophy className="text-yellow-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Series
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {mockSeries.filter((s) => s.status === "ongoing").length}
                </p>
              </div>
              <FaCalendar className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {mockSeries.filter((s) => s.status === "completed").length}
                </p>
              </div>
              <FaCrown className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-orange-600">
                  {mockSeries.filter((s) => s.status === "upcoming").length}
                </p>
              </div>
              <FaUsers className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Series List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Series</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Series Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teams
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matches
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockSeries.map((series) => (
                  <tr key={series.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {series.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          series.type === "T20"
                            ? "bg-purple-100 text-purple-800"
                            : series.type === "ODI"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {series.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          series.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : series.status === "ongoing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {series.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {series.teams.length} teams
                      </div>
                      <div className="text-xs text-gray-500">
                        {series.teams.slice(0, 2).join(", ")}
                        {series.teams.length > 2 &&
                          ` +${series.teams.length - 2} more`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {series.completedMatches}/{series.totalMatches}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(
                          (series.completedMatches / series.totalMatches) * 100
                        )}
                        % complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(series.startDate).toLocaleDateString()} -{" "}
                      {new Date(series.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditSeries(series)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteSeries(series.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/series/${series.id}`)}
                          className="text-green-600 hover:text-green-900"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSeries;
