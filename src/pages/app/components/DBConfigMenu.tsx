"use client";
import { Button } from "@/components/ui/button";
import { useDB } from "@/components/DBProvider";
import { useState } from "react";
import { createUsersTable, createWalletsTable, addTokenColumn } from "@/lib/db";
import { saveToIndexedDB } from "@/utils/db";
import { type Database } from "sql.js";

const DBConfigMenu = () => {
  const { db } = useDB();
  const [openMenu, setOpenMenu] = useState(false);

  const storeUserTable = async (db: Database) => {
    try {
      const result = await createUsersTable(db);
      await saveToIndexedDB(result.db);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  const storeWalletTable = async (db: Database) => {
    try {
      const result = await createWalletsTable(db);
      await saveToIndexedDB(result.db);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  const addTokenColumnToTable = async (db: Database) => {
    try {
      const result = await addTokenColumn(db);
      await saveToIndexedDB(result.db);
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  return (
    <div>
      {openMenu && db && (
        <div>
          <p>Config</p>
          <ul>
            <li className="cursor-pointer px-2 py-1" onClick={() => storeUserTable(db)}>
              Create wallet table
            </li>
            <li className="cursor-pointer px-2 py-1" onClick={() => storeWalletTable(db)}>
              Create user table
            </li>
            <li className="cursor-pointer px-2 py-1" onClick={() => addTokenColumnToTable(db)}>
              add token column
            </li>
          </ul>
        </div>
      )}

      <div>
        <Button onClick={() => setOpenMenu(!openMenu)}>DB Menu</Button>
      </div>
    </div>
  );
};

export default DBConfigMenu;
