import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  MoreHorizontal,
  MessageSquare,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  ThumbsDown,
} from "lucide-react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  useBidRequests,
  useUpdateBidRequest,
} from "@/hooks/useBidRequests";
import type { BidRequestWithCustomer } from "@/services/bidRequestService";

type BidRequestStatus = "pending" | "approved" | "rejected" | "won" | "lost";

const statusOptions: { value: BidRequestStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export default function AdminBidRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<BidRequestWithCustomer | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<BidRequestStatus>("pending");
  const [adminNotes, setAdminNotes] = useState("");

  const { data: bidRequests, isLoading, error } = useBidRequests();
  const updateMutation = useUpdateBidRequest();

  // Filter bid requests
  const filteredRequests = useMemo(() => {
    if (!bidRequests) return [];

    return bidRequests.filter((request) => {
      const matchesSearch =
        searchQuery === "" ||
        request.customer?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.customer?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.auction_vehicle_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.destination_country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.destination_port.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || request.request_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bidRequests, searchQuery, statusFilter]);

  // Stats
  const totalRequests = bidRequests?.length || 0;
  const pendingRequests = bidRequests?.filter((r) => r.request_status === "pending").length || 0;
  const wonRequests = bidRequests?.filter((r) => r.request_status === "won").length || 0;

  const handleOpenStatusDialog = (request: BidRequestWithCustomer) => {
    setSelectedRequest(request);
    setNewStatus(request.request_status as BidRequestStatus);
    setStatusDialogOpen(true);
  };

  const handleOpenNotesDialog = (request: BidRequestWithCustomer) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || "");
    setNotesDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    
    await updateMutation.mutateAsync({
      id: selectedRequest.id,
      request_status: newStatus,
    });
    
    setStatusDialogOpen(false);
    setSelectedRequest(null);
  };

  const handleUpdateNotes = async () => {
    if (!selectedRequest) return;
    
    await updateMutation.mutateAsync({
      id: selectedRequest.id,
      admin_notes: adminNotes || null,
    });
    
    setNotesDialogOpen(false);
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: BidRequestStatus) => {
    const config: Record<BidRequestStatus, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; label: string }> = {
      pending: { variant: "secondary", icon: <Clock className="h-3 w-3" />, label: "Pending" },
      approved: { variant: "default", icon: <CheckCircle2 className="h-3 w-3" />, label: "Approved" },
      rejected: { variant: "destructive", icon: <XCircle className="h-3 w-3" />, label: "Rejected" },
      won: { variant: "default", icon: <Trophy className="h-3 w-3" />, label: "Won" },
      lost: { variant: "outline", icon: <ThumbsDown className="h-3 w-3" />, label: "Lost" },
    };
    
    const { variant, icon, label } = config[status];
    return (
      <Badge variant={variant} className="gap-1">
        {icon}
        {label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading bid requests: {error.message}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bid Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer bid requests for auction vehicles
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Won Bids</CardTitle>
              <Trophy className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wonRequests}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by customer, vehicle, destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredRequests && filteredRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle Reference</TableHead>
                      <TableHead>Max Bid</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.customer?.full_name || "Unknown"}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.customer?.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.auction_vehicle_reference}</p>
                            {request.auction_vehicle && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                {request.auction_vehicle.status === "active" ? "Active" : "Expired"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-foreground">
                            {formatCurrency(request.max_bid_amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.destination_port}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.destination_country}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.request_status as BidRequestStatus)}
                        </TableCell>
                        <TableCell>
                          {request.admin_notes ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenNotesDialog(request)}
                              className="text-xs"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(request.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenStatusDialog(request)}>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Update Status
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleOpenNotesDialog(request)}>
                                <FileText className="h-4 w-4 mr-2" />
                                {request.admin_notes ? "Edit Notes" : "Add Notes"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No bid requests</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== "all"
                    ? "No requests match your filters."
                    : "No bid requests have been submitted yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Bid Request Status</DialogTitle>
            <DialogDescription>
              Change the status for this bid request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">
                  {selectedRequest.auction_vehicle_reference}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Customer: {selectedRequest.customer?.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Max Bid: {formatCurrency(selectedRequest.max_bid_amount)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>New Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as BidRequestStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStatus} disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Status
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Admin Notes</DialogTitle>
            <DialogDescription>
              Add or edit internal notes for this bid request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">
                  {selectedRequest.auction_vehicle_reference}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Customer: {selectedRequest.customer?.full_name}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Notes (Internal Only)</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this bid request..."
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  These notes are only visible to admin users.
                </p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateNotes} disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Notes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminDashboardLayout>
  );
}
