import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

/**
 * Redirects authenticated users away from auth pages to their appropriate dashboard
 */
export function RedirectIfAuthenticated({ children }: RedirectIfAuthenticatedProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = role === "admin" ? "/admin" : "/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
