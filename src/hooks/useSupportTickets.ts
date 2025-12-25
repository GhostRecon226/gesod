import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllTickets,
  fetchCustomerTickets,
  fetchTicketById,
  createTicket,
  updateTicketStatus,
  updateTicketPriority,
  deleteTicket,
  CreateTicketData,
  SupportTicket,
} from "@/services/supportTicketService";
import { toast } from "@/hooks/use-toast";

export function useAllTickets() {
  return useQuery({
    queryKey: ["support-tickets", "all"],
    queryFn: fetchAllTickets,
  });
}

export function useCustomerTickets(customerId: string | undefined) {
  return useQuery({
    queryKey: ["support-tickets", "customer", customerId],
    queryFn: () => fetchCustomerTickets(customerId!),
    enabled: !!customerId,
  });
}

export function useTicket(ticketId: string | undefined) {
  return useQuery({
    queryKey: ["support-tickets", ticketId],
    queryFn: () => fetchTicketById(ticketId!),
    enabled: !!ticketId,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketData) => createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create ticket.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: SupportTicket["status"] }) =>
      updateTicketStatus(ticketId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast({
        title: "Status Updated",
        description: "Ticket status has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status.",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateTicketPriority() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, priority }: { ticketId: string; priority: SupportTicket["priority"] }) =>
      updateTicketPriority(ticketId, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast({
        title: "Priority Updated",
        description: "Ticket priority has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update priority.",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId: string) => deleteTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      toast({
        title: "Ticket Deleted",
        description: "The support ticket has been deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete ticket.",
        variant: "destructive",
      });
    },
  });
}
