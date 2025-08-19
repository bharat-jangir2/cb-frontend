import { FaChartBar } from "react-icons/fa";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="card text-center py-12">
        <FaChartBar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Player statistics, team performance, and detailed analytics.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
