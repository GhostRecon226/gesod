import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type BidRequestStatus = Database["public"]["Enums"]["bid_request_status"];

export interface BidRequest {
  id: string;
  customer_id: string;
  auction_vehicle_reference: string;
  max_bid_amount: number;
  destination_country: string;
  destination_port: string;
  request_status: BidRequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BidRequestWithCustomer extends BidRequest {
  customer?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface CreateBidRequestInput {
  customer_id: string;
  auction_vehicle_reference: string;
  max_bid_amount: number;
  destination_country: string;
  destination_port: string;
}

export interface UpdateBidRequestInput {
  request_status?: BidRequestStatus;
  admin_notes?: string | null;
}

// Create bid request (customer)
export async function createBidRequest(input: CreateBidRequestInput): Promise<BidRequest> {
  const { data, error } = await supabase
    .from("bid_requests")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all bid requests (admin)
export async function getBidRequests(): Promise<BidRequestWithCustomer[]> {
  const { data, error } = await supabase
    .from("bid_requests")
    .select(`
      *,
      customer:customers(id, full_name, email)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as BidRequestWithCustomer[];
}

// Get bid request by ID
export async function getBidRequest(id: string): Promise<BidRequestWithCustomer> {
  const { data, error } = await supabase
    .from("bid_requests")
    .select(`
      *,
      customer:customers(id, full_name, email)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as BidRequestWithCustomer;
}

// Get bid requests by customer ID
export async function getBidRequestsByCustomerId(customerId: string): Promise<BidRequest[]> {
  const { data, error } = await supabase
    .from("bid_requests")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Update bid request (admin - for status and notes)
export async function updateBidRequest(
  id: string,
  input: UpdateBidRequestInput
): Promise<BidRequest> {
  const { data, error } = await supabase
    .from("bid_requests")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete bid request
export async function deleteBidRequest(id: string): Promise<void> {
  const { error } = await supabase.from("bid_requests").delete().eq("id", id);
  if (error) throw error;
}

// Search bid requests
export async function searchBidRequests(query: string): Promise<BidRequestWithCustomer[]> {
  const { data, error } = await supabase
    .from("bid_requests")
    .select(`
      *,
      customer:customers(id, full_name, email)
    `)
    .or(`auction_vehicle_reference.ilike.%${query}%,destination_country.ilike.%${query}%,destination_port.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as BidRequestWithCustomer[];
}
