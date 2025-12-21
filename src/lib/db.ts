import type { IQueryResponse } from "@/types/db.types";
import type { Database } from "sql.js";

export function queryAll(db: Database, sql: string): Record<string, string | number>[] {
  const res = db.exec(sql);
  if (res.length === 0) return [];
  const { columns, values } = res[0] as IQueryResponse;
  return values.map((row) => Object.fromEntries(row.map((val, i) => [columns[i], val])));
}

/**
 * Creates the users table in the database if it doesn't exist
 * @param db - SQL.js Database instance
 */
export async function createUsersTable(db: Database): Promise<{ db: Database }> {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      userName TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      token: TEXT UNIQUE,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);

  return { db };
}

export async function addTokenColumn(db: Database) {
  db.run(`
    ALTER TABLE users ADD COLUMN token TEXT;
    `);
  return { db };
}
/**
 * Creates the wallets table in the database if it doesn't exist
 * @param db - SQL.js Database instance
 */
export async function createWalletsTable(db: Database): Promise<{ db: Database }> {
  db.run(`
    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      walletName TEXT NOT NULL,
      amount REAL DEFAULT 0,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  return { db };
}
