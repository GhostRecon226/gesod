import { supabase } from "@/integrations/supabase/client";
import type { VinStatus } from "./vehicleService";

export interface CustomerDashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  completedVehicles: number;
  pendingQuotes: number;
}

export interface RecentStatusUpdate {
  id: string;
  status: VinStatus;
  description: string | null;
  created_at: string;
  vin: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
}

export interface RecentDocument {
  id: string;
  file_name: string;
  document_type: string;
  created_at: string;
  vin: string;
}

// Get dashboard stats for current customer
export async function fetchCustomerDashboardStats(customerId: string): Promise<CustomerDashboardStats> {
  // Fetch vehicles with VIN records
  const { data: vehicles, error: vehiclesError } = await supabase
    .from("vehicles")
    .select(`
      id,
      vin_records (
        current_status
      )
    `)
    .eq("customer_id", customerId);

  if (vehiclesError) throw vehiclesError;

  // Fetch pending quotes
  const { count: pendingQuotes, error: quotesError } = await supabase
    .from("quote_requests")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", customerId)
    .eq("quote_status", "pending");

  if (quotesError) throw quotesError;

  // Calculate vehicle stats
  const totalVehicles = vehicles?.length || 0;
  let activeVehicles = 0;
  let completedVehicles = 0;

  vehicles?.forEach((vehicle) => {
    const vinRecords = vehicle.vin_records as { current_status: VinStatus }[] | null;
    const primaryVin = vinRecords?.[0];
    if (primaryVin) {
      if (primaryVin.current_status === "completed") {
        completedVehicles++;
      } else if (primaryVin.current_status !== "cancelled") {
        activeVehicles++;
      }
    }
  });

  return {
    totalVehicles,
    activeVehicles,
    completedVehicles,
    pendingQuotes: pendingQuotes || 0,
  };
}

// Get recent status updates for customer's vehicles
export async function fetchRecentStatusUpdates(customerId: string, limit = 5): Promise<RecentStatusUpdate[]> {
  // First get VIN records for this customer
  const { data: vinRecords, error: vinError } = await supabase
    .from("vin_records")
    .select(`
      id,
      vin,
      vehicle:vehicles (
        make,
        model,
        year
      )
    `)
    .eq("customer_id", customerId);

  if (vinError) throw vinError;
  if (!vinRecords || vinRecords.length === 0) return [];

  const vinRecordIds = vinRecords.map((v) => v.id);

  // Get recent status updates for these VIN records
  const { data: updates, error: updatesError } = await supabase
    .from("vin_status_updates")
    .select("*")
    .in("vin_record_id", vinRecordIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (updatesError) throw updatesError;

  // Map updates with vehicle info
  const vinRecordMap = new Map(vinRecords.map((v) => [v.id, v]));

  return (updates || []).map((update) => {
    const vinRecord = vinRecordMap.get(update.vin_record_id);
    const vehicle = vinRecord?.vehicle as { make: string; model: string; year: number } | null;
    
    return {
      id: update.id,
      status: update.status as VinStatus,
      description: update.description,
      created_at: update.created_at,
      vin: vinRecord?.vin || "",
      vehicle: vehicle || { make: "Unknown", model: "Unknown", year: 0 },
    };
  });
}

// Get recent documents for customer's vehicles
export async function fetchRecentDocuments(customerId: string, limit = 5): Promise<RecentDocument[]> {
  // First get VIN records for this customer
  const { data: vinRecords, error: vinError } = await supabase
    .from("vin_records")
    .select("id, vin")
    .eq("customer_id", customerId);

  if (vinError) throw vinError;
  if (!vinRecords || vinRecords.length === 0) return [];

  const vinRecordIds = vinRecords.map((v) => v.id);

  // Get recent documents for these VIN records
  const { data: documents, error: docsError } = await supabase
    .from("documents")
    .select("*")
    .in("vin_record_id", vinRecordIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (docsError) throw docsError;

  // Map documents with VIN
  const vinRecordMap = new Map(vinRecords.map((v) => [v.id, v.vin]));

  return (documents || []).map((doc) => ({
    id: doc.id,
    file_name: doc.file_name,
    document_type: doc.document_type,
    created_at: doc.created_at,
    vin: vinRecordMap.get(doc.vin_record_id) || "",
  }));
}

// Get current customer record
export async function fetchCurrentCustomer() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) throw error;
  return data;
}
