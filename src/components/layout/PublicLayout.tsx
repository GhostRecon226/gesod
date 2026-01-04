import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import gesodLogo from "@/assets/gesod_logo_white.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { publicHeaderNavItems, publicFooterNavItems } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getDashboardPath = () => {
    return role === "admin" ? "/admin" : "/dashboard";
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={gesodLogo} alt="GESOD RIDES" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {publicHeaderNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons / User Menu */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to={getDashboardPath()}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-full">
                          <span className="text-xs font-medium">{userInitials}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <div className="px-3 py-2">
                          <p className="text-sm font-medium">{userName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground capitalize mt-1">
                            {role || "Customer"}
                          </p>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to={getDashboardPath()}>
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        {role === "admin" && (
                          <DropdownMenuItem asChild>
                            <Link to="/dashboard">
                              <User className="h-4 w-4 mr-2" />
                              Customer View
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard/profile">
                            <Settings className="h-4 w-4 mr-2" />
                            Profile Settings
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/auth?mode=signup">Get Started</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-card md:hidden">
            <div className="space-y-1 px-4 py-4">
              {publicHeaderNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-accent text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
              <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-border">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <Button variant="outline" asChild className="w-full">
                          <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            Dashboard
                          </Link>
                        </Button>
                        {role === "admin" && (
                          <Button variant="ghost" asChild className="w-full">
                            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                              <User className="h-4 w-4 mr-2" />
                              Customer View
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full text-destructive"
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" asChild className="w-full">
                          <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2">
                <img src={gesodLogo} alt="GESOD RIDES" className="h-10 w-auto" />
              </Link>
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                Vehicle sourcing and logistics facilitation. We coordinate auction 
                bidding, inland transport, and ocean freight services for clients 
                importing vehicles from the United States.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                GESOD RIDES is a logistics facilitation company. We do not own 
                vehicles or transport equipment. All services are provided in 
                coordination with third-party partners.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
              <ul className="mt-4 space-y-2">
                {publicFooterNavItems.slice(0, 7).map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-foreground">Contact</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">Email:</span>
                  <br />
                  contact@gesodrides.com
                </li>
                <li>
                  <span className="font-medium text-foreground">Phone:</span>
                  <br />
                  +1 (555) 123-4567
                </li>
                <li>
                  <span className="font-medium text-foreground">Hours:</span>
                  <br />
                  Mon–Fri: 9:00 AM – 6:00 PM EST
                </li>
              </ul>
            </div>
          </div>

          {/* Trust Elements & Legal */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground mb-6">
              <div>
                <p className="font-medium text-foreground mb-1">Terminology</p>
                <p>
                  "VIN Tracking" refers to status-based milestone updates, not GPS tracking.
                  "Quote" means an estimate subject to final confirmation.
                  "Auction Vehicles" are third-party listings, not owned by GESOD RIDES.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Service Scope</p>
                <p>
                  We facilitate logistics coordination. Actual transport is performed by 
                  licensed carriers and shipping lines. We do not guarantee auction outcomes, 
                  customs clearance, or specific delivery dates.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Estimates & Timelines</p>
                <p>
                  All quotes and timelines are indicative. Final costs depend on vehicle 
                  specifications, carrier rates, and market conditions. Delays may occur 
                  due to factors beyond our control.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GESOD RIDES. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/consent" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Consent & Data Use
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
