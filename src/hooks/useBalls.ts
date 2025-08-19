import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesAPI } from "../services/api/matches.service";

export const useBalls = (matchId: string, filters = {}) => {
  return useQuery({
    queryKey: ["balls", matchId, filters],
    queryFn: () => matchesAPI.getBalls(matchId, filters),
    enabled: !!matchId,
    refetchInterval: (data) => {
      // Refetch every 2 seconds for live matches
      return data?.some((ball: any) => ball.isLive) ? 2000 : false;
    },
  });
};

export const useAddBall = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, ballData }: any) =>
      matchesAPI.addBall(matchId, ballData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["balls", variables.matchId] });
      queryClient.invalidateQueries({
        queryKey: ["innings", variables.matchId],
      });
      queryClient.invalidateQueries({ queryKey: ["match", variables.matchId] });
    },
  });
};
