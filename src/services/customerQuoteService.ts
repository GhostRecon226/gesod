import { supabase } from "@/integrations/supabase/client";
import { fetchCurrentCustomer } from "./customerDashboardService";

export type QuoteStatus = "pending" | "issued" | "expired" | "accepted";
export type QuoteType = "ocean_freight" | "inland_freight";
export type BidRequestStatus = "pending" | "approved" | "rejected" | "won" | "lost";

export interface CustomerQuoteRequest {
  id: string;
  quote_type: QuoteType;
  vehicle_details: string;
  origin_location: string;
  destination_location: string;
  quote_status: QuoteStatus;
  quote_amount: number | null;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerBidRequest {
  id: string;
  auction_vehicle_reference: string;
  max_bid_amount: number;
  destination_port: string;
  destination_country: string;
  request_status: BidRequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Fetch all quote requests for the current customer
export async function fetchCustomerQuoteRequests(): Promise<CustomerQuoteRequest[]> {
  const customer = await fetchCurrentCustomer();

  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as CustomerQuoteRequest[];
}

// Fetch all bid requests for the current customer
export async function fetchCustomerBidRequests(): Promise<CustomerBidRequest[]> {
  const customer = await fetchCurrentCustomer();

  const { data, error } = await supabase
    .from("bid_requests")
    .select("*")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as CustomerBidRequest[];
}
