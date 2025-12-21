import { useEffect, useState } from "react";
import { type Database } from "sql.js";
import { saveToIndexedDB } from "@/utils/db";
import type { ILocalUser } from "@/types/user.types";

export interface IUser {
  id: string;
  userName: string;
  password: string;
  email: string;
  token: string;
  createdAt: string;
  updatedAt: string;
}

export type UserInput = Omit<IUser, "id" | "createdAt" | "updatedAt" | "token">;

// Utility functions for password hashing
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

function generateToken(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 15)}-${Math.random().toString(36).slice(2, 15)}`;
}

function saveAuthToLocalStorage(auth: ILocalUser): void {
  localStorage.setItem("my_cash_auth", JSON.stringify(auth));
}

function getAuthFromLocalStorage(): ILocalUser | null {
  const auth = localStorage.getItem("my_cash_auth");
  if (!auth) return null;
  try {
    return JSON.parse(auth) as ILocalUser;
  } catch {
    return null;
  }
}

function clearAuthFromLocalStorage(): void {
  localStorage.removeItem("my_cash_auth");
}

export const useUser = (db: Database | null) => {
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    if (db) {
      loadUsers(db);
    }
  }, [db]);

  const loadUsers = (database: Database) => {
    const res = database.exec("SELECT * FROM users ORDER BY createdAt DESC");
    if (res.length === 0) {
      setUsers([]);
      return;
    }
    const { columns, values } = res[0];
    const list = values.map((row) => {
      const obj: any = {};
      row.forEach((val, i) => (obj[columns[i]] = val));
      return obj as IUser;
    });
    setUsers(list);
  };

  const save = async (database: Database) => {
    await saveToIndexedDB(database);
    loadUsers(database);
  };

  const createUser = async (input: UserInput): Promise<{ success: boolean; userId?: string }> => {
    if (!db) return { success: false };
    try {
      const now = new Date().toISOString();
      const userId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      // Hash the password before saving
      const hashedPassword = await hashPassword(input.password);

      db.run(
        `INSERT INTO users (id, userName, password, email, token, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, input.userName, hashedPassword, input.email, "", now, now]
      );

      await save(db);
      return { success: true, userId };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false };
    }
  };

  const getUserByEmail = (email: string): IUser | null => {
    if (!db) return null;
    const res = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    if (res.length === 0) return null;
    const { columns, values } = res[0];
    if (values.length === 0) return null;
    const obj: any = {};
    values[0].forEach((val, i) => (obj[columns[i]] = val));
    return obj as IUser;
  };

  const getUserById = (userId: string): IUser | null => {
    if (!db) return null;
    const res = db.exec(`SELECT * FROM users WHERE id = '${userId}'`);
    if (res.length === 0) return null;
    const { columns, values } = res[0];
    if (values.length === 0) return null;
    const obj: any = {};
    values[0].forEach((val, i) => (obj[columns[i]] = val));
    return obj as IUser;
  };

  const updateUser = async (
    userId: string,
    updates: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>
  ): Promise<{ success: boolean }> => {
    if (!db) return { success: false };
    try {
      const now = new Date().toISOString();
      const setClauses = [];
      const values = [];

      if (updates.userName !== undefined) {
        setClauses.push("userName = ?");
        values.push(updates.userName);
      }
      if (updates.password !== undefined) {
        setClauses.push("password = ?");
        values.push(updates.password);
      }
      if (updates.email !== undefined) {
        setClauses.push("email = ?");
        values.push(updates.email);
      }

      if (setClauses.length === 0) {
        return { success: false };
      }

      setClauses.push("updatedAt = ?");
      values.push(now);
      values.push(userId);

      db.run(`UPDATE users SET ${setClauses.join(", ")} WHERE id = ?`, values);

      await save(db);
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false };
    }
  };

  const deleteUser = async (userId: string): Promise<{ success: boolean }> => {
    if (!db) return { success: false };
    try {
      db.run(`DELETE FROM users WHERE id = ?`, [userId]);
      await save(db);
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false };
    }
  };

  const reload = async () => {
    if (!db) return { success: false };
    loadUsers(db);
    return { success: true };
  };

  const signIn = async (
    userName: string,
    password: string
  ): Promise<{ success: boolean; token?: string; userId?: string; message?: string }> => {
    if (!db) return { success: false, message: "Database not initialized" };

    try {
      // Find user by userName
      const res = db.exec(`SELECT * FROM users WHERE userName = '${userName}'`);
      if (res.length === 0 || res[0].values.length === 0) {
        return { success: false, message: "Invalid username or password" };
      }

      const { columns, values } = res[0];
      const userObj: any = {};
      values[0].forEach((val, i) => (userObj[columns[i]] = val));
      const user = userObj as IUser;

      // Verify password
      const hashedInputPassword = await hashPassword(password);
      if (hashedInputPassword !== user.password) {
        return { success: false, message: "Invalid username or password" };
      }

      // Generate new token
      const token = generateToken();
      const now = new Date().toISOString();

      // Update user with new token
      db.run(`UPDATE users SET token = ?, updatedAt = ? WHERE id = ?`, [token, now, user.id]);

      await save(db);

      // Save to localStorage
      const authData: ILocalUser = {
        id: user.id,
        useName: user.userName,
        token,
      };
      saveAuthToLocalStorage(authData);

      return { success: true, token, userId: user.id };
    } catch (error) {
      console.error("Error signing in:", error);
      return { success: false, message: "An error occurred during sign in" };
    }
  };

  const signOut = async (): Promise<{ success: boolean }> => {
    if (!db) return { success: false };

    try {
      const auth = getAuthFromLocalStorage();
      if (auth) {
        // Clear token from database
        const now = new Date().toISOString();
        db.run(`UPDATE users SET token = ?, updatedAt = ? WHERE id = ?`, ["", now, auth.id]);
        await save(db);
      }

      // Clear localStorage
      clearAuthFromLocalStorage();

      return { success: true };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false };
    }
  };

  const getIsAuthed = async (): Promise<boolean> => {
    const localUser = getAuthFromLocalStorage();
    if (!localUser) return false;

    const user = getUserById(localUser.id);
    if (!user) return false;
    if (user.token !== localUser.token || !user.token) return false;

    return true;
  };

  const getCurrentUser = (): ILocalUser | null => {
    return getAuthFromLocalStorage();
  };

  return {
    users,
    createUser,
    getUserByEmail,
    getUserById,
    updateUser,
    deleteUser,
    reload,
    signIn,
    signOut,
    getIsAuthed,
    getCurrentUser,
  };
};
