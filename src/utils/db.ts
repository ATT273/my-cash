import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";

// ==========================
// SQL.js setup + persistence
// ==========================
let SQL: SqlJsStatic | null = null;

// Load SQL.js and create a new DB (or load from IndexedDB later)
export async function initDB(): Promise<Database> {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (file) => `https://sql.js.org/dist/${file}`,
    });
  }

  // Try to load existing DB
  const existing = await loadFromIndexedDB(SQL, "moneyAppDB");
  if (existing) return existing;

  // Otherwise create new DB + schema
  const db = new SQL.Database();
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT,
      amount REAL,
      category TEXT,
      note TEXT,
      date TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);
  return db;
}

// Save DB into IndexedDB
export async function saveToIndexedDB(db: Database, key = "moneyAppDB") {
  const data = db.export(); // Uint8Array
  const blob = new Blob([data as unknown as BlobPart]);

  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open("MoneyAppStorage", 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore("databases");
    };

    request.onsuccess = () => {
      const tx = request.result.transaction("databases", "readwrite");
      tx.objectStore("databases").put(blob, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
}

// Load DB from IndexedDB
export async function loadFromIndexedDB(SQL: SqlJsStatic, key = "moneyAppDB") {
  return new Promise<Database | null>((resolve, reject) => {
    const request = indexedDB.open("MoneyAppStorage", 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore("databases");
    };

    request.onsuccess = () => {
      const tx = request.result.transaction("databases", "readonly");
      const getReq = tx.objectStore("databases").get(key);

      getReq.onsuccess = () => {
        if (getReq.result) {
          const reader = new FileReader();
          reader.onload = () => {
            const uInt = new Uint8Array(reader.result as ArrayBuffer);
            const db = new SQL.Database(uInt);
            resolve(db);
          };
          reader.readAsArrayBuffer(getReq.result);
        } else {
          resolve(null);
        }
      };

      getReq.onerror = () => reject(getReq.error);
    };

    request.onerror = () => reject(request.error);
  });
}
