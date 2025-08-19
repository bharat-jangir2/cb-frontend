import React from "react";
import { useParams } from "react-router-dom";
import { FaRocket, FaArrowLeft } from "react-icons/fa";
import { LiveMatchDashboard } from "../../components/matches/LiveMatchDashboard";

const MatchScoring: React.FC = () => {
  const { id } = useParams();

  return <LiveMatchDashboard matchId={id || ""} />;
};

export default MatchScoring;
