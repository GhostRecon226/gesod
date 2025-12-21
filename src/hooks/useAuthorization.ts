import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  hasPermission,
  canAccessResource,
  getPermissions,
  isAdmin,
  isAuthenticated,
  canAccessRoute,
  getRedirectForRole,
  Action,
  Resource,
} from "@/lib/authorization";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for checking authorization in components
 */
export function useAuthorization() {
  const { role, user } = useAuth();
  const { toast } = useToast();

  /**
   * Check if current user can perform action on resource
   */
  const can = useCallback(
    (resource: Resource, action: Action): boolean => {
      return hasPermission(role, resource, action);
    },
    [role]
  );

  /**
   * Check if current user can access a resource at all
   */
  const canAccess = useCallback(
    (resource: Resource): boolean => {
      return canAccessResource(role, resource);
    },
    [role]
  );

  /**
   * Get all permissions for current user on a resource
   */
  const getResourcePermissions = useCallback(
    (resource: Resource): Action[] => {
      return getPermissions(role, resource);
    },
    [role]
  );

  /**
   * Check if user is owner of a resource
   */
  const isOwner = useCallback(
    (ownerId: string | undefined): boolean => {
      if (!user || !ownerId) return false;
      return user.id === ownerId;
    },
    [user]
  );

  /**
   * Check if user can access (owner OR admin)
   */
  const canAccessOwned = useCallback(
    (ownerId: string | undefined): boolean => {
      if (!user) return false;
      return isOwner(ownerId) || isAdmin(role);
    },
    [user, role, isOwner]
  );

  /**
   * Guard function that throws toast and returns false if unauthorized
   */
  const guard = useCallback(
    (resource: Resource, action: Action): boolean => {
      const allowed = hasPermission(role, resource, action);
      if (!allowed) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: `You don't have permission to ${action} ${resource}.`,
        });
      }
      return allowed;
    },
    [role, toast]
  );

  /**
   * Guard function for owned resources
   */
  const guardOwned = useCallback(
    (ownerId: string | undefined, resource: Resource, action: Action): boolean => {
      // Admins can always access
      if (isAdmin(role)) return true;

      // Check ownership
      if (!isOwner(ownerId)) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You can only access your own resources.",
        });
        return false;
      }

      // Check permission
      return guard(resource, action);
    },
    [role, isOwner, guard, toast]
  );

  return {
    // State
    role,
    isAdmin: isAdmin(role),
    isAuthenticated: isAuthenticated(role),
    userId: user?.id,

    // Permission checks
    can,
    canAccess,
    getResourcePermissions,
    isOwner,
    canAccessOwned,

    // Guards (with toast feedback)
    guard,
    guardOwned,

    // Route helpers
    canAccessRoute: (path: string) => canAccessRoute(role, path),
    getRedirectPath: () => getRedirectForRole(role),
  };
}
