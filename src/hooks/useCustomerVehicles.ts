import { useQuery } from "@tanstack/react-query";
import { fetchCustomerVehicles, CustomerVehicle } from "@/services/customerVehicleService";
import { fetchCurrentCustomer } from "@/services/customerDashboardService";

// Query keys
export const customerVehicleKeys = {
  all: ["customer-vehicles"] as const,
  list: () => [...customerVehicleKeys.all, "list"] as const,
};

// Fetch customer vehicles
export function useCustomerVehicles() {
  return useQuery({
    queryKey: customerVehicleKeys.list(),
    queryFn: async () => {
      const customer = await fetchCurrentCustomer();
      return fetchCustomerVehicles(customer.id);
    },
  });
}

export type { CustomerVehicle };
