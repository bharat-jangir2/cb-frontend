import React from "react";
import { useParams } from "react-router-dom";
import { UserScorecard } from "./UserScorecard";
import { AdminScorecard } from "./AdminScorecard";

interface ScorecardProps {
  isAdmin?: boolean;
}

export const Scorecard: React.FC<ScorecardProps> = ({ isAdmin = false }) => {
  const { id } = useParams<{ id: string }>();

  console.log("🎯 Scorecard - Rendering with id:", id);
  console.log("🎯 Scorecard - isAdmin:", isAdmin);

  // Render appropriate component based on admin status
  if (isAdmin) {
    return <AdminScorecard isAdmin={true} />;
  } else {
    return <UserScorecard isAdmin={false} />;
  }
};
