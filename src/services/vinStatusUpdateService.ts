import { supabase } from "@/integrations/supabase/client";
import type { VinStatus } from "./vinService";

// Valid status values (lowercase)
const validStatuses: VinStatus[] = ["pending", "active", "awaiting_action", "in_progress", "delayed", "completed", "cancelled"];

// Normalize status to ensure lowercase enum value
const normalizeStatus = (status: string): VinStatus => {
  const normalized = status.toLowerCase().replace(/ /g, "_") as VinStatus;
  if (!validStatuses.includes(normalized)) {
    throw new Error(`Invalid status: ${status}`);
  }
  return normalized;
};

export interface VinStatusUpdate {
  id: string;
  vin_record_id: string;
  status: VinStatus;
  description: string | null;
  updated_by: string;
  created_at: string;
}

export interface VinStatusUpdateWithUser extends VinStatusUpdate {
  updater_profile: {
    full_name: string | null;
    email: string;
  } | null;
}

export interface CreateStatusUpdateData {
  vin_record_id: string;
  status: VinStatus;
  description?: string;
}

// Fetch status updates for a VIN record
export async function fetchStatusUpdates(vinRecordId: string): Promise<VinStatusUpdateWithUser[]> {
  // First fetch the status updates
  const { data: updates, error } = await supabase
    .from("vin_status_updates")
    .select("*")
    .eq("vin_record_id", vinRecordId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!updates) return [];

  // Get unique user IDs
  const userIds = [...new Set(updates.map(u => u.updated_by))];
  
  // Fetch profiles for those users
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

  return updates.map(update => ({
    ...update,
    updater_profile: profileMap.get(update.updated_by) || null,
  }));
}

// Create a new status update (admin only)
export async function createStatusUpdate(data: CreateStatusUpdateData): Promise<VinStatusUpdateWithUser> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const normalizedStatus = normalizeStatus(data.status);

  const { data: result, error } = await supabase
    .from("vin_status_updates")
    .insert({
      ...data,
      status: normalizedStatus,
      updated_by: user.id,
    })
    .select("*")
    .single();

  if (error) throw error;

  // Fetch the profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", user.id)
    .single();

  return {
    ...result,
    updater_profile: profile || null,
  };
}

// Delete a status update (admin only)
export async function deleteStatusUpdate(id: string) {
  const { error } = await supabase
    .from("vin_status_updates")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
