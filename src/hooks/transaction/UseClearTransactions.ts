import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TRANSACTION_ROUTES } from "@/constants/api.constants";

const clearTransactions = async (): Promise<{ success: boolean }> => {
  const res = await fetch(TRANSACTION_ROUTES.BASE, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to clear transactions");
  return res.json();
};

export const useClearTransactions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearTransactions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
