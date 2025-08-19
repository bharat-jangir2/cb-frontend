import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { matchesAPI } from "../services/api/matches.service";

export const useEvents = (matchId: string, filters = {}) => {
  return useQuery({
    queryKey: ["events", matchId, filters],
    queryFn: () => matchesAPI.getEvents(matchId, filters),
    enabled: !!matchId,
  });
};

export const useHighlights = (matchId: string, filters = {}) => {
  return useQuery({
    queryKey: ["highlights", matchId, filters],
    queryFn: () => matchesAPI.getHighlights(matchId, filters),
    enabled: !!matchId,
  });
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, eventData }: any) =>
      matchesAPI.addEvent(matchId, eventData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["events", variables.matchId],
      });
    },
  });
};
