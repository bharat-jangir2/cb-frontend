import { io, Socket } from "socket.io-client";
import type { LiveScorecard, UnifiedScorecard } from "../types/scorecard";

export interface ScorecardWebSocketEvents {
  // Client events
  "join-scorecard": (data: { matchId: string }) => void;
  "leave-scorecard": (data: { matchId: string }) => void;
  "get-scorecard": (data: { matchId: string }) => void;
  "get-live-scorecard": (data: { matchId: string }) => void;

  // Server events
  "scorecard-updated": (scorecard: UnifiedScorecard) => void;
  "live-scorecard-updated": (liveScorecard: LiveScorecard) => void;
  "innings-updated": (data: {
    matchId: string;
    inningsNumber: number;
    innings: any;
  }) => void;
  "player-updated": (data: {
    matchId: string;
    playerId: string;
    stats: any;
  }) => void;
  "ball-added": (data: { matchId: string; ball: any }) => void;
  "commentary-added": (data: { matchId: string; commentary: any }) => void;
  "partnership-updated": (data: { matchId: string; partnership: any }) => void;
  "power-play-updated": (data: { matchId: string; powerPlay: any }) => void;
  "match-status-changed": (data: { matchId: string; status: string }) => void;
  "scorecard-error": (error: { message: string; code: string }) => void;
}

class ScorecardWebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.socket = io("http://localhost:5000/scorecard", {
        transports: ["websocket", "polling"],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("🎯 Scorecard WebSocket connected");
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🎯 Scorecard WebSocket disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🎯 Scorecard WebSocket connection error:", error);
      this.isConnected = false;
    });

    this.socket.on("reconnect", (attemptNumber: number) => {
      console.log(
        "🎯 Scorecard WebSocket reconnected after",
        attemptNumber,
        "attempts"
      );
      this.isConnected = true;
    });

    this.socket.on("reconnect_error", (error: any) => {
      console.error("🎯 Scorecard WebSocket reconnection error:", error);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("🎯 Scorecard WebSocket reconnection failed");
    });
  }

  // Join scorecard room for a specific match
  joinScorecard(matchId: string) {
    if (!this.socket || !this.isConnected) {
      console.warn("WebSocket not connected, cannot join scorecard");
      return;
    }

    console.log("🎯 Joining scorecard room for match:", matchId);
    this.socket.emit("join-scorecard", { matchId });
  }

  // Leave scorecard room
  leaveScorecard(matchId: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    console.log("🎯 Leaving scorecard room for match:", matchId);
    this.socket.emit("leave-scorecard", { matchId });
  }

  // Request scorecard data
  getScorecard(matchId: string) {
    if (!this.socket || !this.isConnected) {
      console.warn("WebSocket not connected, cannot get scorecard");
      return;
    }

    this.socket.emit("get-scorecard", { matchId });
  }

  // Request live scorecard data
  getLiveScorecard(matchId: string) {
    if (!this.socket || !this.isConnected) {
      console.warn("WebSocket not connected, cannot get live scorecard");
      return;
    }

    this.socket.emit("get-live-scorecard", { matchId });
  }

  // Listen for scorecard updates
  onScorecardUpdated(callback: (scorecard: UnifiedScorecard) => void) {
    if (!this.socket) return;

    this.socket.on("scorecard-updated", callback);
  }

  // Listen for live scorecard updates
  onLiveScorecardUpdated(callback: (liveScorecard: LiveScorecard) => void) {
    if (!this.socket) return;

    this.socket.on("live-scorecard-updated", callback);
  }

  // Listen for innings updates
  onInningsUpdated(
    callback: (data: {
      matchId: string;
      inningsNumber: number;
      innings: any;
    }) => void
  ) {
    if (!this.socket) return;

    this.socket.on("innings-updated", callback);
  }

  // Listen for player updates
  onPlayerUpdated(
    callback: (data: { matchId: string; playerId: string; stats: any }) => void
  ) {
    if (!this.socket) return;

    this.socket.on("player-updated", callback);
  }

  // Listen for ball additions
  onBallAdded(callback: (data: { matchId: string; ball: any }) => void) {
    if (!this.socket) return;

    this.socket.on("ball-added", callback);
  }

  // Listen for commentary additions
  onCommentaryAdded(
    callback: (data: { matchId: string; commentary: any }) => void
  ) {
    if (!this.socket) return;

    this.socket.on("commentary-added", callback);
  }

  // Listen for partnership updates
  onPartnershipUpdated(
    callback: (data: { matchId: string; partnership: any }) => void
  ) {
    if (!this.socket) return;

    this.socket.on("partnership-updated", callback);
  }

  // Listen for power play updates
  onPowerPlayUpdated(
    callback: (data: { matchId: string; powerPlay: any }) => void
  ) {
    if (!this.socket) return;

    this.socket.on("power-play-updated", callback);
  }

  // Listen for match status changes
  onMatchStatusChanged(
    callback: (data: { matchId: string; status: string }) => void
  ) {
    if (!this.socket) return;

    this.socket.on("match-status-changed", callback);
  }

  // Listen for errors
  onError(callback: (error: { message: string; code: string }) => void) {
    if (!this.socket) return;

    this.socket.on("scorecard-error", callback);
  }

  // Remove all listeners for a specific event
  off(event: keyof ScorecardWebSocketEvents) {
    if (!this.socket) return;

    this.socket.off(event);
  }

  // Remove all listeners
  removeAllListeners() {
    if (!this.socket) return;

    this.socket.removeAllListeners();
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socket: this.socket,
    };
  }

  // Reconnect manually
  reconnect() {
    this.disconnect();
    setTimeout(() => {
      this.connect();
    }, 1000);
  }
}

export const scorecardWebSocketService = new ScorecardWebSocketService();
