import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "@/services/auth.service";
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
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  requireAuth = false,
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<ILocalUser | null>(null);

  const checkAuth = async () => {
    setIsChecking(true);
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        return;
      }
      const isAuthed = await authService.getIsAuthed();
      setIsAuthenticated(isAuthed);
      setCurrentUser(isAuthed ? user : null);
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextValue = {
    isAuthenticated,
    isChecking,
    currentUser,
    checkAuth,
  };

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
