import { format } from "date-fns";
import { Ship, Truck, Gavel, Clock, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useCustomerQuoteRequests,
  useCustomerBidRequests,
  CustomerQuoteRequest,
  CustomerBidRequest,
} from "@/hooks/useCustomerQuotes";
import { 
  QuoteStatus, 
  BidRequestStatus,
  getVehicleSummary,
  getVinFromDetails,
} from "@/services/customerQuoteService";

// Quote type labels and icons
const quoteTypeConfig: Record<string, { label: string; icon: typeof Ship }> = {
  ocean_freight: { label: "Ocean Freight", icon: Ship },
  inland_freight: { label: "Inland Freight", icon: Truck },
};

// Quote status config
const quoteStatusConfig: Record<QuoteStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
  pending: { label: "Pending", variant: "secondary" },
  issued: { label: "Issued", variant: "default", className: "bg-primary text-primary-foreground" },
  expired: { label: "Expired", variant: "destructive" },
  accepted: { label: "Accepted", variant: "outline", className: "border-active text-active" },
};

// Bid status config
const bidStatusConfig: Record<BidRequestStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock; className?: string }> = {
  pending: { label: "Pending", variant: "secondary", icon: Clock },
  approved: { label: "Approved", variant: "default", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
  won: { label: "Won", variant: "outline", icon: CheckCircle2, className: "border-active text-active bg-active/10" },
  lost: { label: "Lost", variant: "outline", icon: XCircle, className: "border-muted-foreground text-muted-foreground" },
};

// Format currency
function formatCurrency(amount: number, currency: string | null = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function CustomerQuotes() {
  const { data: quotes, isLoading: quotesLoading, error: quotesError } = useCustomerQuoteRequests();
  const { data: bids, isLoading: bidsLoading, error: bidsError } = useCustomerBidRequests();

  const isLoading = quotesLoading || bidsLoading;
  const hasError = quotesError || bidsError;

  if (hasError) {
    return (
      <CustomerDashboardLayout>
        <div className="p-6">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                Failed to load quotes and requests. Please try again.
              </p>
            </CardContent>
          </Card>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Quotes & Requests</h1>
          <p className="text-muted-foreground mt-1">
            View your quote requests and bid submissions
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="quotes" className="gap-2">
              <Ship className="h-4 w-4" />
              Quote Requests
              {quotes && quotes.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {quotes.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bids" className="gap-2">
              <Gavel className="h-4 w-4" />
              Bid Requests
              {bids && bids.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {bids.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Quote Requests Tab */}
          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Quote Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : !quotes || quotes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Ship className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No quote requests yet</p>
                    <p className="text-sm mt-1">
                      Submit a quote request to see it here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Quote Amount</TableHead>
                          <TableHead>Valid Until</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quotes.map((quote) => (
                          <QuoteRow key={quote.id} quote={quote} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bid Requests Tab */}
          <TabsContent value="bids">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Bid Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : !bids || bids.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Gavel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium">No bid requests yet</p>
                    <p className="text-sm mt-1">
                      Submit a bid request to see it here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Auction Vehicle</TableHead>
                          <TableHead>Max Bid</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submitted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bids.map((bid) => (
                          <BidRow key={bid.id} bid={bid} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CustomerDashboardLayout>
  );
}

// Quote Request Row
function QuoteRow({ quote }: { quote: CustomerQuoteRequest }) {
  const typeConfig = quoteTypeConfig[quote.quote_type] || { label: quote.quote_type, icon: Ship };
  const TypeIcon = typeConfig.icon;
  const statusConfig = quoteStatusConfig[quote.quote_status];
  
  // Parse vehicle details for display
  const vehicleSummary = getVehicleSummary(quote.vehicle_details);
  const vin = getVinFromDetails(quote.vehicle_details);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <TypeIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{typeConfig.label}</span>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="text-sm font-medium">{vehicleSummary}</p>
          {vin && (
            <p className="text-xs text-muted-foreground font-mono">
              VIN: {vin}
            </p>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-xs">From:</span> 
            <span>{quote.origin_location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-xs">To:</span> 
            <span>{quote.destination_location}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={statusConfig.variant} className={statusConfig.className}>
          {statusConfig.label}
        </Badge>
      </TableCell>
      <TableCell>
        {quote.quote_amount ? (
          <span className="font-semibold text-primary flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {formatCurrency(quote.quote_amount, quote.currency)}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">Awaiting quote</span>
        )}
      </TableCell>
      <TableCell>
        {quote.valid_until ? (
          <span className="text-sm">
            {format(new Date(quote.valid_until), "MMM d, yyyy")}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {format(new Date(quote.created_at), "MMM d, yyyy")}
      </TableCell>
    </TableRow>
  );
}

// Bid Request Row
function BidRow({ bid }: { bid: CustomerBidRequest }) {
  const statusConfig = bidStatusConfig[bid.request_status];
  const StatusIcon = statusConfig.icon;

  // Build vehicle display from linked auction vehicle or reference
  const vehicleDisplay = bid.auction_vehicle
    ? `${bid.auction_vehicle.year} ${bid.auction_vehicle.make} ${bid.auction_vehicle.model}`
    : null;

  return (
    <TableRow>
      <TableCell>
        <div>
          {vehicleDisplay && (
            <p className="text-sm font-medium">{vehicleDisplay}</p>
          )}
          <p className="text-xs text-muted-foreground font-mono">
            {bid.auction_vehicle_reference}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <span className="font-semibold text-primary flex items-center gap-1">
          <DollarSign className="h-3 w-3" />
          {formatCurrency(bid.max_bid_amount)}
        </span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {bid.destination_port}, {bid.destination_country}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={statusConfig.variant} className={`gap-1 ${statusConfig.className || ""}`}>
          <StatusIcon className="h-3 w-3" />
          {statusConfig.label}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {format(new Date(bid.created_at), "MMM d, yyyy")}
      </TableCell>
    </TableRow>
  );
}
