import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  FileText,
  Ship,
  Car,
  Loader2,
  MoreHorizontal,
  Eye,
  Link2,
  Link2Off,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  usePublicQuoteRequests,
  useUpdateQuoteStatus,
  PublicQuoteRequest,
} from "@/hooks/usePublicQuoteRequests";

// Helper to parse vehicle details JSON
function parseVehicleDetails(detailsStr: string): {
  vehicle_type?: string;
  make?: string;
  model?: string;
  year?: string;
  vin?: string;
} {
  try {
    return JSON.parse(detailsStr);
  } catch {
    return {};
  }
}

// Get vehicle summary string
function getVehicleSummary(details: string): string {
  const parsed = parseVehicleDetails(details);
  const parts = [
    parsed.year,
    parsed.make,
    parsed.model,
  ].filter(Boolean);
  
  if (parts.length === 0) {
    return parsed.vehicle_type || "Vehicle details unavailable";
  }
  
  return parts.join(" ");
}

// Get VIN from details
function getVinFromDetails(details: string): string | null {
  const parsed = parseVehicleDetails(details);
  return parsed.vin || null;
}

// Status badge component
function QuoteStatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof Clock; className: string; label: string }> = {
    pending: { icon: Clock, className: "bg-warning/10 text-warning border-warning/30", label: "Pending" },
    issued: { icon: CheckCircle, className: "bg-primary/10 text-primary border-primary/30", label: "Issued" },
    accepted: { icon: CheckCircle, className: "bg-active/10 text-active border-active/30", label: "Accepted" },
    expired: { icon: XCircle, className: "bg-muted text-muted-foreground border-muted", label: "Expired" },
  };

  const { icon: Icon, className, label } = config[status] || config.pending;

  return (
    <Badge variant="outline" className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

// Quote type badge
function QuoteTypeBadge({ type }: { type: string }) {
  const isOcean = type === "ocean_freight";
  return (
    <Badge variant="outline" className={isOcean ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary text-secondary-foreground"}>
      {isOcean ? <Ship className="h-3 w-3 mr-1" /> : <Car className="h-3 w-3 mr-1" />}
      {isOcean ? "Ocean" : "Inland"}
    </Badge>
  );
}

export default function AdminQuotes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: quotes, isLoading, error } = usePublicQuoteRequests();
  const updateStatusMutation = useUpdateQuoteStatus();

  // Filter quotes
  const filteredQuotes = useMemo(() => {
    if (!quotes) return [];

    return quotes.filter((quote) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const vehicleDetails = parseVehicleDetails(quote.vehicle_details);
      const matchesSearch =
        searchQuery === "" ||
        quote.contact_name.toLowerCase().includes(searchLower) ||
        quote.contact_email.toLowerCase().includes(searchLower) ||
        (vehicleDetails.vin && vehicleDetails.vin.toLowerCase().includes(searchLower)) ||
        quote.id.toLowerCase().includes(searchLower);

      // Type filter
      const matchesType = typeFilter === "all" || quote.quote_type === typeFilter;

      // Status filter
      const matchesStatus = statusFilter === "all" || quote.quote_status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [quotes, searchQuery, typeFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    if (!quotes) return { total: 0, pending: 0, ocean: 0, inland: 0 };
    return {
      total: quotes.length,
      pending: quotes.filter((q) => q.quote_status === "pending").length,
      ocean: quotes.filter((q) => q.quote_type === "ocean_freight").length,
      inland: quotes.filter((q) => q.quote_type === "inland_freight").length,
    };
  }, [quotes]);

  const handleStatusChange = (quoteId: string, status: "pending" | "issued" | "expired" | "accepted") => {
    updateStatusMutation.mutate({ id: quoteId, status });
  };

  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading quotes: {error.message}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quote Requests</h1>
            <p className="text-muted-foreground mt-1">
              Manage all incoming quote requests
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocean Freight</CardTitle>
              <Ship className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ocean}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inland Freight</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inland}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, VIN, or quote ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Quote Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ocean_freight">Ocean Freight</SelectItem>
              <SelectItem value="inland_freight">Inland Freight</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
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
            ) : filteredQuotes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quote ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => {
                    const vin = getVinFromDetails(quote.vehicle_details);
                    return (
                      <TableRow key={quote.id}>
                        <TableCell className="font-mono text-xs">
                          {quote.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <QuoteTypeBadge type={quote.quote_type} />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {quote.customer ? quote.customer.full_name : quote.contact_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {quote.customer ? (
                                <span className="text-primary">Linked Customer</span>
                              ) : (
                                "Guest"
                              )}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{getVehicleSummary(quote.vehicle_details)}</p>
                            {vin && (
                              <p className="text-xs text-muted-foreground font-mono">
                                VIN: {vin}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <QuoteStatusBadge status={quote.quote_status} />
                        </TableCell>
                        <TableCell>
                          {format(new Date(quote.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Update Status
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "pending")}>
                                    Pending
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "issued")}>
                                    Issued
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "accepted")}>
                                    Accepted
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "expired")}>
                                    Expired
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                              <DropdownMenuSeparator />
                              {quote.customer ? (
                                <DropdownMenuItem>
                                  <Link2Off className="h-4 w-4 mr-2" />
                                  Unlink Customer
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <Link2 className="h-4 w-4 mr-2" />
                                  Link to Customer
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <FileText className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No quote requests found</p>
                <p className="text-sm">
                  {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Quote requests will appear here when submitted"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
