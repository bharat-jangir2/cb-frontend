import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import {
  FaRocket,
  FaHome,
  FaTrophy,
  FaUsers,
  FaNewspaper,
  FaGamepad,
  FaChartLine,
  FaComments,
  FaCrown,
  FaCog,
  FaChevronDown,
  FaChevronRight,
  FaCalendar,
  FaMapMarkerAlt,
  FaServer,
  FaNetworkWired,
  FaShieldAlt,
  FaBell,
  FaUserCog,
  FaDatabase,
  FaChartBar,
  FaCogs,
} from "react-icons/fa";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const { user } = useAuthStore();
  const location = useLocation();

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isActiveSection = (section: string) =>
    location.pathname.startsWith(`/admin/${section}`);

  const navigationItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: FaHome,
      section: "main",
    },
    {
      title: "Match Management",
      section: "matches",
      icon: FaTrophy,
      items: [
        { title: "All Matches", path: "/admin/matches" },
        { title: "Create Match", path: "/admin/matches/create" },
        { title: "Live Matches", path: "/admin/matches/live" },
        { title: "Match Statistics", path: "/admin/matches/stats" },
      ],
    },
    {
      title: "Team Management",
      section: "teams",
      icon: FaUsers,
      items: [
        { title: "All Teams", path: "/admin/teams" },
        { title: "Create Team", path: "/admin/teams/create" },
        { title: "Team Statistics", path: "/admin/teams/stats" },
      ],
    },
    {
      title: "Player Management",
      section: "players",
      icon: FaUsers,
      items: [
        { title: "All Players", path: "/admin/players" },
        { title: "Create Player", path: "/admin/players/create" },
        { title: "Player Statistics", path: "/admin/players/stats" },
      ],
    },
    {
      title: "Tournament Management",
      section: "tournaments",
      icon: FaTrophy,
      items: [
        { title: "All Tournaments", path: "/admin/tournaments" },
        { title: "Create Tournament", path: "/admin/tournaments/create" },
        { title: "Tournament Results", path: "/admin/tournaments/results" },
      ],
    },
    {
      title: "Series Management",
      section: "series",
      icon: FaCalendar,
      items: [
        { title: "All Series", path: "/admin/series" },
        { title: "Create Series", path: "/admin/series/create" },
        { title: "Series Table", path: "/admin/series/table" },
      ],
    },
    {
      title: "News Management",
      section: "news",
      icon: FaNewspaper,
      items: [
        { title: "All News", path: "/admin/news" },
        { title: "Create News", path: "/admin/news/create" },
        { title: "News Categories", path: "/admin/news/categories" },
      ],
    },
    {
      title: "Fantasy Cricket",
      section: "fantasy",
      icon: FaGamepad,
      items: [
        { title: "All Leagues", path: "/admin/fantasy/leagues" },
        { title: "Create League", path: "/admin/fantasy/leagues/create" },
        { title: "Fantasy Statistics", path: "/admin/fantasy/stats" },
      ],
    },
    {
      title: "Premium Features",
      section: "premium",
      icon: FaCrown,
      items: [
        { title: "All Subscriptions", path: "/admin/premium/subscriptions" },
        { title: "Premium Plans", path: "/admin/premium/plans" },
        { title: "Payment History", path: "/admin/premium/payments" },
      ],
    },
    {
      title: "Community",
      section: "community",
      icon: FaComments,
      items: [
        { title: "All Discussions", path: "/admin/community/discussions" },
        { title: "Comments", path: "/admin/community/comments" },
        { title: "Polls", path: "/admin/community/polls" },
        { title: "Quizzes", path: "/admin/community/quizzes" },
      ],
    },
    {
      title: "Analytics",
      section: "analytics",
      icon: FaChartLine,
      items: [
        { title: "Match Analytics", path: "/admin/analytics/matches" },
        { title: "Player Analytics", path: "/admin/analytics/players" },
        { title: "Team Analytics", path: "/admin/analytics/teams" },
        { title: "User Analytics", path: "/admin/analytics/users" },
      ],
    },
    {
      title: "System Management",
      section: "system",
      icon: FaServer,
      items: [
        { title: "AI Agents", path: "/admin/system/agents" },
        { title: "Scrapers", path: "/admin/system/scrapers" },
        { title: "Selectors", path: "/admin/system/selectors" },
        { title: "System Health", path: "/admin/system/health" },
      ],
    },
    {
      title: "User Management",
      section: "users",
      icon: FaUserCog,
      items: [
        { title: "All Users", path: "/admin/users" },
        { title: "Create User", path: "/admin/users/create" },
        { title: "User Roles", path: "/admin/users/roles" },
        { title: "User Activity", path: "/admin/users/activity" },
      ],
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: FaCog,
      section: "main",
    },
  ];

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg mr-3">
                <FaRocket className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">Admin Panel</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-700"
          >
            {isCollapsed ? (
              <FaChevronRight className="h-4 w-4" />
            ) : (
              <FaChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-medium">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          if (item.path) {
            // Single item
            return (
              <Link
                key={item.title}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          } else {
            // Section with sub-items
            const isExpanded = expandedSections.includes(item.section);
            const hasActiveChild = isActiveSection(item.section);

            return (
              <div key={item.title}>
                <button
                  onClick={() => toggleSection(item.section)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    hasActiveChild
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="text-xs">
                      {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  )}
                </button>

                {isExpanded && !isCollapsed && item.items && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.path}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(subItem.path)
                            ? "bg-blue-500 text-white"
                            : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
        })}
      </nav>

      {/* Quick Stats (when not collapsed) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">Quick Stats</div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Live Matches</span>
              <span className="text-green-400">3</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Active Users</span>
              <span className="text-blue-400">1.2k</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>System Status</span>
              <span className="text-green-400">Healthy</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
