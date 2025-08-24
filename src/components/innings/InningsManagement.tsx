import React, { useState } from 'react';
import {  FaEye, FaCog, FaUsers, FaChartBar, FaBolt, FaRocket, FaPlus } from 'react-icons/fa';
import { useInnings } from '../../hooks/useInnings';
import { InningsOverviewPanel } from './InningsOverviewPanel';
import { InningsDetailsPanel } from './InningsDetailsPanel';
import { InningsControlPanel } from './InningsControlPanel';
import { CurrentPlayersPanel } from './CurrentPlayersPanel';
import { InningsResult, InningsStatus } from '../../types/innings';
import { InningsTestComponent } from './InningsTestComponent';

interface InningsManagementProps {
  matchId: string;
  isAdmin?: boolean;
  teamAId?: string;
  teamBId?: string;
}

type TabType = 'overview' | 'details' | 'controls' | 'players' | 'statistics' | 'test';

export const InningsManagement: React.FC<InningsManagementProps> = ({
  matchId,
  isAdmin = false,
  teamAId = "68a4bb42e5dbb94da94b9989", // Default Team A ID (India)
  teamBId = "68a4bb50e5dbb94da94b9991", // Default Team B ID (Pakistan)
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const {
    innings,
    selectedInnings,
    selectedInningsNumber,
    partnerships,
    playerStats,
    isLoading,
    createInnings,
    startInnings,
    pauseInnings,
    resumeInnings,
    endInnings,
    declareInnings,
    updateInnings,
    updateCurrentPlayers,
    deleteInnings,
    setSelectedInningsNumber,
    getInningsByNumber,
    getCurrentInnings,
    getCompletedInnings,
    getPendingInnings,
    getInProgressInnings,
    getNextInningsNumber,
    isCreating,
    isStarting,
    isPausing,
    isResuming,
    isEnding,
    isDeclaring,
    isUpdating,
    isUpdatingPlayers,
    isDeleting,
  } = useInnings(matchId);

  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: FaEye,
      description: 'Innings overview and summary',
    },
    {
      id: 'details' as TabType,
      label: 'Details',
      icon: FaRocket,
      description: 'Detailed innings information',
    },
    {
      id: 'controls' as TabType,
      label: 'Controls',
      icon: FaCog,
      description: 'Innings management controls',
    },
    {
      id: 'players' as TabType,
      label: 'Players',
      icon: FaUsers,
      description: 'Current players management',
    },
    {
      id: 'statistics' as TabType,
      label: 'Statistics',
      icon: FaChartBar,
      description: 'Innings statistics and analytics',
    },
    {
      id: 'test' as TabType,
      label: 'Test',
      icon: FaBolt,
      description: 'Test component for debugging',
    },
  ];

  const handleInningsChange = (inningsNumber: number) => {
    setSelectedInningsNumber(inningsNumber);
  };

  const handleCreateInnings = () => {
    const nextInningsNumber = getNextInningsNumber();
    // Alternate batting and bowling teams for each innings
    const isEvenInnings = nextInningsNumber % 2 === 0;
    createInnings({
      inningsNumber: nextInningsNumber,
      battingTeam: isEvenInnings ? teamBId : teamAId,
      bowlingTeam: isEvenInnings ? teamAId : teamBId,
      status: InningsStatus.NOT_STARTED,
    });
  };

  const handleStartInnings = (inningsNumber: number) => {
    startInnings({ inningsNumber });
  };

  const handlePauseInnings = (inningsNumber: number) => {
    pauseInnings({ inningsNumber });
  };

  const handleResumeInnings = (inningsNumber: number) => {
    resumeInnings({ inningsNumber });
  };

  const handleEndInnings = (inningsNumber: number, result: InningsResult, description?: string) => {
    endInnings({ inningsNumber, result, resultDescription: description });
  };

  const handleDeclareInnings = (inningsNumber: number, description?: string) => {
    declareInnings({ inningsNumber, resultDescription: description });
  };

  const handleInningsUpdate = (updateData: any) => {
    if (selectedInnings) {
      updateInnings({ inningsNumber: selectedInnings.inningsNumber, updateData });
    }
  };

  const handlePlayerChange = (position: 'striker' | 'nonStriker' | 'bowler', playerId: string) => {
    if (selectedInnings) {
      updateCurrentPlayers({ 
        inningsNumber: selectedInnings.inningsNumber, 
        players: {
          striker: position === 'striker' ? playerId : selectedInnings.currentPlayers?.striker?._id || '',
          nonStriker: position === 'nonStriker' ? playerId : selectedInnings.currentPlayers?.nonStriker?._id || '',
          bowler: position === 'bowler' ? playerId : selectedInnings.currentPlayers?.bowler?._id || '',
        }
      });
    }
  };

  const handlePlayerSwap = (position1: 'striker' | 'nonStriker', position2: 'striker' | 'nonStriker') => {
    if (selectedInnings) {
      const currentPlayers = selectedInnings.currentPlayers;
      if (currentPlayers) {
        updateCurrentPlayers({
          inningsNumber: selectedInnings.inningsNumber,
          players: {
            striker: position1 === 'striker' ? currentPlayers.nonStriker._id : currentPlayers.striker._id,
            nonStriker: position1 === 'nonStriker' ? currentPlayers.striker._id : currentPlayers.nonStriker._id,
            bowler: currentPlayers.bowler._id,
          }
        });
      }
    }
  };

  const handleDeleteInnings = (inningsNumber: number) => {
    if (confirm(`Are you sure you want to delete Innings ${inningsNumber}? This action cannot be undone.`)) {
      deleteInnings(inningsNumber);
    }
  };

  // Mock available players - this would come from the match data
  const availablePlayers = [
    { _id: '1', fullName: 'Virat Kohli', shortName: 'VK' },
    { _id: '2', fullName: 'Rohit Sharma', shortName: 'RS' },
    { _id: '3', fullName: 'KL Rahul', shortName: 'KL' },
    { _id: '4', fullName: 'Jasprit Bumrah', shortName: 'JB' },
    { _id: '5', fullName: 'Mohammed Shami', shortName: 'MS' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading innings data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaRocket className="mr-3 text-indigo-600" />
              Innings Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage match innings, players, and statistics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Selected Innings</div>
              <div className="text-lg font-semibold text-indigo-600">
                {selectedInningsNumber || 'None'}
              </div>
            </div>
            {isAdmin && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCreateInnings}
                  disabled={isCreating}
                  className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  <FaPlus className="mr-1" />
                  {isCreating ? 'Creating...' : 'New Innings'}
                </button>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Admin Mode
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
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
        <div className="p-6">
          {activeTab === 'overview' && (
            <InningsOverviewPanel
              matchId={matchId}
              innings={innings}
              selectedInnings={selectedInnings || null}
              selectedInningsNumber={selectedInningsNumber}
              onInningsChange={handleInningsChange}
              onStartInnings={isAdmin ? handleStartInnings : undefined}
              onEndInnings={isAdmin ? handleEndInnings : undefined}
              onDeleteInnings={isAdmin ? handleDeleteInnings : undefined}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'details' && selectedInnings && (
            <InningsDetailsPanel
              innings={selectedInnings}
              onInningsUpdate={handleInningsUpdate}
              isAdmin={isAdmin}
            />
          )}

                     {activeTab === 'controls' && (
             <InningsControlPanel
               matchId={matchId}
               innings={selectedInnings || null}
               onInningsStarted={() => selectedInnings && handleStartInnings(selectedInnings.inningsNumber)}
               onInningsPaused={() => selectedInnings && handlePauseInnings(selectedInnings.inningsNumber)}
               onInningsResumed={() => selectedInnings && handleResumeInnings(selectedInnings.inningsNumber)}
               onInningsEnded={(result, description) => selectedInnings && handleEndInnings(selectedInnings.inningsNumber, result, description)}
               onInningsDeclared={(description) => selectedInnings && handleDeclareInnings(selectedInnings.inningsNumber, description)}
               isAdmin={isAdmin}
             />
           )}

          {activeTab === 'players' && selectedInnings && (
            <CurrentPlayersPanel
              innings={selectedInnings}
              availablePlayers={availablePlayers}
              onPlayerChange={handlePlayerChange}
              onPlayerSwap={handlePlayerSwap}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaChartBar className="mr-2 text-indigo-600" />
                  Innings Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{innings.length}</div>
                    <div className="text-sm text-gray-600">Total Innings</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {getInProgressInnings().length}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {getCompletedInnings().length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {partnerships.length}
                    </div>
                    <div className="text-sm text-gray-600">Partnerships</div>
                  </div>
                </div>
              </div>

              {/* Partnerships */}
              {partnerships.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Partnerships</h4>
                  <div className="space-y-3">
                    {partnerships.slice(0, 5).map((partnership, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">
                            {partnership.player1.fullName} & {partnership.player2.fullName}
                          </div>
                          <div className="text-sm text-gray-600">
                            Overs {partnership.startOver}-{partnership.endOver}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{partnership.runs}</div>
                          <div className="text-sm text-gray-600">runs</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Player Statistics */}
              {playerStats.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Top Performers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Batting */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Batting</h5>
                      <div className="space-y-2">
                        {playerStats
                          .sort((a, b) => b.battingStats.runs - a.battingStats.runs)
                          .slice(0, 3)
                          .map((player, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <div className="font-medium">{player.player.fullName}</div>
                                <div className="text-sm text-gray-600">
                                  {player.battingStats.runs} runs ({player.battingStats.balls} balls)
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{player.battingStats.strikeRate.toFixed(2)}</div>
                                <div className="text-sm text-gray-600">SR</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Bowling */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Bowling</h5>
                      <div className="space-y-2">
                        {playerStats
                          .sort((a, b) => b.bowlingStats.wickets - a.bowlingStats.wickets)
                          .slice(0, 3)
                          .map((player, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <div className="font-medium">{player.player.fullName}</div>
                                <div className="text-sm text-gray-600">
                                  {player.bowlingStats.wickets} wickets ({player.bowlingStats.overs} overs)
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{player.bowlingStats.economy.toFixed(2)}</div>
                                <div className="text-sm text-gray-600">Econ</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Test Tab */}
          {activeTab === 'test' && (
            <InningsTestComponent matchId={matchId} />
          )}
        </div>
      </div>
    </div>
  );
};
