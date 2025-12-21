import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/components/AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isChecking } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isChecking && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isChecking, navigate]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
