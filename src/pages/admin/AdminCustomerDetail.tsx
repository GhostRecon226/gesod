import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowUpRight,
  Circle,
  FileText,
  MessageSquare,
  Activity,
  Mail,
  Phone,
  Globe,
  Car,
  FileCheck,
  Quote,
  Loader2,
} from "lucide-react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomer } from "@/hooks/useCustomers";
import {
  useCustomerDashboardStats,
  useRecentStatusUpdates,
  useRecentDocuments,
} from "@/hooks/useCustomerDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { VinStatus } from "@/services/vehicleService";

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

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: customer, isLoading: customerLoading, error: customerError } = useCustomer(id || "");
  const { data: stats, isLoading: statsLoading } = useCustomerDashboardStats(id);
  const { data: recentUpdates, isLoading: updatesLoading } = useRecentStatusUpdates(id, 5);
  const { data: recentDocs, isLoading: docsLoading } = useRecentDocuments(id, 5);

  // Fetch recent quote responses
  const { data: recentQuotes, isLoading: quotesLoading } = useQuery({
    queryKey: ["adminCustomerQuotes", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_quote_requests")
        .select("id, quote_type, quote_status, quote_amount, currency, updated_at, vehicle_details")
        .eq("customer_id", id!)
        .order("updated_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

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

  if (customerError) {
    return (
      <AdminDashboardLayout pageTitle="Customer Details">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading customer: {customerError.message}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (customerLoading) {
    return (
      <AdminDashboardLayout pageTitle="Customer Details">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!customer) {
    return (
      <AdminDashboardLayout pageTitle="Customer Details">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">Customer not found</p>
          <Button variant="outline" onClick={() => navigate("/admin/customers")}>
            Back to Customers
          </Button>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout pageTitle="Customer Details">
      <div className="max-w-6xl space-y-6">
        {/* Admin Preview Banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 flex items-center gap-2">
          <span className="text-xs font-medium text-primary">Admin View</span>
          <span className="text-xs text-muted-foreground">
            You're viewing this customer's dashboard as an administrator
          </span>
        </div>

        {/* Back Button + Header */}
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/customers")}
            className="mt-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                {customer.full_name}
              </h1>
              <div className="flex items-center gap-1.5">
                <Circle 
                  className={`h-2 w-2 fill-current ${
                    customer.account_status === "active" 
                      ? "text-success" 
                      : "text-destructive"
                  }`} 
                />
                <span className="text-sm capitalize text-muted-foreground">
                  {customer.account_status}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {customer.email}
              </span>
              {customer.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {customer.phone}
                </span>
              )}
              {customer.country && (
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  {customer.country}
                </span>
              )}
              <span className="text-muted-foreground/60">
                Joined {format(new Date(customer.created_at), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/vehicles?customer=${id}`}>
              <Car className="h-3.5 w-3.5 mr-1.5" />
              View Vehicles
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/quotes?customer=${id}`}>
              <Quote className="h-3.5 w-3.5 mr-1.5" />
              View Quotes
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/admin/documents?customer=${id}`}>
              <FileCheck className="h-3.5 w-3.5 mr-1.5" />
              View Documents
            </Link>
          </Button>
        </div>

        {/* Metrics Groups */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicles Group */}
            <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Vehicles
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total</p>
                  {statsLoading ? (
                    <Skeleton className="h-9 w-12" />
                  ) : (
                    <p className="text-3xl font-semibold text-foreground tabular-nums">
                      {stats?.totalVehicles || 0}
                    </p>
                  )}
                </div>
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
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pending Quotes</p>
                {statsLoading ? (
                  <Skeleton className="h-9 w-12" />
                ) : (
                  <p className="text-3xl font-semibold text-foreground tabular-nums">
                    {stats?.pendingQuotes || 0}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Operational Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Operational Activity
            </h2>
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
                  Activity will appear here as this customer's shipments progress.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminDashboardLayout>
  );
}