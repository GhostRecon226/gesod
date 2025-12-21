import { UserRole } from "@/contexts/AuthContext";

// Define permissions for each action type
export type Action = "create" | "read" | "update" | "delete" | "manage";

// Define resource types in the system
export type Resource =
  | "profile"
  | "vehicle"
  | "quote"
  | "bid_request"
  | "document"
  | "auction"
  | "vin_tracking"
  | "user"
  | "settings";

// Permission matrix type
type PermissionMatrix = {
  admin: Record<Resource, Action[]>;
  customer: Record<Resource, Action[]>;
  public: Record<Resource, Action[]>;
};

// Permission matrix: defines what each role can do
const permissions: PermissionMatrix = {
  admin: {
    profile: ["create", "read", "update", "delete", "manage"],
    vehicle: ["create", "read", "update", "delete", "manage"],
    quote: ["create", "read", "update", "delete", "manage"],
    bid_request: ["create", "read", "update", "delete", "manage"],
    document: ["create", "read", "update", "delete", "manage"],
    auction: ["create", "read", "update", "delete", "manage"],
    vin_tracking: ["create", "read", "update", "delete", "manage"],
    user: ["create", "read", "update", "delete", "manage"],
    settings: ["create", "read", "update", "delete", "manage"],
  },
  customer: {
    profile: ["read", "update"], // Own profile only (enforced by RLS)
    vehicle: ["read"], // Own vehicles only (enforced by RLS)
    quote: ["create", "read"], // Can create and view own quotes
    bid_request: ["create", "read"], // Can create and view own bids
    document: ["create", "read"], // Own documents only
    auction: ["read"], // Can view public auctions
    vin_tracking: ["create", "read"], // Own VIN tracking
    user: [], // No access to user management
    settings: [], // No access to system settings
  },
  public: {
    // Public users - unauthenticated
    profile: [],
    vehicle: [],
    quote: [],
    bid_request: [],
    document: [],
    auction: ["read"], // Can view public auctions
    vin_tracking: [],
    user: [],
    settings: [],
  },
};

// Helper to get permissions key from role
function getRoleKey(role: UserRole): keyof PermissionMatrix {
  return role === null ? "public" : role;
}

/**
 * Check if a role has permission to perform an action on a resource
 */
export function hasPermission(
  role: UserRole,
  resource: Resource,
  action: Action
): boolean {
  const roleKey = getRoleKey(role);
  const rolePermissions = permissions[roleKey];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;

  // "manage" permission grants all other permissions
  return resourcePermissions.includes(action) || resourcePermissions.includes("manage");
}

/**
 * Check if a role can access any actions on a resource
 */
export function canAccessResource(role: UserRole, resource: Resource): boolean {
  const roleKey = getRoleKey(role);
  const rolePermissions = permissions[roleKey];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  return resourcePermissions && resourcePermissions.length > 0;
}

/**
 * Get all permissions for a role on a resource
 */
export function getPermissions(role: UserRole, resource: Resource): Action[] {
  const roleKey = getRoleKey(role);
  const rolePermissions = permissions[roleKey];
  if (!rolePermissions) return [];

  return rolePermissions[resource] || [];
}

/**
 * Check if user is admin
 */
export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

/**
 * Check if user is authenticated (has any role)
 */
export function isAuthenticated(role: UserRole): boolean {
  return role !== null;
}

// Route access configuration
type RouteAccess = {
  path: string;
  roles: UserRole[];
  requireAuth: boolean;
};

export const routeAccess: RouteAccess[] = [
  // Public routes
  { path: "/", roles: [null, "customer", "admin"], requireAuth: false },
  { path: "/auth", roles: [null, "customer", "admin"], requireAuth: false },
  { path: "/services", roles: [null, "customer", "admin"], requireAuth: false },
  { path: "/auctions", roles: [null, "customer", "admin"], requireAuth: false },
  { path: "/quote", roles: [null, "customer", "admin"], requireAuth: false },
  { path: "/track", roles: [null, "customer", "admin"], requireAuth: false },
  { path: "/contact", roles: [null, "customer", "admin"], requireAuth: false },

  // Customer routes
  { path: "/dashboard", roles: ["customer", "admin"], requireAuth: true },
  { path: "/dashboard/vehicles", roles: ["customer", "admin"], requireAuth: true },
  { path: "/dashboard/tracking", roles: ["customer", "admin"], requireAuth: true },
  { path: "/dashboard/quotes", roles: ["customer", "admin"], requireAuth: true },
  { path: "/dashboard/documents", roles: ["customer", "admin"], requireAuth: true },
  { path: "/dashboard/profile", roles: ["customer", "admin"], requireAuth: true },

  // Admin routes
  { path: "/admin", roles: ["admin"], requireAuth: true },
  { path: "/admin/customers", roles: ["admin"], requireAuth: true },
  { path: "/admin/vehicles", roles: ["admin"], requireAuth: true },
  { path: "/admin/status", roles: ["admin"], requireAuth: true },
  { path: "/admin/quotes", roles: ["admin"], requireAuth: true },
  { path: "/admin/bids", roles: ["admin"], requireAuth: true },
  { path: "/admin/auctions", roles: ["admin"], requireAuth: true },
  { path: "/admin/documents", roles: ["admin"], requireAuth: true },
  { path: "/admin/settings", roles: ["admin"], requireAuth: true },
];

/**
 * Check if a role can access a specific route
 */
export function canAccessRoute(role: UserRole, path: string): boolean {
  const route = routeAccess.find((r) => {
    // Exact match or prefix match for nested routes
    return path === r.path || path.startsWith(r.path + "/");
  });

  if (!route) {
    // Default: require authentication for unknown routes
    return role !== null;
  }

  return route.roles.includes(role);
}

/**
 * Get the appropriate redirect path for a role
 */
export function getRedirectForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "customer":
      return "/dashboard";
    default:
      return "/";
  }
}
