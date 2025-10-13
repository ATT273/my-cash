import { useEffect, useState } from "react";
import { type Database } from "sql.js";
import { convertQueryParams, initDB, saveToIndexedDB } from "@/utils/db";
import type { ITransaction, TransactionInput } from "@/types/transaction.types";
import type { IQueryParams } from "@/types/db.types";

export const useDB = () => {
  const [db, setDb] = useState<Database | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  useEffect(() => {
    (async () => {
      const database = await initDB();
      setDb(database);
      loadTransactions(database);
    })();
  }, []);

  const loadTransactions = (database: Database) => {
    const res = database.exec("SELECT * FROM transactions ORDER BY date DESC");
    if (res.length === 0) {
      setTransactions([]);
      return;
    }
    const { columns, values } = res[0];
    const list = values.map((row) => {
      const obj: any = {};
      row.forEach((val, i) => (obj[columns[i]] = val));
      return obj as ITransaction;
    });
    setTransactions(list);
  };

  const getMonthlySummary = (startDate: string, endDate: string) => {
    if (!db) throw new Error("DB not initialized");
    const stmt = db.prepare(`
      SELECT 
        strftime('%Y-%m', date) AS time,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
      FROM transactions
      WHERE date BETWEEN ? AND ?
      GROUP BY time
      ORDER BY time;
    `);
    stmt.bind([startDate, endDate]);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();

    return result;
  };

  const getYearlySummary = (startDate: string, endDate: string) => {
    if (!db) throw new Error("DB not initialized");
    const stmt = db.prepare(`
      SELECT 
        strftime('%Y', date) AS time,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS totalExpense
      FROM transactions
      WHERE date BETWEEN ? AND ?
      GROUP BY time
      ORDER BY time;
    `);
    stmt.bind([startDate, endDate]);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();

    return result;
  };

  const getIncomeTransactions = (params: IQueryParams) => {
    if (!db) throw new Error("DB not initialized");
    const where = convertQueryParams(params);
    const res = db.exec(
      `SELECT * FROM transactions WHERE ${where} ORDER BY date DESC`
    );
    if (res.length === 0) {
      return [];
    }
    const { columns, values } = res[0];
    const list = values.map((row) => {
      const obj: any = {};
      row.forEach((val, i) => (obj[columns[i]] = val));
      return obj as ITransaction;
    });
    return list;
  };

  const getExpenseTransactions = (params: IQueryParams) => {
    if (!db) throw new Error("DB not initialized");
    const where = convertQueryParams(params);
    const res = db.exec(
      `SELECT * FROM transactions WHERE ${where} ORDER BY date DESC`
    );
    if (res.length === 0) {
      return [];
    }
    const { columns, values } = res[0];
    const list = values.map((row) => {
      const obj: any = {};
      row.forEach((val, i) => (obj[columns[i]] = val));
      return obj as ITransaction;
    });
    return list;
  };

  const save = async (database: Database) => {
    await saveToIndexedDB(database);
    loadTransactions(database);
  };

  const addTransaction = async (
    input: TransactionInput
  ): Promise<ITransaction> => {
    if (!db) throw new Error("DB not initialized");
    const now = new Date().toISOString();
    const tx: ITransaction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    db.run(
      `INSERT INTO transactions (id, type, amount, category, note, date, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tx.id,
        tx.type,
        tx.amount,
        tx.category ?? "",
        tx.note ?? "",
        tx.date,
        tx.createdAt,
        tx.updatedAt ?? "",
      ]
    );
    await save(db);
    return tx;
  };

  const updateTransaction = async (id: string, data: Partial<ITransaction>) => {
    if (!db) return;
    const now = new Date().toISOString();
    db.run(
      `UPDATE transactions
       SET type = COALESCE(?, type),
           amount = COALESCE(?, amount),
           category = COALESCE(?, category),
           note = COALESCE(?, note),
           date = COALESCE(?, date),
           updatedAt = ?
       WHERE id = ?`,
      [
        data.type ?? null,
        data.amount ?? null,
        data.category ?? null,
        data.note ?? null,
        data.date ?? null,
        now,
        id,
      ]
    );
    await save(db);
  };

  const deleteTransaction = async (id: string) => {
    if (!db) return;
    db.run(`DELETE FROM transactions WHERE id = ?`, [id]);
    await save(db);
  };

  const clearTransactions = async () => {
    if (!db) return;
    db.run("DELETE FROM transactions");
    await save(db);
  };

  const getBalance = () => {
    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, net: income - expense };
  };

  const reload = async () => {
    if (!db) return;
    loadTransactions(db);
  };

  const exportDB = () => {
    if (!db) return;
    const data = db.export();
    const blob = new Blob([data as unknown as BlobPart], {
      type: "application/x-sqlite3",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "moneyApp.db";
    link.click();
  };

  return {
    db,
    transactions,
    getMonthlySummary,
    getYearlySummary,
    getIncomeTransactions,
    getExpenseTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
    getBalance,
    reload,
    exportDB,
  };
};
