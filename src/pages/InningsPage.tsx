import React from 'react';
import { useParams } from 'react-router-dom';
import { InningsManagement } from '../components/innings/InningsManagement';

const InningsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Match Not Found</h2>
          <p className="text-gray-600">The requested match could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InningsManagement matchId={id} isAdmin={false} />
      </div>
    </div>
  );
};

export default InningsPage;
