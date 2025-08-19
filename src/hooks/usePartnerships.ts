import { useQuery } from "@tanstack/react-query";
import { matchesAPI } from "../services/api/matches.service";

export const usePartnerships = (matchId: string, innings?: number) => {
  return useQuery({
    queryKey: ["partnerships", matchId, innings],
    queryFn: () => matchesAPI.getPartnerships(matchId, innings),
    enabled: !!matchId,
  });
};

export const useBestPartnerships = (limit = 10) => {
  return useQuery({
    queryKey: ["partnerships", "best", limit],
    queryFn: () => matchesAPI.getBestPartnerships(limit),
    staleTime: 300000, // 5 minutes
  });
};
