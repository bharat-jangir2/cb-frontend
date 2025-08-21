import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { matchesApi } from "../services/matches";
import { teamsApi } from "../services/teams";
import {
  FaRocket,
  FaPlay,
  FaClock,
  FaTrophy,
  FaUsers,
  FaChartBar,
  FaNewspaper,
  FaGamepad,
  FaCrown,
  FaSearch,
  FaFilter,
  FaHeart,
  FaEye,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";

const UserDashboard = () => {
  const navigate = useNavigate();

  const { data: liveMatches } = useQuery({
    queryKey: ["matches", "live"],
    queryFn: () => matchesApi.getLiveMatches(),
  });

  const { data: upcomingMatches } = useQuery({
    queryKey: ["matches", "upcoming"],
    queryFn: () => matchesApi.getMatches({ status: "scheduled" }),
  });

  // Debug logging
  console.log("🏠 UserDashboard - Live matches:", liveMatches);
  console.log("🏠 UserDashboard - Upcoming matches:", upcomingMatches);

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamsApi.getTeams(),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Mobile Responsive */}
      <div className="bg-gradient-to-r from-cricket-green via-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4">
              Cricket Live Score
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl text-green-100 mb-6 sm:mb-8 px-4">
              Your ultimate destination for live cricket scores, news, and
              fantasy games
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
              <button className="bg-white text-cricket-green px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base">
                Watch Live
              </button>
              <button className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-cricket-green transition-colors text-sm sm:text-base">
                Join Fantasy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Live Matches Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <FaPlay className="text-red-500 mr-2 sm:mr-3 h-5 w-5 sm:h-8 sm:w-8" />
              <span className="hidden sm:inline">Live Matches</span>
              <span className="sm:hidden">Live</span>
            </h2>
            <a
              href="/user/matches"
              className="text-cricket-green hover:text-green-600 font-semibold text-sm sm:text-base"
            >
              View All →
            </a>
          </div>

          {liveMatches && liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {liveMatches.map((match) => (
                <div
                  key={match._id}
                  onClick={() => {
                    console.log(
                      "🎯 UserDashboard - Clicking on live match:",
                      match
                    );
                    console.log("🎯 UserDashboard - Live Match ID:", match._id);
                    navigate(`/match/${match._id}`);
                  }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 sm:p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold">
                        LIVE
                      </span>
                      <span className="text-xs bg-red-700 px-2 py-1 rounded-full">
                        {match?.matchType?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 line-clamp-2">
                      {match?.teamAId?.name} vs {match?.teamBId?.name}
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {match?.teamAId?.name}
                        </span>
                        <span className="font-semibold text-sm sm:text-base truncate ml-2">
                          {match?.score?.teamA?.runs || 0}/
                          {match?.score?.teamA?.wickets || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {match?.teamBId?.name}
                        </span>
                        <span className="font-semibold text-sm sm:text-base truncate ml-2">
                          {match?.score?.teamB?.runs || 0}/
                          {match?.score?.teamB?.wickets || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Venue
                        </span>
                        <span className="text-xs sm:text-sm truncate ml-2">
                          {match?.venue}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(
                            "🎯 UserDashboard - Watch Live clicked for match:",
                            match._id
                          );
                          navigate(`/match/${match._id}`);
                        }}
                        className="block w-full bg-cricket-green text-white text-center py-2 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base"
                      >
                        Watch Live
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
              <FaPlay className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No Live Matches
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Check back later for exciting live cricket action!
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Matches */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <FaClock className="text-blue-500 mr-2 sm:mr-3 h-5 w-5 sm:h-8 sm:w-8" />
              <span className="hidden sm:inline">Upcoming Matches</span>
              <span className="sm:hidden">Upcoming</span>
            </h2>
            <a
              href="/user/matches"
              className="text-cricket-green hover:text-green-600 font-semibold text-sm sm:text-base"
            >
              View All →
            </a>
          </div>

          {upcomingMatches && upcomingMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {upcomingMatches.slice(0, 6).map((match) => (
                <div
                  key={match._id}
                  onClick={() => {
                    console.log(
                      "🎯 UserDashboard - Clicking on upcoming match:",
                      match
                    );
                    console.log(
                      "🎯 UserDashboard - Upcoming Match ID:",
                      match._id
                    );
                    navigate(`/match/${match._id}`);
                  }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 sm:p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-semibold">
                        UPCOMING
                      </span>
                      <span className="text-xs bg-blue-700 px-2 py-1 rounded-full">
                        {match?.matchType?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 line-clamp-2">
                      {match?.teamAId?.name} vs {match?.teamBId?.name}
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {match?.teamAId?.name}
                        </span>
                        <span className="font-semibold text-sm sm:text-base truncate ml-2">
                          vs
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {match?.teamBId?.name}
                        </span>
                        <span className="font-semibold text-sm sm:text-base truncate ml-2">
                          {match?.venue}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Date
                        </span>
                        <span className="text-xs sm:text-sm">
                          {new Date(match?.startTime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(
                            "🎯 UserDashboard - View Details clicked for match:",
                            match._id
                          );
                          navigate(`/match/${match._id}`);
                        }}
                        className="block w-full bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
              <FaClock className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No Upcoming Matches
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Stay tuned for upcoming cricket tournaments!
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats - Mobile Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <FaRocket className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-red-500 mb-2 sm:mb-3" />
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
              {liveMatches?.length || 0}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">Live Matches</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <FaTrophy className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 mb-2 sm:mb-3" />
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
              {teams?.length || 0}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">Teams</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <FaUsers className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mb-2 sm:mb-3" />
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
              1.2K
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">Active Users</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <FaGamepad className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-green-500 mb-2 sm:mb-3" />
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
              500+
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">Fantasy Leagues</p>
          </div>
        </div>

        {/* Features Grid - Mobile Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <FaNewspaper className="h-8 w-8 sm:h-12 sm:w-12 text-blue-500 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Latest News
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Stay updated with the latest cricket news, player interviews, and
              match analysis.
            </p>
            <a
              href="/user/news"
              className="text-cricket-green hover:text-green-600 font-semibold text-sm sm:text-base"
            >
              Read More →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <FaGamepad className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Fantasy Cricket
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Create your dream team, compete with friends, and win exciting
              prizes.
            </p>
            <a
              href="/user/fantasy"
              className="text-cricket-green hover:text-green-600 font-semibold text-sm sm:text-base"
            >
              Play Now →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <FaChartBar className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Deep dive into player statistics, team performance, and match
              predictions.
            </p>
            <a
              href="/user/analytics"
              className="text-cricket-green hover:text-green-600 font-semibold text-sm sm:text-base"
            >
              Explore →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <FaTrophy className="h-8 w-8 sm:h-12 sm:w-12 text-yellow-500 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Tournaments
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Follow major tournaments, series, and international cricket
              events.
            </p>
            <a
              href="/user/tournaments"
              className="text-cricket-green hover:text-green-600 font-semibold text-sm sm:text-base"
            >
              Browse →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <FaUsers className="h-8 w-8 sm:h-12 sm:w-12 text-indigo-500 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Community
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Join discussions, participate in polls, and connect with cricket
              fans.
            </p>
            <a
              href="/user/community"
              className="text-cricket-green hover:text-green-600 font-semibold text-sm sm:text-base"
            >
              Join →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
            <FaCrown className="h-8 w-8 sm:h-12 sm:w-12 text-orange-500 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              Premium
            </h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              Get exclusive content, advanced analytics, and premium features.
            </p>
            <a
              href="/user/premium"
              className="text-cricket-green hover:text-green-600 font-semibold text-sm sm:text-base"
            >
              Upgrade →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
