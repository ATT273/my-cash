import { useEffect, useState } from "react";
import { type Database } from "sql.js";
import { saveToIndexedDB } from "@/utils/db";

export interface IWallet {
  id: string;
  userId: string;
  walletName: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export type WalletInput = Omit<IWallet, "id" | "createdAt" | "updatedAt">;

export const useWallet = (db: Database | null) => {
  const [wallets, setWallets] = useState<IWallet[]>([]);

  useEffect(() => {
    if (db) {
      loadWallets(db);
    }
  }, [db]);

  const loadWallets = (database: Database) => {
    const res = database.exec("SELECT * FROM wallets ORDER BY createdAt DESC");
    if (res.length === 0) {
      setWallets([]);
      return;
    }
    const { columns, values } = res[0];
    const list = values.map((row) => {
      const obj: any = {};
      row.forEach((val, i) => (obj[columns[i]] = val));
      return obj as IWallet;
    });
    setWallets(list);
  };

  const save = async (database: Database) => {
    await saveToIndexedDB(database);
    loadWallets(database);
  };

  const createWallet = async (input: WalletInput): Promise<{ success: boolean; walletId?: string }> => {
    if (!db) return { success: false };
    try {
      const now = new Date().toISOString();
      const walletId = `wallet-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      db.run(
        `INSERT INTO wallets (id, userId, walletName, amount, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [walletId, input.userId, input.walletName, input.amount, now, now]
      );

      await save(db);
      return { success: true, walletId };
    } catch (error) {
      console.error("Error creating wallet:", error);
      return { success: false };
    }
  };

  const getWalletsByUserId = (userId: string): IWallet[] => {
    if (!db) return [];
    const res = db.exec(`SELECT * FROM wallets WHERE userId = '${userId}' ORDER BY createdAt DESC`);
    if (res.length === 0) return [];
    const { columns, values } = res[0];
    const list = values.map((row) => {
      const obj: any = {};
      row.forEach((val, i) => (obj[columns[i]] = val));
      return obj as IWallet;
    });
    return list;
  };

  const getWalletById = (walletId: string): IWallet | null => {
    if (!db) return null;
    const res = db.exec(`SELECT * FROM wallets WHERE id = '${walletId}'`);
    if (res.length === 0) return null;
    const { columns, values } = res[0];
    if (values.length === 0) return null;
    const obj: any = {};
    values[0].forEach((val, i) => (obj[columns[i]] = val));
    return obj as IWallet;
  };

  const updateWallet = async (
    walletId: string,
    updates: Partial<Omit<IWallet, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<{ success: boolean }> => {
    if (!db) return { success: false };
    try {
      const now = new Date().toISOString();
      const setClauses = [];
      const values = [];

      if (updates.walletName !== undefined) {
        setClauses.push("walletName = ?");
        values.push(updates.walletName);
      }
      if (updates.amount !== undefined) {
        setClauses.push("amount = ?");
        values.push(updates.amount);
      }

      if (setClauses.length === 0) {
        return { success: false };
      }

      setClauses.push("updatedAt = ?");
      values.push(now);
      values.push(walletId);

      db.run(`UPDATE wallets SET ${setClauses.join(", ")} WHERE id = ?`, values);

      await save(db);
      return { success: true };
    } catch (error) {
      console.error("Error updating wallet:", error);
      return { success: false };
    }
  };

  const deleteWallet = async (walletId: string): Promise<{ success: boolean }> => {
    if (!db) return { success: false };
    try {
      db.run(`DELETE FROM wallets WHERE id = ?`, [walletId]);
      await save(db);
      return { success: true };
    } catch (error) {
      console.error("Error deleting wallet:", error);
      return { success: false };
    }
  };

  const getTotalBalance = (userId: string): number => {
    const userWallets = getWalletsByUserId(userId);
    return userWallets.reduce((total, wallet) => total + wallet.amount, 0);
  };

  const reload = async () => {
    if (!db) return { success: false };
    loadWallets(db);
    return { success: true };
  };

  return {
    wallets,
    createWallet,
    getWalletsByUserId,
    getWalletById,
    updateWallet,
    deleteWallet,
    getTotalBalance,
    reload,
  };
};
