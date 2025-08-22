import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/authStore";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";
import UserLayout from "./components/common/UserLayout";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import Matches from "./pages/Matches";
import Teams from "./pages/Teams";
import MatchDetail from "./pages/MatchDetail";
import LiveMatchPage from "./pages/LiveMatchPage";
import PlayerProfile from "./pages/PlayerProfile";
import AdminMatchDetail from "./pages/Admin/AdminMatchDetail";
import Series from "./pages/Series";
import Fixtures from "./pages/Fixtures";
import Stats from "./pages/Stats";
import Rankings from "./pages/Rankings";
import News from "./pages/News";
import Tournaments from "./pages/Tournaments";
import Fantasy from "./pages/Fantasy";
import Analytics from "./pages/Analytics";
import Community from "./pages/Community";
import Premium from "./pages/Premium";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminMatches from "./pages/Admin/Matches";
import LiveMatches from "./pages/Admin/LiveMatches";
import MatchScoring from "./pages/Admin/MatchScoring";
import MatchStats from "./pages/Admin/MatchStats";
import MatchSquad from "./pages/Admin/MatchSquad";
import MatchVenue from "./pages/Admin/MatchVenue";
import MatchScorecard from "./pages/Admin/MatchScorecard";
import Scoring from "./pages/Admin/Scoring";
import AdminTeams from "./pages/Admin/Teams";
import TeamDetail from "./pages/Admin/TeamDetail";
import TeamPlayers from "./pages/Admin/TeamPlayers";
import TeamEdit from "./pages/Admin/TeamEdit";
import AdminPlayers from "./pages/Admin/Players";
import PlayerDetail from "./pages/Admin/PlayerDetail";
import PlayerEdit from "./pages/Admin/PlayerEdit";
import PlayerStats from "./pages/Admin/PlayerStats";
import AdminUsers from "./pages/Admin/Users";
import AdminTournaments from "./pages/Admin/Tournaments";
import AdminSeries from "./pages/Admin/AdminSeries";
import CreateMatch from "./pages/Admin/CreateMatch";
import CreateTournament from "./pages/Admin/CreateTournament";
import CreateSeries from "./pages/Admin/CreateSeries";
import DebugAuth from "./components/DebugAuth";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuthStore();

  console.log("🔍 RoleBasedRedirect - User role:", user?.role);

  if (user?.role === "admin") {
    console.log("🔄 Redirecting admin to /admin");
    return <Navigate to="/admin" replace />;
  } else if (user?.role === "scorer") {
    console.log("🔄 Redirecting scorer to /manage");
    return <Navigate to="/manage" replace />;
  } else {
    console.log("🔄 Redirecting user to /");
    return <Navigate to="/" replace />;
  }
};

function App() {
  const { isAuthenticated, user, token, isLoading, initializeAuth } =
    useAuthStore();

  console.log("🚀 App component rendering with:", {
    isAuthenticated,
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    hasToken: !!token,
  });

  // Initialize authentication on app startup (only once)
  useEffect(() => {
    console.log("🔐 App - Initializing authentication");
    console.log("🔐 App - Current auth state:", {
      isAuthenticated,
      isLoading,
      hasUser: !!user,
      hasToken: !!token,
    });

    // Add a small delay to ensure the store is ready
    setTimeout(() => {
      console.log("🔐 App - Calling initializeAuth after delay");
      try {
        initializeAuth();
        console.log("🔐 App - initializeAuth called successfully");
      } catch (error) {
        console.error("🔐 App - Error calling initializeAuth:", error);
      }
    }, 100);
  }, []); // Empty dependency array - only run once on mount

  // Debug logging for auth state changes
  useEffect(() => {
    console.log("🔍 App - Auth state changed:", {
      isAuthenticated,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      hasToken: !!token,
    });
  }, [isAuthenticated, user, token]);

  // Show loading spinner while initializing auth
  if (isLoading) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/match/:id" element={<MatchDetail />} />
          <Route path="/series" element={<Series />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/rankings" element={<Rankings />} />

          {/* Root redirect based on role */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="match/:id" element={<MatchDetail />} />
            <Route path="live/:id" element={<LiveMatchPage />} />
            <Route path="series/:id" element={<Series />} />
            <Route path="team/:id" element={<Teams />} />
            <Route path="player/:id" element={<PlayerProfile />} />
            <Route path="fixtures" element={<Fixtures />} />
            <Route path="stats" element={<Stats />} />
            <Route path="rankings" element={<Rankings />} />
          </Route>

          {/* Admin Routes - Dashboard style interface */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="matches" element={<AdminMatches />} />
            <Route path="matches/live" element={<LiveMatches />} />
            <Route path="matches/create" element={<CreateMatch />} />
            <Route path="matches/:id" element={<AdminMatchDetail />} />
            <Route path="matches/:id/scoring" element={<MatchScoring />} />
            <Route path="matches/:id/stats" element={<MatchStats />} />
            <Route path="matches/:id/squad" element={<MatchSquad />} />
            <Route path="matches/:id/commentary" element={<MatchScoring />} />
            <Route path="matches/:id/venue" element={<MatchVenue />} />
            <Route path="matches/:id/scorecard" element={<MatchScorecard />} />
            <Route path="matches/:id/scoring" element={<Scoring />} />
            <Route path="teams" element={<AdminTeams />} />
            <Route path="teams/create" element={<AdminTeams />} />
            <Route path="teams/:id" element={<TeamDetail />} />
            <Route path="teams/:id/edit" element={<TeamEdit />} />
            <Route path="teams/:id/players" element={<TeamPlayers />} />
            <Route path="players" element={<AdminPlayers />} />
            <Route path="players/create" element={<AdminPlayers />} />
            <Route path="players/:id" element={<PlayerDetail />} />
            <Route path="players/:id/edit" element={<PlayerEdit />} />
            <Route path="players/stats" element={<PlayerStats />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/create" element={<AdminUsers />} />
            <Route path="users/:id" element={<AdminUsers />} />
            <Route path="tournaments" element={<AdminTournaments />} />
            <Route path="tournaments/create" element={<CreateTournament />} />
            <Route path="tournaments/:id" element={<AdminTournaments />} />
            <Route path="tournaments/:id/edit" element={<AdminTournaments />} />
            <Route path="series" element={<AdminSeries />} />
            <Route path="series/create" element={<CreateSeries />} />
            <Route path="series/:id" element={<AdminSeries />} />
            <Route path="series/:id/edit" element={<AdminSeries />} />
            <Route path="news" element={<News />} />
            <Route path="fantasy" element={<Fantasy />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="community" element={<Community />} />
            <Route path="premium" element={<Premium />} />
            <Route path="system" element={<AdminDashboard />} />
            <Route path="system/agents" element={<AdminDashboard />} />
            <Route path="system/scrapers" element={<AdminDashboard />} />
            <Route path="system/selectors" element={<AdminDashboard />} />
            <Route path="system/health" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminDashboard />} />
          </Route>

          {/* Management Routes - Dashboard style for scorers */}
          <Route
            path="/manage"
            element={
              <ProtectedRoute requiredRole="scorer">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="matches" element={<Matches />} />
            <Route path="matches/:id" element={<MatchDetail />} />
            <Route path="teams" element={<Teams />} />
            <Route path="news" element={<News />} />
            <Route path="tournaments" element={<Tournaments />} />
            <Route path="fantasy" element={<Fantasy />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="community" element={<Community />} />
            <Route path="premium" element={<Premium />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* Debug component - remove in production */}
      <DebugAuth />
    </QueryClientProvider>
  );
}

export default App;
