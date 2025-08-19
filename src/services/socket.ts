import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../stores/authStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Match state updates
    this.socket.on("score.state", (data) => {
      this.emitToListeners("score.state", data);
    });

    this.socket.on("score.diff", (data) => {
      this.emitToListeners("score.diff", data);
    });

    // Ball updates
    this.socket.on("ball.applied", (data) => {
      this.emitToListeners("ball.applied", data);
    });

    this.socket.on("ball.undone", (data) => {
      this.emitToListeners("ball.undone", data);
    });

    // Odds updates
    this.socket.on("odds.update", (data) => {
      this.emitToListeners("odds.update", data);
    });

    // Match status updates
    this.socket.on("match.status", (data) => {
      this.emitToListeners("match.status", data);
    });

    // Player updates
    this.socket.on("player.update", (data) => {
      this.emitToListeners("player.update", data);
    });

    // Commentary updates
    this.socket.on("commentary.update", (data) => {
      this.emitToListeners("commentary.update", data);
    });

    // System alerts
    this.socket.on("system.alert", (data) => {
      this.emitToListeners("system.alert", data);
    });

    // Review needed alerts
    this.socket.on("alert.reviewNeeded", (data) => {
      this.emitToListeners("alert.reviewNeeded", data);
    });
  }

  // Join a specific match room
  joinMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit("join.match", { matchId });
    }
  }

  // Leave a specific match room
  leaveMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit("leave.match", { matchId });
    }
  }

  // Apply a ball (for scorers)
  applyBall(ballData: any) {
    if (this.socket) {
      this.socket.emit("ball.apply", ballData);
    }
  }

  // Undo last ball (for scorers)
  undoBall(matchId: string) {
    if (this.socket) {
      this.socket.emit("ball.undo", { matchId });
    }
  }

  // Update player (for scorers)
  updatePlayer(playerData: any) {
    if (this.socket) {
      this.socket.emit("player.update", playerData);
    }
  }

  // Add event listener
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Remove event listener
  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
    } else {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Emit to all listeners for an event
  private emitToListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Get socket instance
  get socketInstance() {
    return this.socket;
  }
}

export const socketService = new SocketService();
