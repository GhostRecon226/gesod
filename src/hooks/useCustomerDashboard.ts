import { useQuery } from "@tanstack/react-query";
import {
  fetchCustomerDashboardStats,
  fetchRecentStatusUpdates,
  fetchRecentDocuments,
  fetchCurrentCustomer,
} from "@/services/customerDashboardService";

// Get current customer
export function useCurrentCustomer() {
  return useQuery({
    queryKey: ["currentCustomer"],
    queryFn: fetchCurrentCustomer,
  });
}

// Get dashboard stats
export function useCustomerDashboardStats(customerId: string | undefined) {
  return useQuery({
    queryKey: ["customerDashboardStats", customerId],
    queryFn: () => fetchCustomerDashboardStats(customerId!),
    enabled: !!customerId,
  });
}

// Get recent status updates
export function useRecentStatusUpdates(customerId: string | undefined, limit = 5) {
  return useQuery({
    queryKey: ["recentStatusUpdates", customerId, limit],
    queryFn: () => fetchRecentStatusUpdates(customerId!, limit),
    enabled: !!customerId,
  });
}

// Get recent documents
export function useRecentDocuments(customerId: string | undefined, limit = 5) {
  return useQuery({
    queryKey: ["recentDocuments", customerId, limit],
    queryFn: () => fetchRecentDocuments(customerId!, limit),
    enabled: !!customerId,
  });
}
