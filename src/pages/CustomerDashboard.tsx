import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp,
  ArrowRight,
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

const statusColors: Record<VinStatus, string> = {
  pending: "bg-pending-muted text-pending",
  active: "bg-in-progress-muted text-in-progress",
  awaiting_action: "bg-awaiting-muted text-awaiting",
  in_progress: "bg-in-progress-muted text-in-progress",
  delayed: "bg-destructive-muted text-destructive",
  completed: "bg-success-muted text-success",
  cancelled: "bg-muted text-muted-foreground",
};

const documentTypeLabels: Record<string, string> = {
  invoice: "Invoice",
  bill_of_lading: "Bill of Lading",
  photo: "Photo",
  other: "Other",
};

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  loading?: boolean;
  trend?: "up" | "neutral";
  accentColor?: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
  accentColor = "bg-primary/10 text-primary",
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
            {loading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-4xl font-bold tracking-tight text-foreground">
                {value}
              </p>
            )}
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className={`p-3 rounded-xl ${accentColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
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
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <CustomerDashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <header className="pb-2">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {greeting}
          </p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {customerLoading ? (
              <Skeleton className="h-9 w-48 inline-block" />
            ) : (
              `Welcome back, ${firstName}`
            )}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Your vehicle logistics overview
          </p>
        </header>

        {/* Stats Grid */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Vehicles"
            value={stats?.totalVehicles || 0}
            description="All registered"
            icon={Car}
            loading={statsLoading}
            accentColor="bg-primary/10 text-primary"
          />
          <StatCard
            title="Active"
            value={stats?.activeVehicles || 0}
            description="In process"
            icon={Activity}
            loading={statsLoading}
            accentColor="bg-in-progress-muted text-in-progress"
          />
          <StatCard
            title="Completed"
            value={stats?.completedVehicles || 0}
            description="Delivered"
            icon={CheckCircle2}
            loading={statsLoading}
            accentColor="bg-success-muted text-success"
          />
          <StatCard
            title="Pending Quotes"
            value={stats?.pendingQuotes || 0}
            description="Awaiting response"
            icon={FileQuestion}
            loading={statsLoading}
            accentColor="bg-awaiting-muted text-awaiting"
          />
        </section>

        {/* Activity Grid */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Recent Status Updates */}
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Recent Updates</CardTitle>
                    <p className="text-sm text-muted-foreground">Vehicle status changes</p>
                  </div>
                </div>
                <Link 
                  to="/dashboard/vehicles" 
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {updatesLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-lg bg-muted/50">
                      <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentUpdates && recentUpdates.length > 0 ? (
                <div className="space-y-3">
                  {recentUpdates.map((update, idx) => (
                    <div
                      key={update.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[update.status]}`}>
                            {statusLabels[update.status]}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(update.created_at), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {update.vehicle.year} {update.vehicle.make} {update.vehicle.model}
                        </p>
                        <code className="text-xs text-muted-foreground font-mono">
                          {update.vin}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 rounded-full bg-muted mb-3">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No recent updates</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Status changes will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <FileText className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Recent Documents</CardTitle>
                    <p className="text-sm text-muted-foreground">Uploaded files</p>
                  </div>
                </div>
                <Link 
                  to="/dashboard/documents" 
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {docsLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-lg bg-muted/50">
                      <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentDocs && recentDocs.length > 0 ? (
                <div className="space-y-3">
                  {recentDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate mb-1">
                          {doc.file_name}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {documentTypeLabels[doc.document_type] || doc.document_type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(doc.created_at), "MMM d, yyyy")}
                          </span>
                        </div>
                        <code className="text-xs text-muted-foreground/80 font-mono mt-1 block">
                          {doc.vin}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 rounded-full bg-muted mb-3">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No documents yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Files will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </CustomerDashboardLayout>
  );
}
