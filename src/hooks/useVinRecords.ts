import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchVinRecords,
  fetchVinRecordById,
  fetchVinRecordByVin,
  fetchVinRecordsByCustomerId,
  createVinRecord,
  updateVinRecord,
  deleteVinRecord,
  searchVinRecords,
  CreateVinRecordData,
  UpdateVinRecordData,
} from "@/services/vinService";
import { useToast } from "@/hooks/use-toast";

// Query keys
export const vinKeys = {
  all: ["vinRecords"] as const,
  lists: () => [...vinKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...vinKeys.lists(), filters] as const,
  details: () => [...vinKeys.all, "detail"] as const,
  detail: (id: string) => [...vinKeys.details(), id] as const,
  byVin: (vin: string) => [...vinKeys.all, "vin", vin] as const,
  byCustomerId: (customerId: string) => [...vinKeys.all, "customer", customerId] as const,
};

// Fetch all VIN records
export function useVinRecords() {
  return useQuery({
    queryKey: vinKeys.lists(),
    queryFn: fetchVinRecords,
  });
}

// Fetch single VIN record by ID
export function useVinRecord(id: string) {
  return useQuery({
    queryKey: vinKeys.detail(id),
    queryFn: () => fetchVinRecordById(id),
    enabled: !!id,
  });
}

// Fetch VIN record by VIN string
export function useVinRecordByVin(vin: string) {
  return useQuery({
    queryKey: vinKeys.byVin(vin),
    queryFn: () => fetchVinRecordByVin(vin),
    enabled: !!vin,
  });
}

// Fetch VIN records by customer ID
export function useVinRecordsByCustomerId(customerId: string | undefined) {
  return useQuery({
    queryKey: vinKeys.byCustomerId(customerId || ""),
    queryFn: () => fetchVinRecordsByCustomerId(customerId!),
    enabled: !!customerId,
  });
}

// Search VIN records
export function useSearchVinRecords(query: string) {
  return useQuery({
    queryKey: vinKeys.list({ search: query }),
    queryFn: () => searchVinRecords(query),
    enabled: query.length > 0,
  });
}

// Create VIN record mutation
export function useCreateVinRecord() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateVinRecordData) => createVinRecord(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vinKeys.all });
      toast({
        title: "VIN record created",
        description: "The VIN record has been created successfully.",
      });
    },
    onError: (error: Error) => {
      let message = error.message;
      if (error.message.includes("duplicate key") || error.message.includes("unique")) {
        message = "This VIN already exists in the system.";
      }
      toast({
        variant: "destructive",
        title: "Error creating VIN record",
        description: message,
      });
    },
  });
}

// Update VIN record mutation
export function useUpdateVinRecord() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVinRecordData }) =>
      updateVinRecord(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vinKeys.all });
      queryClient.setQueryData(vinKeys.detail(data.id), data);
      toast({
        title: "VIN record updated",
        description: "The VIN record has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      let message = error.message;
      if (error.message.includes("duplicate key") || error.message.includes("unique")) {
        message = "This VIN already exists in the system.";
      }
      toast({
        variant: "destructive",
        title: "Error updating VIN record",
        description: message,
      });
    },
  });
}

// Delete VIN record mutation
export function useDeleteVinRecord() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteVinRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vinKeys.all });
      toast({
        title: "VIN record deleted",
        description: "The VIN record has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error deleting VIN record",
        description: error.message,
      });
    },
  });
}
