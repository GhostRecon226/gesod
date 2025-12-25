import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTicketAttachments,
  uploadTicketAttachment,
  uploadReplyAttachment,
  getAttachmentUrl,
} from "@/services/supportTicketService";
import { toast } from "@/hooks/use-toast";

export function useTicketAttachments(ticketId: string | undefined) {
  return useQuery({
    queryKey: ["ticket-attachments", ticketId],
    queryFn: () => fetchTicketAttachments(ticketId!),
    enabled: !!ticketId,
  });
}

export function useUploadTicketAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, file, userId }: { ticketId: string; file: File; userId: string }) =>
      uploadTicketAttachment(ticketId, file, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-attachments", variables.ticketId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload attachment.",
        variant: "destructive",
      });
    },
  });
}

export function useUploadReplyAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      replyId,
      file,
      userId,
    }: {
      ticketId: string;
      replyId: string;
      file: File;
      userId: string;
    }) => uploadReplyAttachment(ticketId, replyId, file, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-attachments", variables.ticketId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload attachment.",
        variant: "destructive",
      });
    },
  });
}

export function useAttachmentUrl() {
  return useMutation({
    mutationFn: (filePath: string) => getAttachmentUrl(filePath),
  });
}
