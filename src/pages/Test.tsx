import React from "react";

const Test: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🏏 Cricket Live Score
        </h1>
        <p className="text-gray-600 mb-6">
          The app is working! This is a test page.
        </p>
        <div className="space-y-2">
          <div className="bg-green-100 text-green-800 p-3 rounded">
            ✅ Tailwind CSS is working
          </div>
          <div className="bg-blue-100 text-blue-800 p-3 rounded">
            ✅ React is working
          </div>
          <div className="bg-purple-100 text-purple-800 p-3 rounded">
            ✅ TypeScript is working
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
