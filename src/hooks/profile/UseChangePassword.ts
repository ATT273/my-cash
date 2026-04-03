import { useMutation } from "@tanstack/react-query";
import { AUTH_ROUTES } from "@/constants/api.constants";

interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

const changePassword = async (
  input: ChangePasswordInput
): Promise<{ success: boolean; message?: string }> => {
  const res = await fetch(AUTH_ROUTES.CHANGE_PASSWORD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to change password");
  return res.json();
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
