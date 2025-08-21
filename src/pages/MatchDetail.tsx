import { useParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Scorecard } from "../components/scorecard/Scorecard";

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  console.log("🎯 MatchDetail - Rendering with id:", id);
  console.log("🎯 MatchDetail - User role:", user?.role);

  // For user pages, we don't need admin functionality
  const isAdmin = false; // Always false for public match viewing

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scorecard Component - Pure user interface */}
      <Scorecard isAdmin={isAdmin} />
    </div>
  );
};

export default MatchDetail;
