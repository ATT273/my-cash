export interface IWalletBudgetSummary {
  id: string;
  type: string;
  status: boolean;
}

export interface IWallet {
  id: string;
  userId: string;
  walletName: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  budgets?: IWalletBudgetSummary[];
}

export type WalletInput = Omit<IWallet, "id" | "createdAt" | "updatedAt" | "budgets">;
