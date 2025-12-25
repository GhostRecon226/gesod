import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { Download, Search, Trash2 } from "lucide-react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAllTickets,
  useUpdateTicketStatus,
  useDeleteTicket,
} from "@/hooks/useSupportTickets";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { SupportTicket } from "@/services/supportTicketService";
import { exportToCsv } from "@/lib/exportCsv";

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
  awaiting_customer: "Awaiting Customer",
  resolved: "Resolved",
  closed: "Closed",
};

const statusOptions: SupportTicket["status"][] = [
  "open",
  "in_progress",
  "awaiting_customer",
  "resolved",
  "closed",
];

export default function AdminSupportTickets() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerFilter = searchParams.get("customer");
  
  const { data: tickets, isLoading } = useAllTickets();
  const updateStatus = useUpdateTicketStatus();
  const deleteTicket = useDeleteTicket();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
        ticket.customers?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        ticket.customers?.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchesCustomer = !customerFilter || ticket.customer_id === customerFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesCustomer;
    });
  }, [tickets, search, statusFilter, priorityFilter, customerFilter]);

  const handleExport = () => {
    const columns = [
      { key: "id" as const, header: "ID", transform: (v: string) => v.slice(0, 8) },
      { key: "subject" as const, header: "Subject" },
      { key: "customers" as const, header: "Customer", transform: (_: unknown, t: SupportTicket) => t.customers?.full_name || "N/A" },
      { key: "customers" as const, header: "Email", transform: (_: unknown, t: SupportTicket) => t.customers?.email || "N/A" },
      { key: "category" as const, header: "Category" },
      { key: "priority" as const, header: "Priority" },
      { key: "status" as const, header: "Status", transform: (v: SupportTicket["status"]) => statusLabels[v] },
      { key: "created_at" as const, header: "Created", transform: (v: string) => format(new Date(v), "yyyy-MM-dd") },
    ];
    exportToCsv(filteredTickets, "support-tickets", columns);
  };

  const handleDelete = (ticket: SupportTicket, e: React.MouseEvent) => {
    e.stopPropagation();
    setTicketToDelete(ticket);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (ticketToDelete) {
      await deleteTicket.mutateAsync(ticketToDelete.id);
      setDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  const openCount = tickets?.filter((t) => t.status === "open").length || 0;
  const urgentCount = tickets?.filter((t) => t.priority === "urgent" && t.status !== "closed" && t.status !== "resolved").length || 0;

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
            <p className="text-muted-foreground">
              Manage customer support requests
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{tickets?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total Tickets</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{openCount}</div>
              <p className="text-xs text-muted-foreground">Open</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
              <p className="text-xs text-muted-foreground">Urgent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{filteredTickets.length}</div>
              <p className="text-xs text-muted-foreground">Showing</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by subject or customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabels[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No tickets found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/admin/support/${ticket.id}`)}
                    >
                      <TableCell className="font-medium max-w-[250px] truncate">
                        {ticket.subject}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ticket.customers?.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {ticket.customers?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{ticket.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={priorityColors[ticket.priority]}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={ticket.status}
                          onValueChange={(value: SupportTicket["status"]) => {
                            updateStatus.mutate({ ticketId: ticket.id, status: value });
                          }}
                        >
                          <SelectTrigger
                            className="w-[150px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Badge variant="outline" className={statusColors[ticket.status]}>
                              {statusLabels[ticket.status]}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {statusLabels[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(ticket.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDelete(ticket, e)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Ticket"
        description={`Are you sure you want to delete the ticket "${ticketToDelete?.subject}"? This action cannot be undone.`}
        isLoading={deleteTicket.isPending}
      />
    </AdminDashboardLayout>
  );
}
