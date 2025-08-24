import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaArrowLeft, FaBolt, FaCog, FaChartBar, FaEye } from 'react-icons/fa';
import { EnhancedPowerplayManagement } from '../../components/admin/EnhancedPowerplayManagement';
import { usePowerplay } from '../../hooks/usePowerplay';
import { adminApi } from '../../services/admin';

type TabType = 'status' | 'config' | 'control' | 'stats';

const PowerplayManagement: React.FC = () => {
  const { id: matchId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch match data for display
  const { data: matchData, isLoading: matchLoading } = useQuery({
    queryKey: ['match', matchId],
    queryFn: () => adminApi.getMatch(matchId!),
    enabled: !!matchId,
  });

  // Powerplay hook
  const {
    currentPowerplay,
    powerplays,
    currentOver,
    isLoading: powerplayLoading,
  } = usePowerplay(matchId!);

  if (matchLoading || powerplayLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading powerplay management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Powerplay Management
                </h1>
                <p className="text-sm text-gray-500">
                  {matchData?.name || 'Match'} • {matchData?.venue || 'Venue'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Current Over: {currentOver || 0}
                </div>
                <div className="text-xs text-gray-500">
                  {currentPowerplay?.isActive ? 'Powerplay Active' : 'No Active Powerplay'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <EnhancedPowerplayManagement 
            matchId={matchId!}
            currentInnings={matchData?.currentInnings || 1}
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaBolt className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Powerplays</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {powerplays.filter(p => p.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCog className="w-5 h-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Powerplays</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {powerplays.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaChartBar className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Over</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {currentOver || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PowerplayManagement;
