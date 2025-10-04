import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";

// Keep a reference to SQL.js and the current database
let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

// Load SQL.js and create a new DB (or load from IndexedDB later)
export async function initDB() {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`, // load wasm
    });
  }
  if (!db) {
    db = new SQL.Database(); // creates empty database
  }
  return db;
}

export function getDB() {
  if (!db) throw new Error("Database not initialized");
  return db;
}
