import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Circle, X } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusTimeline } from "@/components/ui/status-timeline";
import { useCustomerVehicles, CustomerVehicle } from "@/hooks/useCustomerVehicles";
import { useCustomerVehicleDetail } from "@/hooks/useCustomerVehicles";

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

export default function CustomerVinTracking() {
  const { data: vehicles, isLoading, error } = useCustomerVehicles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  const { data: vehicleDetail, isLoading: isLoadingDetail } = useCustomerVehicleDetail(
    selectedVehicleId || ""
  );

  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    if (!searchQuery.trim()) return vehicles;

    const query = searchQuery.toLowerCase();
    return vehicles.filter((vehicle) => {
      const vin = vehicle.vin_record?.vin?.toLowerCase() || "";
      return vin.includes(query);
    });
  }, [vehicles, searchQuery]);

  const handleVehicleClick = (vehicle: CustomerVehicle) => {
    setSelectedVehicleId(vehicle.id);
  };

  const handleCloseDialog = () => {
    setSelectedVehicleId(null);
  };

  const timelineItems = useMemo(() => {
    if (!vehicleDetail?.status_updates) return [];
    return vehicleDetail.status_updates.map((update) => ({
      id: update.id,
      status: update.status,
      date: update.created_at,
      description: update.description || undefined,
    }));
  }, [vehicleDetail]);

  if (error) {
    return (
      <CustomerDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive text-sm">Failed to load tracking data.</p>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">VIN Tracking</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track shipment status by VIN
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by VIN..."
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
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Current Status</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Last Update</TableHead>
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
                {searchQuery ? "No VINs match your search" : "No vehicles to track"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Timeline Dialog */}
      <Dialog open={!!selectedVehicleId} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Status History</span>
            </DialogTitle>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="space-y-3 py-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : vehicleDetail ? (
            <div className="space-y-4">
              {/* Vehicle Info */}
              <div className="border-b border-border pb-4">
                <p className="text-sm font-medium">
                  {vehicleDetail.year} {vehicleDetail.make} {vehicleDetail.model}
                </p>
                <code className="text-xs font-mono text-muted-foreground">
                  {vehicleDetail.vin_record?.vin}
                </code>
              </div>

              {/* Timeline */}
              <div className="max-h-[400px] overflow-y-auto">
                <StatusTimeline items={timelineItems} />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </CustomerDashboardLayout>
  );
}
