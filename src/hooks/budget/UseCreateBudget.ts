import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IBudget, CreateBudgetInput } from "@/types/budget-allocation.types";
import { BUDGET_ROUTES } from "@/constants/api.constants";

const createBudget = async (input: CreateBudgetInput): Promise<{ success: boolean; budget: IBudget }> => {
  const res = await fetch(BUDGET_ROUTES.BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create budget");
  return res.json();
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["budget", variables.walletId] });
      queryClient.invalidateQueries({ queryKey: ["budgets", variables.walletId] });
    },
  });
};
