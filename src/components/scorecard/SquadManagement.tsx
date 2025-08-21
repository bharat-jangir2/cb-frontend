import React from "react";
import { FaUsers, FaCrown, FaUserTie } from "react-icons/fa";

interface SquadManagementProps {
  matchId: string;
}

export const SquadManagement: React.FC<SquadManagementProps> = ({
  matchId,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Squad Management</h2>
        <p className="text-gray-600">Manage team squads and playing XI</p>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <FaUsers className="text-blue-500 text-xl mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Squad Management
            </h3>
            <p className="text-blue-700">
              Squad management is handled in the dedicated Squad Management
              page. Please navigate to the admin panel to manage team squads and
              playing XI.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Team A Squad
            </h3>
            <FaUsers className="text-blue-500 text-xl" />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Manage Team A squad selection and playing XI
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Manage Squad
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Team B Squad
            </h3>
            <FaUsers className="text-green-500 text-xl" />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Manage Team B squad selection and playing XI
          </p>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
            Manage Squad
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Playing XI</h3>
            <FaCrown className="text-purple-500 text-xl" />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Set playing XI, captain, and vice-captain
          </p>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
            Set Playing XI
          </button>
        </div>
      </div>

      {/* Squad Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Current Squad Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-blue-900">Team A</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Squad Size:</span>
                <span className="text-sm font-medium text-gray-900">
                  18 players
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Playing XI:</span>
                <span className="text-sm font-medium text-gray-900">
                  11 selected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Captain:</span>
                <span className="text-sm font-medium text-gray-900">
                  Player Name
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Vice Captain:</span>
                <span className="text-sm font-medium text-gray-900">
                  Player Name
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-green-900">Team B</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Squad Size:</span>
                <span className="text-sm font-medium text-gray-900">
                  18 players
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Playing XI:</span>
                <span className="text-sm font-medium text-gray-900">
                  11 selected
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Captain:</span>
                <span className="text-sm font-medium text-gray-900">
                  Player Name
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Vice Captain:</span>
                <span className="text-sm font-medium text-gray-900">
                  Player Name
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Squad Rules */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Squad Management Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-md font-semibold text-gray-900">
              Squad Selection
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Maximum 18 players per team</li>
              <li>• Minimum 15 players per team</li>
              <li>• Must include wicket-keeper</li>
              <li>• Balance of batsmen and bowlers</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-md font-semibold text-gray-900">
              Playing XI Rules
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Exactly 11 players</li>
              <li>• Must select captain and vice-captain</li>
              <li>• Must include wicket-keeper</li>
              <li>• Set batting order</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
