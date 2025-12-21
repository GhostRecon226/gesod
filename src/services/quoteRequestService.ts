import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type QuoteType = Database["public"]["Enums"]["quote_type"];
type QuoteStatus = Database["public"]["Enums"]["quote_status"];

export interface QuoteRequest {
  id: string;
  customer_id: string;
  quote_type: QuoteType;
  vehicle_details: string;
  origin_location: string;
  destination_location: string;
  quote_amount: number | null;
  quote_status: QuoteStatus;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequestWithCustomer extends QuoteRequest {
  customer?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface CreateQuoteRequestInput {
  customer_id: string;
  quote_type: QuoteType;
  vehicle_details: string;
  origin_location: string;
  destination_location: string;
}

export interface UpdateQuoteRequestInput {
  quote_amount?: number | null;
  quote_status?: QuoteStatus;
  valid_until?: string | null;
}

// Create quote request (customer)
export async function createQuoteRequest(input: CreateQuoteRequestInput): Promise<QuoteRequest> {
  const { data, error } = await supabase
    .from("quote_requests")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all quote requests (admin)
export async function getQuoteRequests(): Promise<QuoteRequestWithCustomer[]> {
  const { data, error } = await supabase
    .from("quote_requests")
    .select(`
      *,
      customer:customers(id, full_name, email)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as QuoteRequestWithCustomer[];
}

// Get quote request by ID
export async function getQuoteRequest(id: string): Promise<QuoteRequestWithCustomer> {
  const { data, error } = await supabase
    .from("quote_requests")
    .select(`
      *,
      customer:customers(id, full_name, email)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as QuoteRequestWithCustomer;
}

// Get quote requests by customer ID
export async function getQuoteRequestsByCustomerId(customerId: string): Promise<QuoteRequest[]> {
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Update quote request (admin - for pricing and status)
export async function updateQuoteRequest(
  id: string,
  input: UpdateQuoteRequestInput
): Promise<QuoteRequest> {
  const { data, error } = await supabase
    .from("quote_requests")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete quote request
export async function deleteQuoteRequest(id: string): Promise<void> {
  const { error } = await supabase.from("quote_requests").delete().eq("id", id);
  if (error) throw error;
}

// Search quote requests
export async function searchQuoteRequests(query: string): Promise<QuoteRequestWithCustomer[]> {
  const { data, error } = await supabase
    .from("quote_requests")
    .select(`
      *,
      customer:customers(id, full_name, email)
    `)
    .or(`vehicle_details.ilike.%${query}%,origin_location.ilike.%${query}%,destination_location.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as QuoteRequestWithCustomer[];
}
