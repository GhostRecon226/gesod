import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCurrentCustomer,
  useCustomerDashboardStats,
  useRecentStatusUpdates,
  useRecentDocuments,
} from "@/hooks/useCustomerDashboard";
import {
  Car,
  FileText,
  ArrowUpRight,
  Circle,
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

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { data: customer, isLoading: customerLoading } = useCurrentCustomer();
  const { data: stats, isLoading: statsLoading } = useCustomerDashboardStats(customer?.id);
  const { data: recentUpdates, isLoading: updatesLoading } = useRecentStatusUpdates(customer?.id);
  const { data: recentDocs, isLoading: docsLoading } = useRecentDocuments(customer?.id);

  const firstName = customer?.full_name?.split(" ")[0] || "there";

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

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activity - Table */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Recent Activity
              </h2>
              <Link 
                to="/dashboard/vehicles" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {updatesLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentUpdates && recentUpdates.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Vehicle
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                        VIN
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentUpdates.map((update) => (
                      <tr key={update.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Circle className={`h-2 w-2 fill-current ${statusIndicator[update.status]}`} />
                            <span className="text-sm text-foreground">
                              {statusLabels[update.status]}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-foreground">
                            {update.vehicle.year} {update.vehicle.make} {update.vehicle.model}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <code className="text-xs text-muted-foreground font-mono">
                            {update.vin}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm text-muted-foreground tabular-nums">
                            {format(new Date(update.created_at), "MMM d")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-4 py-12 text-center">
                  <Car className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </section>

          {/* Recent Documents - List */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Documents
              </h2>
              <Link 
                to="/dashboard/documents" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {docsLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : recentDocs && recentDocs.length > 0 ? (
                <ul className="divide-y divide-border">
                  {recentDocs.map((doc) => (
                    <li key={doc.id} className="px-4 py-3 hover:bg-muted/20 transition-colors">
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground truncate">
                            {doc.file_name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {documentTypeLabels[doc.document_type] || doc.document_type}
                            <span className="mx-1.5">·</span>
                            {format(new Date(doc.created_at), "MMM d")}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-12 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No documents</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
