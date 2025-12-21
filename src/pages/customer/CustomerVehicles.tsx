import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Search, ChevronUp, ChevronDown, Car, CheckCircle2 } from "lucide-react";
import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerVehicles, CustomerVehicle } from "@/hooks/useCustomerVehicles";

type SortField = "status" | "updated_at";
type SortDirection = "asc" | "desc";

// Map database status to StatusBadge status type
function mapStatus(dbStatus: string): StatusType {
  const statusMap: Record<string, StatusType> = {
    pending: "pending",
    active: "active",
    awaiting_action: "awaiting",
    in_progress: "in-progress",
    delayed: "delayed",
    completed: "completed",
    cancelled: "cancelled",
  };
  return statusMap[dbStatus] || "pending";
}

// Status sort order (for sorting purposes)
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

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];

    let result = [...vehicles];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((vehicle) => {
        const vin = vehicle.vin_record?.vin?.toLowerCase() || "";
        const make = vehicle.make.toLowerCase();
        const model = vehicle.model.toLowerCase();
        const year = vehicle.year.toString();
        return (
          vin.includes(query) ||
          make.includes(query) ||
          model.includes(query) ||
          year.includes(query)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;

      if (sortField === "status") {
        const statusA = a.vin_record?.current_status || "pending";
        const statusB = b.vin_record?.current_status || "pending";
        comparison = (statusOrder[statusA] || 99) - (statusOrder[statusB] || 99);
      } else if (sortField === "updated_at") {
        const dateA = a.vin_record?.updated_at || a.updated_at;
        const dateB = b.vin_record?.updated_at || b.updated_at;
        comparison = new Date(dateA).getTime() - new Date(dateB).getTime();
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [vehicles, searchQuery, sortField, sortDirection]);

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
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  const isCompleted = (vehicle: CustomerVehicle) =>
    vehicle.vin_record?.current_status === "completed";

  if (error) {
    return (
      <CustomerDashboardLayout>
        <div className="p-6">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                Failed to load vehicles. Please try again.
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
          <h1 className="text-2xl font-semibold text-foreground">My Vehicles</h1>
          <p className="text-muted-foreground mt-1">
            View and track all your vehicles
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by VIN, make, model, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Car className="h-5 w-5 text-muted-foreground" />
              Vehicles
              {vehicles && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({filteredVehicles.length} of {vehicles.length})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? (
                  <p>No vehicles match your search.</p>
                ) : (
                  <p>You don't have any vehicles yet.</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VIN</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        <SortIcon field="status" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort("updated_at")}
                      >
                        Last Updated
                        <SortIcon field="updated_at" />
                      </TableHead>
                      <TableHead>State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow
                        key={vehicle.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleVehicleClick(vehicle)}
                      >
                        <TableCell className="font-mono text-sm">
                          {vehicle.vin_record?.vin || "—"}
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </span>
                            <span className="text-muted-foreground text-sm ml-2 capitalize">
                              ({vehicle.vehicle_type})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {vehicle.vin_record ? (
                            <StatusBadge
                              status={mapStatus(vehicle.vin_record.current_status)}
                              showIcon
                            />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(
                            new Date(
                              vehicle.vin_record?.updated_at || vehicle.updated_at
                            ),
                            "MMM d, yyyy"
                          )}
                        </TableCell>
                        <TableCell>
                          {isCompleted(vehicle) ? (
                            <Badge
                              variant="outline"
                              className="border-success text-success bg-success-muted"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerDashboardLayout>
  );
}
