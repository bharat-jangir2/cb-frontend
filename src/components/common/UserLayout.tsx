import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import {
  FaRocket,
  FaSearch,
  FaBell,
  FaUser,
  FaBars,
  FaTimes,
  FaHome,
  FaNewspaper,
  FaTrophy,
  FaGamepad,
  FaChartBar,
  FaUsers,
  FaCrown,
  FaSignOutAlt,
  FaCog,
  FaHeart,
} from "react-icons/fa";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: "Home", href: "/user", icon: FaHome },
    { name: "Matches", href: "/user/matches", icon: FaRocket },
    { name: "News", href: "/user/news", icon: FaNewspaper },
    { name: "Tournaments", href: "/user/tournaments", icon: FaTrophy },
    { name: "Fantasy", href: "/user/fantasy", icon: FaGamepad },
    { name: "Analytics", href: "/user/analytics", icon: FaChartBar },
    { name: "Community", href: "/user/community", icon: FaUsers },
    { name: "Premium", href: "/user/premium", icon: FaCrown },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile First Design */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/user" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-cricket-green rounded-lg flex items-center justify-center">
                  <FaRocket className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900 hidden sm:block">
                  Cricket Live
                </span>
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex space-x-6">
              {navigation.slice(0, 6).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-cricket-green bg-green-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - Hidden on mobile */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search matches, teams..."
                  className="block w-48 lg:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-cricket-green focus:border-cricket-green sm:text-sm"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 relative">
                <FaBell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-cricket-green rounded-full flex items-center justify-center">
                    <FaUser className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.username}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <Link
                      to="/user/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/user/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaCog className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FaSignOutAlt className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="h-6 w-6" />
                ) : (
                  <FaBars className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            {/* Mobile Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search matches, teams..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-cricket-green focus:border-cricket-green sm:text-sm"
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium ${
                      isActive
                        ? "text-cricket-green bg-green-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Info */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-cricket-green rounded-full flex items-center justify-center">
                  <FaUser className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Link
                  to="/user/profile"
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/user/settings"
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaCog className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                >
                  <FaSignOutAlt className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Mobile Bottom Navigation - Crex.live style */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around">
          {navigation.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 ${
                  isActive
                    ? "text-cricket-green"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer - Hidden on mobile */}
      <footer className="hidden lg:block bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-cricket-green rounded-lg flex items-center justify-center">
                  <FaRocket className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">Cricket Live</span>
              </div>
              <p className="text-gray-400">
                Your ultimate destination for live cricket scores, news, and
                fantasy games.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/user/matches"
                    className="text-gray-400 hover:text-white"
                  >
                    Live Matches
                  </Link>
                </li>
                <li>
                  <Link to="/user/news" className="text-gray-400 hover:text-white">
                    News
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/tournaments"
                    className="text-gray-400 hover:text-white"
                  >
                    Tournaments
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/fantasy"
                    className="text-gray-400 hover:text-white"
                  >
                    Fantasy Cricket
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/user/analytics"
                    className="text-gray-400 hover:text-white"
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/community"
                    className="text-gray-400 hover:text-white"
                  >
                    Community
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/premium"
                    className="text-gray-400 hover:text-white"
                  >
                    Premium
                  </Link>
                </li>
                <li>
                  <Link to="/user/teams" className="text-gray-400 hover:text-white">
                    Teams
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2024 Cricket Live. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
