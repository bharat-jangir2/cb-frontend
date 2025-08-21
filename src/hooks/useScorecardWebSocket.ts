import { useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { scorecardWebSocketService } from "../services/scorecard-websocket.service";
import type { UnifiedScorecard, LiveScorecard } from "../types/scorecard";

interface UseScorecardWebSocketOptions {
  matchId: string;
  enabled?: boolean;
  onScorecardUpdate?: (scorecard: UnifiedScorecard) => void;
  onLiveScorecardUpdate?: (liveScorecard: LiveScorecard) => void;
  onInningsUpdate?: (data: {
    matchId: string;
    inningsNumber: number;
    innings: any;
  }) => void;
  onPlayerUpdate?: (data: {
    matchId: string;
    playerId: string;
    stats: any;
  }) => void;
  onBallAdded?: (data: { matchId: string; ball: any }) => void;
  onCommentaryAdded?: (data: { matchId: string; commentary: any }) => void;
  onPartnershipUpdate?: (data: { matchId: string; partnership: any }) => void;
  onPowerPlayUpdate?: (data: { matchId: string; powerPlay: any }) => void;
  onMatchStatusChange?: (data: { matchId: string; status: string }) => void;
  onError?: (error: { message: string; code: string }) => void;
}

export const useScorecardWebSocket = ({
  matchId,
  enabled = true,
  onScorecardUpdate,
  onLiveScorecardUpdate,
  onInningsUpdate,
  onPlayerUpdate,
  onBallAdded,
  onCommentaryAdded,
  onPartnershipUpdate,
  onPowerPlayUpdate,
  onMatchStatusChange,
  onError,
}: UseScorecardWebSocketOptions) => {
  const queryClient = useQueryClient();
  const isConnectedRef = useRef(false);

  // Join scorecard room
  const joinScorecard = useCallback(() => {
    if (enabled && matchId) {
      console.log(
        "🎯 useScorecardWebSocket - Joining scorecard for match:",
        matchId
      );
      scorecardWebSocketService.joinScorecard(matchId);
      isConnectedRef.current = true;
    }
  }, [matchId, enabled]);

  // Leave scorecard room
  const leaveScorecard = useCallback(() => {
    if (matchId) {
      console.log(
        "🎯 useScorecardWebSocket - Leaving scorecard for match:",
        matchId
      );
      scorecardWebSocketService.leaveScorecard(matchId);
      isConnectedRef.current = false;
    }
  }, [matchId]);

  // Request scorecard data
  const getScorecard = useCallback(() => {
    if (enabled && matchId) {
      scorecardWebSocketService.getScorecard(matchId);
    }
  }, [matchId, enabled]);

  // Request live scorecard data
  const getLiveScorecard = useCallback(() => {
    if (enabled && matchId) {
      scorecardWebSocketService.getLiveScorecard(matchId);
    }
  }, [matchId, enabled]);

  // Setup WebSocket event listeners
  useEffect(() => {
    if (!enabled || !matchId) return;

    console.log(
      "🎯 useScorecardWebSocket - Setting up listeners for match:",
      matchId
    );

    // Scorecard updated
    if (onScorecardUpdate) {
      scorecardWebSocketService.onScorecardUpdated((scorecard) => {
        console.log("🎯 useScorecardWebSocket - Scorecard updated:", scorecard);
        onScorecardUpdate(scorecard);

        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ["scorecard", matchId] });
        queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      });
    }

    // Live scorecard updated
    if (onLiveScorecardUpdate) {
      scorecardWebSocketService.onLiveScorecardUpdated((liveScorecard) => {
        console.log(
          "🎯 useScorecardWebSocket - Live scorecard updated:",
          liveScorecard
        );
        onLiveScorecardUpdate(liveScorecard);

        // Invalidate live scorecard queries
        queryClient.invalidateQueries({ queryKey: ["liveScorecard", matchId] });
      });
    }

    // Innings updated
    if (onInningsUpdate) {
      scorecardWebSocketService.onInningsUpdated((data) => {
        console.log("🎯 useScorecardWebSocket - Innings updated:", data);
        onInningsUpdate(data);

        // Invalidate innings queries
        queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
        queryClient.invalidateQueries({ queryKey: ["scorecard", matchId] });
      });
    }

    // Player updated
    if (onPlayerUpdate) {
      scorecardWebSocketService.onPlayerUpdated((data) => {
        console.log("🎯 useScorecardWebSocket - Player updated:", data);
        onPlayerUpdate(data);

        // Invalidate player stats queries
        queryClient.invalidateQueries({ queryKey: ["playerStats", matchId] });
        queryClient.invalidateQueries({ queryKey: ["scorecard", matchId] });
      });
    }

    // Ball added
    if (onBallAdded) {
      scorecardWebSocketService.onBallAdded((data) => {
        console.log("🎯 useScorecardWebSocket - Ball added:", data);
        onBallAdded(data);

        // Invalidate ball-related queries
        queryClient.invalidateQueries({ queryKey: ["balls", matchId] });
        queryClient.invalidateQueries({ queryKey: ["scorecard", matchId] });
        queryClient.invalidateQueries({ queryKey: ["liveScorecard", matchId] });
      });
    }

    // Commentary added
    if (onCommentaryAdded) {
      scorecardWebSocketService.onCommentaryAdded((data) => {
        console.log("🎯 useScorecardWebSocket - Commentary added:", data);
        onCommentaryAdded(data);

        // Invalidate commentary queries
        queryClient.invalidateQueries({ queryKey: ["commentary", matchId] });
      });
    }

    // Partnership updated
    if (onPartnershipUpdate) {
      scorecardWebSocketService.onPartnershipUpdated((data) => {
        console.log("🎯 useScorecardWebSocket - Partnership updated:", data);
        onPartnershipUpdate(data);

        // Invalidate partnership queries
        queryClient.invalidateQueries({ queryKey: ["partnerships", matchId] });
        queryClient.invalidateQueries({ queryKey: ["scorecard", matchId] });
      });
    }

    // Power play updated
    if (onPowerPlayUpdate) {
      scorecardWebSocketService.onPowerPlayUpdated((data) => {
        console.log("🎯 useScorecardWebSocket - Power play updated:", data);
        onPowerPlayUpdate(data);

        // Invalidate innings queries
        queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
        queryClient.invalidateQueries({ queryKey: ["scorecard", matchId] });
      });
    }

    // Match status changed
    if (onMatchStatusChange) {
      scorecardWebSocketService.onMatchStatusChanged((data) => {
        console.log("🎯 useScorecardWebSocket - Match status changed:", data);
        onMatchStatusChange(data);

        // Invalidate match queries
        queryClient.invalidateQueries({ queryKey: ["match", matchId] });
        queryClient.invalidateQueries({ queryKey: ["scorecard", matchId] });
        queryClient.invalidateQueries({ queryKey: ["liveScorecard", matchId] });
      });
    }

    // Error handling
    if (onError) {
      scorecardWebSocketService.onError((error) => {
        console.error("🎯 useScorecardWebSocket - Error:", error);
        onError(error);
      });
    }

    // Join scorecard room
    joinScorecard();

    // Cleanup function
    return () => {
      console.log(
        "🎯 useScorecardWebSocket - Cleaning up listeners for match:",
        matchId
      );
      leaveScorecard();

      // Remove all listeners
      scorecardWebSocketService.removeAllListeners();
    };
  }, [
    matchId,
    enabled,
    onScorecardUpdate,
    onLiveScorecardUpdate,
    onInningsUpdate,
    onPlayerUpdate,
    onBallAdded,
    onCommentaryAdded,
    onPartnershipUpdate,
    onPowerPlayUpdate,
    onMatchStatusChange,
    onError,
    joinScorecard,
    leaveScorecard,
    queryClient,
  ]);

  // Get connection status
  const getConnectionStatus = useCallback(() => {
    return scorecardWebSocketService.getConnectionStatus();
  }, []);

  // Reconnect manually
  const reconnect = useCallback(() => {
    scorecardWebSocketService.reconnect();
  }, []);

  return {
    joinScorecard,
    leaveScorecard,
    getScorecard,
    getLiveScorecard,
    getConnectionStatus,
    reconnect,
    isConnected: isConnectedRef.current,
  };
};
