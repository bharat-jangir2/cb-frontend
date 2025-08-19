import { FaTrophy } from "react-icons/fa";

const Tournaments = () => {
  return (
    <div className="space-y-6">
      <div className="card text-center py-12">
        <FaTrophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tournaments</h1>
        <p className="text-gray-600">
          Browse tournaments, series, and championship information.
        </p>
      </div>
    </div>
  );
};

export default Tournaments;
