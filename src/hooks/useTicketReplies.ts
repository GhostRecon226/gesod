import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTicketReplies,
  createReply,
  CreateReplyData,
} from "@/services/supportTicketService";
import { toast } from "@/hooks/use-toast";

export function useTicketReplies(ticketId: string | undefined) {
  return useQuery({
    queryKey: ["ticket-replies", ticketId],
    queryFn: () => fetchTicketReplies(ticketId!),
    enabled: !!ticketId,
  });
}

export function useCreateReply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReplyData) => createReply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket-replies", variables.ticket_id] });
      toast({
        title: "Reply Sent",
        description: "Your reply has been added to the ticket.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reply.",
        variant: "destructive",
      });
    },
  });
}
