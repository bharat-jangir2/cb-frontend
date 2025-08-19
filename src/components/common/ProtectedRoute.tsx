import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  console.log("🔒 ProtectedRoute rendering with:", {
    isAuthenticated,
    user: user ? { id: user.id, email: user.email, role: user.role } : null,
    isLoading,
    requiredRole,
    hasRequiredRole: requiredRole ? user?.role === requiredRole : true,
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
  });

  if (isLoading) {
    console.log("⏳ ProtectedRoute - Still loading, showing spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cricket-green"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("🚫 ProtectedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log("🚫 ProtectedRoute - User role doesn't match required role:", {
      userRole: user?.role,
      requiredRole,
    });
    return <Navigate to="/" replace />;
  }

  console.log("✅ ProtectedRoute - Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
