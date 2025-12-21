import { useTransactions } from "@/pages/app/components/AppProvider";
import type { UserInput } from "./use-user.hooks";

/**
 * Hook for authentication operations
 * Provides simplified access to auth-related functions
 */
export const useAuth = () => {
  const {
    signIn,
    signOut,
    getIsAuthed,
    getCurrentUser,
    createUser,
    getUserByEmail,
  } = useTransactions();

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns Promise with success status and userId
   */
  const register = async (userData: UserInput) => {
    // Check if user already exists
    const existingUser = getUserByEmail(userData.email);
    if (existingUser) {
      return {
        success: false,
        message: "A user with this email already exists",
      };
    }

    // Create new user
    const result = await createUser(userData);
    if (result.success) {
      return {
        success: true,
        userId: result.userId,
        message: "Registration successful",
      };
    }

    return {
      success: false,
      message: "Registration failed",
    };
  };

  /**
   * Log in a user
   * @param userName - User's username
   * @param password - User's password
   * @returns Promise with success status, token, and message
   */
  const login = async (userName: string, password: string) => {
    return await signIn(userName, password);
  };

  /**
   * Log out the current user
   * @returns Promise with success status
   */
  const logout = async () => {
    return await signOut();
  };

  /**
   * Check if user is authenticated
   * @returns Promise with authentication status
   */
  const isAuthenticated = async () => {
    return await getIsAuthed();
  };

  /**
   * Get current logged-in user from localStorage
   * @returns Current user data or null
   */
  const currentUser = () => {
    return getCurrentUser();
  };

  return {
    register,
    login,
    logout,
    isAuthenticated,
    currentUser,
  };
};
