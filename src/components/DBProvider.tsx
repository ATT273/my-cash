import { createContext, useContext, useEffect, useState } from "react";
import { type Database } from "sql.js";
import { initDB } from "@/utils/db";
import { useTransaction } from "@/hooks/use-transaction.hooks";
import { useUser } from "@/hooks/use-user.hooks";
import { useWallet } from "@/hooks/use-wallet.hooks";
import type { ITransaction, TransactionInput } from "@/types/transaction.types";
import type { ParamsObject } from "sql.js";
import type { IQueryParams } from "@/types/db.types";
import type { IUser, UserInput } from "@/hooks/use-user.hooks";
import type { IWallet, WalletInput } from "@/hooks/use-wallet.hooks";
import type { ILocalUser } from "@/types/user.types";

// ==========================
// Context Type
// ==========================
interface DBContextValue {
  db: Database | null;
  isInitializing: boolean;
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
  getCurrentUser: () => ILocalUser | null;
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

const DBContext = createContext<DBContextValue | undefined>(undefined);

// ==========================
// Provider Component
// ==========================
interface DBProviderProps {
  children: React.ReactNode;
}

export const DBProvider: React.FC<DBProviderProps> = ({ children }) => {
  const [db, setDb] = useState<Database | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize database on mount
  useEffect(() => {
    (async () => {
      try {
        setIsInitializing(true);
        const database = await initDB();
        setDb(database);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      } finally {
        setIsInitializing(false);
      }
    })();
  }, []);

  // Initialize hooks
  const transactionHook = useTransaction(db);
  const userHook = useUser(db);
  const walletHook = useWallet(db);

  const exportDB = () => {
    if (!db) return { success: false };
    try {
      const data = db.export();
      const blob = new Blob([data as unknown as BlobPart], {
        type: "application/x-sqlite3",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "moneyApp.db";
      link.click();
      return { success: true };
    } catch (error) {
      console.error("Error exporting database:", error);
      return { success: false };
    }
  };

  const value: DBContextValue = {
    db,
    isInitializing,
    // Transaction operations
    transactions: transactionHook.transactions,
    addTransaction: transactionHook.addTransaction,
    updateTransaction: transactionHook.updateTransaction,
    deleteTransaction: transactionHook.deleteTransaction,
    clearTransactions: transactionHook.clearTransactions,
    getBalance: transactionHook.getBalance,
    reloadTransactions: transactionHook.reload,
    getYearlySummary: transactionHook.getYearlySummary,
    getMonthlySummary: transactionHook.getMonthlySummary,
    getIncomeTransactions: transactionHook.getIncomeTransactions,
    getExpenseTransactions: transactionHook.getExpenseTransactions,
    // User operations
    users: userHook.users,
    createUser: userHook.createUser,
    getUserByEmail: userHook.getUserByEmail,
    getUserById: userHook.getUserById,
    updateUser: userHook.updateUser,
    deleteUser: userHook.deleteUser,
    reloadUsers: userHook.reload,
    signIn: userHook.signIn,
    signOut: userHook.signOut,
    getIsAuthed: userHook.getIsAuthed,
    getCurrentUser: userHook.getCurrentUser,
    // Wallet operations
    wallets: walletHook.wallets,
    createWallet: walletHook.createWallet,
    getWalletsByUserId: walletHook.getWalletsByUserId,
    getWalletById: walletHook.getWalletById,
    updateWallet: walletHook.updateWallet,
    deleteWallet: walletHook.deleteWallet,
    getTotalBalance: walletHook.getTotalBalance,
    reloadWallets: walletHook.reload,
    // Database operations
    exportDB,
  };

  // Show loading screen while initializing database
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};

// ==========================
// Consumer Hook
// ==========================
export function useDB(): DBContextValue {
  const ctx = useContext(DBContext);
  if (!ctx) {
    throw new Error("useDB must be used within DBProvider");
  }
  return ctx;
}
