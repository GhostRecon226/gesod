import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PublicVinTracking from "./pages/PublicVinTracking";
import PublicQuote from "./pages/PublicQuote";
import OceanFreightQuote from "./pages/OceanFreightQuote";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerVehicles from "./pages/customer/CustomerVehicles";
import CustomerVehicleDetail from "./pages/customer/CustomerVehicleDetail";
import CustomerDocuments from "./pages/customer/CustomerDocuments";
import CustomerQuotes from "./pages/customer/CustomerQuotes";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminVehicleDetail from "./pages/admin/AdminVehicleDetail";
import AdminVins from "./pages/admin/AdminVins";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* ==================== PUBLIC ROUTES ==================== */}
            {/* These routes are accessible to everyone */}
            <Route path="/" element={<Index />} />
            
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
            <Route path="/track" element={<PublicVinTracking />} />
            <Route path="/quote" element={<PublicQuote />} />
            <Route path="/quote/ocean-freight" element={<OceanFreightQuote />} />
            {/* <Route path="/quote/inland-freight" element={<InlandFreightQuote />} /> */}
            {/* <Route path="/services" element={<Services />} /> */}
            {/* <Route path="/auctions" element={<Auctions />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}

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
            {/* <Route path="/dashboard/tracking" element={<ProtectedRoute allowedRoles={["customer", "admin"]}><VINTracking /></ProtectedRoute>} /> */}
            {/* <Route path="/dashboard/profile" element={<ProtectedRoute allowedRoles={["customer", "admin"]}><Profile /></ProtectedRoute>} */}

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
            {/* Admin sub-pages (to be created) */}
            {/* <Route path="/admin/status" element={<ProtectedRoute allowedRoles={["admin"]}><AdminStatusUpdates /></ProtectedRoute>} /> */}
            {/* <Route path="/admin/quotes" element={<ProtectedRoute allowedRoles={["admin"]}><AdminQuotes /></ProtectedRoute>} /> */}
            {/* <Route path="/admin/bids" element={<ProtectedRoute allowedRoles={["admin"]}><AdminBidRequests /></ProtectedRoute>} /> */}
            {/* <Route path="/admin/auctions" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAuctions /></ProtectedRoute>} /> */}
            {/* <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDocuments /></ProtectedRoute>} /> */}
            {/* <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} /> */}

            {/* ==================== CATCH-ALL ==================== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
