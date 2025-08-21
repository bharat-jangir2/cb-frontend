import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;
  private listeners = new Map<string, Function[]>();

  connect(matchId: string, token: string) {
    this.socket = io("http://localhost:5000", {
      auth: { token },
      query: { matchId },
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Score updates
    this.socket.on("score.state", (data) => {
      this.emit("score.state", data);
    });

    // Ball updates
    this.socket.on("ball.applied", (data) => {
      this.emit("ball.applied", data);
    });

    this.socket.on("ball.undone", (data) => {
      this.emit("ball.undone", data);
    });

    // Player updates
    this.socket.on("player.update", (data) => {
      this.emit("player.update", data);
    });

    // Commentary updates
    this.socket.on("commentary.update", (data) => {
      this.emit("commentary.update", data);
    });

    // Match status updates
    this.socket.on("match.status", (data) => {
      this.emit("match.status", data);
    });

    // Innings updates
    this.socket.on("innings.update", (data) => {
      this.emit("innings.update", data);
    });

    // Partnership updates
    this.socket.on("partnership.update", (data) => {
      this.emit("partnership.update", data);
    });

    // Connection events
    this.socket.on("connect", () => {
      console.log("WebSocket connected");
      this.emit("connected", {});
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      this.emit("disconnected", {});
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      this.emit("error", error);
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string) {
    this.listeners.delete(event);
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Send events to server
  emitToServer(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

export const websocketService = new WebSocketService();
