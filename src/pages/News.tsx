import { FaNewspaper } from "react-icons/fa";

const News = () => {
  return (
    <div className="space-y-6">
      <div className="card text-center py-12">
        <FaNewspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cricket News</h1>
        <p className="text-gray-600">
          Latest cricket news, analysis, and updates will be displayed here.
        </p>
      </div>
    </div>
  );
};

export default News;
