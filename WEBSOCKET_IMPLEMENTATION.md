# 🔌 WebSocket Implementation Guide

## 📋 Overview

This document describes the comprehensive WebSocket implementation for the cricket scoring system, supporting both user viewing and admin/scorer management with real-time updates.

## 🏗️ Architecture

### Namespaces

- **`/matches`** - Main match events and scoring operations
- **`/scorecard`** - Scorecard-specific events and updates

### Connection Management

- **Authentication**: JWT token-based authentication
- **Role-based Access**: ADMIN, SCORER, VIEWER roles
- **Auto-reconnection**: Automatic reconnection with exponential backoff
- **Connection Monitoring**: Real-time connection status tracking

## 🔧 Core Services

### 1. Socket Service (`src/services/socket.ts`)

The main WebSocket service that manages connections to both namespaces.

```typescript
import { socketService } from "../services/socket";

// Connect to both namespaces
socketService.connect(token);

// Join match room
socketService.joinMatch(matchId);

// Apply ball (Admin/Scorer only)
socketService.applyBall(matchId, ballData);

// Get WebSocket statistics
socketService.getWebSocketStats(matchId);
```

#### Key Features:

- **Dual Namespace Support**: Manages both `/matches` and `/scorecard` namespaces
- **Event Management**: Comprehensive event listener system
- **Type Safety**: Full TypeScript support with interfaces
- **Error Handling**: Robust error handling and reconnection logic

### 2. WebSocket Hook (`src/hooks/useWebSocket.ts`)

React hook for easy WebSocket integration in components.

```typescript
const {
  isConnected,
  isMatchConnected,
  isScorecardConnected,
  applyBall,
  undoBall,
  updateStrikeRotation,
  addCommentary,
  // ... more methods
} = useWebSocket({
  matchId: "match-id",
  token: "jwt-token",
  enabled: true,
  onMatchStateUpdate: (data) => console.log("Match state:", data),
  onBallUpdate: (data) => console.log("Ball update:", data),
  // ... more callbacks
});
```

#### Features:

- **Automatic Connection Management**: Handles connection lifecycle
- **Event Callbacks**: Configurable event handlers
- **Query Invalidation**: Automatic React Query cache invalidation
- **Cleanup**: Proper cleanup on unmount

## 🎯 Admin/Scorer Features

### WebSocket Management Component (`src/components/admin/WebSocketManagement.tsx`)

Comprehensive admin interface for managing all WebSocket operations.

#### Features:

- **Ball Scoring**: Real-time ball-by-ball scoring
- **Strike Rotation**: Update batting and bowling positions
- **Commentary**: Add live commentary
- **Toss Management**: Update toss information
- **Squad Management**: Manage team squads
- **Notifications**: Send system notifications
- **Alerts**: View system alerts and reviews

#### Usage:

```typescript
<WebSocketManagement
  matchId={selectedMatchId}
  webSocketStats={webSocketStats}
  connectionStatus={connectionStatus}
/>
```

### Admin Dashboard Integration

The admin dashboard includes:

- **WebSocket Status Monitoring**: Real-time connection status
- **Statistics Display**: WebSocket performance metrics
- **Match Selection**: Choose match for operations
- **Tabbed Interface**: Organized management sections

## 👥 User Features

### Live Match Dashboard (`src/components/matches/LiveMatchDashboard.tsx`)

Real-time match viewing with WebSocket updates.

#### Features:

- **Live Score Updates**: Real-time score display
- **Ball-by-Ball Updates**: Live ball events
- **Player Statistics**: Real-time player stats
- **Commentary**: Live commentary feed
- **Connection Status**: WebSocket connection indicators
- **Update History**: Recent updates log

### WebSocket Status Component (`src/components/common/WebSocketStatus.tsx`)

Reusable component for displaying WebSocket status.

```typescript
<WebSocketStatus matchId={matchId} showStats={true} className="mb-4" />
```

## 📡 Event System

### Match Namespace Events

#### Client → Server (Admin/Scorer)

```typescript
// Ball scoring
socket.emit("ball.apply", { matchId, ballData });

// Strike rotation
socket.emit("strike.rotation.update", { matchId, strikeRotation });

// Commentary
socket.emit("commentary.add", { matchId, commentary });

// Toss management
socket.emit("toss.update", { matchId, tossInfo });

// Squad management
socket.emit("squad.update", { matchId, squad });

// Playing XI
socket.emit("playing.xi.update", { matchId, playingXI });

// Notifications
socket.emit("notification.add", { matchId, notification });
```

#### Server → Client (All Users)

```typescript
// Match state updates
socket.on("score.state", (data) => {
  /* handle state update */
});
socket.on("score.diff", (data) => {
  /* handle score change */
});

// Ball events
socket.on("ball.applied", (data) => {
  /* handle ball applied */
});
socket.on("ball.undone", (data) => {
  /* handle ball undone */
});

// Player updates
socket.on("player.updated", (data) => {
  /* handle player update */
});

// Control events
socket.on("strike.rotation.updated", (data) => {
  /* handle rotation */
});
socket.on("commentary.added", (data) => {
  /* handle commentary */
});
socket.on("toss.updated", (data) => {
  /* handle toss update */
});

// System events
socket.on("alert.reviewNeeded", (data) => {
  /* handle alert */
});
socket.on("notification.added", (data) => {
  /* handle notification */
});
socket.on("websocket.stats", (data) => {
  /* handle stats */
});
```

### Scorecard Namespace Events

#### Client → Server (All Users)

```typescript
// Join/leave rooms
socket.emit("join-scorecard", { matchId });
socket.emit("leave-scorecard", { matchId });

// Get data
socket.emit("get-scorecard", { matchId });
socket.emit("get-live-scorecard", { matchId });
```

#### Server → Client (All Users)

```typescript
// Scorecard updates
socket.on("scorecard-updated", (data) => {
  /* handle update */
});
socket.on("live-scorecard-updated", (data) => {
  /* handle live update */
});

// Data responses
socket.on("scorecard-data", (data) => {
  /* handle data */
});
socket.on("live-scorecard-data", (data) => {
  /* handle live data */
});

// Specific updates
socket.on("innings-updated", (data) => {
  /* handle innings */
});
socket.on("player-updated", (data) => {
  /* handle player */
});
```

## 🔐 Security & Authentication

### Authentication Flow

1. **Token Validation**: JWT token required for all connections
2. **Role Verification**: Server validates user roles for admin/scorer events
3. **Event Authorization**: Events are filtered based on user permissions
4. **Connection Monitoring**: Track and log all connections

### Role-Based Access

#### ADMIN Role

- Full access to all events
- Can perform all scoring operations
- Can manage system settings
- Can view all statistics

#### SCORER Role

- Can perform scoring operations
- Can update match state
- Can add commentary
- Cannot access admin-only features

#### VIEWER Role

- Read-only access to public events
- Can view live scores and updates
- Cannot perform any write operations

## 📊 Monitoring & Statistics

### WebSocket Statistics

- **Connected Clients**: Number of active connections
- **Room Occupancy**: Users per match room
- **Event Rate**: Events per minute
- **Error Rate**: Connection and event errors
- **Performance Metrics**: Latency and throughput

### Connection Monitoring

- **Real-time Status**: Live connection indicators
- **Auto-reconnection**: Automatic retry on disconnection
- **Error Logging**: Comprehensive error tracking
- **Performance Alerts**: Notifications for issues

## 🚀 Usage Examples

### Basic Connection Setup

```typescript
import { useWebSocket } from "../hooks/useWebSocket";

function MatchComponent({ matchId }) {
  const { isConnected, joinMatch } = useWebSocket({
    matchId,
    token: localStorage.getItem("token"),
    enabled: true,
  });

  useEffect(() => {
    if (isConnected) {
      joinMatch();
    }
  }, [isConnected, joinMatch]);

  return (
    <div>
      <div className={`status ${isConnected ? "connected" : "disconnected"}`}>
        {isConnected ? "Connected" : "Disconnected"}
      </div>
    </div>
  );
}
```

### Admin Ball Scoring

```typescript
import { useWebSocket } from "../hooks/useWebSocket";

function ScoringComponent({ matchId }) {
  const { applyBall, undoBall } = useWebSocket({
    matchId,
    token: localStorage.getItem("token"),
    enabled: true,
  });

  const handleBallSubmit = (ballData) => {
    applyBall(ballData);
  };

  const handleUndo = () => {
    undoBall();
  };

  return (
    <div>
      <BallScoringForm onSubmit={handleBallSubmit} />
      <button onClick={handleUndo}>Undo Last Ball</button>
    </div>
  );
}
```

### Real-time Updates

```typescript
function LiveScoreComponent({ matchId }) {
  const [score, setScore] = useState("0/0");
  const [updates, setUpdates] = useState([]);

  const { isConnected } = useWebSocket({
    matchId,
    token: localStorage.getItem("token"),
    onScoreUpdate: (data) => {
      setScore(data.score);
      setUpdates((prev) => [...prev, data]);
    },
    onBallUpdate: (data) => {
      setUpdates((prev) => [...prev, data]);
    },
  });

  return (
    <div>
      <div className="score">{score}</div>
      <div className="updates">
        {updates.map((update, index) => (
          <div key={index}>{update.message}</div>
        ))}
      </div>
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables

```env
VITE_SOCKET_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

### Socket Configuration

```typescript
const socketConfig = {
  transports: ["websocket", "polling"],
  timeout: 20000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Failed**

   - Check server is running
   - Verify VITE_SOCKET_URL is correct
   - Check authentication token

2. **Events Not Received**

   - Verify room membership
   - Check event listener setup
   - Confirm user permissions

3. **Performance Issues**
   - Monitor event rate
   - Check connection count
   - Review error logs

### Debug Tools

- **Browser DevTools**: Network tab for WebSocket monitoring
- **Console Logging**: Comprehensive logging in socket service
- **Status Component**: Real-time connection status display

## 📈 Performance Considerations

### Optimization Tips

1. **Event Debouncing**: Debounce high-frequency events
2. **Selective Updates**: Only update necessary components
3. **Connection Pooling**: Reuse connections when possible
4. **Memory Management**: Clean up event listeners properly

### Monitoring

- **Event Rate Monitoring**: Track events per second
- **Memory Usage**: Monitor WebSocket memory consumption
- **Connection Limits**: Set appropriate connection limits
- **Error Tracking**: Monitor and alert on errors

## 🔄 Future Enhancements

### Planned Features

1. **Message Queuing**: Offline message queuing
2. **Compression**: Message compression for efficiency
3. **Load Balancing**: Multiple WebSocket servers
4. **Analytics**: Advanced WebSocket analytics
5. **Mobile Optimization**: Mobile-specific optimizations

### Scalability

- **Horizontal Scaling**: Multiple WebSocket instances
- **Redis Integration**: Shared state management
- **Load Balancing**: Distribute connections
- **Monitoring**: Advanced monitoring and alerting

---

This implementation provides a robust, scalable, and feature-rich WebSocket system for real-time cricket scoring with comprehensive admin controls and user viewing capabilities.

## 🔄 Auto-Reconnection System

### Overview

The WebSocket implementation includes a robust auto-reconnection system with exponential backoff, jitter, and comprehensive error handling.

### Features

- **Automatic Reconnection**: Automatically attempts to reconnect on disconnection
- **Exponential Backoff**: Delays increase exponentially to prevent server overload
- **Jitter**: Random delay variation to prevent thundering herd problems
- **Configurable Limits**: Maximum attempts, delays, and backoff multipliers
- **Manual Override**: Force reconnection when needed
- **Status Monitoring**: Real-time reconnection status tracking

### Configuration

```typescript
// Default reconnection configuration
const reconnectionConfig = {
  enabled: true, // Enable/disable auto-reconnection
  maxAttempts: 10, // Maximum reconnection attempts
  initialDelay: 1000, // Initial delay in milliseconds
  maxDelay: 30000, // Maximum delay in milliseconds
  backoffMultiplier: 2, // Exponential backoff multiplier
  jitter: true, // Add random jitter to delays
};
```

### Usage Examples

#### Update Reconnection Configuration

```typescript
import { socketService } from "../services/socket";

// Update reconnection settings
socketService.updateReconnectionConfig({
  maxAttempts: 15,
  initialDelay: 2000,
  maxDelay: 60000,
  backoffMultiplier: 1.5,
});
```

#### Force Reconnection

```typescript
// Force reconnect specific namespace
socketService.forceReconnect("match");
socketService.forceReconnect("scorecard");

// Force reconnect both namespaces
socketService.forceReconnect();
```

#### Monitor Reconnection Status

```typescript
// Get current reconnection status
const status = socketService.getReconnectionStatus();
console.log("Reconnection status:", status);

// Get connection health
const health = socketService.getConnectionHealth();
console.log("Connection health:", health);
```

### Reconnection Algorithm

1. **Detection**: Monitor connection state and detect disconnections
2. **Validation**: Check if reconnection should be attempted (not manual disconnect)
3. **Backoff Calculation**: Calculate delay using exponential backoff formula
4. **Jitter Addition**: Add random jitter to prevent synchronized reconnections
5. **Scheduling**: Schedule reconnection attempt with calculated delay
6. **Execution**: Attempt reconnection with fresh authentication
7. **Retry Logic**: Repeat process until max attempts reached or success

### Delay Calculation

```typescript
// Exponential backoff with jitter
delay =
  min(initialDelay * (backoffMultiplier ^ attempt), maxDelay) +
  (jitter ? random(0, delay * 0.1) : 0);
```

### Error Handling

- **Network Errors**: Automatic retry with backoff
- **Authentication Errors**: Retry with fresh token
- **Server Errors**: Retry with exponential backoff
- **Manual Disconnect**: No automatic reconnection
- **Max Attempts Reached**: Stop reconnection attempts

### Monitoring & Debugging

```typescript
// Real-time reconnection monitoring
const { isReconnecting, matchAttempts, scorecardAttempts } =
  socketService.getReconnectionStatus();

// Connection health check
const health = socketService.getConnectionHealth();
console.log("Match socket:", health.match);
console.log("Scorecard socket:", health.scorecard);
```

### UI Components

The system includes UI components for monitoring and controlling reconnection:

```typescript
<WebSocketStatus
  matchId={matchId}
  showStats={true}
  showReconnectionControls={true}
/>
```

This component provides:

- Real-time connection status
- Reconnection attempt counters
- Manual reconnection controls
- Configuration updates
- Statistics display
