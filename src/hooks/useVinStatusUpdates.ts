import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStatusUpdates,
  createStatusUpdate,
  deleteStatusUpdate,
  type CreateStatusUpdateData,
} from "@/services/vinStatusUpdateService";
import { useToast } from "@/hooks/use-toast";

export function useVinStatusUpdates(vinRecordId: string | undefined) {
  return useQuery({
    queryKey: ["vinStatusUpdates", vinRecordId],
    queryFn: () => fetchStatusUpdates(vinRecordId!),
    enabled: !!vinRecordId,
  });
}

export function useCreateStatusUpdate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createStatusUpdate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["vinStatusUpdates", data.vin_record_id] });
      queryClient.invalidateQueries({ queryKey: ["vinRecords"] });
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
    mutationFn: ({ id, vinRecordId }: { id: string; vinRecordId: string }) => 
      deleteStatusUpdate(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vinStatusUpdates", variables.vinRecordId] });
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
