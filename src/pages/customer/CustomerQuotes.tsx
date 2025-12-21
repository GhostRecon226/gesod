import { format } from "date-fns";
import { Ship, Truck, Gavel, Clock, CheckCircle2, XCircle, AlertCircle, DollarSign } from "lucide-react";
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
import { QuoteStatus, BidRequestStatus } from "@/services/customerQuoteService";

// Quote type labels and icons
const quoteTypeConfig: Record<string, { label: string; icon: typeof Ship }> = {
  ocean_freight: { label: "Ocean Freight", icon: Ship },
  inland_freight: { label: "Inland Freight", icon: Truck },
};

// Quote status config
const quoteStatusConfig: Record<QuoteStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "secondary" },
  issued: { label: "Issued", variant: "default" },
  expired: { label: "Expired", variant: "destructive" },
  accepted: { label: "Accepted", variant: "outline" },
};

// Bid status config
const bidStatusConfig: Record<BidRequestStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  pending: { label: "Pending", variant: "secondary", icon: Clock },
  approved: { label: "Approved", variant: "default", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
  won: { label: "Won", variant: "outline", icon: CheckCircle2 },
  lost: { label: "Lost", variant: "destructive", icon: XCircle },
};

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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
                    <p>No quote requests yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Vehicle Details</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Amount</TableHead>
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
                    <p>No bid requests yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Auction Reference</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>Max Bid</TableHead>
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

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <TypeIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{typeConfig.label}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm">{quote.vehicle_details}</span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <span className="text-muted-foreground">From:</span> {quote.origin_location}
          <br />
          <span className="text-muted-foreground">To:</span> {quote.destination_location}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
      </TableCell>
      <TableCell>
        {quote.quote_amount ? (
          <span className="font-medium text-success flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {formatCurrency(quote.quote_amount)}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
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

  return (
    <TableRow>
      <TableCell>
        <span className="font-mono text-sm">{bid.auction_vehicle_reference}</span>
      </TableCell>
      <TableCell>
        <div className="text-sm">
          {bid.destination_port}, {bid.destination_country}
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium">{formatCurrency(bid.max_bid_amount)}</span>
      </TableCell>
      <TableCell>
        <Badge variant={statusConfig.variant} className="gap-1">
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
