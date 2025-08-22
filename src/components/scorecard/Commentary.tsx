import React, { useState } from "react";

interface CommentaryEntry {
  id: string;
  over: number;
  ball: number;
  runs: number;
  bowler: string;
  batsman: string;
  description: string;
  isHighlight: boolean;
  isWicket?: boolean;
  isFour?: boolean;
  isSix?: boolean;
  dismissalType?: string;
  dismissalInfo?: string;
}

interface CommentaryProps {
  entries: CommentaryEntry[];
  filters?: string[];
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  className?: string;
}

const Commentary: React.FC<CommentaryProps> = ({
  entries,
  filters = ["All", "Highlights", "Overs", "W", "4s", "6s"],
  activeFilter = "All",
  onFilterChange,
  className = "",
}) => {
  const getBallStyle = (runs: number, isWicket?: boolean) => {
    if (isWicket) {
      return "bg-red-100 text-red-700 border-red-300";
    }

    switch (runs) {
      case 0:
        return "bg-gray-100 text-gray-600 border-gray-200";
      case 1:
        return "bg-blue-100 text-blue-700 border-blue-300";
      case 2:
        return "bg-green-100 text-green-700 border-green-300";
      case 3:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case 4:
        return "bg-purple-100 text-purple-700 border-purple-300";
      case 6:
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getBallText = (entry: CommentaryEntry) => {
    if (entry.isWicket) {
      return "W";
    }
    return entry.runs.toString();
  };

  const filteredEntries = entries.filter((entry) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Highlights") return entry.isHighlight;
    if (activeFilter === "W") return entry.isWicket;
    if (activeFilter === "4s") return entry.isFour;
    if (activeFilter === "6s") return entry.isSix;
    if (activeFilter === "Overs") return entry.ball === 6; // End of over
    return true;
  });

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange?.(filter)}
              className={`px-2 sm:px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* Commentary Entries */}
      <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto custom-scrollbar">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className={`border-l-2 pl-3 sm:pl-4 py-2 rounded-r-lg transition-all ${
              entry.isHighlight
                ? "border-green-500 bg-green-50"
                : entry.isWicket
                ? "border-red-500 bg-red-50"
                : "border-blue-500 bg-blue-50"
            }`}
          >
            <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-900 bg-white px-2 py-1 rounded">
                {entry.over}.{entry.ball}
              </span>
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${getBallStyle(
                  entry.runs,
                  entry.isWicket
                )}`}
              >
                {getBallText(entry)}
              </div>
              {entry.isHighlight && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Highlight
                </span>
              )}
              {entry.isWicket && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  Wicket
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              {entry.bowler} to {entry.batsman}
            </div>

            <div
              className={`text-xs sm:text-sm ${
                entry.isHighlight || entry.isWicket
                  ? "font-semibold text-gray-800"
                  : "text-gray-700"
              }`}
            >
              {entry.description}
            </div>

            {/* Dismissal Info */}
            {entry.isWicket && entry.dismissalInfo && (
              <div className="mt-2 text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
                {entry.dismissalInfo}
              </div>
            )}
          </div>
        ))}

        {/* Over Summary */}
        {filteredEntries.length > 0 && (
          <div className="border-l-2 border-green-500 pl-3 sm:pl-4 bg-green-50 p-3 rounded-r-lg">
            <div className="text-xs sm:text-sm font-semibold text-green-800 mb-1">
              OVER {filteredEntries[0]?.over} SUMMARY
            </div>
            <div className="text-xs sm:text-sm text-green-700">
              {/* Add over summary logic here */}
              Over completed with highlights
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Commentary;
