import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Send, User, Shield } from "lucide-react";
import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTicket } from "@/hooks/useSupportTickets";
import { useTicketReplies, useCreateReply } from "@/hooks/useTicketReplies";
import { useAuth } from "@/contexts/AuthContext";
import { SupportTicket } from "@/services/supportTicketService";

const statusColors: Record<SupportTicket["status"], string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  awaiting_customer: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-muted text-muted-foreground",
};

const priorityColors: Record<SupportTicket["priority"], string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<SupportTicket["status"], string> = {
  open: "Open",
  in_progress: "In Progress",
  awaiting_customer: "Awaiting Response",
  resolved: "Resolved",
  closed: "Closed",
};

export default function CustomerTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: ticket, isLoading: ticketLoading } = useTicket(id);
  const { data: replies, isLoading: repliesLoading } = useTicketReplies(id);
  const createReply = useCreateReply();
  const [replyMessage, setReplyMessage] = useState("");

  const handleSubmitReply = async () => {
    if (!replyMessage.trim() || !id || !user?.id) return;

    await createReply.mutateAsync({
      ticket_id: id,
      author_id: user.id,
      is_admin_reply: false,
      message: replyMessage.trim(),
    });
    setReplyMessage("");
  };

  const isTicketClosed = ticket?.status === "closed" || ticket?.status === "resolved";

  if (ticketLoading) {
    return (
      <CustomerDashboardLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </CustomerDashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <CustomerDashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Ticket not found</p>
          <Button variant="link" onClick={() => navigate("/dashboard/support")}>
            Back to Support
          </Button>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/support")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={statusColors[ticket.status]}>
                {statusLabels[ticket.status]}
              </Badge>
              <Badge variant="outline" className={priorityColors[ticket.priority]}>
                {ticket.priority} priority
              </Badge>
              <span className="text-sm text-muted-foreground capitalize">
                • {ticket.category}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversation Thread */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {/* Original Message */}
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">You</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(ticket.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                      </div>
                      <div className="mt-1 rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
                        {ticket.description}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {repliesLoading ? (
                    <div className="space-y-2">
                      {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : (
                    replies?.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            reply.is_admin_reply
                              ? "bg-orange-500 text-white"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {reply.is_admin_reply ? (
                            <Shield className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {reply.is_admin_reply ? "Support Team" : "You"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(reply.created_at), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                          <div
                            className={`mt-1 rounded-lg p-3 text-sm whitespace-pre-wrap ${
                              reply.is_admin_reply
                                ? "bg-orange-50 dark:bg-orange-900/20"
                                : "bg-muted"
                            }`}
                          >
                            {reply.message}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Reply Input */}
              {!isTicketClosed ? (
                <div className="mt-4 space-y-2 border-t pt-4">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSubmitReply}
                      disabled={!replyMessage.trim() || createReply.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {createReply.isPending ? "Sending..." : "Send Reply"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
                  This ticket is {ticket.status}. Create a new ticket if you need further
                  assistance.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ticket Info */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Ticket ID</p>
                <p className="font-mono text-sm">{ticket.id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="capitalize">{ticket.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <Badge variant="outline" className={priorityColors[ticket.priority]}>
                  {ticket.priority}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className={statusColors[ticket.status]}>
                  {statusLabels[ticket.status]}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p>{format(new Date(ticket.created_at), "MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p>{format(new Date(ticket.updated_at), "MMM d, yyyy")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
