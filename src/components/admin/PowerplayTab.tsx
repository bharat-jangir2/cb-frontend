import React, { useState } from 'react';
import { FaCog, FaChartBar, FaBolt, FaEye } from 'react-icons/fa';
import { usePowerplay } from '../../hooks/usePowerplay';
import { PowerplayConfigPanel } from './PowerplayConfigPanel';
import { PowerplayStatusDisplay } from './PowerplayStatusDisplay';
import { PowerplayControlPanel } from './PowerplayControlPanel';
import { PowerplayStatsPanel } from './PowerplayStatsPanel';
import { type PowerplayData, type PowerplayUpdateData } from '../../types/powerplay';

interface PowerplayTabProps {
  matchId: string;
  currentInnings: number;
}

type TabType = 'status' | 'config' | 'control' | 'stats';

export const PowerplayTab: React.FC<PowerplayTabProps> = ({
  matchId,
  currentInnings,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('status');
  
  const {
    currentPowerplay,
    powerplays,
    currentOver,
    isLoading,
    createPowerplay,
    updatePowerplay,
    deletePowerplay,
    activatePowerplay,
    deactivatePowerplay,
    updateCurrentOver,
    isCreating,
    isUpdating,
    isDeleting,
    isActivating,
    isDeactivating,
  } = usePowerplay(matchId);

  const handleCreatePowerplay = (data: PowerplayData) => {
    createPowerplay(data);
  };

  const handleUpdatePowerplay = (index: number, data: Partial<PowerplayData>) => {
    updatePowerplay({ index, data: data as PowerplayUpdateData });
  };

  const handleDeletePowerplay = (index: number) => {
    deletePowerplay(index);
  };

  const handleActivatePowerplay = (index: number) => {
    activatePowerplay(index);
  };

  const handleDeactivatePowerplay = () => {
    deactivatePowerplay();
  };

  const handleUpdateOver = (over: number) => {
    updateCurrentOver(over);
  };

  const tabs = [
    {
      id: 'status' as TabType,
      label: 'Status',
      icon: FaEye,
      description: 'Current powerplay status and overview',
    },
    {
      id: 'config' as TabType,
      label: 'Configuration',
      icon: FaCog,
      description: 'Configure powerplays for the match',
    },
    {
      id: 'control' as TabType,
      label: 'Controls',
      icon: FaBolt,
      description: 'Manual powerplay controls and overrides',
    },
    {
      id: 'stats' as TabType,
      label: 'Statistics',
      icon: FaChartBar,
      description: 'Powerplay statistics and analytics',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <PowerplayStatusDisplay
            currentPowerplay={currentPowerplay || null}
            powerplays={powerplays}
            currentOver={currentOver}
          />
        );
      case 'config':
        return (
          <PowerplayConfigPanel
            matchId={matchId}
            currentInnings={currentInnings}
            powerplays={powerplays}
            onCreatePowerplay={handleCreatePowerplay}
            onUpdatePowerplay={handleUpdatePowerplay}
            onDeletePowerplay={handleDeletePowerplay}
            isLoading={isCreating || isUpdating || isDeleting}
          />
        );
      case 'control':
        return (
          <PowerplayControlPanel
            matchId={matchId}
            powerplays={powerplays}
            currentPowerplay={currentPowerplay}
            onActivatePowerplay={handleActivatePowerplay}
            onDeactivatePowerplay={handleDeactivatePowerplay}
            onUpdateCurrentOver={handleUpdateOver}
            currentOver={currentOver}
            isLoading={isActivating || isDeactivating}
          />
        );
      case 'stats':
        return (
          <PowerplayStatsPanel
            powerplays={powerplays}
            currentInnings={currentInnings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Powerplay tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Tab Description */}
        <div className="px-6 py-3 bg-gray-50">
          <p className="text-sm text-gray-600">
            {tabs.find(tab => tab.id === activeTab)?.description}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading powerplay data...</span>
          </div>
        </div>
      )}

      {/* Tab Content */}
      {!isLoading && (
        <div className="animate-fadeIn">
          {renderTabContent()}
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Current Over:</span> {currentOver}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Active Powerplays:</span> {powerplays.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Total Powerplays:</span> {powerplays.length}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentPowerplay?.isActive && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Powerplay Active</span>
              </div>
            )}
            
            <button
              onClick={() => setActiveTab('status')}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
            >
              View Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
