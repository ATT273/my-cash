import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IWallet } from "@/types/wallet.types";
import { WALLET_ROUTES } from "@/constants/api.constants";

type UpdateWalletInput = {
  walletId: string;
  updates: Partial<Pick<IWallet, "walletName" | "amount">>;
};

const updateWallet = async ({ walletId, updates }: UpdateWalletInput): Promise<{ success: boolean; wallet: IWallet }> => {
  const res = await fetch(WALLET_ROUTES.BY_ID(walletId), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update wallet");
  return res.json();
};

export const useUpdateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
};
