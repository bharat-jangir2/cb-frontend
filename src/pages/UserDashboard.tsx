import { useQuery } from "@tanstack/react-query";
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
} from "react-icons/fa";

const UserDashboard = () => {
  const { data: liveMatches } = useQuery({
    queryKey: ["matches", "live"],
    queryFn: () => matchesApi.getLiveMatches(),
  });

  const { data: upcomingMatches } = useQuery({
    queryKey: ["matches", "upcoming"],
    queryFn: () => matchesApi.getMatches({ status: "scheduled" }),
  });

  const { data: teams } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamsApi.getTeams(),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cricket-green via-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Cricket Live Score
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8">
              Your ultimate destination for live cricket scores, news, and
              fantasy games
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-cricket-green px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Watch Live
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-cricket-green transition-colors">
                Join Fantasy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Matches Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaPlay className="text-red-500 mr-3 h-8 w-8" />
              Live Matches
            </h2>
            <a
              href="/matches"
              className="text-cricket-green hover:text-green-600 font-semibold"
            >
              View All →
            </a>
          </div>

          {liveMatches && liveMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">LIVE</span>
                      <span className="text-xs bg-red-700 px-2 py-1 rounded-full">
                        {match.format.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {match.title}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Team 1</span>
                        <span className="font-semibold">
                          {match.team1.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Team 2</span>
                        <span className="font-semibold">
                          {match.team2.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Venue</span>
                        <span className="text-sm">{match.venue}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <a
                        href={`/matches/${match.id}`}
                        className="block w-full bg-cricket-green text-white text-center py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Watch Live
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaPlay className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Live Matches
              </h3>
              <p className="text-gray-600">
                Check back later for exciting live cricket action!
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Matches */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <FaClock className="text-blue-500 mr-3 h-8 w-8" />
              Upcoming Matches
            </h2>
            <a
              href="/matches"
              className="text-cricket-green hover:text-green-600 font-semibold"
            >
              View All →
            </a>
          </div>

          {upcomingMatches && upcomingMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMatches.slice(0, 6).map((match) => (
                <div
                  key={match.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">UPCOMING</span>
                      <span className="text-xs bg-blue-700 px-2 py-1 rounded-full">
                        {match.format.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {match.title}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Team 1</span>
                        <span className="font-semibold">
                          {match.team1.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Team 2</span>
                        <span className="font-semibold">
                          {match.team2.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Date</span>
                        <span className="text-sm">
                          {new Date(match.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <a
                        href={`/matches/${match.id}`}
                        className="block w-full bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaClock className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Upcoming Matches
              </h3>
              <p className="text-gray-600">
                Stay tuned for upcoming cricket tournaments!
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaRocket className="mx-auto h-8 w-8 text-red-500 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              {liveMatches?.length || 0}
            </h3>
            <p className="text-gray-600">Live Matches</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaTrophy className="mx-auto h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">
              {teams?.length || 0}
            </h3>
            <p className="text-gray-600">Teams</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaUsers className="mx-auto h-8 w-8 text-blue-500 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">1.2K</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FaGamepad className="mx-auto h-8 w-8 text-green-500 mb-3" />
            <h3 className="text-2xl font-bold text-gray-900">500+</h3>
            <p className="text-gray-600">Fantasy Leagues</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaNewspaper className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Latest News
            </h3>
            <p className="text-gray-600 mb-4">
              Stay updated with the latest cricket news, player interviews, and
              match analysis.
            </p>
            <a
              href="/news"
              className="text-cricket-green hover:text-green-600 font-semibold"
            >
              Read More →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaGamepad className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Fantasy Cricket
            </h3>
            <p className="text-gray-600 mb-4">
              Create your dream team, compete with friends, and win exciting
              prizes.
            </p>
            <a
              href="/fantasy"
              className="text-cricket-green hover:text-green-600 font-semibold"
            >
              Play Now →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaChartBar className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600 mb-4">
              Deep dive into player statistics, team performance, and match
              predictions.
            </p>
            <a
              href="/analytics"
              className="text-cricket-green hover:text-green-600 font-semibold"
            >
              Explore →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaTrophy className="h-12 w-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tournaments
            </h3>
            <p className="text-gray-600 mb-4">
              Follow major tournaments, series, and international cricket
              events.
            </p>
            <a
              href="/tournaments"
              className="text-cricket-green hover:text-green-600 font-semibold"
            >
              Browse →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaUsers className="h-12 w-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600 mb-4">
              Join discussions, participate in polls, and connect with cricket
              fans.
            </p>
            <a
              href="/community"
              className="text-cricket-green hover:text-green-600 font-semibold"
            >
              Join →
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <FaCrown className="h-12 w-12 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
            <p className="text-gray-600 mb-4">
              Get exclusive content, advanced analytics, and premium features.
            </p>
            <a
              href="/premium"
              className="text-cricket-green hover:text-green-600 font-semibold"
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
