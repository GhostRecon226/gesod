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
  currency: string | null;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerBidRequest {
  id: string;
  auction_vehicle_reference: string;
  auction_vehicle_id: string | null;
  max_bid_amount: number;
  destination_port: string;
  destination_country: string;
  request_status: BidRequestStatus;
  created_at: string;
  updated_at: string;
  auction_vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    lot_number: string;
  } | null;
}

// Helper to parse vehicle details and extract VIN
export function parseVehicleDetails(detailsStr: string): {
  vehicle_type?: string;
  make?: string;
  model?: string;
  year?: string;
  vin?: string;
  auction_source?: string;
  lot_number?: string;
  additional_notes?: string;
} {
  try {
    return JSON.parse(detailsStr);
  } catch {
    return {};
  }
}

// Get vehicle summary string from details JSON
export function getVehicleSummary(details: string): string {
  const parsed = parseVehicleDetails(details);
  const parts = [parsed.year, parsed.make, parsed.model].filter(Boolean);
  
  if (parts.length === 0) {
    return parsed.vehicle_type ? String(parsed.vehicle_type).toUpperCase() : "Vehicle";
  }
  
  return parts.join(" ");
}

// Get VIN from vehicle details
export function getVinFromDetails(details: string): string | null {
  const parsed = parseVehicleDetails(details);
  return parsed.vin || null;
}

// Fetch all quote requests for the current customer
// This now fetches from public_quote_requests where customer_id matches
export async function fetchCustomerQuoteRequests(): Promise<CustomerQuoteRequest[]> {
  const customer = await fetchCurrentCustomer();

  // Fetch from public_quote_requests where customer is linked
  const { data, error } = await supabase
    .from("public_quote_requests")
    .select("id, quote_type, vehicle_details, origin_location, destination_location, quote_status, quote_amount, currency, valid_until, created_at, updated_at")
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
    .select(`
      id,
      auction_vehicle_reference,
      auction_vehicle_id,
      max_bid_amount,
      destination_port,
      destination_country,
      request_status,
      created_at,
      updated_at,
      auction_vehicle:auction_vehicles(id, make, model, year, lot_number)
    `)
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as CustomerBidRequest[];
}
