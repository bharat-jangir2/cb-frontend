# 🏏 Cricket Live Score Platform Frontend

A comprehensive React frontend for a cricket live-score platform similar to Crex.live, featuring real-time scoring, AI agents, and comprehensive match management.

## 🚀 Features

### Core Functionality

- **Authentication & Authorization**: JWT-based login/logout/refresh with role-based access control
- **User Management**: Admin, scorer, and viewer roles with comprehensive user CRUD operations
- **Team & Player Management**: Global player profiles with career stats and match-specific assignments
- **Match Management**: Complete match lifecycle from scheduling to completion
- **Ball-by-Ball Scoring**: Real-time scoring with undo functionality and event tracking
- **AI Agent System**: Intelligent agents that process match events and update odds
- **Real-time Updates**: WebSocket-based live score updates and notifications
- **Odds Management**: AI-powered betting odds calculation and management

### Technical Features

- **React 18 with TypeScript**: Modern React with full type safety
- **Vite**: Fast development and build tooling
- **React Router v6**: Client-side routing with protected routes
- **Socket.IO Client**: Real-time WebSocket communication
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Query (TanStack Query)**: Server state management and caching
- **Zustand**: Lightweight state management
- **React Hook Form**: Form handling with validation
- **React Hot Toast**: Toast notifications
- **React Icons**: Icon library

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cb-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_SOCKET_URL=http://localhost:3000
   VITE_APP_NAME=Cricket Live Score
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api
   - Backend Socket: http://localhost:3000

## 📚 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Layout and shared components
│   └── matches/        # Match-specific components
├── pages/              # Page components
│   └── Admin/          # Admin-specific pages
├── services/           # API and WebSocket services
├── stores/             # State management (Zustand)
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## 🎨 Design System

### Color Palette

- **Primary Green**: `#22c55e` (cricket-green)
- **Secondary Gold**: `#f59e0b` (cricket-gold)
- **Accent Red**: `#ef4444` (cricket-red)
- **Neutral Blue**: `#3b82f6` (cricket-blue)
- **Dark**: `#1f2937` (cricket-dark)

### Typography

- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

### Components

- **Buttons**: Primary, secondary, and outline variants
- **Cards**: Consistent card layouts with shadows
- **Forms**: Styled form inputs with validation
- **Tables**: Responsive data tables
- **Modals**: Overlay dialogs for actions

## 🔐 Authentication

### User Roles

- **Admin**: Full system access, user management, AI agent control
- **Scorer**: Match scoring, player management, basic admin functions
- **Viewer**: Read-only access to matches and statistics

### JWT Token Management

- Automatic token refresh on 401 errors
- Persistent authentication state
- Secure token storage in Zustand store

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Mobile-first design with bottom navigation

## 🔌 API Integration

### REST API Endpoints

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Teams**: `/api/teams/*`
- **Players**: `/api/players/*`
- **Matches**: `/api/matches/*`
- **Odds**: `/api/matches/:id/odds/*`
- **Agents**: `/api/matches/:id/agent/*`

### WebSocket Events

- **Client → Server**: `join_match`, `ball.apply`, `ball.undo`, `player.update`
- **Server → Client**: `score.state`, `score.diff`, `ball.applied`, `odds.update`

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Environment Variables for Production

```env
VITE_API_URL=https://your-api-domain.com/api
VITE_SOCKET_URL=https://your-api-domain.com
VITE_APP_NAME=Cricket Live Score
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## 🎯 Key Features

### Live Match Scoring

- Real-time ball-by-ball scoring
- Undo functionality for corrections
- Live commentary and statistics
- WebSocket-based updates

### AI Agent Management

- Start/stop/pause AI agents
- Real-time agent status monitoring
- Automatic odds calculation
- Anomaly detection alerts

### Team & Player Management

- Complete CRUD operations
- Player statistics and profiles
- Team rosters and assignments
- Search and filtering

### Admin Dashboard

- System overview with key metrics
- User management interface
- AI agent monitoring
- Quick action buttons

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Secure API communication
- Input validation and sanitization
- CORS configuration
- Rate limiting support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation
- Review the code examples

## 🔮 Future Enhancements

- Machine learning-based predictions
- Advanced analytics dashboard
- Multi-language support
- Mobile app development
- Integration with external APIs
- Advanced reporting features
