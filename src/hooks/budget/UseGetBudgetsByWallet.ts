import { useQuery } from "@tanstack/react-query";
import type { IBudget } from "@/types/budget-allocation.types";
import { BUDGET_ROUTES } from "@/constants/api.constants";

const fetchBudgetsByWallet = async (walletId: string): Promise<IBudget[]> => {
  const res = await fetch(BUDGET_ROUTES.LIST_BY_WALLET(walletId));
  if (!res.ok) throw new Error("Failed to fetch budgets");
  return res.json();
};

export const useGetBudgetsByWallet = (walletId: string) => {
  return useQuery({
    queryKey: ["budgets", walletId],
    queryFn: () => fetchBudgetsByWallet(walletId),
    enabled: !!walletId,
  });
};
