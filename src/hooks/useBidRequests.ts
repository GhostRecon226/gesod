import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getBidRequests,
  getBidRequest,
  getBidRequestsByCustomerId,
  createBidRequest,
  updateBidRequest,
  deleteBidRequest,
  searchBidRequests,
  type BidRequest,
  type BidRequestWithCustomer,
  type CreateBidRequestInput,
  type UpdateBidRequestInput,
} from "@/services/bidRequestService";

// Query keys
export const bidRequestKeys = {
  all: ["bidRequests"] as const,
  lists: () => [...bidRequestKeys.all, "list"] as const,
  list: (filters: string) => [...bidRequestKeys.lists(), { filters }] as const,
  details: () => [...bidRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...bidRequestKeys.details(), id] as const,
  byCustomer: (customerId: string) => [...bidRequestKeys.all, "customer", customerId] as const,
  search: (query: string) => [...bidRequestKeys.all, "search", query] as const,
};

// Fetch all bid requests
export function useBidRequests() {
  return useQuery({
    queryKey: bidRequestKeys.lists(),
    queryFn: getBidRequests,
  });
}

// Fetch single bid request
export function useBidRequest(id: string) {
  return useQuery({
    queryKey: bidRequestKeys.detail(id),
    queryFn: () => getBidRequest(id),
    enabled: !!id,
  });
}

// Fetch bid requests by customer ID
export function useBidRequestsByCustomerId(customerId: string | undefined) {
  return useQuery({
    queryKey: bidRequestKeys.byCustomer(customerId || ""),
    queryFn: () => getBidRequestsByCustomerId(customerId!),
    enabled: !!customerId,
  });
}

// Search bid requests
export function useSearchBidRequests(query: string) {
  return useQuery({
    queryKey: bidRequestKeys.search(query),
    queryFn: () => searchBidRequests(query),
    enabled: query.length > 0,
  });
}

// Create bid request mutation
export function useCreateBidRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBidRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bidRequestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bidRequestKeys.byCustomer(data.customer_id) });
      toast.success("Bid request submitted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit bid request: ${error.message}`);
    },
  });
}

// Update bid request mutation
export function useUpdateBidRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateBidRequestInput & { id: string }) =>
      updateBidRequest(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bidRequestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bidRequestKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: bidRequestKeys.byCustomer(data.customer_id) });
      toast.success("Bid request updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update bid request: ${error.message}`);
    },
  });
}

// Delete bid request mutation
export function useDeleteBidRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBidRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bidRequestKeys.all });
      toast.success("Bid request deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete bid request: ${error.message}`);
    },
  });
}
