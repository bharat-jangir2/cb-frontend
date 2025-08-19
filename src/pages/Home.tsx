import { Link } from "react-router-dom";
import {
  FaRocket,
  FaNewspaper,
  FaTrophy,
  FaGamepad,
  FaChartBar,
  FaUsers,
} from "react-icons/fa";

const Home = () => {
  // Static data for testing
  const liveMatches: any[] = [];
  const upcomingMatches: any[] = [];
  const matchesLoading = false;
  const upcomingLoading = false;

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
            ) : liveMatches && liveMatches.length > 0 ? (
              <div className="space-y-4">
                {liveMatches.slice(0, 3).map((match) => (
                  <div
                    key={match.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h3 className="font-medium">{match.title}</h3>
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
                    key={match.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h3 className="font-medium">{match.title}</h3>
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
