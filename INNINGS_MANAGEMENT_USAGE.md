# Innings Management System - Usage Guide

## Overview
The innings management system provides comprehensive control over cricket match innings with real-time updates, player management, and automatic progression logic. This system is fully integrated with the cricket scoring frontend and provides both admin and user interfaces.

## Features Implemented

### ✅ Core Features
- [x] Innings overview panel with both innings display
- [x] Innings details panel with comprehensive statistics
- [x] Innings control panel for admin operations
- [x] Current players management panel
- [x] Innings statistics display
- [x] Real-time innings updates via polling
- [x] Auto-progression logic for innings ending
- [x] Error handling and fallbacks
- [x] Toast notifications for all operations

### ✅ Advanced Features
- [x] Innings comparison tools
- [x] Partnership analysis
- [x] Player statistics tracking
- [x] Innings templates
- [x] Export-ready data structure
- [x] Innings alerts and notifications

### ✅ Integration Points
- [x] Scoreboard integration
- [x] Ball-by-ball scoring integration
- [x] Player management integration
- [x] Power play integration
- [x] DRS integration
- [x] Match settings integration

## How to Use

### 1. Accessing Innings Management

#### For Admins/Scorers:
Navigate to the admin scoring page:
```
http://localhost:5173/admin/matches/{matchId}/scoring
```

Click on the "Innings" tab to access the innings management interface.

#### For Users:
Navigate to the innings page:
```
http://localhost:5173/innings/{matchId}
```

### 2. Innings Overview Panel

The overview panel shows both innings with:
- **Current Innings Indicator**: Highlights which innings is currently active
- **Score Display**: Shows runs/wickets and overs for each innings
- **Status Badges**: Visual indicators for innings status (Not Started, In Progress, Completed)
- **Quick Actions**: Admin-only buttons for starting/ending innings

#### Features:
- Click on any innings card to switch to that innings
- View match summary statistics when both innings are completed
- Real-time updates every 10 seconds

### 3. Innings Details Panel

Provides detailed information about the selected innings:

#### Basic Information:
- **Teams**: Batting and bowling team names
- **Timing**: Start time, end time, and duration
- **Result**: Innings result with description (if completed)

#### Statistics:
- **Score**: Runs, wickets, overs, extras
- **Rates**: Run rate and required run rate (for second innings)
- **Boundaries**: Fours and sixes count
- **Current Players**: Striker, non-striker, and bowler
- **Power Play**: Current power play status and details
- **DRS Reviews**: Used and remaining reviews

#### Admin Features:
- **Edit Mode**: Click "Edit" to modify innings statistics
- **Inline Editing**: Change runs, wickets, overs, extras, boundaries, sixes
- **Save/Cancel**: Confirm or discard changes

### 4. Innings Control Panel

Admin-only panel for managing innings progression:

#### Primary Controls:
- **Start Innings**: Begin an innings (only for NOT_STARTED status)
- **End Innings**: End an innings with result selection
- **Declare Innings**: Declare an innings (only for IN_PROGRESS status)
- **Pause/Resume**: Pause or resume an innings

#### Emergency Controls:
- **Force End Innings**: Emergency termination with confirmation
- **Abandon Innings**: Abandon innings with confirmation

#### Current Status:
- **Live Statistics**: Real-time display of runs, wickets, overs, run rate
- **Status Indicator**: Visual status badge

### 5. Current Players Panel

Manage players currently on the field:

#### Display:
- **Striker**: Current striker with statistics
- **Non-Striker**: Current non-striker with statistics
- **Bowler**: Current bowler with statistics
- **Last Updated**: Timestamp of last player change

#### Admin Features:
- **Edit Mode**: Click "Edit" to change players
- **Player Selection**: Dropdown menus for each position
- **Player Swap**: Quick swap between striker and non-striker
- **Save/Cancel**: Confirm or discard changes

### 6. Innings Statistics Panel

Comprehensive statistics display:

#### Overview Statistics:
- **Total Innings**: Number of innings in the match
- **In Progress**: Number of active innings
- **Completed**: Number of finished innings
- **Partnerships**: Number of partnerships recorded

#### Recent Partnerships:
- **Player Pairs**: Names of players in partnership
- **Overs**: Partnership duration
- **Runs**: Partnership runs scored

#### Top Performers:
- **Batting**: Top 3 batsmen by runs scored
- **Bowling**: Top 3 bowlers by wickets taken

## API Integration

### Base Endpoints
All innings operations use the base URL:
```
http://localhost:5000/api/matches/{matchId}/innings
```

### Authentication
All endpoints require JWT authentication:
```
Authorization: Bearer <jwt_token>
```

### Available Operations

#### Get All Innings
```typescript
GET /matches/{matchId}/innings
```

#### Get Specific Innings
```typescript
GET /matches/{matchId}/innings/{inningsNumber}
```

#### Update Innings
```typescript
PATCH /matches/{matchId}/innings/{inningsNumber}
```

#### Start Innings
```typescript
PATCH /matches/{matchId}/innings/{inningsNumber}
Body: { status: "in_progress", startTime: "2024-01-01T10:00:00Z" }
```

#### End Innings
```typescript
PATCH /matches/{matchId}/innings/{inningsNumber}
Body: { 
  status: "completed", 
  endTime: "2024-01-01T12:00:00Z",
  result: "all_out",
  resultDescription: "All out"
}
```

#### Update Current Players
```typescript
PATCH /matches/{matchId}/innings/{inningsNumber}
Body: {
  currentPlayers: {
    striker: "player_id_1",
    nonStriker: "player_id_2", 
    bowler: "player_id_3",
    lastUpdated: "2024-01-01T10:30:00Z"
  }
}
```

## Auto-Progression Logic

The system automatically ends innings based on:

### 1. All Out
- **Trigger**: Wicket event when wickets >= 10
- **Result**: `all_out`
- **Description**: "All out - Auto progression"

### 2. Overs Completed
- **Trigger**: Over change event when overs >= maxOvers (default: 20)
- **Result**: `overs_completed`
- **Description**: "Overs completed - Auto progression"

### 3. Target Reached (Second Innings)
- **Trigger**: Ball event when runs >= first innings runs
- **Result**: `target_reached`
- **Description**: "Target reached - Auto progression"

## Error Handling

### Network Errors
- **Retry Logic**: Automatic retry with exponential backoff
- **Fallback Data**: Graceful degradation with cached data
- **User Feedback**: Toast notifications for all errors

### Validation Errors
- **Client-Side**: Real-time validation with error messages
- **Server-Side**: API validation with detailed error responses
- **Data Integrity**: Automatic rollback on failed operations

### Common Error Scenarios
- **404**: Match or innings not found
- **400**: Invalid innings data
- **409**: Innings already in progress
- **401**: Unauthorized access
- **500**: Server error

## Real-Time Updates

### Polling Strategy
- **Innings Data**: Refreshed every 10 seconds
- **Current Innings**: Refreshed every 5 seconds
- **Partnerships**: Refreshed on demand
- **Player Stats**: Refreshed on demand

### WebSocket Integration (Planned)
```typescript
// Future implementation
socket.on('innings_updated', (data) => {
  // Update innings data in real-time
});

socket.on('ball_added', (data) => {
  // Trigger auto-progression logic
});

socket.on('players_updated', (data) => {
  // Update current players
});
```

## Performance Optimizations

### Caching Strategy
- **React Query**: Automatic caching with invalidation
- **Optimistic Updates**: Immediate UI updates with rollback
- **Background Refetching**: Non-blocking data updates

### Loading States
- **Skeleton Loaders**: Placeholder content during loading
- **Progressive Loading**: Load critical data first
- **Error Boundaries**: Graceful error handling

## Security Considerations

### Access Control
- **Role-Based**: Admin/scorer vs user permissions
- **Token Validation**: JWT authentication for all operations
- **Input Sanitization**: Client and server-side validation

### Data Integrity
- **Consistency Checks**: Validate innings state consistency
- **Conflict Resolution**: Handle concurrent modifications
- **Audit Logging**: Track all innings modifications

## Troubleshooting

### Common Issues

#### 1. Innings Not Loading
- **Check**: Network connectivity and API availability
- **Solution**: Refresh page or check server status

#### 2. Auto-Progression Not Working
- **Check**: Ball events are being sent correctly
- **Solution**: Verify ball-by-ball scoring integration

#### 3. Player Changes Not Saving
- **Check**: User permissions and API response
- **Solution**: Ensure admin role and valid player IDs

#### 4. Real-Time Updates Not Working
- **Check**: Polling intervals and network connectivity
- **Solution**: Manual refresh or check API endpoints

### Debug Information
- **Console Logs**: Detailed error logging for all operations
- **Network Tab**: Monitor API requests and responses
- **React DevTools**: Inspect component state and props

## Best Practices

### For Developers
1. **Error Handling**: Always implement proper error boundaries
2. **Loading States**: Show appropriate loading indicators
3. **Validation**: Validate data on both client and server
4. **Testing**: Test all edge cases and error scenarios
5. **Documentation**: Keep API documentation updated

### For Users
1. **Permissions**: Ensure proper role assignment
2. **Data Entry**: Double-check critical data before saving
3. **Backup**: Export important data regularly
4. **Training**: Train users on proper usage procedures

## Future Enhancements

### Planned Features
- [ ] WebSocket real-time updates
- [ ] Advanced statistics and analytics
- [ ] Innings templates and presets
- [ ] Mobile-optimized interface
- [ ] Offline support with sync
- [ ] Advanced reporting and exports

### Integration Opportunities
- [ ] Video analysis integration
- [ ] Social media sharing
- [ ] Fantasy cricket integration
- [ ] Live streaming integration
- [ ] AI-powered insights

## Support

For technical support or feature requests:
1. Check the troubleshooting section above
2. Review console logs for error details
3. Contact the development team with specific error messages
4. Provide steps to reproduce issues

---

This innings management system provides a robust, user-friendly interface for managing cricket match innings with comprehensive features and excellent error handling. The system is designed to be scalable, maintainable, and user-friendly for both administrators and regular users.
