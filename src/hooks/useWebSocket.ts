import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socketService } from "../services/socket";

interface UseWebSocketOptions {
  matchId: string;
  token: string;
  enabled?: boolean;
  onMatchStateUpdate?: (data: any) => void;
  onScoreUpdate?: (data: any) => void;
  onBallUpdate?: (data: any) => void;
  onPlayerUpdate?: (data: any) => void;
  onOddsUpdate?: (data: any) => void;
  onAlertUpdate?: (data: any) => void;
  onStrikeRotationUpdate?: (data: any) => void;
  onCommentaryUpdate?: (data: any) => void;
  onTossUpdate?: (data: any) => void;
  onSquadUpdate?: (data: any) => void;
  onPlayingXIUpdate?: (data: any) => void;
  onNotificationUpdate?: (data: any) => void;
  onWebSocketStats?: (data: any) => void;
  onScorecardUpdate?: (data: any) => void;
  onLiveScorecardUpdate?: (data: any) => void;
  onInningsUpdate?: (data: any) => void;
  onError?: (data: any) => void;
}

export const useWebSocket = ({
  matchId,
  token,
  enabled = true,
  onMatchStateUpdate,
  onScoreUpdate,
  onBallUpdate,
  onPlayerUpdate,
  onOddsUpdate,
  onAlertUpdate,
  onStrikeRotationUpdate,
  onCommentaryUpdate,
  onTossUpdate,
  onSquadUpdate,
  onPlayingXIUpdate,
  onNotificationUpdate,
  onWebSocketStats,
  onScorecardUpdate,
  onLiveScorecardUpdate,
  onInningsUpdate,
  onError,
}: UseWebSocketOptions) => {
  const queryClient = useQueryClient();
  const isConnected = useRef(false);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!enabled || !token || isConnected.current) return;

    console.log("🔌 Connecting to WebSocket for match:", matchId);
    socketService.connect(token);
    isConnected.current = true;
  }, [enabled, token, matchId]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (!isConnected.current) return;

    console.log("🔌 Disconnecting from WebSocket for match:", matchId);
    socketService.disconnect();
    isConnected.current = false;
  }, [matchId]);

  // Join match room
  const joinMatch = useCallback(() => {
    if (enabled && matchId && isConnected.current) {
      console.log("🎯 Joining match room:", matchId);
      socketService.joinMatch(matchId);
    }
  }, [enabled, matchId]);

  // Leave match room
  const leaveMatch = useCallback(() => {
    if (matchId && isConnected.current) {
      console.log("🎯 Leaving match room:", matchId);
      socketService.leaveMatch(matchId);
    }
  }, [matchId]);

  // Join scorecard room
  const joinScorecard = useCallback(() => {
    if (enabled && matchId && isConnected.current) {
      console.log("📊 Joining scorecard room:", matchId);
      socketService.joinScorecard(matchId);
    }
  }, [enabled, matchId]);

  // Leave scorecard room
  const leaveScorecard = useCallback(() => {
    if (matchId && isConnected.current) {
      console.log("📊 Leaving scorecard room:", matchId);
      socketService.leaveScorecard(matchId);
    }
  }, [matchId]);

  // Get scorecard data
  const getScorecard = useCallback(() => {
    if (enabled && matchId && isConnected.current) {
      socketService.getScorecard(matchId);
    }
  }, [enabled, matchId]);

  // Get live scorecard data
  const getLiveScorecard = useCallback(() => {
    if (enabled && matchId && isConnected.current) {
      socketService.getLiveScorecard(matchId);
    }
  }, [enabled, matchId]);

  // Get WebSocket statistics
  const getWebSocketStats = useCallback(() => {
    if (enabled && matchId && isConnected.current) {
      socketService.getWebSocketStats(matchId);
    }
  }, [enabled, matchId]);

  // Force reconnection
  const forceReconnect = useCallback(
    (namespace?: "match" | "scorecard") => {
      if (enabled && isConnected.current) {
        console.log("🔄 Forcing WebSocket reconnection...");
        socketService.forceReconnect(namespace);
      }
    },
    [enabled]
  );

  // Get reconnection status
  const getReconnectionStatus = useCallback(() => {
    return socketService.getReconnectionStatus();
  }, []);

  // Get connection health
  const getConnectionHealth = useCallback(() => {
    return socketService.getConnectionHealth();
  }, []);

  // Update reconnection configuration
  const updateReconnectionConfig = useCallback((config: any) => {
    socketService.updateReconnectionConfig(config);
  }, []);

  // Admin/Scorer methods
  const applyBall = useCallback(
    (ballData: any) => {
      if (enabled && matchId && isConnected.current) {
        socketService.applyBall(matchId, ballData);
      }
    },
    [enabled, matchId]
  );

  const undoBall = useCallback(() => {
    if (enabled && matchId && isConnected.current) {
      socketService.undoBall(matchId);
    }
  }, [enabled, matchId]);

  const updatePlayer = useCallback(
    (playerId: string, updates: any) => {
      if (enabled && matchId && isConnected.current) {
        socketService.updatePlayer(matchId, playerId, updates);
      }
    },
    [enabled, matchId]
  );

  const updateStrikeRotation = useCallback(
    (strikeRotation: any) => {
      if (enabled && matchId && isConnected.current) {
        socketService.updateStrikeRotation(matchId, strikeRotation);
      }
    },
    [enabled, matchId]
  );

  const addCommentary = useCallback(
    (commentary: any) => {
      if (enabled && matchId && isConnected.current) {
        socketService.addCommentary(matchId, commentary);
      }
    },
    [enabled, matchId]
  );

  const updateToss = useCallback(
    (tossInfo: any) => {
      if (enabled && matchId && isConnected.current) {
        socketService.updateToss(matchId, tossInfo);
      }
    },
    [enabled, matchId]
  );

  const updateSquad = useCallback(
    (squad: any) => {
      if (enabled && matchId && isConnected.current) {
        socketService.updateSquad(matchId, squad);
      }
    },
    [enabled, matchId]
  );

  const updatePlayingXI = useCallback(
    (playingXI: any) => {
      if (enabled && matchId && isConnected.current) {
        socketService.updatePlayingXI(matchId, playingXI);
      }
    },
    [enabled, matchId]
  );

  const addNotification = useCallback(
    (notification: any) => {
      if (enabled && matchId && isConnected.current) {
        socketService.addNotification(matchId, notification);
      }
    },
    [enabled, matchId]
  );

  // Setup event listeners
  useEffect(() => {
    if (!enabled || !token) return;

    // Connect to WebSocket
    connect();

    // Setup match event listeners
    const handleMatchStateUpdate = (data: any) => {
      console.log("📊 Match state update:", data);
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      onMatchStateUpdate?.(data);
    };

    const handleScoreUpdate = (data: any) => {
      console.log("📊 Score update:", data);
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
      onScoreUpdate?.(data);
    };

    const handleBallUpdate = (data: any) => {
      console.log("🏏 Ball update:", data);
      queryClient.invalidateQueries({ queryKey: ["balls", matchId] });
      queryClient.invalidateQueries({ queryKey: ["playerStats", matchId] });
      queryClient.invalidateQueries({ queryKey: ["partnerships", matchId] });
      onBallUpdate?.(data);
    };

    const handlePlayerUpdate = (data: any) => {
      console.log("👤 Player update:", data);
      queryClient.invalidateQueries({ queryKey: ["playerStats", matchId] });
      onPlayerUpdate?.(data);
    };

    const handleOddsUpdate = (data: any) => {
      console.log("🎲 Odds update:", data);
      queryClient.invalidateQueries({ queryKey: ["odds", matchId] });
      onOddsUpdate?.(data);
    };

    const handleAlertUpdate = (data: any) => {
      console.log("⚠️ Alert update:", data);
      onAlertUpdate?.(data);
    };

    const handleStrikeRotationUpdate = (data: any) => {
      console.log("🔄 Strike rotation update:", data);
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      onStrikeRotationUpdate?.(data);
    };

    const handleCommentaryUpdate = (data: any) => {
      console.log("💬 Commentary update:", data);
      queryClient.invalidateQueries({ queryKey: ["commentary", matchId] });
      onCommentaryUpdate?.(data);
    };

    const handleTossUpdate = (data: any) => {
      console.log("🪙 Toss update:", data);
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      onTossUpdate?.(data);
    };

    const handleSquadUpdate = (data: any) => {
      console.log("👥 Squad update:", data);
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      onSquadUpdate?.(data);
    };

    const handlePlayingXIUpdate = (data: any) => {
      console.log("🏏 Playing XI update:", data);
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      onPlayingXIUpdate?.(data);
    };

    const handleNotificationUpdate = (data: any) => {
      console.log("🔔 Notification update:", data);
      onNotificationUpdate?.(data);
    };

    const handleWebSocketStats = (data: any) => {
      console.log("📈 WebSocket stats:", data);
      onWebSocketStats?.(data);
    };

    const handleError = (data: any) => {
      console.error("❌ WebSocket error:", data);
      onError?.(data);
    };

    // Setup scorecard event listeners
    const handleScorecardUpdate = (data: any) => {
      console.log("📊 Scorecard update:", data);
      queryClient.invalidateQueries({ queryKey: ["scorecard", matchId] });
      onScorecardUpdate?.(data);
    };

    const handleLiveScorecardUpdate = (data: any) => {
      console.log("📊 Live scorecard update:", data);
      queryClient.invalidateQueries({ queryKey: ["liveScorecard", matchId] });
      onLiveScorecardUpdate?.(data);
    };

    const handleInningsUpdate = (data: any) => {
      console.log("🏏 Innings update:", data);
      queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
      onInningsUpdate?.(data);
    };

    // Subscribe to match events
    socketService.onMatch("score.state", handleMatchStateUpdate);
    socketService.onMatch("score.diff", handleScoreUpdate);
    socketService.onMatch("ball.applied", handleBallUpdate);
    socketService.onMatch("ball.undone", handleBallUpdate);
    socketService.onMatch("player.updated", handlePlayerUpdate);
    socketService.onMatch("odds.update", handleOddsUpdate);
    socketService.onMatch("alert.reviewNeeded", handleAlertUpdate);
    socketService.onMatch(
      "strike.rotation.updated",
      handleStrikeRotationUpdate
    );
    socketService.onMatch("commentary.added", handleCommentaryUpdate);
    socketService.onMatch("toss.updated", handleTossUpdate);
    socketService.onMatch("squad.updated", handleSquadUpdate);
    socketService.onMatch("playing.xi.updated", handlePlayingXIUpdate);
    socketService.onMatch("notification.added", handleNotificationUpdate);
    socketService.onMatch("websocket.stats", handleWebSocketStats);
    socketService.onMatch("error", handleError);

    // Subscribe to scorecard events
    socketService.onScorecard("scorecard-updated", handleScorecardUpdate);
    socketService.onScorecard(
      "live-scorecard-updated",
      handleLiveScorecardUpdate
    );
    socketService.onScorecard("scorecard-data", handleScorecardUpdate);
    socketService.onScorecard("live-scorecard-data", handleLiveScorecardUpdate);
    socketService.onScorecard("innings-updated", handleInningsUpdate);
    socketService.onScorecard("player-updated", handlePlayerUpdate);
    socketService.onScorecard("scorecard-error", handleError);

    // Join rooms
    joinMatch();
    joinScorecard();

    // Get initial data
    getScorecard();
    getLiveScorecard();
    getWebSocketStats();

    // Cleanup function
    return () => {
      leaveMatch();
      leaveScorecard();
      disconnect();

      // Unsubscribe from events
      socketService.offMatch("score.state");
      socketService.offMatch("score.diff");
      socketService.offMatch("ball.applied");
      socketService.offMatch("ball.undone");
      socketService.offMatch("player.updated");
      socketService.offMatch("odds.update");
      socketService.offMatch("alert.reviewNeeded");
      socketService.offMatch("strike.rotation.updated");
      socketService.offMatch("commentary.added");
      socketService.offMatch("toss.updated");
      socketService.offMatch("squad.updated");
      socketService.offMatch("playing.xi.updated");
      socketService.offMatch("notification.added");
      socketService.offMatch("websocket.stats");
      socketService.offMatch("error");

      socketService.offScorecard("scorecard-updated");
      socketService.offScorecard("live-scorecard-updated");
      socketService.offScorecard("scorecard-data");
      socketService.offScorecard("live-scorecard-data");
      socketService.offScorecard("innings-updated");
      socketService.offScorecard("player-updated");
      socketService.offScorecard("scorecard-error");
    };
  }, [
    enabled,
    token,
    matchId,
    connect,
    disconnect,
    joinMatch,
    leaveMatch,
    joinScorecard,
    leaveScorecard,
    getScorecard,
    getLiveScorecard,
    getWebSocketStats,
    queryClient,
    onMatchStateUpdate,
    onScoreUpdate,
    onBallUpdate,
    onPlayerUpdate,
    onOddsUpdate,
    onAlertUpdate,
    onStrikeRotationUpdate,
    onCommentaryUpdate,
    onTossUpdate,
    onSquadUpdate,
    onPlayingXIUpdate,
    onNotificationUpdate,
    onWebSocketStats,
    onScorecardUpdate,
    onLiveScorecardUpdate,
    onInningsUpdate,
    onError,
  ]);

  return {
    // Connection status
    isConnected: isConnected.current,
    isMatchConnected: socketService.isMatchConnected(),
    isScorecardConnected: socketService.isScorecardConnected(),

    // Reconnection management
    forceReconnect,
    getReconnectionStatus,
    getConnectionHealth,
    updateReconnectionConfig,

    // User methods
    joinMatch,
    leaveMatch,
    joinScorecard,
    leaveScorecard,
    getScorecard,
    getLiveScorecard,
    getWebSocketStats,

    // Admin/Scorer methods
    applyBall,
    undoBall,
    updatePlayer,
    updateStrikeRotation,
    addCommentary,
    updateToss,
    updateSquad,
    updatePlayingXI,
    addNotification,
  };
};
