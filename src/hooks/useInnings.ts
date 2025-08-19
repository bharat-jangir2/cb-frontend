import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesAPI } from "../services/api/matches.service";

export const useInnings = (matchId: string, inningsNumber?: number) => {
  return useQuery({
    queryKey: ["innings", matchId, inningsNumber],
    queryFn: () => matchesAPI.getInnings(matchId, inningsNumber),
    enabled: !!matchId,
  });
};

export const useUpdateInnings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, inningsNumber, data }: any) =>
      matchesAPI.updateInnings(matchId, inningsNumber, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["innings", variables.matchId],
      });
      queryClient.invalidateQueries({ queryKey: ["match", variables.matchId] });
    },
  });
};
