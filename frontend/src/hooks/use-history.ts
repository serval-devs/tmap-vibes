import { AddHistory, GetHistory, HistoryItem } from "@/lib/history";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: GetHistory,
  });
}

export function useAddHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["addHistory"],
    mutationFn: (historyItem: HistoryItem) => {
      AddHistory(historyItem);
      return Promise.resolve();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["clearHistory"],
    mutationFn: () => {
      localStorage.removeItem("fakeNewsHistory");
      return Promise.resolve();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
