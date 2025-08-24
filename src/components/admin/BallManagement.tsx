import React, { useState } from 'react';
import { useBall } from '../../hooks/useBall';
import { BallStatus, BallResult, BallType } from '../../types/ball';
import { toast } from 'react-hot-toast';
import {
  FaPlay,
  FaPause,
  FaCheck,
  FaTimes,
  FaUndo,
  FaRedo,
  FaBolt,
  FaClock,
  
  FaRunning,
  FaStop,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEdit,
  FaTrash,
  FaRocket
} from 'react-icons/fa';

interface BallManagementProps {
  matchId: string;
  inningsNumber: number;
  isAdmin?: boolean;
}

export const BallManagement: React.FC<BallManagementProps> = ({
  matchId,
  inningsNumber,
  isAdmin = false
}) => {
  const {
    currentBall,
    currentOverBalls,
    overSummary,
    isBallInProgress,
    isLoading,
    isStarting,
    isConfirming,
    isQuickScoring,
    isUndoing,
    startBall,
    confirmBall,
    quickBallResult,
    undoLastBall,
    getBallStatus,
    getBallResult,
    isOverComplete,
    getNextBallNumber,
    getCurrentOverNumber
  } = useBall(matchId, inningsNumber);

  const [showBallConfirmation, setShowBallConfirmation] = useState(false);
  const [selectedResult, setSelectedResult] = useState<BallResult | null>(null);
  const [runsScored, setRunsScored] = useState(0);
  const [showExtras, setShowExtras] = useState(false);
  const [extras, setExtras] = useState({
    wides: 0,
    noBalls: 0,
    byes: 0,
    legByes: 0,
    penalties: 0
  });

  const handleStartBall = () => {
    if (!currentBall) {
      const overNumber = getCurrentOverNumber();
      const ballNumber = getNextBallNumber();
      startBall(overNumber, ballNumber);
    }
  };

  const handleQuickResult = (result: BallResult, runs: number = 0) => {
    if (!currentBall) return;
    
    quickBallResult(currentBall.overNumber, currentBall.ballNumber, result, runs);
  };

  const handleConfirmBall = () => {
    if (!currentBall || !selectedResult) return;

    const confirmation = {
      ballId: `${matchId}-${inningsNumber}-${currentBall.overNumber}-${currentBall.ballNumber}`,
      result: selectedResult,
      runsScored: runsScored + extras.wides + extras.noBalls + extras.byes + extras.legByes + extras.penalties,
      extras: showExtras ? extras : undefined,
      confirmedBy: 'scorer'
    };

    confirmBall(currentBall.overNumber, currentBall.ballNumber, confirmation);
    setShowBallConfirmation(false);
    setSelectedResult(null);
    setRunsScored(0);
    setExtras({ wides: 0, noBalls: 0, byes: 0, legByes: 0, penalties: 0 });
  };

  const getResultColor = (result: BallResult) => {
    switch (result) {
      case BallResult.DOT_BALL:
        return 'bg-gray-100 text-gray-800';
      case BallResult.SINGLE:
      case BallResult.DOUBLE:
      case BallResult.TRIPLE:
        return 'bg-blue-100 text-blue-800';
      case BallResult.FOUR:
        return 'bg-green-100 text-green-800';
      case BallResult.SIX:
        return 'bg-purple-100 text-purple-800';
      case BallResult.WICKET:
      case BallResult.BOWLED:
      case BallResult.CAUGHT:
      case BallResult.LBW:
      case BallResult.RUN_OUT:
      case BallResult.STUMPED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getResultIcon = (result: BallResult) => {
    switch (result) {
      case BallResult.DOT_BALL:
        return <FaStop className="w-4 h-4" />;
      case BallResult.SINGLE:
      case BallResult.DOUBLE:
      case BallResult.TRIPLE:
        return <FaRunning className="w-4 h-4" />;
      case BallResult.FOUR:
        return <FaRocket className="w-4 h-4" />;
      case BallResult.SIX:
        return <FaBolt className="w-4 h-4" />;
      case BallResult.WICKET:
      case BallResult.BOWLED:
      case BallResult.CAUGHT:
      case BallResult.LBW:
      case BallResult.RUN_OUT:
      case BallResult.STUMPED:
        return <FaTimes className="w-4 h-4" />;
      default:
        return <FaInfoCircle className="w-4 h-4" />;
    }
  };

  const quickResults = [
    { result: BallResult.DOT_BALL, label: '0', runs: 0, color: 'bg-gray-500' },
    { result: BallResult.SINGLE, label: '1', runs: 1, color: 'bg-blue-500' },
    { result: BallResult.DOUBLE, label: '2', runs: 2, color: 'bg-blue-600' },
    { result: BallResult.TRIPLE, label: '3', runs: 3, color: 'bg-blue-700' },
    { result: BallResult.FOUR, label: '4', runs: 4, color: 'bg-green-500' },
    { result: BallResult.SIX, label: '6', runs: 6, color: 'bg-purple-500' },
    { result: BallResult.WICKET, label: 'W', runs: 0, color: 'bg-red-500' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading ball data...</span>
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
              <FaRocket className="mr-3 text-blue-600" />
              Ball Management
            </h2>
            <p className="text-gray-600 mt-1">
              Live ball-by-ball scoring and updates
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Current Over</div>
              <div className="text-lg font-semibold text-blue-600">
                {getCurrentOverNumber()}.{getNextBallNumber() - 1}
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={undoLastBall}
                disabled={isUndoing}
                className="flex items-center px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                <FaUndo className="mr-1" />
                {isUndoing ? 'Undoing...' : 'Undo'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Current Ball Status */}
      {currentBall && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl font-semibold text-blue-800">
                Ball {currentBall.ballNumber} in Progress
              </h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Over {currentBall.overNumber}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-600">
                Started at {new Date(currentBall.startTime).toLocaleTimeString()}
              </div>
              {currentBall.isPowerplay && (
                <div className="text-xs text-orange-600 flex items-center">
                  <FaBolt className="mr-1" />
                  Powerplay Active
                </div>
              )}
            </div>
          </div>

          {/* Quick Scoring Buttons */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {quickResults.map((quick) => (
              <button
                key={quick.result}
                onClick={() => handleQuickResult(quick.result, quick.runs)}
                disabled={isQuickScoring}
                className={`p-3 rounded-lg text-white font-bold text-lg hover:opacity-80 disabled:opacity-50 ${quick.color}`}
              >
                {quick.label}
              </button>
            ))}
          </div>

          {/* Manual Confirmation */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowBallConfirmation(true)}
              disabled={isConfirming}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              <FaEdit className="mr-2" />
              {isConfirming ? 'Confirming...' : 'Manual Confirmation'}
            </button>
          </div>
        </div>
      )}

      {/* Start Ball Button */}
      {!currentBall && !isOverComplete() && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ready for Next Ball
            </h3>
            <button
              onClick={handleStartBall}
              disabled={isStarting}
              className="flex items-center mx-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              <FaPlay className="mr-2" />
              {isStarting ? 'Starting Ball...' : 'Start Ball'}
            </button>
          </div>
        </div>
      )}

      {/* Over Complete */}
      {isOverComplete() && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Over {getCurrentOverNumber()} Complete
            </h3>
            <p className="text-green-600">
              Ready to start next over
            </p>
          </div>
        </div>
      )}

      {/* Current Over Balls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Over {getCurrentOverNumber()} - Ball History
        </h3>
        <div className="grid grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((ballNumber) => {
            const ball = currentOverBalls.find(b => b.ballNumber === ballNumber);
            const status = getBallStatus(ballNumber);
            const result = getBallResult(ballNumber);
            
            return (
              <div
                key={ballNumber}
                className={`p-4 rounded-lg border-2 text-center ${
                  ballNumber === currentBall?.ballNumber
                    ? 'border-blue-500 bg-blue-50'
                    : ball
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="text-sm font-medium text-gray-600 mb-1">
                  Ball {ballNumber}
                </div>
                {ball ? (
                  <div className="space-y-1">
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getResultColor(result || BallResult.DOT_BALL)}`}>
                      {getResultIcon(result || BallResult.DOT_BALL)}
                      <span className="ml-1">{result?.replace('_', ' ') || 'Pending'}</span>
                    </div>
                    {ball.runsScored > 0 && (
                      <div className="text-lg font-bold text-gray-900">
                        {ball.runsScored}
                      </div>
                    )}
                    {ball.wicket && (
                      <div className="text-xs text-red-600">
                        Wicket
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    Pending
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Over Summary */}
      {overSummary && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Over {overSummary.overNumber} Summary
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{overSummary.totalRuns}</div>
              <div className="text-sm text-gray-600">Total Runs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{overSummary.totalWickets}</div>
              <div className="text-sm text-gray-600">Wickets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{overSummary.totalExtras}</div>
              <div className="text-sm text-gray-600">Extras</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{overSummary.runRate.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Run Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Ball Confirmation Modal */}
      {showBallConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Ball Result</h3>
            
            {/* Result Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ball Result
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(BallResult).map((result) => (
                  <button
                    key={result}
                    onClick={() => setSelectedResult(result)}
                    className={`p-2 rounded text-sm font-medium ${
                      selectedResult === result
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {result.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Runs Scored */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Runs Scored
              </label>
              <input
                type="number"
                min="0"
                value={runsScored}
                onChange={(e) => setRunsScored(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Extras Toggle */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showExtras}
                  onChange={(e) => setShowExtras(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Include Extras</span>
              </label>
            </div>

            {/* Extras Input */}
            {showExtras && (
              <div className="mb-4 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Wides"
                    value={extras.wides}
                    onChange={(e) => setExtras({ ...extras, wides: Number(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="No Balls"
                    value={extras.noBalls}
                    onChange={(e) => setExtras({ ...extras, noBalls: Number(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Byes"
                    value={extras.byes}
                    onChange={(e) => setExtras({ ...extras, byes: Number(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Leg Byes"
                    value={extras.legByes}
                    onChange={(e) => setExtras({ ...extras, legByes: Number(e.target.value) })}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmBall}
                disabled={!selectedResult || isConfirming}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {isConfirming ? 'Confirming...' : 'Confirm'}
              </button>
              <button
                onClick={() => setShowBallConfirmation(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
