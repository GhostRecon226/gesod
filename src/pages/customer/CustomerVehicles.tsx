import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Search, ChevronUp, ChevronDown, Circle } from "lucide-react";
import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerVehicles, CustomerVehicle } from "@/hooks/useCustomerVehicles";

type SortField = "status" | "updated_at";
type SortDirection = "asc" | "desc";

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

const statusOrder: Record<string, number> = {
  in_progress: 1,
  active: 2,
  awaiting_action: 3,
  pending: 4,
  delayed: 5,
  completed: 6,
  cancelled: 7,
};

export default function CustomerVehicles() {
  const navigate = useNavigate();
  const { data: vehicles, isLoading, error } = useCustomerVehicles();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];

    let result = [...vehicles];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((vehicle) => {
        const vin = vehicle.vin_record?.vin?.toLowerCase() || "";
        const make = vehicle.make.toLowerCase();
        const model = vehicle.model.toLowerCase();
        const year = vehicle.year.toString();
        return vin.includes(query) || make.includes(query) || model.includes(query) || year.includes(query);
      });
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "status") {
        const statusA = a.vin_record?.current_status || "pending";
        const statusB = b.vin_record?.current_status || "pending";
        comparison = (statusOrder[statusA] || 99) - (statusOrder[statusB] || 99);
      } else {
        const dateA = a.vin_record?.updated_at || a.updated_at;
        const dateB = b.vin_record?.updated_at || b.updated_at;
        comparison = new Date(dateA).getTime() - new Date(dateB).getTime();
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [vehicles, searchQuery, sortField, sortDirection]);

  const stats = useMemo(() => {
    if (!vehicles) return { total: 0, active: 0, completed: 0 };
    return {
      total: vehicles.length,
      active: vehicles.filter(v => {
        const status = v.vin_record?.current_status;
        return status && !["completed", "cancelled"].includes(status);
      }).length,
      completed: vehicles.filter(v => v.vin_record?.current_status === "completed").length,
    };
  }, [vehicles]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleVehicleClick = (vehicle: CustomerVehicle) => {
    navigate(`/dashboard/vehicles/${vehicle.id}`);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3 inline ml-0.5" />
    ) : (
      <ChevronDown className="h-3 w-3 inline ml-0.5" />
    );
  };

  if (error) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive text-sm">Failed to load vehicles.</p>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">My Vehicles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track and manage your vehicles
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 max-w-xs">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.active}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.completed}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search VIN, make, model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredVehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-medium uppercase tracking-wider">VIN</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Vehicle</TableHead>
                  <TableHead 
                    className="text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <SortIcon field="status" />
                  </TableHead>
                  <TableHead 
                    className="text-xs font-medium uppercase tracking-wider cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("updated_at")}
                  >
                    Updated
                    <SortIcon field="updated_at" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow
                    key={vehicle.id}
                    className="cursor-pointer hover:bg-muted/20 transition-colors"
                    onClick={() => handleVehicleClick(vehicle)}
                  >
                    <TableCell>
                      <code className="text-xs font-mono text-muted-foreground">
                        {vehicle.vin_record?.vin || "—"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </span>
                    </TableCell>
                    <TableCell>
                      {vehicle.vin_record ? (
                        <div className="flex items-center gap-1.5">
                          <Circle 
                            className={`h-2 w-2 fill-current ${
                              statusIndicator[vehicle.vin_record.current_status] || "text-muted-foreground"
                            }`} 
                          />
                          <span className="text-sm">
                            {statusLabels[vehicle.vin_record.current_status] || vehicle.vin_record.current_status}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {format(
                          new Date(vehicle.vin_record?.updated_at || vehicle.updated_at),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <p className="text-sm">
                {searchQuery ? "No vehicles match your search" : "No vehicles yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </CustomerDashboardLayout>
  );
}
