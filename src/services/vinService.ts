import { supabase } from "@/integrations/supabase/client";

export type VinStatus = 
  | "pending"
  | "active"
  | "awaiting_action"
  | "in_progress"
  | "delayed"
  | "completed"
  | "cancelled";

export interface VinRecord {
  id: string;
  vin: string;
  vehicle_id: string;
  customer_id: string;
  current_status: VinStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VinRecordWithRelations extends VinRecord {
  vehicles: {
    id: string;
    make: string;
    model: string;
    year: number;
  };
  customers: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface CreateVinRecordData {
  vin: string;
  vehicle_id: string;
  customer_id: string;
  current_status?: VinStatus;
  is_active?: boolean;
}

export interface UpdateVinRecordData {
  vin?: string;
  vehicle_id?: string;
  customer_id?: string;
  current_status?: VinStatus;
  is_active?: boolean;
}

// Fetch all VIN records with relations (admin only due to RLS)
export async function fetchVinRecords() {
  const { data, error } = await supabase
    .from("vin_records")
    .select(`
      *,
      vehicles (
        id,
        make,
        model,
        year
      ),
      customers (
        id,
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as VinRecordWithRelations[];
}

// Fetch VIN records for a specific customer
export async function fetchVinRecordsByCustomerId(customerId: string) {
  const { data, error } = await supabase
    .from("vin_records")
    .select(`
      *,
      vehicles (
        id,
        make,
        model,
        year
      )
    `)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as (VinRecord & { vehicles: { id: string; make: string; model: string; year: number } })[];
}

// Fetch single VIN record by ID
export async function fetchVinRecordById(id: string) {
  const { data, error } = await supabase
    .from("vin_records")
    .select(`
      *,
      vehicles (
        id,
        make,
        model,
        year
      ),
      customers (
        id,
        full_name,
        email
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as VinRecordWithRelations;
}

// Fetch VIN record by VIN string
export async function fetchVinRecordByVin(vin: string) {
  const { data, error } = await supabase
    .from("vin_records")
    .select(`
      *,
      vehicles (
        id,
        make,
        model,
        year
      ),
      customers (
        id,
        full_name,
        email
      )
    `)
    .eq("vin", vin)
    .single();

  if (error) throw error;
  return data as VinRecordWithRelations;
}

// Create a new VIN record (admin only)
export async function createVinRecord(data: CreateVinRecordData) {
  const { data: result, error } = await supabase
    .from("vin_records")
    .insert(data)
    .select(`
      *,
      vehicles (
        id,
        make,
        model,
        year
      ),
      customers (
        id,
        full_name,
        email
      )
    `)
    .single();

  if (error) throw error;
  return result as VinRecordWithRelations;
}

// Update a VIN record (admin only)
export async function updateVinRecord(id: string, updates: UpdateVinRecordData) {
  const { data, error } = await supabase
    .from("vin_records")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      vehicles (
        id,
        make,
        model,
        year
      ),
      customers (
        id,
        full_name,
        email
      )
    `)
    .single();

  if (error) throw error;
  return data as VinRecordWithRelations;
}

// Delete a VIN record (admin only)
export async function deleteVinRecord(id: string) {
  const { error } = await supabase
    .from("vin_records")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Search VIN records
export async function searchVinRecords(query: string) {
  const { data, error } = await supabase
    .from("vin_records")
    .select(`
      *,
      vehicles (
        id,
        make,
        model,
        year
      ),
      customers (
        id,
        full_name,
        email
      )
    `)
    .ilike("vin", `%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as VinRecordWithRelations[];
}

// Helper: VIN status options for dropdowns
export const vinStatuses: { value: VinStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "awaiting_action", label: "Awaiting Action" },
  { value: "in_progress", label: "In Progress" },
  { value: "delayed", label: "Delayed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Validate VIN format (basic 17-character check)
export function isValidVin(vin: string): boolean {
  const cleanVin = vin.trim().toUpperCase();
  // VIN must be exactly 17 characters, alphanumeric (no I, O, Q)
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(cleanVin);
}
