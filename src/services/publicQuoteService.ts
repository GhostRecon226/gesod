import { supabase } from "@/integrations/supabase/client";

export interface PublicQuoteRequestInput {
  quote_type: "ocean_freight" | "inland_freight";
  full_name: string;
  email: string;
  phone: string;
  vehicle_type: string;
  make: string;
  model: string;
  year: string;
  vin?: string;
  origin_port: string;
  destination_port: string;
  auction_source?: string;
  lot_number?: string;
  additional_notes?: string;
}

// Create a public quote request (no authentication required)
export async function createPublicQuoteRequest(input: PublicQuoteRequestInput): Promise<{ success: boolean; message: string }> {
  // Build vehicle details as a structured JSON string
  const vehicleDetails = JSON.stringify({
    vehicle_type: input.vehicle_type,
    make: input.make,
    model: input.model,
    year: input.year,
    vin: input.vin || null,
    auction_source: input.auction_source || null,
    lot_number: input.lot_number || null,
    additional_notes: input.additional_notes || null,
  });

  // Use the RPC function for public quote submission
  const { data, error } = await supabase.rpc('create_public_quote_request' as any, {
    p_quote_type: input.quote_type,
    p_vehicle_details: vehicleDetails,
    p_origin_location: input.origin_port,
    p_destination_location: input.destination_port,
    p_contact_email: input.email,
    p_contact_name: input.full_name,
    p_contact_phone: input.phone,
  });

  if (error) {
    console.error("Error creating public quote request:", error);
    throw new Error("Failed to submit quote request. Please try again.");
  }

  return {
    success: true,
    message: "Your quote request has been received. We will respond shortly.",
  };
}
