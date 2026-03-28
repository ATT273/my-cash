import { useQuery } from "@tanstack/react-query";
import type { ITransaction } from "@/types/transaction.types";
import { TRANSACTION_ROUTES } from "@/constants/api.constants";

const fetchTransactions = async (): Promise<ITransaction[]> => {
  const res = await fetch(TRANSACTION_ROUTES.BASE);
  if (!res.ok) throw new Error("Failed to fetch transactions");
  return res.json();
};

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
};
