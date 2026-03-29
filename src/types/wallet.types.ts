export interface IWallet {
  id: string;
  userId: string;
  walletName: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export type WalletInput = Omit<IWallet, "id" | "createdAt" | "updatedAt">;
