import type {
  ITransaction,
  TransactionInput,
} from "@/types/transaction.types";
import { createContext, useContext } from "react";
import { useDB } from "@/components/DBProvider";
import type { Database, ParamsObject } from "sql.js";
import type { IQueryParams } from "@/types/db.types";
import type { IUser, UserInput } from "@/hooks/use-user.hooks";
import type { IWallet, WalletInput } from "@/hooks/use-wallet.hooks";

// ==========================
// Context
// ==========================
interface AppContextValue {
  db: Database | null;
  // Transaction operations
  transactions: ITransaction[];
  addTransaction: (input: TransactionInput) => Promise<{ success: boolean }>;
  updateTransaction: (id: string, data: Partial<ITransaction>) => Promise<{ success: boolean }>;
  deleteTransaction: (id: string) => Promise<{ success: boolean }>;
  clearTransactions: () => Promise<{ success: boolean }>;
  getBalance: () => { income: number; expense: number; net: number };
  reloadTransactions: () => Promise<{ success: boolean }>;
  getYearlySummary: (start: string, end: string) => ParamsObject[];
  getMonthlySummary: (start: string, end: string) => ParamsObject[];
  getIncomeTransactions: (params: IQueryParams) => ITransaction[];
  getExpenseTransactions: (params: IQueryParams) => ITransaction[];
  // User operations
  users: IUser[];
  createUser: (input: UserInput) => Promise<{ success: boolean; userId?: string }>;
  getUserByEmail: (email: string) => IUser | null;
  getUserById: (userId: string) => IUser | null;
  updateUser: (userId: string, updates: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>) => Promise<{ success: boolean }>;
  deleteUser: (userId: string) => Promise<{ success: boolean }>;
  reloadUsers: () => Promise<{ success: boolean }>;
  signIn: (userName: string, password: string) => Promise<{ success: boolean; token?: string; userId?: string; message?: string }>;
  signOut: () => Promise<{ success: boolean }>;
  getIsAuthed: () => Promise<boolean>;
  getCurrentUser: () => import("@/types/user.types").ILocalUser | null;
  // Wallet operations
  wallets: IWallet[];
  createWallet: (input: WalletInput) => Promise<{ success: boolean; walletId?: string }>;
  getWalletsByUserId: (userId: string) => IWallet[];
  getWalletById: (walletId: string) => IWallet | null;
  updateWallet: (walletId: string, updates: Partial<Omit<IWallet, "id" | "userId" | "createdAt" | "updatedAt">>) => Promise<{ success: boolean }>;
  deleteWallet: (walletId: string) => Promise<{ success: boolean }>;
  getTotalBalance: (userId: string) => number;
  reloadWallets: () => Promise<{ success: boolean }>;
  // Database operations
  exportDB: () => { success: boolean };
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ==========================
// Provider
// ==========================
export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dbContext = useDB();

  return (
    <AppContext.Provider
      value={{
        db: dbContext.db,
        // Transaction operations
        transactions: dbContext.transactions,
        addTransaction: dbContext.addTransaction,
        updateTransaction: dbContext.updateTransaction,
        deleteTransaction: dbContext.deleteTransaction,
        clearTransactions: dbContext.clearTransactions,
        getBalance: dbContext.getBalance,
        reloadTransactions: dbContext.reloadTransactions,
        getYearlySummary: dbContext.getYearlySummary,
        getMonthlySummary: dbContext.getMonthlySummary,
        getIncomeTransactions: dbContext.getIncomeTransactions,
        getExpenseTransactions: dbContext.getExpenseTransactions,
        // User operations
        users: dbContext.users,
        createUser: dbContext.createUser,
        getUserByEmail: dbContext.getUserByEmail,
        getUserById: dbContext.getUserById,
        updateUser: dbContext.updateUser,
        deleteUser: dbContext.deleteUser,
        reloadUsers: dbContext.reloadUsers,
        signIn: dbContext.signIn,
        signOut: dbContext.signOut,
        getIsAuthed: dbContext.getIsAuthed,
        getCurrentUser: dbContext.getCurrentUser,
        // Wallet operations
        wallets: dbContext.wallets,
        createWallet: dbContext.createWallet,
        getWalletsByUserId: dbContext.getWalletsByUserId,
        getWalletById: dbContext.getWalletById,
        updateWallet: dbContext.updateWallet,
        deleteWallet: dbContext.deleteWallet,
        getTotalBalance: dbContext.getTotalBalance,
        reloadWallets: dbContext.reloadWallets,
        // Database operations
        exportDB: dbContext.exportDB,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export function useTransactions(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
}
