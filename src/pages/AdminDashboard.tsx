import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Package, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Car,
  Activity,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

// Fetch dashboard statistics
async function fetchAdminDashboardStats() {
  const [
    customersResult,
    vehiclesResult,
    quotesResult,
    bidRequestsResult,
    delayedResult,
    completedThisMonthResult
  ] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("vin_records").select("id, current_status", { count: "exact" }).eq("is_active", true),
    supabase.from("public_quote_requests").select("id", { count: "exact", head: true }).eq("quote_status", "pending"),
    supabase.from("bid_requests").select("id", { count: "exact", head: true }).eq("request_status", "pending"),
    supabase.from("vin_records").select("id", { count: "exact", head: true }).eq("current_status", "delayed"),
    supabase.from("vin_records")
      .select("id", { count: "exact", head: true })
      .eq("current_status", "completed")
      .gte("updated_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
  ]);

  return {
    totalCustomers: customersResult.count || 0,
    activeVehicles: vehiclesResult.count || 0,
    pendingQuotes: quotesResult.count || 0,
    pendingBids: bidRequestsResult.count || 0,
    delayedVehicles: delayedResult.count || 0,
    completedThisMonth: completedThisMonthResult.count || 0
  };
}

// Fetch recent activity
async function fetchRecentActivity() {
  const { data, error } = await supabase
    .from("vin_status_updates")
    .select(`
      id,
      status,
      description,
      created_at,
      vin_record:vin_records(
        vin,
        vehicle:vehicles(make, model, year),
        customer:customers(full_name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
}

// Fetch pending actions
async function fetchPendingActions() {
  const { data, error } = await supabase
    .from("public_quote_requests")
    .select("id, contact_name, quote_type, created_at")
    .eq("quote_status", "pending")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) throw error;
  return data;
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  loading?: boolean;
  accentColor?: string;
  linkTo?: string;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  loading,
  accentColor = "bg-primary/10 text-primary",
  linkTo,
}: StatCardProps) {
  const content = (
    <Card className={`relative overflow-hidden border-0 shadow-card transition-all duration-300 ${linkTo ? 'hover:shadow-card-hover cursor-pointer group' : ''}`}>
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
          <div className={`p-3 rounded-xl ${accentColor} ${linkTo ? 'group-hover:scale-110 transition-transform' : ''}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }
  return content;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  awaiting_action: "Awaiting Action",
  in_progress: "In Progress",
  delayed: "Delayed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusColors: Record<string, string> = {
  pending: "bg-pending-muted text-pending",
  active: "bg-in-progress-muted text-in-progress",
  awaiting_action: "bg-awaiting-muted text-awaiting",
  in_progress: "bg-in-progress-muted text-in-progress",
  delayed: "bg-destructive-muted text-destructive",
  completed: "bg-success-muted text-success",
  cancelled: "bg-muted text-muted-foreground",
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: fetchAdminDashboardStats,
  });

  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ["adminRecentActivity"],
    queryFn: fetchRecentActivity,
  });

  const { data: pendingActions, isLoading: actionsLoading } = useQuery({
    queryKey: ["adminPendingActions"],
    queryFn: fetchPendingActions,
  });

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <header className="pb-2">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {greeting}
          </p>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Operations overview and management
          </p>
        </header>

        {/* Stats Grid */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Customers"
            value={stats?.totalCustomers || 0}
            description="Registered"
            icon={Users}
            loading={statsLoading}
            accentColor="bg-primary/10 text-primary"
            linkTo="/admin/customers"
          />
          <StatCard
            title="Active Vehicles"
            value={stats?.activeVehicles || 0}
            description="In transit"
            icon={Car}
            loading={statsLoading}
            accentColor="bg-in-progress-muted text-in-progress"
            linkTo="/admin/vehicles"
          />
          <StatCard
            title="Pending Quotes"
            value={stats?.pendingQuotes || 0}
            description="Awaiting response"
            icon={FileText}
            loading={statsLoading}
            accentColor="bg-awaiting-muted text-awaiting"
            linkTo="/admin/quotes"
          />
          <StatCard
            title="Bid Requests"
            value={stats?.pendingBids || 0}
            description="Active bids"
            icon={DollarSign}
            loading={statsLoading}
            accentColor="bg-pending-muted text-pending"
            linkTo="/admin/bid-requests"
          />
          <StatCard
            title="Completed"
            value={stats?.completedThisMonth || 0}
            description="This month"
            icon={TrendingUp}
            loading={statsLoading}
            accentColor="bg-success-muted text-success"
          />
          <StatCard
            title="Delayed"
            value={stats?.delayedVehicles || 0}
            description="Needs attention"
            icon={AlertCircle}
            loading={statsLoading}
            accentColor="bg-destructive-muted text-destructive"
            linkTo="/admin/vins"
          />
        </section>

        {/* Activity Grid */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                    <p className="text-sm text-muted-foreground">Latest status updates</p>
                  </div>
                </div>
                <Link 
                  to="/admin/vins" 
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {activityLoading ? (
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
              ) : recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[activity.status] || 'bg-muted text-muted-foreground'}`}>
                            {statusLabels[activity.status] || activity.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(activity.created_at), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.vin_record?.vehicle?.year} {activity.vin_record?.vehicle?.make} {activity.vin_record?.vehicle?.model}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <code className="text-xs text-muted-foreground font-mono">
                            {activity.vin_record?.vin}
                          </code>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {activity.vin_record?.customer?.full_name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 rounded-full bg-muted mb-3">
                    <Activity className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Updates will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Actions */}
          <Card className="border-0 shadow-card">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning-muted">
                    <Clock className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Pending Actions</CardTitle>
                    <p className="text-sm text-muted-foreground">Requires your attention</p>
                  </div>
                </div>
                <Link 
                  to="/admin/quotes" 
                  className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {actionsLoading ? (
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
              ) : pendingActions && pendingActions.length > 0 ? (
                <div className="space-y-3">
                  {pendingActions.map((action) => (
                    <Link
                      key={action.id}
                      to="/admin/quotes"
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-pending-muted text-pending">
                            Quote Request
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(action.created_at), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-foreground truncate">
                          {action.contact_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                          {action.quote_type.replace('_', ' ')}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 rounded-full bg-success-muted mb-3">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">No pending actions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </AdminDashboardLayout>
  );
}
