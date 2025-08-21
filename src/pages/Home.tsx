import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaRocket,
  FaNewspaper,
  FaTrophy,
  FaGamepad,
  FaChartBar,
  FaUsers,
  FaPlay,
} from "react-icons/fa";
import { matchesApi } from "../services/matches";
import type { Match } from "../types/matches";

const Home = () => {
  const navigate = useNavigate();

  // Fetch live matches from API
  const {
    data: liveMatches = [],
    isLoading: matchesLoading,
    error: liveMatchesError,
  } = useQuery({
    queryKey: ["live-matches"],
    queryFn: () => matchesApi.getLiveMatches(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Temporary fallback data for testing navigation
  const fallbackLiveMatches = [
    {
      _id: "68a418b9e9f3a0b5f9a2cebc",
      teamAId: { name: "India", shortName: "in" },
      teamBId: { name: "Pakistan", shortName: "pk" },
      venue: "bangladesh",
      score: { teamA: { runs: 0, wickets: 0, overs: 0 } },
      matchType: "T20",
      currentBall: 0,
    },
  ];

  // Use fallback data if API fails or returns empty
  const displayLiveMatches =
    liveMatches.length > 0 ? liveMatches : fallbackLiveMatches;

  console.log("🏠 Home - Display live matches:", displayLiveMatches);
  // Fetch upcoming matches from API
  const {
    data: upcomingMatches = [],
    isLoading: upcomingLoading,
    error: upcomingMatchesError,
  } = useQuery({
    queryKey: ["upcoming-matches"],
    queryFn: () => matchesApi.getMatches({ status: "scheduled" }),
    refetchInterval: 60000, // Refetch every minute
  });

  // Debug logging
  console.log("🏠 Home - Live matches:", liveMatches);
  console.log("🏠 Home - Upcoming matches:", upcomingMatches);
  console.log("🏠 Home - Live matches length:", liveMatches?.length);
  console.log("🏠 Home - First live match:", liveMatches?.[0]);
  console.log("🏠 Home - First live match teamAId:", liveMatches?.[0]?.teamAId);
  console.log("🏠 Home - First live match teamBId:", liveMatches?.[0]?.teamBId);
  console.log("🏠 Home - Live matches error:", liveMatchesError);
  console.log("🏠 Home - Upcoming matches error:", upcomingMatchesError);
  console.log("🏠 Home - Live matches loading:", matchesLoading);
  console.log("🏠 Home - Upcoming matches loading:", upcomingLoading);

  const stats = [
    {
      title: "Live Matches",
      value: liveMatches?.length || 0,
      icon: FaRocket,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Upcoming Matches",
      value: upcomingMatches?.length || 0,
      icon: FaRocket,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Teams",
      value: "24",
      icon: FaTrophy,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Users",
      value: "1.2K",
      icon: FaUsers,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const quickActions = [
    {
      title: "Live Matches",
      description: "Watch live cricket matches",
      icon: FaRocket,
      href: "/matches",
      color: "bg-red-500",
    },
    {
      title: "News",
      description: "Latest cricket news and updates",
      icon: FaNewspaper,
      href: "/news",
      color: "bg-blue-500",
    },
    {
      title: "Tournaments",
      description: "Browse tournaments and series",
      icon: FaTrophy,
      href: "/tournaments",
      color: "bg-yellow-500",
    },
    {
      title: "Fantasy Cricket",
      description: "Play fantasy cricket games",
      icon: FaGamepad,
      href: "/fantasy",
      color: "bg-green-500",
    },
    {
      title: "Analytics",
      description: "Player and team statistics",
      icon: FaChartBar,
      href: "/analytics",
      color: "bg-purple-500",
    },
    {
      title: "Community",
      description: "Join cricket discussions",
      icon: FaUsers,
      href: "/community",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <FaRocket className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Cricket Live
              </span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Welcome to Cricket Live!
            </h1>
            <p className="text-green-100 mb-4">
              Your ultimate destination for live cricket scores, news, and
              fantasy games.
            </p>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-white text-white hover:bg-white hover:text-green-600 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="card">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.href}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all duration-200"
                  >
                    <div
                      className={`p-3 rounded-lg ${action.color} text-white`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Live Matches */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Live Matches
              </h2>
              <Link
                to="/matches"
                className="text-green-500 hover:text-green-600 font-medium"
              >
                View All
              </Link>
            </div>

            {matchesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : liveMatchesError ? (
              <div className="text-center py-8">
                <FaRocket className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Error loading live matches
                </h3>
                <p className="mt-1 text-sm text-red-500">
                  {liveMatchesError.message || "Failed to load live matches"}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : displayLiveMatches && displayLiveMatches.length > 0 ? (
              <div className="space-y-4">
                {displayLiveMatches.slice(0, 3).map((match) => (
                  <div
                    key={match._id}
                    onClick={() => {
                      console.log("🎯 Clicking on live match:", match);
                      console.log("🎯 Live Match ID:", match._id);
                      navigate(`/match/${match._id}`);
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {match.teamAId?.name || "Team A"} vs{" "}
                          {match.teamBId?.name || "Team B"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {match.venue || "Venue TBD"}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm font-medium text-green-600">
                            {match.score?.teamA?.runs || 0}/
                            {match.score?.teamA?.wickets || 0} -{" "}
                            {match.score?.teamA?.overs || 0}.
                            {match.currentBall || 0}
                          </span>
                          <span className="text-sm text-gray-500">
                            {match.matchType || "T20"}
                          </span>
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            LIVE
                          </span>
                        </div>
                      </div>
                      <FaPlay className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaRocket className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No live matches
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Check back later for live cricket action!
                </p>
              </div>
            )}
          </div>

          {/* Upcoming Matches */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Upcoming Matches
              </h2>
              <Link
                to="/matches"
                className="text-green-500 hover:text-green-600 font-medium"
              >
                View All
              </Link>
            </div>

            {upcomingLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : upcomingMatches && upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {upcomingMatches.slice(0, 3).map((match) => (
                  <div
                    key={match._id}
                    onClick={() => {
                      console.log("🎯 Clicking on upcoming match:", match);
                      console.log("🎯 Upcoming Match ID:", match._id);
                      navigate(`/match/${match._id}`);
                    }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {match.teamAId?.name} vs {match.teamBId?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {match.venue}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            {new Date(match.startTime).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            UPCOMING
                          </span>
                        </div>
                      </div>
                      <FaPlay className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FaTrophy className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No upcoming matches
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Stay tuned for upcoming cricket tournaments!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
