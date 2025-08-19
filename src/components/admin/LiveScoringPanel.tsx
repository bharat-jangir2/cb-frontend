import React, { useState } from "react";
import { useAddBall } from "../../hooks";
import { websocketService } from "../../services/websocket.service";
import { toast } from "react-hot-toast";

interface LiveScoringPanelProps {
  matchId?: string;
}

export const LiveScoringPanel: React.FC<LiveScoringPanelProps> = ({
  matchId,
}) => {
  const [selectedMatch, setSelectedMatch] = useState(matchId);
  const [ballData, setBallData] = useState({
    eventType: "runs",
    runs: 0,
    striker: "",
    nonStriker: "",
    bowler: "",
    commentary: "",
  });

  const addBallMutation = useAddBall();

  const handleAddBall = async () => {
    if (!selectedMatch) {
      toast.error("Please select a match first");
      return;
    }

    try {
      // Add ball via WebSocket for real-time updates
      websocketService.addBall(selectedMatch, ballData);

      // Also add via API for persistence
      await addBallMutation.mutateAsync({ matchId: selectedMatch, ballData });

      // Reset form
      setBallData({
        eventType: "runs",
        runs: 0,
        striker: "",
        nonStriker: "",
        bowler: "",
        commentary: "",
      });

      toast.success("Ball added successfully!");
    } catch (error) {
      console.error("Error adding ball:", error);
      toast.error("Failed to add ball");
    }
  };

  const quickActions = [
    { label: "Dot Ball", runs: 0, eventType: "runs" },
    { label: "Single", runs: 1, eventType: "runs" },
    { label: "Two", runs: 2, eventType: "runs" },
    { label: "Three", runs: 3, eventType: "runs" },
    { label: "Four", runs: 4, eventType: "runs" },
    { label: "Six", runs: 6, eventType: "runs" },
    { label: "Wide", runs: 1, eventType: "extra" },
    { label: "No Ball", runs: 1, eventType: "extra" },
    { label: "Wicket", runs: 0, eventType: "wicket" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Scoring</h2>

      {/* Match Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Match
        </label>
        <select
          value={selectedMatch}
          onChange={(e) => setSelectedMatch(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a match...</option>
          {/* Add match options here */}
        </select>
      </div>

      {selectedMatch && (
        <div className="space-y-6">
          {/* Ball Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select
                value={ballData.eventType}
                onChange={(e) =>
                  setBallData({ ...ballData, eventType: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="runs">Runs</option>
                <option value="wicket">Wicket</option>
                <option value="extra">Extra</option>
                <option value="over_change">Over Change</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Runs
              </label>
              <input
                type="number"
                min="0"
                max="6"
                value={ballData.runs}
                onChange={(e) =>
                  setBallData({ ...ballData, runs: parseInt(e.target.value) })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentary
              </label>
              <input
                type="text"
                value={ballData.commentary}
                onChange={(e) =>
                  setBallData({ ...ballData, commentary: e.target.value })
                }
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ball commentary..."
              />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() =>
                  setBallData({
                    ...ballData,
                    eventType: action.eventType as any,
                    runs: action.runs,
                  })
                }
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddBall}
              disabled={addBallMutation.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {addBallMutation.isPending ? "Adding..." : "Add Ball"}
            </button>

            <button
              onClick={() => setBallData({ ...ballData, eventType: "wicket" })}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
            >
              Wicket
            </button>

            <button
              onClick={() => setBallData({ ...ballData, runs: 4 })}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Four
            </button>

            <button
              onClick={() => setBallData({ ...ballData, runs: 6 })}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              Six
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
