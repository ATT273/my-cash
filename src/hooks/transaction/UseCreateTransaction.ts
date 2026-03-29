import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ITransaction, TransactionInput } from "@/types/transaction.types";
import { TRANSACTION_ROUTES } from "@/constants/api.constants";

const createTransaction = async (input: TransactionInput): Promise<{data: ITransaction, success: boolean}> => {
  const res = await fetch(TRANSACTION_ROUTES.BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create transaction");
  const data = await res.json();
  
  return {
    data: data.transaction,
    success: data.success
  };
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
};
