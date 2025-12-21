import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Activity,
  CheckCircle2,
  FileQuestion,
  Clock,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
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

const statusVariants: Record<VinStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  active: "default",
  awaiting_action: "outline",
  in_progress: "default",
  delayed: "destructive",
  completed: "secondary",
  cancelled: "outline",
};

const documentTypeLabels: Record<string, string> = {
  invoice: "Invoice",
  bill_of_lading: "Bill of Lading",
  photo: "Photo",
  other: "Other",
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { data: customer, isLoading: customerLoading } = useCurrentCustomer();
  const { data: stats, isLoading: statsLoading } = useCustomerDashboardStats(customer?.id);
  const { data: recentUpdates, isLoading: updatesLoading } = useRecentStatusUpdates(customer?.id);
  const { data: recentDocs, isLoading: docsLoading } = useRecentDocuments(customer?.id);

  const firstName = customer?.full_name?.split(" ")[0] || "there";

  return (
    <CustomerDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {customerLoading ? "..." : firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your vehicle logistics activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Vehicles"
            value={stats?.totalVehicles || 0}
            description="All registered vehicles"
            icon={Car}
            loading={statsLoading}
          />
          <StatCard
            title="Active Vehicles"
            value={stats?.activeVehicles || 0}
            description="Currently in process"
            icon={Activity}
            loading={statsLoading}
          />
          <StatCard
            title="Completed"
            value={stats?.completedVehicles || 0}
            description="Successfully delivered"
            icon={CheckCircle2}
            loading={statsLoading}
          />
          <StatCard
            title="Pending Quotes"
            value={stats?.pendingQuotes || 0}
            description="Awaiting response"
            icon={FileQuestion}
            loading={statsLoading}
          />
        </div>

        {/* Recent Activity Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Status Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Status Updates
              </CardTitle>
              <CardDescription>
                Latest updates on your vehicles
              </CardDescription>
            </CardHeader>
            <CardContent>
              {updatesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentUpdates && recentUpdates.length > 0 ? (
                <div className="space-y-4">
                  {recentUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={statusVariants[update.status]} className="text-xs">
                            {statusLabels[update.status]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(update.created_at), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm font-medium mt-1 truncate">
                          {update.vehicle.year} {update.vehicle.make} {update.vehicle.model}
                        </p>
                        <code className="text-xs text-muted-foreground font-mono">
                          {update.vin}
                        </code>
                        {update.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {update.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No recent status updates</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Documents
              </CardTitle>
              <CardDescription>
                Recently uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {docsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentDocs && recentDocs.length > 0 ? (
                <div className="space-y-4">
                  {recentDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.file_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {documentTypeLabels[doc.document_type] || doc.document_type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(doc.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        <code className="text-xs text-muted-foreground font-mono">
                          {doc.vin}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No documents yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
