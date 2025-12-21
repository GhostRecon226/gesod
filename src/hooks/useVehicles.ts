import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchVehicles,
  fetchVehicleById,
  fetchVehiclesByCustomerId,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
  CreateVehicleData,
  UpdateVehicleData,
} from "@/services/vehicleService";
import { useToast } from "@/hooks/use-toast";

// Query keys
export const vehicleKeys = {
  all: ["vehicles"] as const,
  lists: () => [...vehicleKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...vehicleKeys.lists(), filters] as const,
  details: () => [...vehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
  byCustomerId: (customerId: string) => [...vehicleKeys.all, "customer", customerId] as const,
};

// Fetch all vehicles
export function useVehicles() {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn: fetchVehicles,
  });
}

// Fetch single vehicle
export function useVehicle(id: string) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => fetchVehicleById(id),
    enabled: !!id,
  });
}

// Fetch vehicles by customer ID
export function useVehiclesByCustomerId(customerId: string | undefined) {
  return useQuery({
    queryKey: vehicleKeys.byCustomerId(customerId || ""),
    queryFn: () => fetchVehiclesByCustomerId(customerId!),
    enabled: !!customerId,
  });
}

// Search vehicles
export function useSearchVehicles(query: string) {
  return useQuery({
    queryKey: vehicleKeys.list({ search: query }),
    queryFn: () => searchVehicles(query),
    enabled: query.length > 0,
  });
}

// Create vehicle mutation
export function useCreateVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateVehicleData) => createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      toast({
        title: "Vehicle created",
        description: "The vehicle has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error creating vehicle",
        description: error.message,
      });
    },
  });
}

// Update vehicle mutation
export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleData }) =>
      updateVehicle(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      queryClient.setQueryData(vehicleKeys.detail(data.id), data);
      toast({
        title: "Vehicle updated",
        description: "The vehicle has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating vehicle",
        description: error.message,
      });
    },
  });
}

// Delete vehicle mutation
export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      toast({
        title: "Vehicle deleted",
        description: "The vehicle has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error deleting vehicle",
        description: error.message,
      });
    },
  });
}
