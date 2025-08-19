import { Link } from "react-router-dom";
import type { Match } from "../../types/matches";
import { FaRocket, FaMapMarkerAlt, FaClock, FaEye } from "react-icons/fa";

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "LIVE";
      case "completed":
        return "COMPLETED";
      case "scheduled":
        return "UPCOMING";
      case "cancelled":
        return "CANCELLED";
      default:
        return status.toUpperCase();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link
      to={`/matches/${match.id}`}
      className="block card hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaRocket className="h-5 w-5 text-cricket-green" />
          <span className="text-sm font-medium text-gray-600">
            {match.format.toUpperCase()}
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            match.status
          )}`}
        >
          {getStatusText(match.status)}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {match.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                {match.team1.logo ? (
                  <img
                    src={match.team1.logo}
                    alt={match.team1.name}
                    className="w-8 h-8"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-600">
                    {match.team1.shortName}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-700">
                {match.team1.name}
              </p>
            </div>

            <div className="text-center">
              <span className="text-lg font-bold text-gray-400">VS</span>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                {match.team2.logo ? (
                  <img
                    src={match.team2.logo}
                    alt={match.team2.name}
                    className="w-8 h-8"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-600">
                    {match.team2.shortName}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-700">
                {match.team2.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <FaMapMarkerAlt className="h-4 w-4" />
            <span>{match.venue}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaClock className="h-4 w-4" />
            <span>{formatDate(match.date)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-cricket-green">
          <FaEye className="h-4 w-4" />
          <span>View Details</span>
        </div>
      </div>

      {match.result && (
        <div className="mt-3 p-2 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{match.result}</p>
        </div>
      )}
    </Link>
  );
};

export default MatchCard;
