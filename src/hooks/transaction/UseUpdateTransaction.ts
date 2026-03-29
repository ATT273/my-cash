import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ITransaction } from "@/types/transaction.types";
import { TRANSACTION_ROUTES } from "@/constants/api.constants";

type UpdateTransactionInput = {
  id: string;
  data: Partial<Omit<ITransaction, "id" | "createdAt" | "updatedAt">>;
};

const updateTransaction = async ({ id, data }: UpdateTransactionInput): Promise<{ success: boolean; transaction: ITransaction }> => {
  const res = await fetch(TRANSACTION_ROUTES.BY_ID(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update transaction");
  return res.json();
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
};
