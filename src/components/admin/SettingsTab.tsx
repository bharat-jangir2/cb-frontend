import React, { useState } from "react";
import {
  FaCog, FaEdit, FaSave, FaTimes, FaBell, FaVolumeUp,
  FaDownload, FaPrint, FaEye, FaEyeSlash, FaGlobe, FaClock,
  FaInfoCircle, FaChild, FaDatabase, FaWifi, FaCheckCircle
} from "react-icons/fa";

interface SettingsTabProps {
  matchId: string;
  match?: any;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ matchId, match }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    notifications: true,
    soundAlerts: false,
    showLiveScore: true,
    showCommentary: true,
    showStats: true,
    theme: 'light',
    language: 'en',
    timezone: 'UTC+5:30',
    exportFormat: 'pdf',
    printScorecard: true,
    printStats: false
  });

  const handleSave = () => {
    // Here you would typically save to the backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSettingChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaCog className="mr-2" />
          General Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                 <FaClock className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Auto Refresh</div>
                  <div className="text-sm text-gray-600">Automatically refresh match data</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={(e) => handleSettingChange('autoRefresh', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Interval (seconds)</label>
              <select
                value={settings.refreshInterval}
                onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaBell className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Notifications</div>
                  <div className="text-sm text-gray-600">Show match notifications</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaVolumeUp className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Sound Alerts</div>
                  <div className="text-sm text-gray-600">Play sound for important events</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundAlerts}
                  onChange={(e) => handleSettingChange('soundAlerts', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaEye className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Show Live Score</div>
                  <div className="text-sm text-gray-600">Display live score updates</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showLiveScore}
                  onChange={(e) => handleSettingChange('showLiveScore', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaInfoCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Show Commentary</div>
                  <div className="text-sm text-gray-600">Display ball-by-ball commentary</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showCommentary}
                  onChange={(e) => handleSettingChange('showCommentary', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                 <FaChild className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Show Statistics</div>
                  <div className="text-sm text-gray-600">Display detailed match statistics</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showStats}
                  onChange={(e) => handleSettingChange('showStats', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaEye className="mr-2" />
          Display Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="ur">Urdu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="UTC+5:30">IST (UTC+5:30)</option>
              <option value="UTC+0">GMT (UTC+0)</option>
              <option value="UTC-5">EST (UTC-5)</option>
              <option value="UTC+1">CET (UTC+1)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaDownload className="mr-2" />
          Export Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <select
                value={settings.exportFormat}
                onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaPrint className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Print Scorecard</div>
                  <div className="text-sm text-gray-600">Include scorecard in exports</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.printScorecard}
                  onChange={(e) => handleSettingChange('printScorecard', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                                 <FaChild className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Print Statistics</div>
                  <div className="text-sm text-gray-600">Include detailed statistics</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.printStats}
                  onChange={(e) => handleSettingChange('printStats', e.target.checked)}
                  disabled={!isEditing}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <button
              disabled={!isEditing}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FaDownload className="h-4 w-4" />
              <span>Export Current Data</span>
            </button>
            <button
              disabled={!isEditing}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <FaPrint className="h-4 w-4" />
              <span>Print Scorecard</span>
            </button>
            <button
              disabled={!isEditing}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                             <FaChild className="h-4 w-4" />
              <span>Export Statistics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Match Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaInfoCircle className="mr-2" />
          Match Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Match ID:</span>
              <span className="font-medium">{matchId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Match Name:</span>
              <span className="font-medium">{match?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Venue:</span>
              <span className="font-medium">{match?.venue || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Match Type:</span>
              <span className="font-medium">{match?.matchType || 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Overs:</span>
              <span className="font-medium">{match?.overs || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium">{match?.status || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Innings:</span>
              <span className="font-medium">{match?.currentInnings || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active:</span>
              <span className="font-medium">{match?.isActive ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaDatabase className="mr-2" />
          System Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data Source:</span>
              <span className="font-medium">Live API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Connection:</span>
              <div className="flex items-center space-x-2">
                <FaWifi className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sync Status:</span>
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-600">Synced</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cache Status:</span>
              <span className="font-medium text-blue-600">Enabled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaCog className="mr-2" />
            Settings Actions
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaEdit className="h-4 w-4" />
              <span>Edit Settings</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FaSave className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <FaTimes className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab; 