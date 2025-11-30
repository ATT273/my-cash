import type {
  ITransaction,
  // IUpdateTransactionInput,
  TransactionInput,
} from "@/types/transaction.types";
import { createContext, useContext } from "react";
import { useDB } from "@/hooks/use-db.hooks";
import type { Database, ParamsObject } from "sql.js";
import type { IQueryParams } from "@/types/db.types";

// ==========================
// Context
// ==========================
interface TransactionsContextValue {
  db: Database | null;
  transactions: ITransaction[];
  addTransaction: (input: TransactionInput) => Promise<{ success: boolean }>;
  updateTransaction: (id: string, data: Partial<ITransaction>) => Promise<{ success: boolean }>;
  deleteTransaction: (id: string) => Promise<{ success: boolean }>;
  clearTransactions: () => Promise<{ success: boolean }>;
  getBalance: () => { income: number; expense: number; net: number };
  reload: () => Promise<{ success: boolean }>;
  exportDB: () => void;
  getYearlySummary: (start: string, end: string) => ParamsObject[];
  getMonthlySummary: (start: string, end: string) => ParamsObject[];
  getIncomeTransactions: (params: IQueryParams) => ITransaction[];
  getExpenseTransactions: (params: IQueryParams) => ITransaction[];
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

// ==========================
// Provider
// ==========================
export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    db,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
    getBalance,
    reload,
    exportDB,
    getYearlySummary,
    getMonthlySummary,
    getIncomeTransactions,
    getExpenseTransactions,
  } = useDB();

  return (
    <TransactionsContext.Provider
      value={{
        db,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearTransactions,
        getBalance,
        reload,
        exportDB,
        getYearlySummary,
        getMonthlySummary,
        getIncomeTransactions,
        getExpenseTransactions,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export function useTransactions(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext);
  if (!ctx) throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
}
