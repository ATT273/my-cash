import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth.service";
import { USER_ROUTES } from "@/constants/api.constants";

interface UserProfile {
  id: string;
  userName: string;
  email: string;
}

const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const res = await fetch(USER_ROUTES.BY_ID(userId));
  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
};

export const useGetUserProfile = () => {
  const user = getCurrentUser();
  const userId = user?.id ?? "";

  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });
};
