import { FaCrown } from "react-icons/fa";

const Premium = () => {
  return (
    <div className="space-y-6">
      <div className="card text-center py-12">
        <FaCrown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Premium Features
        </h1>
        <p className="text-gray-600">
          Upgrade to premium for exclusive features and content.
        </p>
      </div>
    </div>
  );
};

export default Premium;
