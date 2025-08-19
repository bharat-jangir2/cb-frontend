import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesAPI } from "../services/api/matches.service";

export const useMatch = (matchId: string) => {
  return useQuery({
    queryKey: ["match", matchId],
    queryFn: () => matchesAPI.getMatch(matchId),
    staleTime: 30000, // 30 seconds
    enabled: !!matchId,
  });
};

export const useMatchWithData = (matchId: string) => {
  const queryClient = useQueryClient();

  const match = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => matchesAPI.getMatch(matchId),
    enabled: !!matchId,
  });

  const innings = useQuery({
    queryKey: ["innings", matchId],
    queryFn: () => matchesAPI.getInnings(matchId),
    enabled: !!matchId,
  });

  const recentBalls = useQuery({
    queryKey: ["balls", matchId, "recent"],
    queryFn: () => matchesAPI.getLatestBalls(matchId, 10),
    enabled: !!matchId,
    refetchInterval: 5000, // Refresh every 5 seconds for live matches
  });

  const playerStats = useQuery({
    queryKey: ["player-stats", matchId],
    queryFn: () => matchesAPI.getPlayerStats(matchId),
    enabled: !!matchId,
  });

  const partnerships = useQuery({
    queryKey: ["partnerships", matchId],
    queryFn: () => matchesAPI.getPartnerships(matchId),
    enabled: !!matchId,
  });

  const events = useQuery({
    queryKey: ["events", matchId],
    queryFn: () => matchesAPI.getEvents(matchId),
    enabled: !!matchId,
  });

  return {
    match: match.data,
    innings: innings.data,
    recentBalls: recentBalls.data,
    playerStats: playerStats.data,
    partnerships: partnerships.data,
    events: events.data,
    isLoading: match.isLoading || innings.isLoading,
    error: match.error || innings.error,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
      queryClient.invalidateQueries({ queryKey: ["innings", matchId] });
      queryClient.invalidateQueries({ queryKey: ["balls", matchId] });
    },
  };
};

export const useMatches = (params = {}) => {
  return useQuery({
    queryKey: ["matches", params],
    queryFn: () => matchesAPI.getMatches(params),
    staleTime: 60000, // 1 minute
  });
};

export const useLiveMatches = () => {
  return useQuery({
    queryKey: ["live-matches"],
    queryFn: () => matchesAPI.getLiveMatches(),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // 10 seconds
  });
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => matchesAPI.createMatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["live-matches"] });
    },
  });
};

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, data }: { matchId: string; data: any }) =>
      matchesAPI.updateMatch(matchId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["match", variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["live-matches"] });
    },
  });
};

export const useUpdateMatchStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      matchId,
      statusData,
    }: {
      matchId: string;
      statusData: any;
    }) => matchesAPI.updateMatchStatus(matchId, statusData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["match", variables.matchId] });
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["live-matches"] });
    },
  });
};

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => matchesAPI.deleteMatch(matchId),
    onSuccess: (data, matchId) => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["live-matches"] });
      queryClient.removeQueries({ queryKey: ["match", matchId] });
    },
  });
};
