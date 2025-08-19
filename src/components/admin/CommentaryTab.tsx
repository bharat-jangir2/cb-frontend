import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaComment, FaSave, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { adminApi } from "../../services/admin";

interface CommentaryTabProps {
  matchId: string;
}

interface CommentaryEntry {
  id: string;
  over: number;
  ball: number;
  commentary: string;
  timestamp: string;
  type: "ball" | "over" | "innings" | "match";
}

export const CommentaryTab: React.FC<CommentaryTabProps> = ({ matchId }) => {
  const queryClient = useQueryClient();
  const [newCommentary, setNewCommentary] = useState("");
  const [selectedOver, setSelectedOver] = useState(1);
  const [selectedBall, setSelectedBall] = useState(1);
  const [commentaryType, setCommentaryType] = useState<"ball" | "over" | "innings" | "match">("ball");

  // Mock commentary data
  const commentaryEntries: CommentaryEntry[] = [
    {
      id: "1",
      over: 1,
      ball: 1,
      commentary: "Good length delivery, batsman defends it solidly",
      timestamp: "2024-01-15T10:30:00Z",
      type: "ball"
    },
    {
      id: "2",
      over: 1,
      ball: 2,
      commentary: "Short ball, pulled away for a single",
      timestamp: "2024-01-15T10:31:00Z",
      type: "ball"
    },
    {
      id: "3",
      over: 1,
      ball: 3,
      commentary: "Full delivery, driven through covers for four!",
      timestamp: "2024-01-15T10:32:00Z",
      type: "ball"
    },
    {
      id: "4",
      over: 1,
      ball: 4,
      commentary: "Dot ball, good line and length",
      timestamp: "2024-01-15T10:33:00Z",
      type: "ball"
    },
    {
      id: "5",
      over: 1,
      ball: 5,
      commentary: "Wide delivery, extra run",
      timestamp: "2024-01-15T10:34:00Z",
      type: "ball"
    },
    {
      id: "6",
      over: 1,
      ball: 6,
      commentary: "End of over 1. 6 runs from the over.",
      timestamp: "2024-01-15T10:35:00Z",
      type: "over"
    }
  ];

  // Add commentary mutation
  const addCommentaryMutation = useMutation({
    mutationFn: (commentaryData: any) => adminApi.updateMatchCommentary(matchId, commentaryData.commentary),
    onSuccess: () => {
      toast.success("Commentary added successfully");
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      setNewCommentary("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to add commentary");
    },
  });

  const handleAddCommentary = () => {
    if (!newCommentary.trim()) {
      toast.error("Please enter commentary text");
      return;
    }

    const commentaryData = {
      commentary: newCommentary,
      over: selectedOver,
      ball: selectedBall,
      type: commentaryType
    };

    addCommentaryMutation.mutate(commentaryData);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ball": return "bg-blue-100 text-blue-800";
      case "over": return "bg-green-100 text-green-800";
      case "innings": return "bg-purple-100 text-purple-800";
      case "match": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Commentary Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaComment className="mr-2" />
          Add Commentary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Over
            </label>
            <input
              type="number"
              value={selectedOver}
              onChange={(e) => setSelectedOver(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ball
            </label>
            <input
              type="number"
              value={selectedBall}
              onChange={(e) => setSelectedBall(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="6"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={commentaryType}
              onChange={(e) => setCommentaryType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ball">Ball</option>
              <option value="over">Over</option>
              <option value="innings">Innings</option>
              <option value="match">Match</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleAddCommentary}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <FaPlus className="mr-2" />
              Add
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Commentary Text
          </label>
          <textarea
            value={newCommentary}
            onChange={(e) => setNewCommentary(e.target.value)}
            placeholder="Enter commentary for this ball/over..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Commentary History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FaComment className="mr-2" />
            Commentary History
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {commentaryEntries.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(entry.type)}`}>
                        {entry.type.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        Over {entry.over}.{entry.ball}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-900">{entry.commentary}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {commentaryEntries.length === 0 && (
            <div className="text-center py-8">
              <FaComment className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Commentary Yet
              </h3>
              <p className="text-gray-600">
                Start adding commentary to track the match progress.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Commentary Templates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Commentary Templates
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Boundaries</h4>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                "Driven through covers for four!"
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                "Pulled away for a six!"
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                "Cut away for four runs"
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Wickets</h4>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                "Bowled! Clean bowled!"
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                "Caught behind!"
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                "LBW! Given out!"
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Extras</h4>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                "Wide delivery, extra run"
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                "No ball called"
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
                "Byes, batsmen run a single"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 