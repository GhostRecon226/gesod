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

export interface VehicleStatusUpdate {
  id: string;
  status: VinStatus;
  description: string | null;
  created_at: string;
}

export interface VehicleDocument {
  id: string;
  file_name: string;
  document_type: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface CustomerVehicleDetail {
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
  status_updates: VehicleStatusUpdate[];
  documents: VehicleDocument[];
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

// Fetch single vehicle detail with status history and documents
export async function fetchCustomerVehicleDetail(
  vehicleId: string,
  customerId: string
): Promise<CustomerVehicleDetail> {
  // Fetch vehicle with VIN records
  const { data: vehicle, error: vehicleError } = await supabase
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
    .eq("id", vehicleId)
    .eq("customer_id", customerId)
    .single();

  if (vehicleError) throw vehicleError;

  const vinRecords = vehicle.vin_records as Array<{
    id: string;
    vin: string;
    current_status: VinStatus;
    is_active: boolean;
    updated_at: string;
  }> | null;

  const primaryVin = vinRecords?.find((v) => v.is_active) || vinRecords?.[0] || null;

  let statusUpdates: VehicleStatusUpdate[] = [];
  let documents: VehicleDocument[] = [];

  if (primaryVin) {
    // Fetch status updates
    const { data: updates, error: updatesError } = await supabase
      .from("vin_status_updates")
      .select("id, status, description, created_at")
      .eq("vin_record_id", primaryVin.id)
      .order("created_at", { ascending: false });

    if (updatesError) throw updatesError;
    statusUpdates = (updates || []) as VehicleStatusUpdate[];

    // Fetch documents
    const { data: docs, error: docsError } = await supabase
      .from("documents")
      .select("id, file_name, document_type, file_path, file_size, mime_type, created_at")
      .eq("vin_record_id", primaryVin.id)
      .order("created_at", { ascending: false });

    if (docsError) throw docsError;
    documents = (docs || []) as VehicleDocument[];
  }

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
    status_updates: statusUpdates,
    documents,
  };
}

// Get document download URL
export async function getDocumentDownloadUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}
