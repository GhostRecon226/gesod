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

// Attachment types
export interface TicketAttachment {
  id: string;
  ticket_id: string;
  reply_id: string | null;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string;
  created_at: string;
}

// Upload attachment to storage
export async function uploadTicketAttachment(
  ticketId: string,
  file: File,
  userId: string
): Promise<{ path: string; attachment: TicketAttachment }> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${ticketId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("ticket-attachments")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Create attachment record
  const { data, error } = await supabase
    .from("ticket_attachments")
    .insert({
      ticket_id: ticketId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      uploaded_by: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return { path: filePath, attachment: data as TicketAttachment };
}

// Upload attachment with reply
export async function uploadReplyAttachment(
  ticketId: string,
  replyId: string,
  file: File,
  userId: string
): Promise<TicketAttachment> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `${ticketId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("ticket-attachments")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data, error } = await supabase
    .from("ticket_attachments")
    .insert({
      ticket_id: ticketId,
      reply_id: replyId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      uploaded_by: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as TicketAttachment;
}

// Fetch attachments for a ticket
export async function fetchTicketAttachments(ticketId: string): Promise<TicketAttachment[]> {
  const { data, error } = await supabase
    .from("ticket_attachments")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as TicketAttachment[];
}

// Get signed URL for attachment download
export async function getAttachmentUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("ticket-attachments")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}
