import type { ITransaction, TransactionInput } from "@/types/transaction.types";
import { createContext, useContext } from "react";
import { useDB } from "@/hooks/use-db.hooks";

// ==========================
// Context
// ==========================
interface TransactionsContextValue {
  transactions: ITransaction[];
  addTransaction: (input: TransactionInput) => Promise<ITransaction>;
  updateTransaction: (id: string, data: Partial<ITransaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearTransactions: () => Promise<void>;
  getBalance: () => { income: number; expense: number; net: number };
  reload: () => Promise<void>;
  exportDB: () => void;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(
  undefined
);

// ==========================
// Provider
// ==========================
export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
  } = useDB();

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        clearTransactions,
        getBalance,
        reload,
        exportDB,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

// Hook
export function useTransactions(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext);
  if (!ctx)
    throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
}
