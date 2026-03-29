import type { ILocalUser } from "@/types/user.types";
import { AUTH_ROUTES } from "@/constants/api.constants";

export function getAuthFromLocalStorage(): ILocalUser | null {
  const auth = localStorage.getItem("my_cash_auth");
  if (!auth) return null;
  try {
    return JSON.parse(auth) as ILocalUser;
  } catch {
    return null;
  }
}

function saveAuthToLocalStorage(auth: ILocalUser): void {
  localStorage.setItem("my_cash_auth", JSON.stringify(auth));
}

function clearAuthFromLocalStorage(): void {
  localStorage.removeItem("my_cash_auth");
}

export const register = async (input: {
  userName: string;
  password: string;
  email: string;
}): Promise<{ success: boolean; userId?: string; message?: string }> => {
  const res = await fetch(AUTH_ROUTES.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
};

export const signIn = async (
  userName: string,
  password: string
): Promise<{ success: boolean; token?: string; userId?: string; message?: string }> => {
  const res = await fetch(AUTH_ROUTES.SIGNIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });
  const data = await res.json();
  if (data.success && data.token && data.userId) {
    saveAuthToLocalStorage({ id: data.userId, useName: userName, token: data.token });
  }
  return data;
};

export const signOut = async (): Promise<{ success: boolean }> => {
  const auth = getAuthFromLocalStorage();
  if (auth) {
    await fetch(AUTH_ROUTES.SIGNOUT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: auth.id }),
    });
  }
  clearAuthFromLocalStorage();
  return { success: true };
};

export const getIsAuthed = async (): Promise<boolean> => {
  const localUser = getAuthFromLocalStorage();
  if (!localUser) return false;
  const res = await fetch(
    `${AUTH_ROUTES.VERIFY}?userId=${encodeURIComponent(localUser.id)}&token=${encodeURIComponent(localUser.token)}`
  );
  const data = await res.json();
  return data.valid === true;
};

export const getCurrentUser = (): ILocalUser | null => {
  return getAuthFromLocalStorage();
};
