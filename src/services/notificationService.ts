import { supabase } from "@/integrations/supabase/client";
import { fetchCurrentCustomer } from "./customerDashboardService";

export type NotificationType = "status_update" | "document_upload" | "quote_response" | "bid_outcome";

export interface Notification {
  id: string;
  customer_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  related_id: string | null;
  related_type: string | null;
  created_at: string;
}

// Fetch all notifications for the current customer
export async function fetchCustomerNotifications(): Promise<Notification[]> {
  const customer = await fetchCurrentCustomer();

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data || []) as Notification[];
}

// Get unread notification count
export async function fetchUnreadNotificationCount(): Promise<number> {
  const customer = await fetchCurrentCustomer();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", customer.id)
    .eq("is_read", false);

  if (error) throw error;
  return count || 0;
}

// Mark a single notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) throw error;
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<void> {
  const customer = await fetchCurrentCustomer();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("customer_id", customer.id)
    .eq("is_read", false);

  if (error) throw error;
}
