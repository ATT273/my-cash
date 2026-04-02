import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TRANSACTION_ROUTES } from "@/constants/api.constants";

const deleteTransaction = async (id: string): Promise<{ success: boolean }> => {
  const res = await fetch(TRANSACTION_ROUTES.BY_ID(id), { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete transaction");
  return res.json();
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["budget"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
};
