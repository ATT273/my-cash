import { useQuery } from "@tanstack/react-query";
import type { ITransaction, TransactionType } from "@/types/transaction.types";
import { TRANSACTION_ROUTES } from "@/constants/api.constants";

export interface SearchTransactionParams {
  type: TransactionType;
  budgetId?: string;
  category?: string;
  from?: string;
  to?: string;
}

const fetchTransactions = async (params: SearchTransactionParams): Promise<ITransaction[]> => {
  const query = new URLSearchParams();
  if (params.type) query.set("type", params.type);
  if (params.budgetId) query.set("budgetId", params.budgetId);
  if (params.category) query.set("category", params.category);
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);

  const res = await fetch(`${TRANSACTION_ROUTES.SEARCH}?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
};

export const useSearchTransactions = (params: SearchTransactionParams) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => fetchTransactions(params),
    enabled: !!params.budgetId && !!params.from && !!params.to,
  });
};
