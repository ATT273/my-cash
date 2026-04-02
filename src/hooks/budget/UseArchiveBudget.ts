import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BUDGET_ROUTES } from "@/constants/api.constants";

const archiveBudget = async (id: string): Promise<{ success: boolean }> => {
  const res = await fetch(BUDGET_ROUTES.ARCHIVE(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to archive budget");
  return res.json();
};

export const useArchiveBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
};
