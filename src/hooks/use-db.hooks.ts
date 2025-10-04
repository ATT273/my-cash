import { useEffect, useState } from "react";
import initSqlJs from "sql.js";
import { loadFromIndexedDB, saveToIndexedDB } from "@/utils/storage";
import { queryAll } from "@/lib/db";

export const useDB = () => {
  const [db, setDb] = useState<any>(null);
  useEffect(() => {
    (async () => {
      const SQL = await initSqlJs({
        locateFile: (f) => `https://sql.js.org/dist/${f}`,
      });
      const existingDB = await loadFromIndexedDB(SQL);

      let database;
      if (existingDB) {
        database = existingDB;
        console.log("Loaded existing DB");
      } else {
        database = new SQL.Database();
        database.run(`
              CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT,
                category TEXT,
                amount INTEGER,
                note TEXT,
                date TEXT
              );
            `);
        console.log("Created new DB");
      }

      setDb(database);
    })();
  }, []);

  const addExpense = async (formData: any) => {
    db.run(
      "INSERT INTO expenses (type, category, amount, note, date) VALUES (?, ?, ?, ?, ?)",
      [
        formData.type,
        formData.category,
        formData.amount,
        formData.note,
        formData.date,
      ]
    );
    await saveToIndexedDB(db);
    console.log("Expense saved!");
  };

  const listExpenses = () => {
    const res = queryAll(db, "SELECT * FROM expenses");
    if (res.length > 0) {
      console.log(res);
    } else {
      console.log("No data");
    }
  };

  function downloadDB() {
    const data = db.export(); // Uint8Array
    const blob = new Blob([data], { type: "application/x-sqlite3" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "moneyApp.db";
    link.click();
  }
  return {
    db,
    addExpense,
    listExpenses,
    downloadDB,
  };
};
