import * as userRepo from "../repositories/user.repository";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateToken(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 15)}-${Math.random().toString(36).slice(2, 15)}`;
}

export const register = async (input: {
  userName: string;
  password: string;
  email: string;
}): Promise<{ success: boolean; userId?: string; message?: string }> => {
  const existing = await userRepo.findByEmail(input.email);
  if (existing) {
    return { success: false, message: "A user with this email already exists" };
  }
  const hashedPassword = await hashPassword(input.password);
  const user = await userRepo.create({ ...input, password: hashedPassword });
  return { success: true, userId: user.id };
};

export const signIn = async (
  userName: string,
  password: string
): Promise<{ success: boolean; token?: string; userId?: string; message?: string }> => {
  const user = await userRepo.findByUserName(userName);
  if (!user) {
    return { success: false, message: "Invalid username or password" };
  }
  const hashedInput = await hashPassword(password);
  if (hashedInput !== user.password) {
    return { success: false, message: "Invalid username or password" };
  }
  const token = generateToken();
  await userRepo.update(user.id, { token });
  return { success: true, token, userId: user.id };
};

export const signOut = async (userId: string): Promise<{ success: boolean }> => {
  await userRepo.update(userId, { token: null });
  return { success: true };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> => {
  const user = await userRepo.findById(userId);
  if (!user) return { success: false, message: "User not found" };
  const hashedCurrent = await hashPassword(currentPassword);
  if (hashedCurrent !== user.password) return { success: false, message: "Current password is incorrect" };
  const hashedNew = await hashPassword(newPassword);
  await userRepo.update(userId, { password: hashedNew });
  return { success: true };
};

export const verifyToken = async (
  userId: string,
  token: string
): Promise<boolean> => {
  const user = await userRepo.findById(userId);
  if (!user || !user.token || user.token !== token) return false;
  return true;
};
