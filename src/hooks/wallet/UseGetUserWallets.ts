import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth.service";
import type { IWallet } from "@/types/wallet.types";
import { WALLET_ROUTES } from "@/constants/api.constants";

const fetchUserWallets = async (userId: string): Promise<IWallet[]> => {
  const res = await fetch(WALLET_ROUTES.BY_USER(userId));
  if (!res.ok) throw new Error("Failed to fetch wallets");
  return res.json();
};

export const useGetUserWallets = () => {
  const user = getCurrentUser();
  const userId = user?.id ?? "";

  return useQuery({
    queryKey: ["wallets", userId],
    queryFn: () => fetchUserWallets(userId),
    enabled: !!userId,
  });
};
