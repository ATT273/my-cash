import { useQuery } from "@tanstack/react-query";
import type { IBudget } from "@/types/budget-allocation.types";
import { BUDGET_ROUTES } from "@/constants/api.constants";

const fetchBudgetByWallet = async (walletId: string): Promise<IBudget | null> => {
  const res = await fetch(BUDGET_ROUTES.BY_WALLET(walletId));
  if (!res.ok) throw new Error("Failed to fetch budget");
  return res.json();
};

export const useGetBudgetByWallet = (walletId: string) => {
  return useQuery({
    queryKey: ["budget", walletId],
    queryFn: () => fetchBudgetByWallet(walletId),
    enabled: !!walletId,
  });
};
