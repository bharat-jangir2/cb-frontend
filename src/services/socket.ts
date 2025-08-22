import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../stores/authStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

// Types for WebSocket events
export interface BallData {
  over: number;
  ball: number;
  innings: number;
  runs: number;
  extras: number;
  extraType: string;
  wicket: boolean;
  wicketType: string;
  dismissedPlayer: string;
  newBatsman: string;
  commentary: string;
}

export interface StrikeRotation {
  striker: string;
  nonStriker: string;
  bowler: string;
}

export interface CommentaryData {
  over: number;
  ball: number;
  innings: number;
  commentary: string;
  type: string;
}

export interface TossInfo {
  winner: string;
  decision: string;
  electedTo: string;
}

export interface SquadData {
  team1Squad: string[];
  team2Squad: string[];
}

export interface PlayingXIData {
  team1PlayingXI: string[];
  team2PlayingXI: string[];
}

export interface NotificationData {
  type: string;
  message: string;
  priority: string;
}

interface ReconnectionConfig {
  enabled: boolean;
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
}

class SocketService {
  private matchSocket: Socket | null = null;
  private scorecardSocket: Socket | null = null;
  private matchListeners: Map<string, Function[]> = new Map();
  private scorecardListeners: Map<string, Function[]> = new Map();

  // Reconnection state
  private matchReconnectAttempts = 0;
  private scorecardReconnectAttempts = 0;
  private matchReconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private scorecardReconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isReconnecting = false;

  // Configuration
  private reconnectionConfig: ReconnectionConfig = {
    enabled: true,
    maxAttempts: 10,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    jitter: true,
  };

  // Connect to match namespace
  connectToMatches(token: string) {
    if (this.matchSocket?.connected) {
      return;
    }

    this.matchSocket = io(`${SOCKET_URL}/matches`, {
      auth: { token },
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: false, // We'll handle reconnection manually
      reconnectionAttempts: 0,
      reconnectionDelay: 0,
      reconnectionDelayMax: 0,
    });

    this.matchSocket.on("connect", () => {
      console.log("✅ Connected to matches WebSocket namespace");
      this.matchReconnectAttempts = 0; // Reset attempts on successful connection
      this.isReconnecting = false;
    });

    this.matchSocket.on("disconnect", (reason) => {
      console.log("❌ Disconnected from matches WebSocket namespace:", reason);
      this.handleDisconnect("match", reason);
    });

    this.matchSocket.on("connect_error", (error) => {
      console.error("❌ Matches WebSocket connection error:", error);
      this.handleConnectionError("match", error);
    });

    this.matchSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Matches WebSocket reconnection attempt ${attemptNumber}`);
    });

    this.matchSocket.on("reconnect_failed", () => {
      console.error(
        "❌ Matches WebSocket reconnection failed after all attempts"
      );
      this.isReconnecting = false;
    });

    this.setupMatchEventListeners();
  }

  // Connect to scorecard namespace
  connectToScorecard(token: string) {
    if (this.scorecardSocket?.connected) {
      return;
    }

    this.scorecardSocket = io(`${SOCKET_URL}/scorecard`, {
      auth: { token },
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: false, // We'll handle reconnection manually
      reconnectionAttempts: 0,
      reconnectionDelay: 0,
      reconnectionDelayMax: 0,
    });

    this.scorecardSocket.on("connect", () => {
      console.log("✅ Connected to scorecard WebSocket namespace");
      this.scorecardReconnectAttempts = 0; // Reset attempts on successful connection
      this.isReconnecting = false;
    });

    this.scorecardSocket.on("disconnect", (reason) => {
      console.log(
        "❌ Disconnected from scorecard WebSocket namespace:",
        reason
      );
      this.handleDisconnect("scorecard", reason);
    });

    this.scorecardSocket.on("connect_error", (error) => {
      console.error("❌ Scorecard WebSocket connection error:", error);
      this.handleConnectionError("scorecard", error);
    });

    this.scorecardSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log(
        `🔄 Scorecard WebSocket reconnection attempt ${attemptNumber}`
      );
    });

    this.scorecardSocket.on("reconnect_failed", () => {
      console.error(
        "❌ Scorecard WebSocket reconnection failed after all attempts"
      );
      this.isReconnecting = false;
    });

    this.setupScorecardEventListeners();
  }

  // Connect to both namespaces
  connect(token: string) {
    this.connectToMatches(token);
    this.connectToScorecard(token);
  }

  disconnect() {
    // Clear any pending reconnection timers
    if (this.matchReconnectTimer) {
      clearTimeout(this.matchReconnectTimer);
      this.matchReconnectTimer = null;
    }
    if (this.scorecardReconnectTimer) {
      clearTimeout(this.scorecardReconnectTimer);
      this.scorecardReconnectTimer = null;
    }

    // Reset reconnection state
    this.matchReconnectAttempts = 0;
    this.scorecardReconnectAttempts = 0;
    this.isReconnecting = false;

    // Disconnect sockets
    if (this.matchSocket) {
      this.matchSocket.disconnect();
      this.matchSocket = null;
    }
    if (this.scorecardSocket) {
      this.scorecardSocket.disconnect();
      this.scorecardSocket = null;
    }
    this.matchListeners.clear();
    this.scorecardListeners.clear();
  }

  // Handle disconnection with reconnection logic
  private handleDisconnect(namespace: "match" | "scorecard", reason: string) {
    console.log(`🔄 ${namespace} socket disconnected:`, reason);

    // Don't reconnect if it was a manual disconnect
    if (
      reason === "io client disconnect" ||
      reason === "io server disconnect"
    ) {
      console.log(`📤 Manual disconnect for ${namespace}, not reconnecting`);
      return;
    }

    // Don't reconnect if reconnection is disabled
    if (!this.reconnectionConfig.enabled) {
      console.log(`🚫 Reconnection disabled for ${namespace}`);
      return;
    }

    // Check if we've exceeded max attempts
    const attempts =
      namespace === "match"
        ? this.matchReconnectAttempts
        : this.scorecardReconnectAttempts;
    if (attempts >= this.reconnectionConfig.maxAttempts) {
      console.error(
        `❌ Max reconnection attempts (${this.reconnectionConfig.maxAttempts}) reached for ${namespace}`
      );
      return;
    }

    // Calculate delay with exponential backoff
    const delay = this.calculateReconnectionDelay(attempts);
    console.log(
      `⏰ Scheduling ${namespace} reconnection in ${delay}ms (attempt ${
        attempts + 1
      })`
    );

    // Schedule reconnection
    const timer = setTimeout(() => {
      this.attemptReconnection(namespace);
    }, delay);

    // Store timer reference
    if (namespace === "match") {
      this.matchReconnectTimer = timer;
    } else {
      this.scorecardReconnectTimer = timer;
    }
  }

  // Handle connection errors
  private handleConnectionError(namespace: "match" | "scorecard", error: any) {
    console.error(`❌ ${namespace} connection error:`, error);

    // Increment reconnection attempts
    if (namespace === "match") {
      this.matchReconnectAttempts++;
    } else {
      this.scorecardReconnectAttempts++;
    }

    // Emit error to listeners
    this.emitToListeners(namespace, "error", {
      message: `Connection error: ${error.message || error}`,
      namespace,
      attempt:
        namespace === "match"
          ? this.matchReconnectAttempts
          : this.scorecardReconnectAttempts,
    });
  }

  // Attempt reconnection
  private attemptReconnection(namespace: "match" | "scorecard") {
    if (this.isReconnecting) {
      console.log(`⏳ Already reconnecting ${namespace}, skipping`);
      return;
    }

    this.isReconnecting = true;
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ No authentication token available for reconnection");
      this.isReconnecting = false;
      return;
    }

    console.log(`🔄 Attempting to reconnect ${namespace}...`);

    try {
      if (namespace === "match") {
        this.connectToMatches(token);
      } else {
        this.connectToScorecard(token);
      }
    } catch (error) {
      console.error(`❌ Failed to reconnect ${namespace}:`, error);
      this.isReconnecting = false;

      // Schedule another attempt if we haven't exceeded max attempts
      const attempts =
        namespace === "match"
          ? this.matchReconnectAttempts
          : this.scorecardReconnectAttempts;
      if (attempts < this.reconnectionConfig.maxAttempts) {
        const delay = this.calculateReconnectionDelay(attempts);
        console.log(`⏰ Scheduling retry for ${namespace} in ${delay}ms`);

        const timer = setTimeout(() => {
          this.attemptReconnection(namespace);
        }, delay);

        if (namespace === "match") {
          this.matchReconnectTimer = timer;
        } else {
          this.scorecardReconnectTimer = timer;
        }
      }
    }
  }

  // Calculate reconnection delay with exponential backoff and jitter
  private calculateReconnectionDelay(attempt: number): number {
    let delay =
      this.reconnectionConfig.initialDelay *
      Math.pow(this.reconnectionConfig.backoffMultiplier, attempt);

    // Cap at max delay
    delay = Math.min(delay, this.reconnectionConfig.maxDelay);

    // Add jitter to prevent thundering herd
    if (this.reconnectionConfig.jitter) {
      const jitter = delay * 0.1; // 10% jitter
      delay += Math.random() * jitter;
    }

    return Math.floor(delay);
  }

  // Update reconnection configuration
  updateReconnectionConfig(config: Partial<ReconnectionConfig>) {
    this.reconnectionConfig = { ...this.reconnectionConfig, ...config };
    console.log("⚙️ Updated reconnection config:", this.reconnectionConfig);
  }

  // Get reconnection status
  getReconnectionStatus() {
    return {
      isReconnecting: this.isReconnecting,
      matchAttempts: this.matchReconnectAttempts,
      scorecardAttempts: this.scorecardReconnectAttempts,
      config: this.reconnectionConfig,
    };
  }

  // Force reconnection
  forceReconnect(namespace?: "match" | "scorecard") {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "❌ No authentication token available for forced reconnection"
      );
      return;
    }

    if (namespace === "match" || !namespace) {
      console.log("🔄 Forcing match socket reconnection...");
      this.matchReconnectAttempts = 0;
      if (this.matchSocket) {
        this.matchSocket.disconnect();
      }
      this.connectToMatches(token);
    }

    if (namespace === "scorecard" || !namespace) {
      console.log("🔄 Forcing scorecard socket reconnection...");
      this.scorecardReconnectAttempts = 0;
      if (this.scorecardSocket) {
        this.scorecardSocket.disconnect();
      }
      this.connectToScorecard(token);
    }
  }

  private setupMatchEventListeners() {
    if (!this.matchSocket) return;

    // Match state events
    this.matchSocket.on("score.state", (data) => {
      this.emitToMatchListeners("score.state", data);
    });

    this.matchSocket.on("score.diff", (data) => {
      this.emitToMatchListeners("score.diff", data);
    });

    // Ball events
    this.matchSocket.on("ball.applied", (data) => {
      this.emitToMatchListeners("ball.applied", data);
    });

    this.matchSocket.on("ball.undone", (data) => {
      this.emitToMatchListeners("ball.undone", data);
    });

    // Player updates
    this.matchSocket.on("player.updated", (data) => {
      this.emitToMatchListeners("player.updated", data);
    });

    // Odds updates
    this.matchSocket.on("odds.update", (data) => {
      this.emitToMatchListeners("odds.update", data);
    });

    // Alerts and notifications
    this.matchSocket.on("alert.reviewNeeded", (data) => {
      this.emitToMatchListeners("alert.reviewNeeded", data);
    });

    // Strike rotation updates
    this.matchSocket.on("strike.rotation.updated", (data) => {
      this.emitToMatchListeners("strike.rotation.updated", data);
    });

    // Commentary updates
    this.matchSocket.on("commentary.added", (data) => {
      this.emitToMatchListeners("commentary.added", data);
    });

    // Toss updates
    this.matchSocket.on("toss.updated", (data) => {
      this.emitToMatchListeners("toss.updated", data);
    });

    // Squad updates
    this.matchSocket.on("squad.updated", (data) => {
      this.emitToMatchListeners("squad.updated", data);
    });

    // Playing XI updates
    this.matchSocket.on("playing.xi.updated", (data) => {
      this.emitToMatchListeners("playing.xi.updated", data);
    });

    // Notification updates
    this.matchSocket.on("notification.added", (data) => {
      this.emitToMatchListeners("notification.added", data);
    });

    // WebSocket statistics
    this.matchSocket.on("websocket.stats", (data) => {
      this.emitToMatchListeners("websocket.stats", data);
    });

    // Error events
    this.matchSocket.on("error", (data) => {
      this.emitToMatchListeners("error", data);
    });
  }

  private setupScorecardEventListeners() {
    if (!this.scorecardSocket) return;

    // Scorecard updates
    this.scorecardSocket.on("scorecard-updated", (data) => {
      this.emitToScorecardListeners("scorecard-updated", data);
    });

    // Live scorecard updates
    this.scorecardSocket.on("live-scorecard-updated", (data) => {
      this.emitToScorecardListeners("live-scorecard-updated", data);
    });

    // Scorecard data response
    this.scorecardSocket.on("scorecard-data", (data) => {
      this.emitToScorecardListeners("scorecard-data", data);
    });

    // Live scorecard data response
    this.scorecardSocket.on("live-scorecard-data", (data) => {
      this.emitToScorecardListeners("live-scorecard-data", data);
    });

    // Innings updates
    this.scorecardSocket.on("innings-updated", (data) => {
      this.emitToScorecardListeners("innings-updated", data);
    });

    // Player updates
    this.scorecardSocket.on("player-updated", (data) => {
      this.emitToScorecardListeners("player-updated", data);
    });

    // Error events
    this.scorecardSocket.on("scorecard-error", (data) => {
      this.emitToScorecardListeners("scorecard-error", data);
    });
  }

  // ===== MATCH NAMESPACE EVENTS =====

  // Join/Leave Match Rooms
  joinMatch(matchId: string) {
    if (this.matchSocket) {
      this.matchSocket.emit("join_match", { matchId });
    }
  }

  leaveMatch(matchId: string) {
    if (this.matchSocket) {
      this.matchSocket.emit("leave_match", { matchId });
    }
  }

  // Ball Scoring Events (Admin/Scorer only)
  applyBall(matchId: string, ballData: BallData) {
    if (this.matchSocket) {
      this.matchSocket.emit("ball.apply", { matchId, ballData });
    }
  }

  undoBall(matchId: string) {
    if (this.matchSocket) {
      this.matchSocket.emit("ball.undo", { matchId });
    }
  }

  // Player Management (Admin/Scorer only)
  updatePlayer(matchId: string, playerId: string, updates: any) {
    if (this.matchSocket) {
      this.matchSocket.emit("player.update", { matchId, playerId, updates });
    }
  }

  // Strike Rotation Management (Admin/Scorer only)
  updateStrikeRotation(matchId: string, strikeRotation: StrikeRotation) {
    if (this.matchSocket) {
      this.matchSocket.emit("strike.rotation.update", {
        matchId,
        strikeRotation,
      });
    }
  }

  // Commentary Management (Admin/Scorer only)
  addCommentary(matchId: string, commentary: CommentaryData) {
    if (this.matchSocket) {
      this.matchSocket.emit("commentary.add", { matchId, commentary });
    }
  }

  // Toss Management (Admin/Scorer only)
  updateToss(matchId: string, tossInfo: TossInfo) {
    if (this.matchSocket) {
      this.matchSocket.emit("toss.update", { matchId, tossInfo });
    }
  }

  // Squad Management (Admin/Scorer only)
  updateSquad(matchId: string, squad: SquadData) {
    if (this.matchSocket) {
      this.matchSocket.emit("squad.update", { matchId, squad });
    }
  }

  // Playing XI Management (Admin/Scorer only)
  updatePlayingXI(matchId: string, playingXI: PlayingXIData) {
    if (this.matchSocket) {
      this.matchSocket.emit("playing.xi.update", { matchId, playingXI });
    }
  }

  // Notification Management (Admin/Scorer only)
  addNotification(matchId: string, notification: NotificationData) {
    if (this.matchSocket) {
      this.matchSocket.emit("notification.add", { matchId, notification });
    }
  }

  // WebSocket Statistics (All users)
  getWebSocketStats(matchId: string) {
    if (this.matchSocket) {
      this.matchSocket.emit("websocket.stats.get", { matchId });
    }
  }

  // ===== SCORECARD NAMESPACE EVENTS =====

  // Join/Leave Scorecard Rooms
  joinScorecard(matchId: string) {
    if (this.scorecardSocket) {
      this.scorecardSocket.emit("join-scorecard", { matchId });
    }
  }

  leaveScorecard(matchId: string) {
    if (this.scorecardSocket) {
      this.scorecardSocket.emit("leave-scorecard", { matchId });
    }
  }

  // Get Scorecard Data
  getScorecard(matchId: string) {
    if (this.scorecardSocket) {
      this.scorecardSocket.emit("get-scorecard", { matchId });
    }
  }

  getLiveScorecard(matchId: string) {
    if (this.scorecardSocket) {
      this.scorecardSocket.emit("get-live-scorecard", { matchId });
    }
  }

  // ===== EVENT LISTENERS =====

  // Match namespace listeners
  onMatch(event: string, callback: Function) {
    if (!this.matchListeners.has(event)) {
      this.matchListeners.set(event, []);
    }
    this.matchListeners.get(event)!.push(callback);
  }

  offMatch(event: string, callback?: Function) {
    if (!callback) {
      this.matchListeners.delete(event);
    } else {
      const callbacks = this.matchListeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Scorecard namespace listeners
  onScorecard(event: string, callback: Function) {
    if (!this.scorecardListeners.has(event)) {
      this.scorecardListeners.set(event, []);
    }
    this.scorecardListeners.get(event)!.push(callback);
  }

  offScorecard(event: string, callback?: Function) {
    if (!callback) {
      this.scorecardListeners.delete(event);
    } else {
      const callbacks = this.scorecardListeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // Emit to match listeners
  private emitToMatchListeners(event: string, data: any) {
    const callbacks = this.matchListeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Emit to scorecard listeners
  private emitToScorecardListeners(event: string, data: any) {
    const callbacks = this.scorecardListeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  // Generic emit to listeners
  private emitToListeners(
    namespace: "match" | "scorecard",
    event: string,
    data: any
  ) {
    if (namespace === "match") {
      this.emitToMatchListeners(event, data);
    } else {
      this.emitToScorecardListeners(event, data);
    }
  }

  // Get socket instances
  get matchSocketInstance() {
    return this.matchSocket;
  }

  get scorecardSocketInstance() {
    return this.scorecardSocket;
  }

  // Check connection status
  isMatchConnected() {
    return this.matchSocket?.connected || false;
  }

  isScorecardConnected() {
    return this.scorecardSocket?.connected || false;
  }

  // Get connection health
  getConnectionHealth() {
    return {
      match: {
        connected: this.isMatchConnected(),
        reconnecting: this.isReconnecting,
        attempts: this.matchReconnectAttempts,
      },
      scorecard: {
        connected: this.isScorecardConnected(),
        reconnecting: this.isReconnecting,
        attempts: this.scorecardReconnectAttempts,
      },
      reconnectionConfig: this.reconnectionConfig,
    };
  }
}

export const socketService = new SocketService();
