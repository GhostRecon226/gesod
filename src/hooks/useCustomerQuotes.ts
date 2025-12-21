import { useQuery } from "@tanstack/react-query";
import {
  fetchCustomerQuoteRequests,
  fetchCustomerBidRequests,
  CustomerQuoteRequest,
  CustomerBidRequest,
} from "@/services/customerQuoteService";

// Query keys
export const customerQuoteKeys = {
  all: ["customer-quotes"] as const,
  quotes: () => [...customerQuoteKeys.all, "quotes"] as const,
  bids: () => [...customerQuoteKeys.all, "bids"] as const,
};

// Fetch customer quote requests
export function useCustomerQuoteRequests() {
  return useQuery({
    queryKey: customerQuoteKeys.quotes(),
    queryFn: fetchCustomerQuoteRequests,
  });
}

// Fetch customer bid requests
export function useCustomerBidRequests() {
  return useQuery({
    queryKey: customerQuoteKeys.bids(),
    queryFn: fetchCustomerBidRequests,
  });
}

export type { CustomerQuoteRequest, CustomerBidRequest };
