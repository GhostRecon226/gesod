import { ReactNode } from "react";
import { useAuthorization } from "@/hooks/useAuthorization";
import { Action, Resource } from "@/lib/authorization";

interface RequirePermissionProps {
  children: ReactNode;
  resource: Resource;
  action: Action;
  fallback?: ReactNode;
  ownerId?: string;
}

/**
 * Component that conditionally renders children based on permissions
 * Use this to hide/show UI elements based on user permissions
 */
export function RequirePermission({
  children,
  resource,
  action,
  fallback = null,
  ownerId,
}: RequirePermissionProps) {
  const { can, canAccessOwned } = useAuthorization();

  // If ownerId is provided, check ownership OR admin access
  if (ownerId !== undefined) {
    if (!canAccessOwned(ownerId)) {
      return <>{fallback}</>;
    }
  }

  // Check general permission
  if (!can(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RequireAdminProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Shorthand component for admin-only content
 */
export function RequireAdmin({ children, fallback = null }: RequireAdminProps) {
  const { isAdmin } = useAuthorization();

  if (!isAdmin) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Shorthand component for authenticated-only content
 */
export function RequireAuth({ children, fallback = null }: RequireAuthProps) {
  const { isAuthenticated } = useAuthorization();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
