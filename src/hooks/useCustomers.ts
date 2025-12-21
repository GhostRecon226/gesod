import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCustomers,
  fetchCustomerById,
  fetchCustomerByUserId,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  fetchCustomersByStatus,
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
  AccountStatus,
} from "@/services/customerService";
import { useToast } from "@/hooks/use-toast";

// Query keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  byUserId: (userId: string) => [...customerKeys.all, "user", userId] as const,
};

// Fetch all customers
export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: fetchCustomers,
  });
}

// Fetch single customer
export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => fetchCustomerById(id),
    enabled: !!id,
  });
}

// Fetch customer by user ID
export function useCustomerByUserId(userId: string | undefined) {
  return useQuery({
    queryKey: customerKeys.byUserId(userId || ""),
    queryFn: () => fetchCustomerByUserId(userId!),
    enabled: !!userId,
  });
}

// Search customers
export function useSearchCustomers(query: string) {
  return useQuery({
    queryKey: customerKeys.list({ search: query }),
    queryFn: () => searchCustomers(query),
    enabled: query.length > 0,
  });
}

// Filter by status
export function useCustomersByStatus(status: AccountStatus) {
  return useQuery({
    queryKey: customerKeys.list({ status }),
    queryFn: () => fetchCustomersByStatus(status),
  });
}

// Create customer mutation
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCustomerData) => createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast({
        title: "Customer created",
        description: "The customer has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error creating customer",
        description: error.message,
      });
    },
  });
}

// Update customer mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerData }) =>
      updateCustomer(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.setQueryData(customerKeys.detail(data.id), data);
      toast({
        title: "Customer updated",
        description: "The customer has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating customer",
        description: error.message,
      });
    },
  });
}

// Delete customer mutation
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast({
        title: "Customer deleted",
        description: "The customer has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error deleting customer",
        description: error.message,
      });
    },
  });
}
