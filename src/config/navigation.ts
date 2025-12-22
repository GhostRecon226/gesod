import {
  Home,
  Briefcase,
  Car,
  FileQuestion,
  Search,
  Phone,
  LayoutDashboard,
  Truck,
  MapPin,
  ClipboardList,
  FileText,
  User,
  Users,
  RefreshCw,
  MessageSquare,
  Gavel,
  Settings,
  Info,
  type LucideIcon,
} from "lucide-react";

export type UserRole = "public" | "customer" | "admin";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export interface NavConfig {
  public: NavItem[];
  customer: NavItem[];
  admin: NavItem[];
}

// Public navigation - visible to all users
export const publicNavItems: NavItem[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "About", href: "/about", icon: Info },
  { title: "Services", href: "/services", icon: Briefcase },
  { title: "Auction Vehicles", href: "/auctions", icon: Gavel },
  { title: "Request a Quote", href: "/quote", icon: FileQuestion },
  { title: "VIN Tracking", href: "/track", icon: Search },
];

// Customer dashboard navigation
export const customerNavItems: NavItem[] = [
  { 
    title: "Overview", 
    href: "/dashboard", 
    icon: LayoutDashboard,
    description: "Your dashboard overview"
  },
  { 
    title: "My Vehicles", 
    href: "/dashboard/vehicles", 
    icon: Truck,
    description: "Manage your vehicles"
  },
  { 
    title: "VIN Tracking", 
    href: "/dashboard/tracking", 
    icon: MapPin,
    description: "Track your vehicle shipments"
  },
  { 
    title: "Quotes & Requests", 
    href: "/dashboard/quotes", 
    icon: ClipboardList,
    description: "View quotes and requests"
  },
  { 
    title: "Documents", 
    href: "/dashboard/documents", 
    icon: FileText,
    description: "Access your documents"
  },
  { 
    title: "Profile", 
    href: "/dashboard/profile", 
    icon: User,
    description: "Manage your profile"
  },
];

// Admin dashboard navigation with groups
export interface AdminNavGroup {
  title: string;
  items: NavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Customer Management",
    items: [
      { title: "Customers", href: "/admin/customers", icon: Users },
    ],
  },
  {
    title: "Operations",
    items: [
      { title: "Vehicles & VINs", href: "/admin/vehicles", icon: Truck },
      { title: "Status Updates", href: "/admin/status", icon: RefreshCw },
      { title: "Quotes", href: "/admin/quotes", icon: ClipboardList },
      { title: "Bid Requests", href: "/admin/bids", icon: MessageSquare },
      { title: "Auction Listings", href: "/admin/auctions", icon: Gavel },
    ],
  },
  {
    title: "Documents",
    items: [
      { title: "Documents", href: "/admin/documents", icon: FileText },
    ],
  },
  {
    title: "System",
    items: [
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

// Flatten admin nav for simple lists
export const adminNavItems: NavItem[] = adminNavGroups.flatMap(
  (group) => group.items
);

// Navigation config object
export const navigationConfig: NavConfig = {
  public: publicNavItems,
  customer: customerNavItems,
  admin: adminNavItems,
};

// Helper to get navigation by role
export function getNavigationByRole(role: UserRole): NavItem[] {
  return navigationConfig[role];
}

// Helper to check if a route is accessible by role
export function isRouteAccessible(path: string, role: UserRole): boolean {
  if (role === "admin") {
    // Admins can access everything
    return true;
  }
  
  if (role === "customer") {
    // Customers can access public routes and customer dashboard
    const customerPaths = customerNavItems.map((item) => item.href);
    const publicPaths = publicNavItems.map((item) => item.href);
    return (
      customerPaths.some((p) => path.startsWith(p)) ||
      publicPaths.includes(path) ||
      path === "/auth"
    );
  }
  
  // Public users can only access public routes
  const publicPaths = publicNavItems.map((item) => item.href);
  return publicPaths.includes(path) || path === "/auth";
}
