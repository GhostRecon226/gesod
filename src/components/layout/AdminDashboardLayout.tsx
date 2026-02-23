import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import gesodLogo from "@/assets/gesod_logo_white.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 flex flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4 flex-shrink-0">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={gesodLogo} alt="GESOD RIDES" className="h-8 w-auto" />
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {/* Customer View Link */}
          <div className="mb-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm bg-sidebar-accent text-sidebar-accent-foreground font-medium hover:bg-sidebar-accent/80 transition-colors"
            >
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Customer View</span>
            </Link>
          </div>

          {adminNavGroups.map((group, idx) => (
            <div key={group.title} className={cn(idx > 0 && "mt-6")}>
              <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-muted">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors relative",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-primary font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-sidebar-primary rounded-r" />
                      )}
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-3 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-sidebar-accent">
                <div className="h-7 w-7 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-sidebar-accent-foreground">
                    {initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {userName}
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-sidebar-muted flex-shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-48">
              <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 glass px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {pageTitle && (
              <div>
                <h1 className="text-sm font-medium text-foreground">
                  {pageTitle}
                </h1>
                {pageDescription && (
                  <p className="text-xs text-muted-foreground">
                    {pageDescription}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {actions}
            <AdminNotificationDropdown />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-screen-xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
