import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getQuoteRequests,
  getQuoteRequest,
  getQuoteRequestsByCustomerId,
  createQuoteRequest,
  updateQuoteRequest,
  deleteQuoteRequest,
  searchQuoteRequests,
  type QuoteRequest,
  type QuoteRequestWithCustomer,
  type CreateQuoteRequestInput,
  type UpdateQuoteRequestInput,
} from "@/services/quoteRequestService";

// Query keys
export const quoteRequestKeys = {
  all: ["quoteRequests"] as const,
  lists: () => [...quoteRequestKeys.all, "list"] as const,
  list: (filters: string) => [...quoteRequestKeys.lists(), { filters }] as const,
  details: () => [...quoteRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...quoteRequestKeys.details(), id] as const,
  byCustomer: (customerId: string) => [...quoteRequestKeys.all, "customer", customerId] as const,
  search: (query: string) => [...quoteRequestKeys.all, "search", query] as const,
};

// Fetch all quote requests
export function useQuoteRequests() {
  return useQuery({
    queryKey: quoteRequestKeys.lists(),
    queryFn: getQuoteRequests,
  });
}

// Fetch single quote request
export function useQuoteRequest(id: string) {
  return useQuery({
    queryKey: quoteRequestKeys.detail(id),
    queryFn: () => getQuoteRequest(id),
    enabled: !!id,
  });
}

// Fetch quote requests by customer ID
export function useQuoteRequestsByCustomerId(customerId: string | undefined) {
  return useQuery({
    queryKey: quoteRequestKeys.byCustomer(customerId || ""),
    queryFn: () => getQuoteRequestsByCustomerId(customerId!),
    enabled: !!customerId,
  });
}

// Search quote requests
export function useSearchQuoteRequests(query: string) {
  return useQuery({
    queryKey: quoteRequestKeys.search(query),
    queryFn: () => searchQuoteRequests(query),
    enabled: query.length > 0,
  });
}

// Create quote request mutation
export function useCreateQuoteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createQuoteRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: quoteRequestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quoteRequestKeys.byCustomer(data.customer_id) });
      toast.success("Quote request submitted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit quote request: ${error.message}`);
    },
  });
}

// Update quote request mutation
export function useUpdateQuoteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateQuoteRequestInput & { id: string }) =>
      updateQuoteRequest(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: quoteRequestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: quoteRequestKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: quoteRequestKeys.byCustomer(data.customer_id) });
      toast.success("Quote updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update quote: ${error.message}`);
    },
  });
}

// Delete quote request mutation
export function useDeleteQuoteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuoteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteRequestKeys.all });
      toast.success("Quote request deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete quote request: ${error.message}`);
    },
  });
}
