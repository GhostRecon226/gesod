import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  FileText, 
  ArrowUpRight,
  Circle,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ChartContainer } from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

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

// Fetch vehicle status distribution
async function fetchVehicleStatusDistribution() {
  const statuses = ['active', 'in_progress', 'delayed', 'completed'] as const;
  
  const results = await Promise.all(
    statuses.map(status =>
      supabase
        .from("vin_records")
        .select("id", { count: "exact", head: true })
        .eq("current_status", status)
    )
  );
  
  return statuses.map((status, index) => ({
    name: status,
    value: results[index].count || 0,
  }));
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
    .limit(8);

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

const statusLabels: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  awaiting_action: "Awaiting",
  in_progress: "In Progress",
  delayed: "Delayed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusIndicator: Record<string, string> = {
  pending: "text-pending",
  active: "text-in-progress",
  awaiting_action: "text-awaiting",
  in_progress: "text-in-progress",
  delayed: "text-destructive",
  completed: "text-success",
  cancelled: "text-muted-foreground",
};

export default function AdminDashboard() {
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

  const { data: statusDistribution, isLoading: chartLoading } = useQuery({
    queryKey: ["vehicleStatusDistribution"],
    queryFn: fetchVehicleStatusDistribution,
  });

  // Muted chart colors
  const chartColors: Record<string, string> = {
    active: "hsl(var(--muted-foreground))",
    in_progress: "hsl(var(--muted-foreground) / 0.7)",
    delayed: "hsl(45 93% 47% / 0.7)", // amber, slightly muted
    completed: "hsl(var(--muted-foreground) / 0.4)",
  };

  const chartLabels: Record<string, string> = {
    active: "Active",
    in_progress: "In Progress",
    delayed: "Delayed",
    completed: "Completed",
  };

  const totalVehicles = statusDistribution?.reduce((sum, item) => sum + item.value, 0) || 0;

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-0.5">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </header>

        {/* Metrics Groups */}
        <section className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customers Group */}
            <div className="bg-muted/30 rounded-lg p-3.5 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Customers
              </p>
              <Link to="/admin/customers" className="group block">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    Total Customers
                  </p>
                  {statsLoading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    <p className="text-4xl font-semibold text-foreground tabular-nums">
                      {stats?.totalCustomers || 0}
                    </p>
                  )}
                </div>
              </Link>
            </div>

            {/* Vehicles Group */}
            <div className="bg-muted/30 rounded-lg p-3.5 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Vehicles
              </p>
              <div className="grid grid-cols-3 gap-3">
                <Link to="/admin/vehicles" className="group">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Active
                    </p>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-10" />
                    ) : (
                      <p className="text-2xl font-semibold text-foreground tabular-nums">
                        {stats?.activeVehicles || 0}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Completed
                  </p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-10" />
                  ) : (
                    <p className="text-2xl font-semibold text-foreground tabular-nums">
                      {stats?.completedThisMonth || 0}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">this month</p>
                </div>
                <Link to="/admin/vins?status=delayed" className="group">
                  <div className="space-y-1 pl-3 border-l-2 border-amber-500/60">
                    <p className="text-sm text-amber-600 dark:text-amber-500 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Delayed
                    </p>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-10" />
                    ) : (
                      <p className="text-2xl font-semibold text-foreground tabular-nums">
                        {stats?.delayedVehicles || 0}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Requests Group */}
            <div className="bg-muted/30 rounded-lg p-3.5 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Requests
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/admin/quotes" className="group">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Pending Quotes
                    </p>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-10" />
                    ) : (
                      <p className="text-2xl font-semibold text-foreground tabular-nums">
                        {stats?.pendingQuotes || 0}
                      </p>
                    )}
                  </div>
                </Link>
                <Link to="/admin/bid-requests" className="group">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Bid Requests
                    </p>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-10" />
                    ) : (
                      <p className="text-2xl font-semibold text-foreground tabular-nums">
                        {stats?.pendingBids || 0}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Status Distribution Chart */}
        <section className="mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status Distribution
              </p>
            </div>
            {chartLoading ? (
              <Skeleton className="h-14 w-14 rounded-full" />
            ) : totalVehicles > 0 ? (
              <div className="flex items-center gap-4">
                <div className="h-14 w-14">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={16}
                        outerRadius={26}
                        strokeWidth={0}
                      >
                        {statusDistribution?.map((entry) => (
                          <Cell 
                            key={entry.name} 
                            fill={chartColors[entry.name]} 
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  {statusDistribution?.filter(s => s.value > 0).map((status) => (
                    <div key={status.name} className="flex items-center gap-1.5">
                      <span 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: chartColors[status.name] }}
                      />
                      <span>{chartLabels[status.name]}</span>
                      <span className="tabular-nums font-medium text-foreground">{status.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No vehicles to display</p>
            )}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity - Table */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Recent Activity
              </h2>
              <Link 
                to="/admin/vins" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {activityLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : recentActivity && recentActivity.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-2.5">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-2.5">
                        Vehicle
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-2.5 hidden md:table-cell">
                        Customer
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-2.5 hidden lg:table-cell">
                        VIN
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-2.5">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <Circle className={`h-2 w-2 fill-current ${statusIndicator[activity.status] || 'text-muted-foreground'}`} />
                            <span className="text-sm text-foreground">
                              {statusLabels[activity.status] || activity.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="text-sm text-foreground">
                            {activity.vin_record?.vehicle?.year} {activity.vin_record?.vehicle?.make} {activity.vin_record?.vehicle?.model}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {activity.vin_record?.customer?.full_name}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 hidden lg:table-cell">
                          <code className="text-xs text-muted-foreground font-mono">
                            {activity.vin_record?.vin}
                          </code>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="text-sm text-muted-foreground tabular-nums">
                            {format(new Date(activity.created_at), "MMM d")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-10 text-center">
                  <Users className="h-9 w-9 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    Activity will appear here
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Status changes and updates for customer vehicles will be shown in this section as they occur.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Pending Quotes - List */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Pending Quotes
              </h2>
              <Link 
                to="/admin/quotes" 
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              {actionsLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : pendingActions && pendingActions.length > 0 ? (
                <ul className="divide-y divide-border">
                  {pendingActions.map((action) => (
                    <li key={action.id}>
                      <Link 
                        to="/admin/quotes" 
                        className="block px-4 py-2.5 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-foreground truncate">
                              {action.contact_name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                              {action.quote_type.replace('_', ' ')}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0">
                            {format(new Date(action.created_at), "MMM d")}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-10 text-center">
                  <FileText className="h-9 w-9 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    Quote requests will appear here
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    New quote requests from customers and website visitors will be listed here for review.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
