import { supabase } from "@/integrations/supabase/client";

export type VehicleType = "car" | "suv" | "truck";
export type VehicleSource = "auction" | "direct";
export type AuctionSource = "copart" | "iaai" | "other";
export type VinStatus = "pending" | "active" | "awaiting_action" | "in_progress" | "delayed" | "completed" | "cancelled";

export interface Vehicle {
  id: string;
  customer_id: string;
  make: string;
  model: string;
  year: number;
  vehicle_type: VehicleType;
  source: VehicleSource;
  auction_source: AuctionSource | null;
  lot_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface VinRecord {
  id: string;
  vin: string;
  current_status: VinStatus;
  is_active: boolean;
  created_at: string;
}

export interface VehicleWithCustomer extends Vehicle {
  customers: {
    id: string;
    full_name: string;
    email: string;
  };
  vin_records?: VinRecord[];
}

export interface CreateVehicleData {
  customer_id: string;
  make: string;
  model: string;
  year: number;
  vehicle_type: VehicleType;
  source: VehicleSource;
  auction_source?: AuctionSource | null;
  lot_number?: string | null;
}

export interface UpdateVehicleData {
  customer_id?: string;
  make?: string;
  model?: string;
  year?: number;
  vehicle_type?: VehicleType;
  source?: VehicleSource;
  auction_source?: AuctionSource | null;
  lot_number?: string | null;
}

// Fetch all vehicles with customer info and VIN records (admin only due to RLS)
export async function fetchVehicles() {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      customers (
        id,
        full_name,
        email
      ),
      vin_records (
        id,
        vin,
        current_status,
        is_active,
        created_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as VehicleWithCustomer[];
}

// Fetch vehicles for a specific customer
export async function fetchVehiclesByCustomerId(customerId: string) {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Vehicle[];
}

// Fetch single vehicle by ID
export async function fetchVehicleById(id: string) {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      customers (
        id,
        full_name,
        email
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as VehicleWithCustomer;
}

// Create a new vehicle (admin only)
export async function createVehicle(vehicleData: CreateVehicleData) {
  const { data, error } = await supabase
    .from("vehicles")
    .insert(vehicleData)
    .select(`
      *,
      customers (
        id,
        full_name,
        email
      )
    `)
    .single();

  if (error) throw error;
  return data as VehicleWithCustomer;
}

// Update a vehicle (admin only)
export async function updateVehicle(id: string, updates: UpdateVehicleData) {
  const { data, error } = await supabase
    .from("vehicles")
    .update(updates)
    .eq("id", id)
    .select(`
      *,
      customers (
        id,
        full_name,
        email
      )
    `)
    .single();

  if (error) throw error;
  return data as VehicleWithCustomer;
}

// Delete a vehicle (admin only)
export async function deleteVehicle(id: string) {
  const { error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// Search vehicles
export async function searchVehicles(query: string) {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      customers (
        id,
        full_name,
        email
      )
    `)
    .or(`make.ilike.%${query}%,model.ilike.%${query}%,lot_number.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as VehicleWithCustomer[];
}

// Helper constants for dropdowns
export const vehicleTypes: { value: VehicleType; label: string }[] = [
  { value: "car", label: "Car" },
  { value: "suv", label: "SUV" },
  { value: "truck", label: "Truck" },
];

export const vehicleSources: { value: VehicleSource; label: string }[] = [
  { value: "auction", label: "Auction" },
  { value: "direct", label: "Direct" },
];

export const auctionSources: { value: AuctionSource; label: string }[] = [
  { value: "copart", label: "Copart" },
  { value: "iaai", label: "IAAI" },
  { value: "other", label: "Other" },
];
