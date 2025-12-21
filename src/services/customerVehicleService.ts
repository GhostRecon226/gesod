import { supabase } from "@/integrations/supabase/client";
import type { VinStatus } from "./vehicleService";

export interface CustomerVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vehicle_type: string;
  source: string;
  auction_source: string | null;
  lot_number: string | null;
  created_at: string;
  updated_at: string;
  vin_record: {
    id: string;
    vin: string;
    current_status: VinStatus;
    is_active: boolean;
    updated_at: string;
  } | null;
}

// Fetch all vehicles for the current customer
export async function fetchCustomerVehicles(customerId: string): Promise<CustomerVehicle[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select(`
      *,
      vin_records (
        id,
        vin,
        current_status,
        is_active,
        updated_at
      )
    `)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Map to include the primary VIN record
  return (data || []).map((vehicle) => {
    const vinRecords = vehicle.vin_records as Array<{
      id: string;
      vin: string;
      current_status: VinStatus;
      is_active: boolean;
      updated_at: string;
    }> | null;
    
    // Get the primary (active) VIN or first VIN
    const primaryVin = vinRecords?.find((v) => v.is_active) || vinRecords?.[0] || null;

    return {
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      vehicle_type: vehicle.vehicle_type,
      source: vehicle.source,
      auction_source: vehicle.auction_source,
      lot_number: vehicle.lot_number,
      created_at: vehicle.created_at,
      updated_at: vehicle.updated_at,
      vin_record: primaryVin,
    };
  });
}
