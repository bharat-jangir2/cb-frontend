import React from 'react';
import { useInnings } from '../../hooks/useInnings';
import { InningsStatus, InningsResult } from '../../types/innings';
import { inningsService } from '../../services/innings.service';
import { toast } from 'react-hot-toast';

interface InningsTestComponentProps {
  matchId: string;
}

export const InningsTestComponent: React.FC<InningsTestComponentProps> = ({ matchId }) => {
  const {
    innings,
    selectedInnings,
    selectedInningsNumber,
    partnerships,
    playerStats,
    isLoading,
    inningsError,
    selectedInningsError,
    partnershipsError,
    playerStatsError,
    startInnings,
    pauseInnings,
    resumeInnings,
    endInnings,
    declareInnings,
    updateInnings,
    updateCurrentPlayers,
    createInnings,
    isStarting,
    isPausing,
    isResuming,
    isEnding,
    isDeclaring,
    isUpdating,
    isUpdatingPlayers,
    isCreating,
    getInningsByNumber,
    getCurrentInnings,
    getCompletedInnings,
    getPendingInnings,
    getNextInningsNumber,
  } = useInnings(matchId);

  const handleStartInnings = (inningsNumber: number) => {
    startInnings({ inningsNumber });
  };

  const handlePauseInnings = (inningsNumber: number) => {
    pauseInnings({ inningsNumber });
  };

  const handleResumeInnings = (inningsNumber: number) => {
    resumeInnings({ inningsNumber });
  };

  const handleEndInnings = (inningsNumber: number, result: InningsResult) => {
    endInnings({ 
      inningsNumber, 
      result, 
      resultDescription: `Test end: ${result}` 
    });
  };

  const handleDeclareInnings = (inningsNumber: number) => {
    declareInnings({ 
      inningsNumber, 
      resultDescription: 'Test declaration' 
    });
  };

  const handleUpdateInnings = (inningsNumber: number) => {
    updateInnings({
      inningsNumber,
      updateData: {
        runs: 150,
        wickets: 5,
        overs: 15.2,
        extras: 8,
        boundaries: 12,
        sixes: 3,
        runRate: 9.78,
      }
    });
  };

  const handleUpdatePlayers = (inningsNumber: number) => {
    updateCurrentPlayers({
      inningsNumber,
      players: {
        striker: 'player1',
        nonStriker: 'player2',
        bowler: 'player3'
      }
    });
  };

  // Manual API test functions
  const testGetAllInnings = async () => {
    try {
      console.log('Testing getAllInnings...');
      const result = await inningsService.getAllInnings(matchId);
      console.log('getAllInnings result:', result);
      toast.success('getAllInnings successful');
    } catch (error) {
      console.error('getAllInnings error:', error);
      toast.error('getAllInnings failed');
    }
  };

  const testCreateInnings = async () => {
    try {
      console.log('Testing createInnings...');
      const nextInningsNumber = getNextInningsNumber();
      // Alternate batting and bowling teams for each innings
      const isEvenInnings = nextInningsNumber % 2 === 0;
      const result = await inningsService.createInnings(matchId, {
        inningsNumber: nextInningsNumber,
        battingTeam: isEvenInnings ? "68a4bb50e5dbb94da94b9991" : "68a4bb42e5dbb94da94b9989", // Alternate teams
        bowlingTeam: isEvenInnings ? "68a4bb42e5dbb94da94b9989" : "68a4bb50e5dbb94da94b9991", // Alternate teams
        status: InningsStatus.NOT_STARTED,
      });
      console.log('createInnings result:', result);
      toast.success('createInnings successful');
    } catch (error) {
      console.error('createInnings error:', error);
      toast.error('createInnings failed');
    }
  };

  const testStartInnings = async () => {
    try {
      console.log('Testing startInnings...');
      const result = await inningsService.startInnings(matchId, 1);
      console.log('startInnings result:', result);
      toast.success('startInnings successful');
    } catch (error) {
      console.error('startInnings error:', error);
      toast.error('startInnings failed');
    }
  };

  const testPauseInnings = async () => {
    try {
      console.log('Testing pauseInnings...');
      const result = await inningsService.pauseInnings(matchId, 1);
      console.log('pauseInnings result:', result);
      toast.success('pauseInnings successful');
    } catch (error) {
      console.error('pauseInnings error:', error);
      toast.error('pauseInnings failed');
    }
  };

  const testResumeInnings = async () => {
    try {
      console.log('Testing resumeInnings...');
      const result = await inningsService.resumeInnings(matchId, 1);
      console.log('resumeInnings result:', result);
      toast.success('resumeInnings successful');
    } catch (error) {
      console.error('resumeInnings error:', error);
      toast.error('resumeInnings failed');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Innings Test Component</h3>
        <p className="text-blue-700">Loading innings data...</p>
      </div>
    );
  }

  if (inningsError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Innings Test Component - Error</h3>
        <p className="text-red-700">Error loading innings: {inningsError.message}</p>
        <div className="mt-4">
          <button
            onClick={testGetAllInnings}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Test API Call
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Innings Test Component</h3>
      
      {/* API Test Section */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-3">API Test Controls</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={testGetAllInnings}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Test GetAllInnings
          </button>
          <button
            onClick={testCreateInnings}
            disabled={isCreating}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isCreating ? 'Creating...' : 'Test CreateInnings'}
          </button>
                     <button
             onClick={testStartInnings}
             className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
           >
             Test StartInnings
           </button>
           <button
             onClick={testPauseInnings}
             className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
           >
             Test PauseInnings
           </button>
           <button
             onClick={testResumeInnings}
             className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
           >
             Test ResumeInnings
           </button>
        </div>
      </div>
      
      {/* Status Information */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Status</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Innings:</span> {innings.length}
          </div>
          <div>
            <span className="font-medium">Selected Innings:</span> {selectedInningsNumber}
          </div>
          <div>
            <span className="font-medium">Selected Innings Status:</span> {selectedInnings?.status || 'None'}
          </div>
          <div>
            <span className="font-medium">Completed Innings:</span> {getCompletedInnings().length}
          </div>
        </div>
      </div>

      {/* Innings List */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">All Innings</h4>
        <div className="space-y-2">
          {innings.map((inning) => (
            <div key={inning.inningsNumber} className="p-3 bg-white border border-gray-200 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">Innings {inning.inningsNumber}</span>
                  <span className="ml-2 text-sm text-gray-600">
                    {inning.battingTeam?.name || 'Unknown'} vs {inning.bowlingTeam?.name || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    inning.status === InningsStatus.IN_PROGRESS 
                      ? 'bg-green-100 text-green-800'
                      : inning.status === InningsStatus.COMPLETED
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {inning.status}
                  </span>
                  <span className="text-sm">
                    {inning.runs || 0}/{inning.wickets || 0} ({inning.overs || 0} overs)
                  </span>
                </div>
              </div>
            </div>
          ))}
          {innings.length === 0 && (
            <div className="p-3 bg-gray-100 border border-gray-200 rounded text-center text-gray-500">
              No innings found. Try creating one using the API test controls above.
            </div>
          )}
        </div>
      </div>

      {/* Test Controls */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Test Controls</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Innings 1</h5>
            <div className="space-y-2">
                             <button
                 onClick={() => handleStartInnings(1)}
                 disabled={isStarting}
                 className="w-full px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
               >
                 {isStarting ? 'Starting...' : 'Start Innings 1'}
               </button>
               <button
                 onClick={() => handlePauseInnings(1)}
                 disabled={isPausing}
                 className="w-full px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:bg-gray-400"
               >
                 {isPausing ? 'Pausing...' : 'Pause Innings 1'}
               </button>
               <button
                 onClick={() => handleResumeInnings(1)}
                 disabled={isResuming}
                 className="w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
               >
                 {isResuming ? 'Resuming...' : 'Resume Innings 1'}
               </button>
               <button
                 onClick={() => handleEndInnings(1, InningsResult.ALL_OUT)}
                 disabled={isEnding}
                 className="w-full px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
               >
                 {isEnding ? 'Ending...' : 'End Innings 1'}
               </button>
              <button
                onClick={() => handleUpdateInnings(1)}
                disabled={isUpdating}
                className="w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isUpdating ? 'Updating...' : 'Update Innings 1'}
              </button>
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Innings 2</h5>
            <div className="space-y-2">
                             <button
                 onClick={() => handleStartInnings(2)}
                 disabled={isStarting}
                 className="w-full px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-400"
               >
                 {isStarting ? 'Starting...' : 'Start Innings 2'}
               </button>
               <button
                 onClick={() => handlePauseInnings(2)}
                 disabled={isPausing}
                 className="w-full px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:bg-gray-400"
               >
                 {isPausing ? 'Pausing...' : 'Pause Innings 2'}
               </button>
               <button
                 onClick={() => handleResumeInnings(2)}
                 disabled={isResuming}
                 className="w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
               >
                 {isResuming ? 'Resuming...' : 'Resume Innings 2'}
               </button>
               <button
                 onClick={() => handleDeclareInnings(2)}
                 disabled={isDeclaring}
                 className="w-full px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-gray-400"
               >
                 {isDeclaring ? 'Declaring...' : 'Declare Innings 2'}
               </button>
              <button
                onClick={() => handleUpdatePlayers(2)}
                disabled={isUpdatingPlayers}
                className="w-full px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:bg-gray-400"
              >
                {isUpdatingPlayers ? 'Updating...' : 'Update Players'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Innings Details */}
      {selectedInnings && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Selected Innings Details</h4>
          <div className="p-3 bg-white border border-gray-200 rounded">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Runs:</span> {selectedInnings.runs || 0}
              </div>
              <div>
                <span className="font-medium">Wickets:</span> {selectedInnings.wickets || 0}
              </div>
              <div>
                <span className="font-medium">Overs:</span> {selectedInnings.overs || 0}
              </div>
              <div>
                <span className="font-medium">Run Rate:</span> {selectedInnings.runRate ? selectedInnings.runRate.toFixed(2) : '0.00'}
              </div>
              <div>
                <span className="font-medium">Extras:</span> {selectedInnings.extras || 0}
              </div>
              <div>
                <span className="font-medium">Boundaries:</span> {selectedInnings.boundaries || 0}
              </div>
            </div>
            
            {selectedInnings.currentPlayers && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2">Current Players</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Striker:</span> {selectedInnings.currentPlayers.striker?.fullName || 'Not set'}
                  </div>
                  <div>
                    <span className="font-medium">Non-Striker:</span> {selectedInnings.currentPlayers.nonStriker?.fullName || 'Not set'}
                  </div>
                  <div>
                    <span className="font-medium">Bowler:</span> {selectedInnings.currentPlayers.bowler?.fullName || 'Not set'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Display */}
      {(selectedInningsError || partnershipsError || playerStatsError) && (
        <div className="mb-4">
          <h4 className="font-medium text-red-800 mb-2">Errors</h4>
          <div className="space-y-2">
            {selectedInningsError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                Selected Innings Error: {selectedInningsError.message}
              </div>
            )}
            {partnershipsError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                Partnerships Error: {partnershipsError.message}
              </div>
            )}
            {playerStatsError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                Player Stats Error: {playerStatsError.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Debug Information */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Debug Information</h4>
        <div className="p-3 bg-white border border-gray-200 rounded text-xs">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({
              matchId,
              totalInnings: innings.length,
              selectedInningsNumber,
              selectedInningsStatus: selectedInnings?.status,
              partnershipsCount: partnerships.length,
              playerStatsCount: playerStats.length,
              isLoading,
              hasErrors: !!(inningsError || selectedInningsError || partnershipsError || playerStatsError)
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
