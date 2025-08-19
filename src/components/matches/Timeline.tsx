import React from "react";
import { useEvents } from "../../hooks";

interface TimelineProps {
  matchId: string;
  events?: any;
}

export const Timeline: React.FC<TimelineProps> = ({
  matchId,
  events: initialEvents,
}) => {
  const { data: events = initialEvents || [] } = useEvents(matchId);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Match Timeline
      </h3>

      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No events recorded yet
          </div>
        ) : (
          events.map((event: any, index: number) => (
            <div key={index} className="flex items-start space-x-4">
              {/* Timeline dot */}
              <div
                className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                  event.isHighlight ? "bg-yellow-400" : "bg-blue-400"
                }`}
              ></div>

              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(event.timestamp)}
                  </div>
                </div>

                {/* Event details */}
                {(event.over || event.playerName || event.teamName) && (
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                    {event.over && (
                      <span>
                        Over {event.over}.{event.ball || 0}
                      </span>
                    )}
                    {event.playerName && <span>{event.playerName}</span>}
                    {event.teamName && <span>{event.teamName}</span>}
                  </div>
                )}

                {/* Highlight indicator */}
                {event.isHighlight && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Highlight
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
