import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Module, Action } from "@/lib/permissions";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Module requis pour accéder à cette page */
  module?: Module;
  /** Action requise (défaut: 'view') */
  action?: Action;
  /** Rôles autorisés directement (alternative à module/action) */
  allowedRoles?: string[];
  /** Redirection si non authentifié */
  loginPath?: string;
  /** Redirection si accès refusé */
  forbiddenPath?: string;
}

export function ProtectedRoute({
  children,
  module,
  action = 'view',
  allowedRoles,
  loginPath = "/login",
  forbiddenPath = "/unauthorized",
}: ProtectedRouteProps) {
  const { user, isLoading, hasPermission, roles } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Non connecté → login
  if (!user) {
    return <Navigate to={loginPath} replace />;
  }

  // Vérifier rôle direct
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = roles.some(r => allowedRoles.includes(r));
    if (!hasRole) return <Navigate to={forbiddenPath} replace />;
  }

  // Vérifier permission module/action
  if (module && !hasPermission(module, action)) {
    return <Navigate to={forbiddenPath} replace />;
  }

  return <>{children}</>;
}
