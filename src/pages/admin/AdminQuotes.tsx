import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Loader2,
  MoreHorizontal,
  Eye,
  Circle,
  X,
  Download,
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
import {
  usePublicQuoteRequests,
  useUpdateQuoteStatus,
  useUpdateQuoteResponse,
  PublicQuoteRequest,
} from "@/hooks/usePublicQuoteRequests";
import { QuoteDetailDialog } from "@/components/admin/QuoteDetailDialog";
import { useCustomers } from "@/hooks/useCustomers";
import { exportToCsv } from "@/lib/exportCsv";

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

function getVehicleSummary(details: string): string {
  const parsed = parseVehicleDetails(details);
  const parts = [parsed.year, parsed.make, parsed.model].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "—";
}

function getVinFromDetails(details: string): string | null {
  const parsed = parseVehicleDetails(details);
  return parsed.vin || null;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  issued: "Issued",
  accepted: "Accepted",
  expired: "Expired",
};

const statusIndicator: Record<string, string> = {
  pending: "text-warning",
  issued: "text-primary",
  accepted: "text-success",
  expired: "text-muted-foreground",
};

function formatCurrency(amount: number | null, currency: string | null): string {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

export default function AdminQuotes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const customerIdFromUrl = searchParams.get("customer");

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>(customerIdFromUrl || "all");
  const [selectedQuote, setSelectedQuote] = useState<PublicQuoteRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: quotes, isLoading, error } = usePublicQuoteRequests();
  const { data: customers } = useCustomers();
  const updateStatusMutation = useUpdateQuoteStatus();
  const updateResponseMutation = useUpdateQuoteResponse();

  // Sync URL param with filter state
  useEffect(() => {
    if (customerIdFromUrl) {
      setCustomerFilter(customerIdFromUrl);
    }
  }, [customerIdFromUrl]);

  const clearCustomerFilter = () => {
    setCustomerFilter("all");
    setSearchParams((params) => {
      params.delete("customer");
      return params;
    });
  };

  const selectedCustomer = customers?.find((c) => c.id === customerFilter);

  const filteredQuotes = useMemo(() => {
    if (!quotes) return [];

    return quotes.filter((quote) => {
      const searchLower = searchQuery.toLowerCase();
      const vehicleDetails = parseVehicleDetails(quote.vehicle_details);
      const matchesSearch =
        searchQuery === "" ||
        quote.contact_name.toLowerCase().includes(searchLower) ||
        quote.contact_email.toLowerCase().includes(searchLower) ||
        (vehicleDetails.vin && vehicleDetails.vin.toLowerCase().includes(searchLower));

      const matchesType = typeFilter === "all" || quote.quote_type === typeFilter;
      const matchesStatus = statusFilter === "all" || quote.quote_status === statusFilter;
      const matchesCustomer = customerFilter === "all" || quote.customer_id === customerFilter;

      return matchesSearch && matchesType && matchesStatus && matchesCustomer;
    });
  }, [quotes, searchQuery, typeFilter, statusFilter, customerFilter]);

  const stats = useMemo(() => {
    if (!quotes) return { total: 0, pending: 0, issued: 0 };
    return {
      total: quotes.length,
      pending: quotes.filter((q) => q.quote_status === "pending").length,
      issued: quotes.filter((q) => q.quote_status === "issued").length,
    };
  }, [quotes]);

  const handleStatusChange = (quoteId: string, status: "pending" | "issued" | "expired" | "accepted") => {
    updateStatusMutation.mutate({ id: quoteId, status });
  };

  const handleOpenDetail = (quote: PublicQuoteRequest) => {
    setSelectedQuote(quote);
    setDetailDialogOpen(true);
  };

  const handleQuoteResponseSubmit = async (data: {
    quote_status: "pending" | "issued" | "expired" | "accepted";
    quote_amount: number | null;
    currency: string;
    valid_until: string | null;
    admin_notes: string | null;
  }) => {
    if (!selectedQuote) return;
    await updateResponseMutation.mutateAsync({
      id: selectedQuote.id,
      ...data,
    });
  };

  if (error) {
    return (
      <AdminDashboardLayout pageTitle="Quotes">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading quotes: {error.message}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  const handleExport = () => {
    exportToCsv(
      filteredQuotes,
      "quotes",
      [
        { key: "id", header: "ID", transform: (v) => String(v).slice(0, 8) },
        { key: "quote_type", header: "Type", transform: (v) => v === "ocean_freight" ? "Ocean" : "Inland" },
        { key: "contact_name", header: "Contact Name" },
        { key: "contact_email", header: "Contact Email" },
        { key: "contact_phone", header: "Contact Phone" },
        { key: "customer_id", header: "Customer", transform: (_v, item) => item.customer?.full_name || "Guest" },
        { key: "vehicle_details", header: "Vehicle", transform: (v) => getVehicleSummary(String(v)) },
        { key: "origin_location", header: "Origin" },
        { key: "destination_location", header: "Destination" },
        { key: "quote_amount", header: "Amount", transform: (v, item) => v ? `${item.currency || "USD"} ${v}` : "" },
        { key: "quote_status", header: "Status", transform: (v) => statusLabels[String(v)] || String(v) },
        { key: "valid_until", header: "Valid Until", transform: (v) => v ? format(new Date(String(v)), "yyyy-MM-dd") : "" },
        { key: "created_at", header: "Created", transform: (v) => format(new Date(String(v)), "yyyy-MM-dd") },
      ]
    );
  };

  return (
    <AdminDashboardLayout 
      pageTitle="Quote Requests"
      actions={
        <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredQuotes.length === 0}>
          <Download className="h-4 w-4 mr-1.5" />
          Export
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 max-w-sm">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.pending}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Issued</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.issued}</p>
          </div>
        </div>

        {/* Customer Filter Banner */}
        {selectedCustomer && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm">
              Showing quotes for <span className="font-medium">{selectedCustomer.full_name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={clearCustomerFilter}>
              <X className="h-3.5 w-3.5 mr-1" />
              Clear filter
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name, email, VIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ocean_freight">Ocean</SelectItem>
              <SelectItem value="inland_freight">Inland</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9">
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
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredQuotes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-medium uppercase tracking-wider">ID</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Customer</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Vehicle</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider text-right">Amount</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Date</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => {
                  const vin = getVinFromDetails(quote.vehicle_details);
                  return (
                    <TableRow 
                      key={quote.id} 
                      className="hover:bg-muted/20 cursor-pointer"
                      onClick={() => handleOpenDetail(quote)}
                    >
                      <TableCell>
                        <code className="text-xs font-mono text-muted-foreground">
                          {quote.id.slice(0, 8)}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm capitalize">
                          {quote.quote_type === "ocean_freight" ? "Ocean" : "Inland"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="text-sm">
                            {quote.customer ? quote.customer.full_name : quote.contact_name}
                          </span>
                          {!quote.customer && (
                            <span className="text-xs text-muted-foreground ml-1.5">(Guest)</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className="text-sm">{getVehicleSummary(quote.vehicle_details)}</span>
                          {vin && (
                            <code className="text-xs text-muted-foreground font-mono block">
                              {vin}
                            </code>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm tabular-nums">
                          {formatCurrency(quote.quote_amount, quote.currency)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Circle className={`h-2 w-2 fill-current ${statusIndicator[quote.quote_status]}`} />
                          <span className="text-sm">{statusLabels[quote.quote_status]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {format(new Date(quote.created_at), "MMM d")}
                        </span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDetail(quote)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View & Respond
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>Set Status</DropdownMenuSubTrigger>
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
              <p className="text-sm">No quotes found</p>
            </div>
          )}
        </div>
      </div>

      <QuoteDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        quote={selectedQuote}
        onSubmit={handleQuoteResponseSubmit}
        isLoading={updateResponseMutation.isPending}
      />
    </AdminDashboardLayout>
  );
}
