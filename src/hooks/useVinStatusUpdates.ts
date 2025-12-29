import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchStatusUpdates,
  createStatusUpdate,
  deleteStatusUpdate,
  type CreateStatusUpdateData,
  type VinStatusUpdateWithUser,
} from "@/services/vinStatusUpdateService";
import { useToast } from "@/hooks/use-toast";

// Fetch all status updates across all VINs (admin)
async function fetchAllStatusUpdates(): Promise<VinStatusUpdateWithUser[]> {
  const { data: updates, error } = await supabase
    .from("vin_status_updates")
    .select("*")
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

export function useVinStatusUpdates(vinRecordId: string | undefined) {
  return useQuery({
    queryKey: ["vinStatusUpdates", vinRecordId],
    queryFn: () => fetchStatusUpdates(vinRecordId!),
    enabled: !!vinRecordId,
  });
}

export function useAllStatusUpdates() {
  return useQuery({
    queryKey: ["vinStatusUpdates", "all"],
    queryFn: fetchAllStatusUpdates,
  });
}

export function useCreateStatusUpdate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createStatusUpdate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vinStatusUpdates", data.vin_record_id] });
      queryClient.invalidateQueries({ queryKey: ["vinStatusUpdates", "all"] });
      queryClient.invalidateQueries({ queryKey: ["vinRecords"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle"] });
      toast({
        title: "Status updated",
        description: "The VIN status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteStatusUpdate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteStatusUpdate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinStatusUpdates"] });
      toast({
        title: "Status update deleted",
        description: "The status update has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
