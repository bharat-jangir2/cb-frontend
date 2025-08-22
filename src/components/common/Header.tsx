import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      {/* Navigation Bar */}
      <div className="border-b border-blue-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-6">
              <div
                className="text-2xl font-bold text-yellow-400 cursor-pointer hover:text-yellow-300 transition-colors"
                onClick={() => navigate("/")}
              >
                CREX
              </div>
              <nav className="hidden md:flex space-x-4 text-sm">
                <button
                  onClick={() => navigate("/")}
                  className="hover:text-yellow-300 transition-colors"
                >
                  Home
                </button>
                <div className="relative group">
                  <button className="hover:text-yellow-300 transition-colors flex items-center space-x-1">
                    <span>Series</span>
                    <FaChevronDown className="text-xs" />
                  </button>
                </div>
                <button
                  onClick={() => navigate("/fixtures")}
                  className="hover:text-yellow-300 transition-colors"
                >
                  Fixtures
                </button>
                <button
                  onClick={() => navigate("/stats")}
                  className="hover:text-yellow-300 transition-colors"
                >
                  Stats Corner
                </button>
                <button
                  onClick={() => navigate("/rankings")}
                  className="hover:text-yellow-300 transition-colors"
                >
                  Rankings
                </button>
              </nav>
            </div>
            <button className="text-sm hover:text-yellow-300 transition-colors flex items-center space-x-2">
              <FaMoon className="text-sm" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* Page Title (if provided) */}
      {title && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-lg font-semibold text-center">{title}</h1>
        </div>
      )}
    </div>
  );
};

export default Header;
