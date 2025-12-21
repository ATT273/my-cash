import { useEffect, useState } from "react";
import { type Database } from "sql.js";
import { initDB } from "@/utils/db";
import { useTransaction } from "./use-transaction.hooks";
import { useUser } from "./use-user.hooks";
import { useWallet } from "./use-wallet.hooks";

export const useDB = () => {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    (async () => {
      const database = await initDB();
      setDb(database);
    })();
  }, []);

  const transactionHook = useTransaction(db);
  const userHook = useUser(db);
  const walletHook = useWallet(db);

  const exportDB = () => {
    if (!db) return { success: false };
    const data = db.export();
    const blob = new Blob([data as unknown as BlobPart], {
      type: "application/x-sqlite3",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "moneyApp.db";
    link.click();
    return { success: true };
  };

  return {
    db,
    // Transaction operations
    transactions: transactionHook.transactions,
    getMonthlySummary: transactionHook.getMonthlySummary,
    getYearlySummary: transactionHook.getYearlySummary,
    getIncomeTransactions: transactionHook.getIncomeTransactions,
    getExpenseTransactions: transactionHook.getExpenseTransactions,
    addTransaction: transactionHook.addTransaction,
    updateTransaction: transactionHook.updateTransaction,
    deleteTransaction: transactionHook.deleteTransaction,
    clearTransactions: transactionHook.clearTransactions,
    getBalance: transactionHook.getBalance,
    reloadTransactions: transactionHook.reload,
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
};
