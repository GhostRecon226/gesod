import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Car,
  Loader2,
  ArrowUpDown,
  CheckCircle2,
  Clock,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  vehicleTypes,
  vehicleSources,
} from "@/services/vehicleService";

type SortField = "date" | "status";
type SortDirection = "asc" | "desc";

export default function AdminVehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
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

  // Helper to get primary VIN record
  const getPrimaryVin = (vehicle: VehicleWithCustomer) => {
    if (!vehicle.vin_records || vehicle.vin_records.length === 0) return null;
    return vehicle.vin_records.find(v => v.is_active) || vehicle.vin_records[0];
  };

  // Status priority for sorting
  const statusPriority: Record<VinStatus, number> = {
    pending: 1,
    awaiting_action: 2,
    active: 3,
    in_progress: 4,
    delayed: 5,
    completed: 6,
    cancelled: 7,
  };

  // Filter and sort vehicles
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

      const matchesType =
        typeFilter === "all" || vehicle.vehicle_type === typeFilter;

      const matchesSource =
        sourceFilter === "all" || vehicle.source === sourceFilter;

      const matchesStatus =
        statusFilter === "all" || primaryVin?.current_status === statusFilter;

      return matchesSearch && matchesType && matchesSource && matchesStatus;
    });

    // Sort
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
  }, [vehicles, searchQuery, typeFilter, sourceFilter, statusFilter, sortField, sortDirection]);

  // Stats
  const totalVehicles = vehicles?.length || 0;
  const auctionVehicles = vehicles?.filter((v) => v.source === "auction").length || 0;
  const completedVehicles = vehicles?.filter((v) => {
    const vin = getPrimaryVin(v);
    return vin?.current_status === "completed";
  }).length || 0;

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
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleDelete = (vehicle: VehicleWithCustomer) => {
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
      // Update only vehicle fields (VIN cannot be changed)
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
      // Create new vehicle with VIN
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

  const getTypeVariant = (type: VehicleType) => {
    switch (type) {
      case "car":
        return "default";
      case "suv":
        return "secondary";
      case "truck":
        return "outline";
      default:
        return "default";
    }
  };

  const getSourceBadge = (source: VehicleSource, auctionSource?: AuctionSource | null) => {
    if (source === "direct") {
      return <Badge variant="secondary">Direct</Badge>;
    }
    return (
      <Badge variant="outline">
        {auctionSource ? auctionSource.toUpperCase() : "Auction"}
      </Badge>
    );
  };

  const getStatusBadge = (status?: VinStatus) => {
    if (!status) return <Badge variant="outline">No VIN</Badge>;
    
    const variants: Record<VinStatus, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      active: "default",
      awaiting_action: "outline",
      in_progress: "default",
      delayed: "destructive",
      completed: "secondary",
      cancelled: "outline",
    };
    
    const labels: Record<VinStatus, string> = {
      pending: "Pending",
      active: "Active",
      awaiting_action: "Awaiting Action",
      in_progress: "In Progress",
      delayed: "Delayed",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
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
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading vehicles: {error.message}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vehicles</h1>
            <p className="text-muted-foreground mt-1">
              Manage vehicle records and assignments
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVehicles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auction Sourced</CardTitle>
              <Car className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auctionVehicles}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedVehicles}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by VIN, customer, make, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-[130px]">
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
            <SelectTrigger className="w-full sm:w-[150px]">
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
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredVehicles && filteredVehicles.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VIN</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-3 h-8"
                          onClick={() => toggleSort("status")}
                        >
                          Status
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-3 h-8"
                          onClick={() => toggleSort("date")}
                        >
                          Created
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => {
                      const primaryVin = getPrimaryVin(vehicle);
                      return (
                        <TableRow key={vehicle.id}>
                          <TableCell>
                            <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">
                              {primaryVin?.vin || "—"}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{vehicle.customers?.full_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {vehicle.customers?.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {vehicle.vehicle_type.toUpperCase()}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getSourceBadge(vehicle.source, vehicle.auction_source)}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(primaryVin?.current_status)}
                          </TableCell>
                          <TableCell>
                            {isCompleted(vehicle) ? (
                              <div className="flex items-center gap-1.5 text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-sm font-medium">Complete</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">In Progress</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(vehicle.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Car className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No vehicles found</p>
                <p className="text-sm">
                  {searchQuery || sourceFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Click 'Add Vehicle' to create one"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <VehicleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vehicle={selectedVehicle}
        customers={customers || []}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Vehicle"
        description={`Are you sure you want to delete ${selectedVehicle?.year} ${selectedVehicle?.make} ${selectedVehicle?.model}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </AdminDashboardLayout>
  );
}
