import { io, Socket } from "socket.io-client";
import { matchesAPI } from "./api/matches.service";

class WebSocketService {
  private socket: Socket | null = null;
  private matchId: string | null = null;

  connect(token: string) {
    this.socket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
      {
        auth: { token },
        transports: ["websocket", "polling"],
      }
    );

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("Connected to WebSocket");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    // Match events
    this.socket.on("ball.added", (data) => {
      this.handleBallUpdate(data);
    });

    this.socket.on("innings.updated", (data) => {
      this.handleInningsUpdate(data);
    });

    this.socket.on("match.updated", (data) => {
      this.handleMatchUpdate(data);
    });

    this.socket.on("event.added", (data) => {
      this.handleEventUpdate(data);
    });

    this.socket.on("highlight.added", (data) => {
      this.handleHighlightUpdate(data);
    });
  }

  joinMatch(matchId: string) {
    if (this.socket && matchId) {
      this.matchId = matchId;
      this.socket.emit("join_match", { matchId });
    }
  }

  leaveMatch() {
    if (this.socket && this.matchId) {
      this.socket.emit("leave_match", { matchId: this.matchId });
      this.matchId = null;
    }
  }

  // Real-time update handlers
  private handleBallUpdate(data: any) {
    // Trigger React Query cache updates
    window.dispatchEvent(new CustomEvent("ball-update", { detail: data }));
  }

  private handleInningsUpdate(data: any) {
    window.dispatchEvent(new CustomEvent("innings-update", { detail: data }));
  }

  private handleMatchUpdate(data: any) {
    window.dispatchEvent(new CustomEvent("match-update", { detail: data }));
  }

  private handleEventUpdate(data: any) {
    window.dispatchEvent(new CustomEvent("event-update", { detail: data }));
  }

  private handleHighlightUpdate(data: any) {
    window.dispatchEvent(new CustomEvent("highlight-update", { detail: data }));
  }

  // Admin/Scorer actions
  addBall(matchId: string, ballData: any) {
    if (this.socket) {
      this.socket.emit("ball.add", { matchId, ballData });
    }
  }

  updateMatch(matchId: string, updateData: any) {
    if (this.socket) {
      this.socket.emit("match.update", { matchId, updateData });
    }
  }

  addEvent(matchId: string, eventData: any) {
    if (this.socket) {
      this.socket.emit("event.add", { matchId, eventData });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const websocketService = new WebSocketService();

// React hook for WebSocket - commented out for now to fix build issues
/*
export const useWebSocket = (matchId?: string) => {
  // Import React hooks properly
  const { useQueryClient } = require("@tanstack/react-query");
  const queryClient = useQueryClient();
  const { useEffect } = require("react");

  useEffect(() => {
    if (matchId) {
      websocketService.joinMatch(matchId);

      const handleBallUpdate = (event: any) => {
        queryClient.invalidateQueries({ queryKey: ["balls", matchId] });
        queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
      };

      const handleInningsUpdate = (event: any) => {
        queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
        queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      };

      const handleMatchUpdate = (event: any) => {
        queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      };

      const handleEventUpdate = (event: any) => {
        queryClient.invalidateQueries({ queryKey: ["events", matchId] });
      };

      window.addEventListener("ball-update", handleBallUpdate);
      window.addEventListener("innings-update", handleInningsUpdate);
      window.addEventListener("match-update", handleMatchUpdate);
      window.addEventListener("event-update", handleEventUpdate);

      return () => {
        websocketService.leaveMatch();
        window.removeEventListener("ball-update", handleBallUpdate);
        window.removeEventListener("innings-update", handleInningsUpdate);
        window.removeEventListener("match-update", handleMatchUpdate);
        window.removeEventListener("event-update", handleEventUpdate);
      };
    }
  }, [matchId, queryClient]);
};
*/
