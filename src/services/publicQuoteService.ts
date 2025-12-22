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

// Get the current user's customer_id if logged in
async function getCurrentCustomerId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    // Get customer record for this user
    const { data: customer, error } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (error || !customer) {
      return null;
    }

    return customer.id;
  } catch {
    return null;
  }
}

// Create a quote request (works for both public users and logged-in customers)
export async function createPublicQuoteRequest(input: PublicQuoteRequestInput): Promise<{ success: boolean; message: string }> {
  // Check if user is logged in and get their customer_id
  const customerId = await getCurrentCustomerId();

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

  // Use the RPC function for quote submission
  // The function accepts an optional customer_id parameter
  const { data, error } = await supabase.rpc('create_public_quote_request' as any, {
    p_quote_type: input.quote_type,
    p_vehicle_details: vehicleDetails,
    p_origin_location: input.origin_port,
    p_destination_location: input.destination_port,
    p_contact_email: input.email,
    p_contact_name: input.full_name,
    p_contact_phone: input.phone,
    p_customer_id: customerId, // Will be null for public users, or customer ID for logged-in users
  });

  if (error) {
    console.error("Error creating quote request:", error);
    throw new Error("Failed to submit quote request. Please try again.");
  }

  const isLinked = customerId !== null;
  
  return {
    success: true,
    message: isLinked 
      ? "Your quote request has been received and linked to your account. We will respond shortly."
      : "Your quote request has been received. We will respond shortly.",
  };
}

// Admin function to associate a public quote with a customer
export async function linkQuoteToCustomer(
  quoteId: string, 
  customerId: string
): Promise<{ success: boolean; message: string }> {
  const { error } = await supabase
    .from("public_quote_requests")
    .update({ customer_id: customerId })
    .eq("id", quoteId);

  if (error) {
    console.error("Error linking quote to customer:", error);
    throw new Error("Failed to link quote to customer.");
  }

  return {
    success: true,
    message: "Quote successfully linked to customer.",
  };
}

// Admin function to unlink a quote from a customer
export async function unlinkQuoteFromCustomer(
  quoteId: string
): Promise<{ success: boolean; message: string }> {
  const { error } = await supabase
    .from("public_quote_requests")
    .update({ customer_id: null })
    .eq("id", quoteId);

  if (error) {
    console.error("Error unlinking quote from customer:", error);
    throw new Error("Failed to unlink quote from customer.");
  }

  return {
    success: true,
    message: "Quote successfully unlinked from customer.",
  };
}
