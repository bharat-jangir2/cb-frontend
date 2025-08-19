import { FaUsers } from "react-icons/fa";

const Community = () => {
  return (
    <div className="space-y-6">
      <div className="card text-center py-12">
        <FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">
          Join discussions, polls, and quizzes with cricket fans.
        </p>
      </div>
    </div>
  );
};

export default Community;
