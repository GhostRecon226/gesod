import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";
import { MaintenanceGuard } from "@/components/MaintenanceGuard";
import { SessionTimeoutHandler } from "@/components/SessionTimeoutHandler";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import PublicVinTracking from "./pages/PublicVinTracking";
import PublicQuote from "./pages/PublicQuote";
import OceanFreightQuote from "./pages/OceanFreightQuote";
import InlandFreightQuote from "./pages/InlandFreightQuote";
import PublicAuctions from "./pages/PublicAuctions";
import PublicAuctionDetail from "./pages/PublicAuctionDetail";
import About from "./pages/About";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerVehicles from "./pages/customer/CustomerVehicles";
import CustomerVehicleDetail from "./pages/customer/CustomerVehicleDetail";
import CustomerDocuments from "./pages/customer/CustomerDocuments";
import CustomerQuotes from "./pages/customer/CustomerQuotes";
import CustomerVinTracking from "./pages/customer/CustomerVinTracking";
import CustomerProfile from "./pages/customer/CustomerProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminVehicleDetail from "./pages/admin/AdminVehicleDetail";
import AdminVins from "./pages/admin/AdminVins";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminAuctionListings from "./pages/admin/AdminAuctionListings";
import AdminBidRequests from "./pages/admin/AdminBidRequests";
import AdminDocuments from "./pages/admin/AdminDocuments";
import AdminStatusUpdates from "./pages/admin/AdminStatusUpdates";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <SettingsProvider>
            <SessionTimeoutHandler />
            <MaintenanceGuard>
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            {/* These routes are accessible to everyone */}
            <Route path="/" element={<Home />} />
            
            {/* Auth page - redirects to dashboard if already logged in */}
            <Route
              path="/auth"
              element={
                <RedirectIfAuthenticated>
                  <Auth />
                </RedirectIfAuthenticated>
              }
            />

            {/* Public pages */}
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/track" element={<PublicVinTracking />} />
            <Route path="/quote" element={<PublicQuote />} />
            <Route path="/quote/ocean-freight" element={<OceanFreightQuote />} />
            <Route path="/quote/inland-freight" element={<InlandFreightQuote />} />
            <Route path="/auctions" element={<PublicAuctions />} />
            <Route path="/auctions/:id" element={<PublicAuctionDetail />} />

            {/* ==================== CUSTOMER ROUTES ==================== */}
            {/* These routes require authentication - accessible by customers AND admins */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vehicles"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <CustomerVehicles />
                </ProtectedRoute>
              }
            />
            {/* Customer sub-pages */}
            <Route
              path="/dashboard/vehicles/:id"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <CustomerVehicleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/documents"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <CustomerDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/quotes"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <CustomerQuotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/tracking"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <CustomerVinTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />

            {/* ==================== ADMIN ROUTES ==================== */}
            {/* These routes are ONLY accessible by admins */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminVehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles/:id"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminVehicleDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vins"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminVins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/quotes"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminQuotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/auctions"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminAuctionListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bids"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminBidRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/documents"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/status"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminStatusUpdates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* ==================== CATCH-ALL ==================== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
            </MaintenanceGuard>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
