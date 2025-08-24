import React from 'react';
import { PowerplayTab } from '../components/admin/PowerplayTab';

const TestPowerplay: React.FC = () => {
  // Use a sample match ID - replace with an actual match ID from your database
  const sampleMatchId = '68a4bca3e5dbb94da94b99c1';

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Powerplay Management Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Testing PowerplayTab Component
          </h2>
          
          <PowerplayTab 
            matchId={sampleMatchId}
            currentInnings={1}
          />
        </div>
      </div>
    </div>
  );
};

export default TestPowerplay;

