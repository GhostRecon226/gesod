import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Car,
  Loader2,
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
  vehicleTypes,
  vehicleSources,
} from "@/services/vehicleService";

export default function AdminVehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithCustomer | null>(null);

  const { data: vehicles, isLoading, error } = useVehicles();
  const { data: customers } = useCustomers();
  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();

  // Filter vehicles
  const filteredVehicles = vehicles?.filter((vehicle) => {
    const matchesSearch =
      searchQuery === "" ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.lot_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.customers?.full_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || vehicle.vehicle_type === typeFilter;

    const matchesSource =
      sourceFilter === "all" || vehicle.source === sourceFilter;

    return matchesSearch && matchesType && matchesSource;
  });

  // Stats
  const totalVehicles = vehicles?.length || 0;
  const auctionVehicles = vehicles?.filter((v) => v.source === "auction").length || 0;
  const directVehicles = vehicles?.filter((v) => v.source === "direct").length || 0;

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
              <CardTitle className="text-sm font-medium">Direct Sourced</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{directVehicles}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by make, model, lot number, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {vehicleTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
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
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredVehicles && filteredVehicles.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Lot #</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                        </div>
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
                        <Badge variant={getTypeVariant(vehicle.vehicle_type)}>
                          {vehicle.vehicle_type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getSourceBadge(vehicle.source, vehicle.auction_source)}
                      </TableCell>
                      <TableCell>{vehicle.lot_number || "—"}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Car className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No vehicles found</p>
                <p className="text-sm">
                  {searchQuery || typeFilter !== "all" || sourceFilter !== "all"
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
