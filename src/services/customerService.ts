import { supabase } from "@/integrations/supabase/client";

export type AccountStatus = "active" | "suspended";

export interface Customer {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerData {
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  account_status?: AccountStatus;
}

export interface UpdateCustomerData {
  full_name?: string;
  email?: string;
  phone?: string | null;
  country?: string | null;
  account_status?: AccountStatus;
}

// Fetch all customers (admin only due to RLS)
export async function fetchCustomers() {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Customer[];
}

// Fetch single customer by ID
export async function fetchCustomerById(id: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Customer;
}

// Fetch customer by user_id (for current user)
export async function fetchCustomerByUserId(userId: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data as Customer;
}

// Create a new customer (admin only)
export async function createCustomer(customerData: CreateCustomerData) {
  const { data, error } = await supabase
    .from("customers")
    .insert(customerData)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

// Update a customer
export async function updateCustomer(id: string, updates: UpdateCustomerData) {
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}

// Delete a customer (admin only)
export async function deleteCustomer(id: string) {
  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Search customers
export async function searchCustomers(query: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Customer[];
}

// Filter customers by status
export async function fetchCustomersByStatus(status: AccountStatus) {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("account_status", status)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Customer[];
}
