import { useQuery } from "@tanstack/react-query";
import { matchesAPI } from "../services/api/matches.service";

export const usePlayerStats = (matchId: string, playerId?: string) => {
  return useQuery({
    queryKey: ["player-stats", matchId, playerId],
    queryFn: () => matchesAPI.getPlayerStats(matchId, playerId),
    enabled: !!matchId,
  });
};
