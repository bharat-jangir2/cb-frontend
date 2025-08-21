import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { websocketService } from "../services/websocket.service";

export const useWebSocket = (matchId: string, token: string) => {
  const queryClient = useQueryClient();
  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current && matchId && token) {
      websocketService.connect(matchId, token);
      isConnected.current = true;

      // Handle real-time updates
      const handleScoreUpdate = (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["match", matchId] });
        queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
      };

      const handleBallUpdate = (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["balls", matchId] });
        queryClient.invalidateQueries({ queryKey: ["playerStats", matchId] });
      };

      const handlePlayerUpdate = (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["playerStats", matchId] });
      };

      const handleCommentaryUpdate = (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["commentary", matchId] });
      };

      const handlePartnershipUpdate = (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["partnerships", matchId] });
      };

      const handleMatchStatusUpdate = (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      };

      const handleInningsUpdate = (data: any) => {
        queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
        queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      };

      const handleConnectionError = (error: any) => {
        console.error("WebSocket connection error:", error);
      };

      // Subscribe to events
      websocketService.on("score.state", handleScoreUpdate);
      websocketService.on("ball.applied", handleBallUpdate);
      websocketService.on("ball.undone", handleBallUpdate);
      websocketService.on("player.update", handlePlayerUpdate);
      websocketService.on("commentary.update", handleCommentaryUpdate);
      websocketService.on("partnership.update", handlePartnershipUpdate);
      websocketService.on("match.status", handleMatchStatusUpdate);
      websocketService.on("innings.update", handleInningsUpdate);
      websocketService.on("error", handleConnectionError);

      return () => {
        websocketService.disconnect();
        isConnected.current = false;
      };
    }
  }, [matchId, token, queryClient]);

  return websocketService;
};
