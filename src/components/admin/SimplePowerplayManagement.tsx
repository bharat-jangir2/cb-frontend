import React, { useState } from 'react';
import { FaBolt, FaCog, FaChartBar, FaEye, FaPlus, FaEdit, FaTrash, FaPlay, FaStop } from 'react-icons/fa';
import { usePowerplay } from '../../hooks/usePowerplay';
import { PowerplayConfigPanel } from './PowerplayConfigPanel';
import { PowerplayStatusDisplay } from './PowerplayStatusDisplay';
import { PowerplayControlPanel } from './PowerplayControlPanel';
import { PowerplayStatsPanel } from './PowerplayStatsPanel';

interface SimplePowerplayManagementProps {
  matchId: string;
  currentInnings: number;
}

type TabType = 'status' | 'config' | 'control' | 'stats';

export const SimplePowerplayManagement: React.FC<SimplePowerplayManagementProps> = ({
  matchId,
  currentInnings,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('status');
  
  // Debug logging
  console.log('🔧 SimplePowerplayManagement - matchId:', matchId);
  console.log('🔧 SimplePowerplayManagement - currentInnings:', currentInnings);
  console.log('🔧 SimplePowerplayManagement - currentInnings type:', typeof currentInnings);
  
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
    matchWithPowerplays,
  } = usePowerplay(matchId);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Loading powerplay data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Match Status Warning */}
      {currentInnings <= 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Match Status Issue
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Current innings is not properly set. Please ensure the match is in progress and has a valid innings number.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{currentOver || 0}</div>
            <div className="text-sm text-gray-600">Current Over</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {powerplays.filter(p => p.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Powerplays</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{powerplays.length}</div>
            <div className="text-sm text-gray-600">Total Powerplays</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {currentPowerplay?.isActive ? 'Yes' : 'No'}
            </div>
            <div className="text-sm text-gray-600">Powerplay Active</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="text-sm" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'status' && (
          <PowerplayStatusDisplay
            currentPowerplay={currentPowerplay}
            powerplays={powerplays}
            currentOver={currentOver}
          />
        )}
        
        {activeTab === 'config' && (
          <PowerplayConfigPanel
            matchId={matchId}
            currentInnings={currentInnings}
            powerplays={powerplays}
            onCreatePowerplay={createPowerplay}
            onUpdatePowerplay={updatePowerplay}
            onDeletePowerplay={deletePowerplay}
            isCreating={isCreating}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
            matchStatus={matchWithPowerplays?.status}
          />
        )}
        
        {activeTab === 'control' && (
          <PowerplayControlPanel
            currentPowerplay={currentPowerplay}
            powerplays={powerplays}
            currentOver={currentOver}
            onActivatePowerplay={activatePowerplay}
            onDeactivatePowerplay={deactivatePowerplay}
            onUpdateCurrentOver={updateCurrentOver}
            isActivating={isActivating}
            isDeactivating={isDeactivating}
          />
        )}
        
        {activeTab === 'stats' && (
          <PowerplayStatsPanel
            powerplays={powerplays}
            currentPowerplay={currentPowerplay}
            currentOver={currentOver}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('config')}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Powerplay
          </button>
          
          {currentPowerplay?.isActive && (
            <button
              onClick={() => deactivatePowerplay()}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              disabled={isDeactivating}
            >
              <FaStop className="mr-2" />
              {isDeactivating ? 'Deactivating...' : 'Deactivate Powerplay'}
            </button>
          )}
          
          <button
            onClick={() => setActiveTab('control')}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <FaBolt className="mr-2" />
            Manual Control
          </button>
        </div>
      </div>
    </div>
  );
};

