import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCurrentCustomer,
  useCustomerDashboardStats,
  useRecentStatusUpdates,
  useRecentDocuments,
} from "@/hooks/useCustomerDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Car,
  FileText,
  ArrowUpRight,
  Circle,
  MessageSquare,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import type { VinStatus } from "@/services/vehicleService";
import { Link } from "react-router-dom";

const statusLabels: Record<VinStatus, string> = {
  pending: "Pending",
  active: "Active",
  awaiting_action: "Awaiting Action",
  in_progress: "In Progress",
  delayed: "Delayed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusIndicator: Record<VinStatus, string> = {
  pending: "text-pending",
  active: "text-in-progress",
  awaiting_action: "text-awaiting",
  in_progress: "text-in-progress",
  delayed: "text-destructive",
  completed: "text-success",
  cancelled: "text-muted-foreground",
};

const documentTypeLabels: Record<string, string> = {
  invoice: "Invoice",
  bill_of_lading: "Bill of Lading",
  photo: "Photo",
  other: "Other",
};

const quoteStatusLabels: Record<string, string> = {
  pending: "Pending",
  issued: "Issued",
  expired: "Expired",
  accepted: "Accepted",
};

interface OperationalActivity {
  id: string;
  type: "status_update" | "document" | "quote";
  title: string;
  description: string;
  date: string;
  status?: string;
  icon: "status" | "document" | "quote";
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { data: customer, isLoading: customerLoading } = useCurrentCustomer();
  const { data: stats, isLoading: statsLoading } = useCustomerDashboardStats(customer?.id);
  const { data: recentUpdates, isLoading: updatesLoading } = useRecentStatusUpdates(customer?.id, 5);
  const { data: recentDocs, isLoading: docsLoading } = useRecentDocuments(customer?.id, 5);

  // Fetch recent quote responses
  const { data: recentQuotes, isLoading: quotesLoading } = useQuery({
    queryKey: ["recentQuoteResponses", customer?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_quote_requests")
        .select("id, quote_type, quote_status, quote_amount, currency, updated_at, vehicle_details")
        .eq("customer_id", customer!.id)
        .neq("quote_status", "pending")
        .order("updated_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!customer?.id,
  });

  const firstName = customer?.full_name?.split(" ")[0] || "there";

  // Combine all activities into unified timeline
  const operationalActivities: OperationalActivity[] = [];

  // Add status updates
  recentUpdates?.forEach((update) => {
    operationalActivities.push({
      id: `status-${update.id}`,
      type: "status_update",
      title: `${update.vehicle.year} ${update.vehicle.make} ${update.vehicle.model}`,
      description: `Status changed to ${statusLabels[update.status]}`,
      date: update.created_at,
      status: update.status,
      icon: "status",
    });
  });

  // Add documents
  recentDocs?.forEach((doc) => {
    operationalActivities.push({
      id: `doc-${doc.id}`,
      type: "document",
      title: doc.file_name,
      description: `${documentTypeLabels[doc.document_type] || doc.document_type} uploaded`,
      date: doc.created_at,
      icon: "document",
    });
  });

  // Add quote responses
  recentQuotes?.forEach((quote) => {
    let vehicleInfo = "Vehicle";
    try {
      const details = JSON.parse(quote.vehicle_details);
      vehicleInfo = `${details.year || ""} ${details.make || ""} ${details.model || ""}`.trim() || "Vehicle";
    } catch {}
    
    const quoteType = quote.quote_type === "ocean_freight" ? "Ocean Freight" : "Inland Freight";
    let description = `${quoteType} quote ${quoteStatusLabels[quote.quote_status]?.toLowerCase()}`;
    if (quote.quote_status === "issued" && quote.quote_amount) {
      description += ` - ${quote.currency || "USD"} ${quote.quote_amount}`;
    }
    
    operationalActivities.push({
      id: `quote-${quote.id}`,
      type: "quote",
      title: vehicleInfo,
      description,
      date: quote.updated_at,
      icon: "quote",
    });
  });

  // Sort by date descending and take first 8
  const sortedActivities = operationalActivities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const isLoading = updatesLoading || docsLoading || quotesLoading;
  const hasActivities = sortedActivities.length > 0;

  const getActivityIcon = (activity: OperationalActivity) => {
    switch (activity.icon) {
      case "status":
        return (
          <Circle 
            className={`h-2 w-2 fill-current ${statusIndicator[activity.status as VinStatus] || "text-muted-foreground"}`} 
          />
        );
      case "document":
        return <FileText className="h-3.5 w-3.5 text-muted-foreground" />;
      case "quote":
        return <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const getActivityTypeLabel = (type: OperationalActivity["type"]) => {
    switch (type) {
      case "status_update":
        return "Status";
      case "document":
        return "Document";
      case "quote":
        return "Quote";
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="max-w-6xl">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-2xl font-semibold text-foreground">
            {customerLoading ? (
              <Skeleton className="h-8 w-64 inline-block" />
            ) : (
              `Welcome back, ${firstName}`
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </header>

        {/* Metrics Groups */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicles Group */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Vehicles
              </p>
              <div className="grid grid-cols-3 gap-4">
                <Link to="/dashboard/vehicles" className="group">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Total
                    </p>
                    {statsLoading ? (
                      <Skeleton className="h-9 w-12" />
                    ) : (
                      <p className="text-3xl font-semibold text-foreground tabular-nums">
                        {stats?.totalVehicles || 0}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active</p>
                  {statsLoading ? (
                    <Skeleton className="h-9 w-12" />
                  ) : (
                    <p className="text-3xl font-semibold text-foreground tabular-nums">
                      {stats?.activeVehicles || 0}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Completed</p>
                  {statsLoading ? (
                    <Skeleton className="h-9 w-12" />
                  ) : (
                    <p className="text-3xl font-semibold text-foreground tabular-nums">
                      {stats?.completedVehicles || 0}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Requests Group */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Requests
              </p>
              <Link to="/dashboard/quotes" className="group">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Pending Quotes
                  </p>
                  {statsLoading ? (
                    <Skeleton className="h-9 w-12" />
                  ) : (
                    <p className="text-3xl font-semibold text-foreground tabular-nums">
                      {stats?.pendingQuotes || 0}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Operational Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Operational Activity
            </h2>
            <Link 
              to="/dashboard/vehicles" 
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              View vehicles
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : hasActivities ? (
              <ul className="divide-y divide-border">
                {sortedActivities.map((activity) => (
                  <li 
                    key={activity.id} 
                    className="px-4 py-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1.5 flex items-center justify-center w-5">
                        {getActivityIcon(activity)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                            {getActivityTypeLabel(activity.type)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0 mt-1">
                        {format(new Date(activity.date), "MMM d")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-16 text-center">
                <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm font-medium text-foreground mb-1">
                  No activity yet
                </p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  This is where you'll see updates about your vehicles, new documents, and quote responses. Activity will appear here as your shipments progress.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </CustomerDashboardLayout>
  );
}
