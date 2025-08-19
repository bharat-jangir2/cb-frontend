import React, { useState } from "react";
import { useLiveMatches } from "../../hooks";
import { LiveScoringPanel } from "./LiveScoringPanel";
import { MatchManagement } from "./MatchManagement";
import { PlayerStatsManagement } from "./PlayerStatsManagement";

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("live-scoring");
  const { data: liveMatches } = useLiveMatches();

  const tabs = [
    { id: "live-scoring", label: "Live Scoring", component: LiveScoringPanel },
    {
      id: "match-management",
      label: "Match Management",
      component: MatchManagement,
    },
    {
      id: "player-stats",
      label: "Player Stats",
      component: PlayerStatsManagement,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            {/* Live Matches Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                {liveMatches?.data?.length || 0} live matches
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};
