import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WALLET_ROUTES } from "@/constants/api.constants";

const deleteWallet = async (walletId: string): Promise<{ success: boolean }> => {
  const res = await fetch(WALLET_ROUTES.BY_ID(walletId), { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete wallet");
  return res.json();
};

export const useDeleteWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
};
