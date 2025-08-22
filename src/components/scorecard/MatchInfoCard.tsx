import React from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaTrophy,
} from "react-icons/fa";

interface MatchInfoCardProps {
  venue: string;
  date: string;
  time: string;
  series: string;
  format: string;
  toss: {
    winner: string;
    decision: string;
  };
  umpires: string[];
  matchReferee?: string;
  className?: string;
}

const MatchInfoCard: React.FC<MatchInfoCardProps> = ({
  venue,
  date,
  time,
  series,
  format,
  toss,
  umpires,
  matchReferee,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 ${className}`}
    >
      <div className="flex items-center space-x-2 mb-3 sm:mb-4">
        <FaTrophy className="text-blue-600" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          Match Information
        </h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Series & Format */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-xs sm:text-sm font-medium text-blue-900 mb-1">
            {series}
          </div>
          <div className="text-xs text-blue-700">{format}</div>
        </div>

        {/* Venue & Date */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-medium text-gray-900">
                Venue
              </div>
              <div className="text-xs sm:text-sm text-gray-600">{venue}</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <FaCalendarAlt className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-medium text-gray-900">
                Date & Time
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">{time}</div>
            </div>
          </div>
        </div>

        {/* Toss */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
            Toss
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {toss.winner} won the toss and chose to {toss.decision}
          </div>
        </div>

        {/* Officials */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <FaUserTie className="text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-medium text-gray-900">
                Umpires
              </div>
              <div className="space-y-1">
                {umpires.map((umpire, index) => (
                  <div key={index} className="text-xs sm:text-sm text-gray-600">
                    {umpire}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {matchReferee && (
            <div className="flex items-start space-x-3">
              <FaUserTie className="text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-medium text-gray-900">
                  Match Referee
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {matchReferee}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Weather & Pitch */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs sm:text-sm font-medium text-green-900 mb-1">
              Weather
            </div>
            <div className="text-xs sm:text-sm text-green-700">Sunny, 28°C</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-xs sm:text-sm font-medium text-yellow-900 mb-1">
              Pitch
            </div>
            <div className="text-xs sm:text-sm text-yellow-700">
              Batting friendly
            </div>
          </div>
        </div>

        {/* Match Status */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-xs sm:text-sm font-medium text-blue-900 mb-1">
            Match Status
          </div>
          <div className="text-xs sm:text-sm text-blue-700">
            Live - In Progress
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchInfoCard;
