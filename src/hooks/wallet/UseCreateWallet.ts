import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IWallet, WalletInput } from "@/types/wallet.types";
import { WALLET_ROUTES } from "@/constants/api.constants";

const createWallet = async (input: WalletInput): Promise<{ success: boolean; wallet: IWallet }> => {
  const res = await fetch(WALLET_ROUTES.BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create wallet");
  return res.json();
};

export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
};
