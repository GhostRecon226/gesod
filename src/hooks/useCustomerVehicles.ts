import { useQuery } from "@tanstack/react-query";
import {
  fetchCustomerVehicles,
  fetchCustomerVehicleDetail,
  CustomerVehicle,
  CustomerVehicleDetail,
} from "@/services/customerVehicleService";
import { fetchCurrentCustomer } from "@/services/customerDashboardService";

// Query keys
export const customerVehicleKeys = {
  all: ["customer-vehicles"] as const,
  list: () => [...customerVehicleKeys.all, "list"] as const,
  detail: (id: string) => [...customerVehicleKeys.all, "detail", id] as const,
};

// Fetch customer vehicles list
export function useCustomerVehicles() {
  return useQuery({
    queryKey: customerVehicleKeys.list(),
    queryFn: async () => {
      const customer = await fetchCurrentCustomer();
      return fetchCustomerVehicles(customer.id);
    },
  });
}

// Fetch single customer vehicle detail
export function useCustomerVehicleDetail(vehicleId: string) {
  return useQuery({
    queryKey: customerVehicleKeys.detail(vehicleId),
    queryFn: async () => {
      const customer = await fetchCurrentCustomer();
      return fetchCustomerVehicleDetail(vehicleId, customer.id);
    },
    enabled: !!vehicleId,
  });
}

export type { CustomerVehicle, CustomerVehicleDetail };
