import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAuctionVehicles,
  fetchAuctionVehicleById,
  createAuctionVehicle,
  updateAuctionVehicle,
  deleteAuctionVehicle,
  CreateAuctionVehicleData,
  UpdateAuctionVehicleData,
} from "@/services/auctionVehicleService";
import { useToast } from "@/hooks/use-toast";

// Query keys
export const auctionVehicleKeys = {
  all: ["auction-vehicles"] as const,
  lists: () => [...auctionVehicleKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...auctionVehicleKeys.lists(), filters] as const,
  details: () => [...auctionVehicleKeys.all, "detail"] as const,
  detail: (id: string) => [...auctionVehicleKeys.details(), id] as const,
};

// Fetch all auction vehicles
export function useAuctionVehicles() {
  return useQuery({
    queryKey: auctionVehicleKeys.lists(),
    queryFn: fetchAuctionVehicles,
  });
}

// Fetch single auction vehicle
export function useAuctionVehicle(id: string) {
  return useQuery({
    queryKey: auctionVehicleKeys.detail(id),
    queryFn: () => fetchAuctionVehicleById(id),
    enabled: !!id,
  });
}

// Create auction vehicle mutation
export function useCreateAuctionVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateAuctionVehicleData) => createAuctionVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionVehicleKeys.all });
      toast({
        title: "Auction listing created",
        description: "The auction listing has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error creating listing",
        description: error.message,
      });
    },
  });
}

// Update auction vehicle mutation
export function useUpdateAuctionVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuctionVehicleData }) =>
      updateAuctionVehicle(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: auctionVehicleKeys.all });
      queryClient.setQueryData(auctionVehicleKeys.detail(data.id), data);
      toast({
        title: "Auction listing updated",
        description: "The auction listing has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error updating listing",
        description: error.message,
      });
    },
  });
}

// Delete auction vehicle mutation
export function useDeleteAuctionVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteAuctionVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionVehicleKeys.all });
      toast({
        title: "Auction listing deleted",
        description: "The auction listing has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error deleting listing",
        description: error.message,
      });
    },
  });
}
