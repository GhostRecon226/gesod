import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  ArrowUpDown,
  Eye,
  Circle,
  X,
} from "lucide-react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleFormDialog } from "@/components/admin/VehicleFormDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from "@/hooks/useVehicles";
import { useCustomers } from "@/hooks/useCustomers";
import {
  VehicleWithCustomer,
  VehicleType,
  VehicleSource,
  AuctionSource,
  VinStatus,
  vehicleSources,
} from "@/services/vehicleService";

type SortField = "date" | "status";
type SortDirection = "asc" | "desc";

const statusLabels: Record<VinStatus, string> = {
  pending: "Pending",
  active: "Active",
  awaiting_action: "Awaiting",
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

export default function AdminVehicles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const customerIdFromUrl = searchParams.get("customer");

  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>(customerIdFromUrl || "all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithCustomer | null>(null);

  const { data: vehicles, isLoading, error } = useVehicles();
  const { data: customers } = useCustomers();
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();

  // Sync URL param with filter state
  useEffect(() => {
    if (customerIdFromUrl) {
      setCustomerFilter(customerIdFromUrl);
    }
  }, [customerIdFromUrl]);

  const clearCustomerFilter = () => {
    setCustomerFilter("all");
    setSearchParams((params) => {
      params.delete("customer");
      return params;
    });
  };

  const selectedCustomer = customers?.find((c) => c.id === customerFilter);

  const getPrimaryVin = (vehicle: VehicleWithCustomer) => {
    if (!vehicle.vin_records || vehicle.vin_records.length === 0) return null;
    return vehicle.vin_records.find(v => v.is_active) || vehicle.vin_records[0];
  };

  const statusPriority: Record<VinStatus, number> = {
    pending: 1,
    awaiting_action: 2,
    active: 3,
    in_progress: 4,
    delayed: 5,
    completed: 6,
    cancelled: 7,
  };

  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];

    let result = vehicles.filter((vehicle) => {
      const primaryVin = getPrimaryVin(vehicle);
      
      const matchesSearch =
        searchQuery === "" ||
        vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.lot_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.customers?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        primaryVin?.vin.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSource =
        sourceFilter === "all" || vehicle.source === sourceFilter;

      const matchesStatus =
        statusFilter === "all" || primaryVin?.current_status === statusFilter;

      const matchesCustomer =
        customerFilter === "all" || vehicle.customer_id === customerFilter;

      return matchesSearch && matchesSource && matchesStatus && matchesCustomer;
    });

    result.sort((a, b) => {
      if (sortField === "date") {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const vinA = getPrimaryVin(a);
        const vinB = getPrimaryVin(b);
        const priorityA = vinA ? statusPriority[vinA.current_status] : 999;
        const priorityB = vinB ? statusPriority[vinB.current_status] : 999;
        return sortDirection === "asc" ? priorityA - priorityB : priorityB - priorityA;
      }
    });

    return result;
  }, [vehicles, searchQuery, sourceFilter, statusFilter, customerFilter, sortField, sortDirection]);

  const stats = useMemo(() => {
    if (!vehicles) return { total: 0, active: 0, completed: 0 };
    return {
      total: vehicles.length,
      active: vehicles.filter(v => {
        const vin = getPrimaryVin(v);
        return vin && !["completed", "cancelled"].includes(vin.current_status);
      }).length,
      completed: vehicles.filter(v => getPrimaryVin(v)?.current_status === "completed").length,
    };
  }, [vehicles]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleCreate = () => {
    setSelectedVehicle(null);
    setFormOpen(true);
  };

  const handleEdit = (vehicle: VehicleWithCustomer) => {
    const vin = getPrimaryVin(vehicle);
    if (vin?.current_status === "completed") return;
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleDelete = (vehicle: VehicleWithCustomer) => {
    const vin = getPrimaryVin(vehicle);
    if (vin?.current_status === "completed") return;
    setSelectedVehicle(vehicle);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: {
    customer_id: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    vehicle_type: VehicleType;
    source: VehicleSource;
    auction_source?: AuctionSource | null;
    lot_number?: string | null;
  }) => {
    if (selectedVehicle) {
      await updateMutation.mutateAsync({
        id: selectedVehicle.id,
        data: {
          customer_id: data.customer_id,
          make: data.make,
          model: data.model,
          year: data.year,
          vehicle_type: data.vehicle_type,
          source: data.source,
          auction_source: data.source === "auction" ? data.auction_source : null,
          lot_number: data.source === "auction" ? data.lot_number : null,
        },
      });
    } else {
      await createMutation.mutateAsync({
        customer_id: data.customer_id,
        vin: data.vin.toUpperCase(),
        make: data.make,
        model: data.model,
        year: data.year,
        vehicle_type: data.vehicle_type,
        source: data.source,
        auction_source: data.source === "auction" ? data.auction_source : null,
        lot_number: data.source === "auction" ? data.lot_number : null,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedVehicle) {
      await deleteMutation.mutateAsync(selectedVehicle.id);
      setDeleteOpen(false);
      setSelectedVehicle(null);
    }
  };

  const isCompleted = (vehicle: VehicleWithCustomer) => {
    const vin = getPrimaryVin(vehicle);
    return vin?.current_status === "completed";
  };

  const statusOptions: { value: VinStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "awaiting_action", label: "Awaiting Action" },
    { value: "in_progress", label: "In Progress" },
    { value: "delayed", label: "Delayed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  if (error) {
    return (
      <AdminDashboardLayout pageTitle="Vehicles">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading vehicles: {error.message}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout 
      pageTitle="Vehicles" 
      actions={
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Vehicle
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 max-w-md">
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

        {/* Customer Filter Banner */}
        {selectedCustomer && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm">
              Showing vehicles for <span className="font-medium">{selectedCustomer.full_name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={clearCustomerFilter}>
              <X className="h-3.5 w-3.5 mr-1" />
              Clear filter
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search VIN, customer, make..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[120px] h-9">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {vehicleSources.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredVehicles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-medium uppercase tracking-wider">VIN</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Customer</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Vehicle</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Source</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => toggleSort("status")}
                    >
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">
                    <button
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => toggleSort("date")}
                    >
                      Created
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => {
                  const primaryVin = getPrimaryVin(vehicle);
                  return (
                    <TableRow key={vehicle.id} className="hover:bg-muted/20">
                      <TableCell>
                        <code className="text-xs font-mono text-muted-foreground">
                          {primaryVin?.vin || "—"}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{vehicle.customers?.full_name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground capitalize">
                          {vehicle.source === "auction" && vehicle.auction_source 
                            ? vehicle.auction_source.toUpperCase() 
                            : vehicle.source}
                        </span>
                      </TableCell>
                      <TableCell>
                        {primaryVin ? (
                          <div className="flex items-center gap-1.5">
                            <Circle className={`h-2 w-2 fill-current ${statusIndicator[primaryVin.current_status]}`} />
                            <span className="text-sm">
                              {statusLabels[primaryVin.current_status]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {format(new Date(vehicle.created_at), "MMM d, yyyy")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/vehicles/${vehicle.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {!isCompleted(vehicle) && (
                              <>
                                <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDelete(vehicle)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p className="text-sm">No vehicles found</p>
            </div>
          )}
        </div>
      </div>

      <VehicleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vehicle={selectedVehicle}
        customers={customers}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        description="Are you sure you want to delete this vehicle? This will also delete all associated VIN records and documents."
        isLoading={deleteMutation.isPending}
      />
    </AdminDashboardLayout>
  );
}
