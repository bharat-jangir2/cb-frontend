import { FaGamepad } from "react-icons/fa";

const Fantasy = () => {
  return (
    <div className="space-y-6">
      <div className="card text-center py-12">
        <FaGamepad className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Fantasy Cricket
        </h1>
        <p className="text-gray-600">
          Create your dream team and compete in fantasy cricket leagues.
        </p>
      </div>
    </div>
  );
};

export default Fantasy;
