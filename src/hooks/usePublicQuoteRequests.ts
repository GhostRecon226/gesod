import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PublicQuoteRequest {
  id: string;
  quote_type: "ocean_freight" | "inland_freight";
  quote_status: "pending" | "issued" | "expired" | "accepted";
  vehicle_details: string;
  origin_location: string;
  destination_location: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  admin_notes: string | null;
  customer_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined customer data
  customer?: {
    id: string;
    full_name: string;
    email: string;
  } | null;
}

// Fetch all public quote requests (admin only)
export function usePublicQuoteRequests() {
  return useQuery({
    queryKey: ["public-quote-requests"],
    queryFn: async (): Promise<PublicQuoteRequest[]> => {
      const { data, error } = await supabase
        .from("public_quote_requests")
        .select(`
          *,
          customer:customers!public_quote_requests_customer_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as unknown as PublicQuoteRequest[];
    },
  });
}

// Update quote status
export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "issued" | "expired" | "accepted";
    }) => {
      const { error } = await supabase
        .from("public_quote_requests")
        .update({ quote_status: status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-quote-requests"] });
      toast({
        title: "Status Updated",
        description: "Quote status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    },
  });
}

// Link quote to customer
export function useLinkQuoteToCustomer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      quoteId,
      customerId,
    }: {
      quoteId: string;
      customerId: string | null;
    }) => {
      const { error } = await supabase
        .from("public_quote_requests")
        .update({ customer_id: customerId, updated_at: new Date().toISOString() })
        .eq("id", quoteId);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["public-quote-requests"] });
      toast({
        title: variables.customerId ? "Quote Linked" : "Quote Unlinked",
        description: variables.customerId
          ? "Quote has been linked to the customer."
          : "Quote has been unlinked from the customer.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    },
  });
}

// Update admin notes
export function useUpdateQuoteNotes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      notes,
    }: {
      id: string;
      notes: string;
    }) => {
      const { error } = await supabase
        .from("public_quote_requests")
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["public-quote-requests"] });
      toast({
        title: "Notes Updated",
        description: "Admin notes have been saved.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    },
  });
}
