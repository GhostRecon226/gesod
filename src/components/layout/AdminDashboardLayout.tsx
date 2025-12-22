import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Truck,
  Menu,
  X,
  LogOut,
  Search,
  ChevronDown,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminNavGroups } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AdminNotificationDropdown } from "@/components/notifications/AdminNotificationDropdown";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  actions?: React.ReactNode;
}

export function AdminDashboardLayout({
  children,
  pageTitle,
  pageDescription,
  actions,
}: AdminDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Admin";
  const initials = userName.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Truck className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-bold text-sidebar-foreground block">
                GESOD RIDES
              </span>
              <span className="text-xs text-sidebar-muted">Admin Panel</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-6 p-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {adminNavGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Admin User */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-sidebar-accent/50">
                <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                  <span className="text-xs font-medium text-sidebar-accent-foreground">
                    {initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-sidebar-muted truncate">
                    Administrator
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-sidebar-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56">
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 border-b border-border bg-card">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Search */}
              <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search vehicles, shipments, customers..."
                    className="pl-9 bg-background"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Search */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <AdminNotificationDropdown />

              {/* User Avatar (desktop) */}
              <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-border">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Header with Filters/Actions */}
          {(pageTitle || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 lg:px-6 py-4 bg-background border-t border-border">
              <div>
                {pageTitle && (
                  <h1 className="text-xl font-semibold text-foreground">
                    {pageTitle}
                  </h1>
                )}
                {pageDescription && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {pageDescription}
                  </p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-3">{actions}</div>
              )}
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
