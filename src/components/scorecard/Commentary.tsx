import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { scorecardService } from "../../services/scorecard.service";

interface CommentaryProps {
  matchId: string;
}

export const Commentary: React.FC<CommentaryProps> = ({ matchId }) => {
  const [selectedInnings, setSelectedInnings] = useState<number>(1);
  const [selectedOver, setSelectedOver] = useState<number | null>(null);
  const [newCommentary, setNewCommentary] = useState("");
  const [commentaryType, setCommentaryType] = useState("general");
  const queryClient = useQueryClient();

  // Fetch commentary data
  const { data: commentary, isLoading } = useQuery({
    queryKey: ["commentary", matchId, selectedInnings, selectedOver],
    queryFn: () =>
      scorecardService.getCommentary(matchId, {
        innings: selectedInnings,
        over: selectedOver || undefined,
      }),
    enabled: !!matchId,
  });

  // Add commentary mutation
  const addCommentaryMutation = useMutation({
    mutationFn: (data: {
      over: number;
      ball: number;
      innings: number;
      commentary: string;
      type: string;
    }) => scorecardService.addCommentary(matchId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commentary", matchId] });
      setNewCommentary("");
      toast.success("Commentary added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add commentary");
      console.error("Add commentary error:", error);
    },
  });

  // Get unique overs for filter
  const uniqueOvers = Array.from(
    new Set(commentary?.map((c) => c.over) || [])
  ).sort((a, b) => a - b);

  const handleAddCommentary = () => {
    if (!newCommentary.trim()) {
      toast.error("Please enter commentary text");
      return;
    }

    addCommentaryMutation.mutate({
      over: selectedOver || 1,
      ball: 1, // Default ball number
      innings: selectedInnings,
      commentary: newCommentary,
      type: commentaryType,
    });
  };

  const getCommentaryTypeColor = (type: string) => {
    switch (type) {
      case "highlight":
        return "bg-yellow-100 text-yellow-800";
      case "milestone":
        return "bg-purple-100 text-purple-800";
      case "analysis":
        return "bg-blue-100 text-blue-800";
      case "general":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Innings
            </label>
            <select
              value={selectedInnings}
              onChange={(e) => setSelectedInnings(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value={1}>1st Innings</option>
              <option value={2}>2nd Innings</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Over
            </label>
            <select
              value={selectedOver || ""}
              onChange={(e) =>
                setSelectedOver(e.target.value ? Number(e.target.value) : null)
              }
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Overs</option>
              {uniqueOvers.map((over) => (
                <option key={over} value={over}>
                  Over {over}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Commentary (Admin Feature) */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Add Commentary
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Over
              </label>
              <input
                type="number"
                min="1"
                value={selectedOver || ""}
                onChange={(e) => setSelectedOver(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Over number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={commentaryType}
                onChange={(e) => setCommentaryType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="general">General</option>
                <option value="highlight">Highlight</option>
                <option value="milestone">Milestone</option>
                <option value="analysis">Analysis</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commentary
            </label>
            <textarea
              value={newCommentary}
              onChange={(e) => setNewCommentary(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
              placeholder="Enter commentary text..."
            />
          </div>

          <button
            onClick={handleAddCommentary}
            disabled={addCommentaryMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {addCommentaryMutation.isPending ? "Adding..." : "Add Commentary"}
          </button>
        </div>
      </div>

      {/* Commentary Timeline */}
      <div className="space-y-4">
        {commentary?.map((comment) => (
          <div
            key={comment._id}
            className="flex items-start space-x-4 p-4 border rounded-lg"
          >
            {/* Over Number */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-sm font-medium text-blue-800">
                {comment.over}.{comment.ball}
              </div>
            </div>

            {/* Commentary Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getCommentaryTypeColor(
                      comment.type
                    )}`}
                  >
                    {comment.type.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(comment.timestamp).toLocaleTimeString()}
                </div>
              </div>

              <div className="text-sm text-gray-900">{comment.commentary}</div>
            </div>
          </div>
        ))}

        {commentary?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No commentary available for the selected filters
          </div>
        )}
      </div>
    </div>
  );
};
