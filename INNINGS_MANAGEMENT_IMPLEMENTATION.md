# Innings Management System Implementation

## Overview
This document provides a comprehensive guide to the innings management system implemented in the cricket scoring frontend. The system provides both admin and user interfaces for managing cricket innings with real-time updates, player management, and detailed statistics.

## Architecture

### 1. Type Definitions (`src/types/innings.ts`)
- **InningsStatus**: Enum for innings states (NOT_STARTED, IN_PROGRESS, COMPLETED, DECLARED)
- **InningsResult**: Enum for innings end results (ALL_OUT, TARGET_REACHED, OVERS_COMPLETED, DECLARATION)
- **Innings**: Main interface containing all innings data
- **CurrentPlayers**: Interface for current players on field
- **Partnership**: Interface for partnership data
- **PlayerMatchStats**: Interface for player statistics

### 2. API Service (`src/services/innings.service.ts`)
- **getAllInnings**: Fetch all innings for a match
- **getInnings**: Get specific innings by number
- **updateInnings**: Update innings data
- **startInnings**: Start an innings
- **endInnings**: End an innings with result
- **declareInnings**: Declare an innings
- **updateCurrentPlayers**: Update current players on field
- **getPartnershipsByInnings**: Get partnerships for an innings
- **getPlayerStatsByInnings**: Get player statistics for an innings

### 3. React Hook (`src/hooks/useInnings.ts`)
- **State Management**: Manages innings data, current innings, partnerships, and player stats
- **Mutations**: Handles all CRUD operations for innings
- **Real-time Updates**: Auto-refreshes data every 5-10 seconds
- **Auto-progression**: Automatically handles innings progression based on match events
- **Helper Functions**: Provides utility functions for data manipulation

## Components

### 1. InningsOverviewPanel (`src/components/innings/InningsOverviewPanel.tsx`)
**Purpose**: Displays overview of both innings with scores and status

**Features**:
- Shows both first and second innings side by side
- Displays current innings indicator
- Shows innings status with color coding
- Admin controls for starting/ending innings
- Match summary statistics
- Quick innings switching

**Props**:
```typescript
interface InningsOverviewProps {
  matchId: string;
  innings: Innings[];
  currentInnings: Innings | null;
  currentInningsNumber: number;
  onInningsChange: (inningsNumber: number) => void;
  onStartInnings?: (inningsNumber: number) => void;
  onEndInnings?: (inningsNumber: number, result: InningsResult) => void;
  isAdmin?: boolean;
}
```

### 2. InningsDetailsPanel (`src/components/innings/InningsDetailsPanel.tsx`)
**Purpose**: Shows detailed innings information and allows editing

**Features**:
- Complete innings statistics display
- Current players information
- Power play status
- DRS reviews tracking
- Inline editing for admin users
- Timing information
- Result details

**Props**:
```typescript
interface InningsDetailsProps {
  innings: Innings;
  onInningsUpdate: (updateData: InningsUpdateData) => void;
  isAdmin?: boolean;
}
```

### 3. InningsControlPanel (`src/components/innings/InningsControlPanel.tsx`)
**Purpose**: Provides innings management controls for admins

**Features**:
- Start/End innings buttons
- Declare innings option
- Pause/Resume functionality
- Emergency controls
- Modal dialogs for confirmations
- Current status display

**Props**:
```typescript
interface InningsControlProps {
  matchId: string;
  innings: Innings;
  onInningsStarted: () => void;
  onInningsEnded: (result: InningsResult, description?: string) => void;
  onInningsDeclared: (description?: string) => void;
  onInningsPaused: () => void;
  onInningsResumed: () => void;
  isAdmin?: boolean;
}
```

### 4. CurrentPlayersPanel (`src/components/innings/CurrentPlayersPanel.tsx`)
**Purpose**: Manages current players on the field

**Features**:
- Striker, non-striker, and bowler display
- Player selection dropdowns
- Player swap functionality
- Player statistics preview
- Real-time updates
- Admin-only editing

**Props**:
```typescript
interface CurrentPlayersProps {
  innings: Innings;
  availablePlayers: Player[];
  onPlayerChange: (position: 'striker' | 'nonStriker' | 'bowler', playerId: string) => void;
  onPlayerSwap: (position1: 'striker' | 'nonStriker', position2: 'striker' | 'nonStriker') => void;
  isAdmin?: boolean;
}
```

### 5. InningsManagement (`src/components/innings/InningsManagement.tsx`)
**Purpose**: Main component that combines all panels

**Features**:
- Tabbed interface with 5 tabs
- Role-based access control
- Comprehensive statistics
- Real-time data updates
- Responsive design

**Props**:
```typescript
interface InningsManagementProps {
  matchId: string;
  isAdmin?: boolean;
}
```

## Usage

### Admin Interface
Access via: `/admin/matches/{matchId}/scoring` → Innings tab

**Features Available**:
- Full innings management controls
- Player management
- Statistics editing
- Emergency controls
- Real-time updates

### User Interface
Access via: `/innings/{matchId}`

**Features Available**:
- View-only access to innings data
- Statistics viewing
- Partnership information
- Player statistics
- No editing capabilities

## API Endpoints

### Base URL
```
http://localhost:5000/api/matches
```

### Authentication
All endpoints require JWT authentication with admin or scorer role:
```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### Get All Innings
```
GET /{matchId}/innings
```

#### Get Specific Innings
```
GET /{matchId}/innings/{inningsNumber}
```

#### Update Innings
```
PATCH /{matchId}/innings/{inningsNumber}
```

#### Start Innings
```
PATCH /{matchId}/innings/{inningsNumber}
Body: { "status": "in_progress", "startTime": "2024-01-01T10:00:00Z" }
```

#### End Innings
```
PATCH /{matchId}/innings/{inningsNumber}
Body: { 
  "status": "completed", 
  "endTime": "2024-01-01T12:00:00Z",
  "result": "all_out",
  "resultDescription": "All out"
}
```

#### Update Current Players
```
PATCH /{matchId}/innings/{inningsNumber}
Body: {
  "currentPlayers": {
    "striker": "player_id",
    "nonStriker": "player_id", 
    "bowler": "player_id",
    "lastUpdated": "2024-01-01T10:00:00Z"
  }
}
```

#### Get Partnerships
```
GET /{matchId}/partnerships/{innings}
```

#### Get Player Stats
```
GET /{matchId}/player-stats/{innings}
```

## State Management

### React Query Integration
- **Queries**: Automatically cache and refetch data
- **Mutations**: Handle API calls with optimistic updates
- **Real-time**: Auto-refresh every 5-10 seconds
- **Error Handling**: Toast notifications for errors

### Local State
- **Current Innings**: Tracks which innings is being viewed
- **Active Tab**: Manages tab navigation
- **Edit Mode**: Tracks editing state for forms

## Real-time Features

### WebSocket Integration (Planned)
```typescript
// Subscribe to innings updates
socket.on('innings_updated', (data) => {
  queryClient.invalidateQueries({ queryKey: ['innings', matchId] });
});

// Subscribe to ball updates
socket.on('ball_added', (data) => {
  checkInningsAutoProgression(data.ball);
});

// Subscribe to player changes
socket.on('players_updated', (data) => {
  queryClient.invalidateQueries({ queryKey: ['innings', matchId, currentInningsNumber] });
});
```

### Auto-progression Logic
```typescript
function checkInningsAutoProgression(ball: Ball) {
  const current = getCurrentInnings();
  
  // Check if innings should end due to all out
  if (ball.eventType === 'wicket' && current.wickets >= 10) {
    endInnings(matchId, current.inningsNumber, 'all_out');
  }
  
  // Check if innings should end due to overs completed
  if (ball.eventType === 'over_change' && ball.over >= 20) {
    endInnings(matchId, current.inningsNumber, 'overs_completed');
  }
  
  // Check if target reached (for second innings)
  if (current.inningsNumber === 2 && current.runs >= getTargetScore()) {
    endInnings(matchId, current.inningsNumber, 'target_reached');
  }
}
```

## Error Handling

### API Errors
```typescript
try {
  await startInnings(matchId, inningsNumber);
} catch (error) {
  if (error.status === 404) {
    showError('Match or innings not found');
  } else if (error.status === 400) {
    showError('Invalid innings data');
  } else if (error.status === 409) {
    showError('Innings already in progress');
  } else if (error.status === 401) {
    showError('Unauthorized - Please login');
  } else {
    showError('Failed to start innings');
  }
}
```

### Validation
```typescript
function validateInningsData(data: Partial<Innings>) {
  if (data.inningsNumber && (data.inningsNumber < 1 || data.inningsNumber > 2)) {
    throw new Error('Innings number must be 1 or 2');
  }
  if (data.runs && data.runs < 0) {
    throw new Error('Runs cannot be negative');
  }
  if (data.wickets && (data.wickets < 0 || data.wickets > 10)) {
    throw new Error('Wickets must be between 0 and 10');
  }
  if (data.overs && data.overs < 0) {
    throw new Error('Overs cannot be negative');
  }
}
```

## Styling

### Design System
- **Colors**: Consistent color scheme with status indicators
- **Icons**: Font Awesome icons for visual clarity
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions and loading states

### CSS Classes
```css
/* Status Colors */
.in-progress { @apply bg-green-100 text-green-800 border-green-200; }
.completed { @apply bg-blue-100 text-blue-800 border-blue-200; }
.declared { @apply bg-purple-100 text-purple-800 border-purple-200; }
.not-started { @apply bg-gray-100 text-gray-800 border-gray-200; }

/* Player Positions */
.striker { @apply bg-green-50 border-green-200; }
.non-striker { @apply bg-blue-50 border-blue-200; }
.bowler { @apply bg-purple-50 border-purple-200; }
```

## Testing

### Unit Tests
- Component rendering tests
- Hook functionality tests
- API service tests
- Validation tests

### Integration Tests
- End-to-end innings management flow
- Admin vs user access control
- Real-time updates
- Error handling scenarios

### Manual Testing Scenarios
1. **Start Innings**: Verify innings starts correctly
2. **Update Statistics**: Test inline editing
3. **Change Players**: Test player management
4. **End Innings**: Test different end scenarios
5. **Real-time Updates**: Test data synchronization
6. **Error Handling**: Test network failures
7. **Access Control**: Test admin vs user permissions

## Performance Considerations

### Optimization
- **Debouncing**: Debounce form inputs to prevent excessive API calls
- **Caching**: React Query provides automatic caching
- **Lazy Loading**: Load components on demand
- **Memoization**: Use React.memo for expensive components

### Monitoring
- **API Response Times**: Track endpoint performance
- **Error Rates**: Monitor API failures
- **User Interactions**: Track feature usage
- **Real-time Updates**: Monitor WebSocket performance

## Security

### Access Control
- **Role-based**: Admin/scorer vs user permissions
- **JWT Validation**: Verify tokens on all requests
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent API abuse

### Data Integrity
- **Validation**: Client and server-side validation
- **Consistency**: Ensure data consistency across operations
- **Audit Trail**: Log all innings modifications
- **Backup**: Backup data before major changes

## Future Enhancements

### Planned Features
1. **Advanced Statistics**: More detailed analytics
2. **Export Functionality**: Export innings data
3. **Notifications**: Real-time alerts for milestones
4. **Mobile App**: Native mobile application
5. **Offline Support**: Work without internet connection
6. **Multi-language**: Internationalization support

### Technical Improvements
1. **WebSocket**: Real-time updates implementation
2. **GraphQL**: More efficient data fetching
3. **PWA**: Progressive web app features
4. **Performance**: Further optimization
5. **Testing**: Comprehensive test coverage

## Conclusion

The innings management system provides a comprehensive solution for managing cricket innings with both admin and user interfaces. The system is built with modern React patterns, includes real-time updates, and provides excellent user experience with responsive design and intuitive controls.

The modular architecture allows for easy maintenance and future enhancements, while the comprehensive error handling and validation ensure data integrity and user satisfaction.
