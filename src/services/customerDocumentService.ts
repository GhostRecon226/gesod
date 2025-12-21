import { supabase } from "@/integrations/supabase/client";
import { fetchCurrentCustomer } from "./customerDashboardService";

export interface CustomerDocument {
  id: string;
  file_name: string;
  document_type: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface VinDocumentGroup {
  vin_record_id: string;
  vin: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
  };
  documents: CustomerDocument[];
}

// Fetch all documents grouped by VIN for the current customer
export async function fetchCustomerDocuments(): Promise<VinDocumentGroup[]> {
  const customer = await fetchCurrentCustomer();

  // Get all VIN records for this customer with vehicle info
  const { data: vinRecords, error: vinError } = await supabase
    .from("vin_records")
    .select(`
      id,
      vin,
      vehicle:vehicles (
        id,
        make,
        model,
        year
      )
    `)
    .eq("customer_id", customer.id);

  if (vinError) throw vinError;
  if (!vinRecords || vinRecords.length === 0) return [];

  const vinRecordIds = vinRecords.map((v) => v.id);

  // Get all documents for these VIN records
  const { data: documents, error: docsError } = await supabase
    .from("documents")
    .select("*")
    .in("vin_record_id", vinRecordIds)
    .order("created_at", { ascending: false });

  if (docsError) throw docsError;

  // Group documents by VIN
  const docsByVin = new Map<string, CustomerDocument[]>();
  (documents || []).forEach((doc) => {
    const existing = docsByVin.get(doc.vin_record_id) || [];
    existing.push({
      id: doc.id,
      file_name: doc.file_name,
      document_type: doc.document_type,
      file_path: doc.file_path,
      file_size: doc.file_size,
      mime_type: doc.mime_type,
      created_at: doc.created_at,
    });
    docsByVin.set(doc.vin_record_id, existing);
  });

  // Build grouped result - only include VINs that have documents
  const result: VinDocumentGroup[] = [];
  
  vinRecords.forEach((vinRecord) => {
    const docs = docsByVin.get(vinRecord.id);
    if (docs && docs.length > 0) {
      const vehicle = vinRecord.vehicle as { id: string; make: string; model: string; year: number } | null;
      result.push({
        vin_record_id: vinRecord.id,
        vin: vinRecord.vin,
        vehicle: vehicle || { id: "", make: "Unknown", model: "Unknown", year: 0 },
        documents: docs,
      });
    }
  });

  return result;
}

// Get document download URL
export async function getDocumentDownloadUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}
