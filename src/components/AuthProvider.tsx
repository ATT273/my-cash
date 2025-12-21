import { createContext, useContext, useEffect, useState } from "react";
import { useDB } from "@/components/DBProvider";
import type { ILocalUser } from "@/types/user.types";

// ==========================
// Auth Context
// ==========================
interface AuthContextValue {
  isAuthenticated: boolean;
  isChecking: boolean;
  currentUser: ILocalUser | null;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ==========================
// Auth Provider
// ==========================
interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  requireAuth = false
}) => {
  const { db, getIsAuthed, getCurrentUser } = useDB();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<ILocalUser | null>(null);

  const checkAuth = async () => {
    // Wait for database to be initialized
    if (!db) {
      console.log("Waiting for database to initialize...");
      return;
    }

    setIsChecking(true);

    try {
      // Check if user exists in localStorage
      const user = getCurrentUser();

      if (!user) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setIsChecking(false);
        return;
      }

      // Verify token with database
      const isAuthed = await getIsAuthed();

      if (!isAuthed) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setIsChecking(false);
        return;
      }

      setIsAuthenticated(true);
      setCurrentUser(user);
      setIsChecking(false);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [db]);

  const value: AuthContextValue = {
    isAuthenticated,
    isChecking,
    currentUser,
    checkAuth,
  };

  // Show loading screen while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, don't render children
  // The ProtectedRoute component will handle the redirect
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==========================
// Consumer Hook
// ==========================
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
