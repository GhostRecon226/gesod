import { supabase } from "@/integrations/supabase/client";

export interface SupportTicket {
  id: string;
  customer_id: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "awaiting_customer" | "resolved" | "closed";
  category: "general" | "shipping" | "documents" | "billing" | "other";
  related_vin_record_id?: string | null;
  related_vehicle_id?: string | null;
  created_at: string;
  updated_at: string;
  customers?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface TicketReply {
  id: string;
  ticket_id: string;
  author_id: string;
  is_admin_reply: boolean;
  message: string;
  created_at: string;
}

export interface CreateTicketData {
  customer_id: string;
  subject: string;
  description: string;
  priority?: "low" | "medium" | "high" | "urgent";
  category?: "general" | "shipping" | "documents" | "billing" | "other";
  related_vin_record_id?: string | null;
  related_vehicle_id?: string | null;
}

export interface CreateReplyData {
  ticket_id: string;
  author_id: string;
  is_admin_reply: boolean;
  message: string;
}

// Fetch all tickets (admin)
export async function fetchAllTickets(): Promise<SupportTicket[]> {
  const { data, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      customers (
        id,
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as SupportTicket[];
}

// Fetch customer's tickets
export async function fetchCustomerTickets(customerId: string): Promise<SupportTicket[]> {
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as SupportTicket[];
}

// Fetch single ticket
export async function fetchTicketById(ticketId: string): Promise<SupportTicket | null> {
  const { data, error } = await supabase
    .from("support_tickets")
    .select(`
      *,
      customers (
        id,
        full_name,
        email
      )
    `)
    .eq("id", ticketId)
    .single();

  if (error) throw error;
  return data as SupportTicket;
}

// Create ticket
export async function createTicket(ticketData: CreateTicketData): Promise<SupportTicket> {
  const { data, error } = await supabase
    .from("support_tickets")
    .insert(ticketData)
    .select()
    .single();

  if (error) throw error;
  return data as SupportTicket;
}

// Update ticket status
export async function updateTicketStatus(
  ticketId: string,
  status: SupportTicket["status"]
): Promise<SupportTicket> {
  const { data, error } = await supabase
    .from("support_tickets")
    .update({ status })
    .eq("id", ticketId)
    .select()
    .single();

  if (error) throw error;
  return data as SupportTicket;
}

// Update ticket priority
export async function updateTicketPriority(
  ticketId: string,
  priority: SupportTicket["priority"]
): Promise<SupportTicket> {
  const { data, error } = await supabase
    .from("support_tickets")
    .update({ priority })
    .eq("id", ticketId)
    .select()
    .single();

  if (error) throw error;
  return data as SupportTicket;
}

// Delete ticket
export async function deleteTicket(ticketId: string): Promise<void> {
  const { error } = await supabase
    .from("support_tickets")
    .delete()
    .eq("id", ticketId);

  if (error) throw error;
}

// Fetch ticket replies
export async function fetchTicketReplies(ticketId: string): Promise<TicketReply[]> {
  const { data, error } = await supabase
    .from("ticket_replies")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as TicketReply[];
}

// Create reply
export async function createReply(replyData: CreateReplyData): Promise<TicketReply> {
  const { data, error } = await supabase
    .from("ticket_replies")
    .insert(replyData)
    .select()
    .single();

  if (error) throw error;
  return data as TicketReply;
}
