import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Gavel,
  Loader2,
  XCircle,
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
import { AuctionVehicleFormDialog } from "@/components/admin/AuctionVehicleFormDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import {
  useAuctionVehicles,
  useCreateAuctionVehicle,
  useUpdateAuctionVehicle,
  useDeleteAuctionVehicle,
} from "@/hooks/useAuctionVehicles";
import {
  AuctionVehicle,
  AuctionVehicleStatus,
  AuctionSource,
  auctionSources,
  auctionVehicleStatuses,
} from "@/services/auctionVehicleService";

export default function AdminAuctionListings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<AuctionVehicle | null>(null);

  const { data: vehicles, isLoading, error } = useAuctionVehicles();
  const createMutation = useCreateAuctionVehicle();
  const updateMutation = useUpdateAuctionVehicle();
  const deleteMutation = useDeleteAuctionVehicle();

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        searchQuery === "" ||
        vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.lot_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.yard_location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSource =
        sourceFilter === "all" || vehicle.auction_source === sourceFilter;

      const matchesStatus =
        statusFilter === "all" || vehicle.status === statusFilter;

      return matchesSearch && matchesSource && matchesStatus;
    });
  }, [vehicles, searchQuery, sourceFilter, statusFilter]);

  // Stats
  const totalListings = vehicles?.length || 0;
  const activeListings = vehicles?.filter((v) => v.status === "active").length || 0;
  const expiredListings = vehicles?.filter((v) => v.status === "expired").length || 0;

  const handleCreate = () => {
    setSelectedVehicle(null);
    setFormOpen(true);
  };

  const handleEdit = (vehicle: AuctionVehicle) => {
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleDelete = (vehicle: AuctionVehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteOpen(true);
  };

  const handleMarkExpired = async (vehicle: AuctionVehicle) => {
    await updateMutation.mutateAsync({
      id: vehicle.id,
      data: { status: "expired" },
    });
  };

  const handleFormSubmit = async (data: {
    make: string;
    model: string;
    year: number;
    vehicle_type: "car" | "suv" | "truck";
    auction_source: AuctionSource;
    lot_number: string;
    auction_date?: string | null;
    yard_location?: string | null;
    remarks?: string | null;
    vehicle_images?: string[] | null;
  }) => {
    if (selectedVehicle) {
      await updateMutation.mutateAsync({
        id: selectedVehicle.id,
        data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedVehicle) {
      await deleteMutation.mutateAsync(selectedVehicle.id);
      setDeleteOpen(false);
      setSelectedVehicle(null);
    }
  };

  const getSourceBadge = (source: AuctionSource) => {
    const variants: Record<AuctionSource, "default" | "secondary" | "outline"> = {
      copart: "default",
      iaai: "secondary",
      other: "outline",
    };
    return (
      <Badge variant={variants[source]}>
        {source.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: AuctionVehicleStatus) => {
    if (status === "active") {
      return <Badge variant="default">Active</Badge>;
    }
    return <Badge variant="secondary">Expired</Badge>;
  };

  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading auction listings: {error.message}</p>
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
            <h1 className="text-3xl font-bold text-foreground">Auction Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage curated auction vehicle opportunities
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Listing
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalListings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Gavel className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeListings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{expiredListings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by make, model, lot number..."
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
              {auctionSources.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {auctionVehicleStatuses.map((status) => (
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
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Lot Number</TableHead>
                      <TableHead>Auction Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
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
                            <p className="text-sm text-muted-foreground">
                              {vehicle.vehicle_type.toUpperCase()}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getSourceBadge(vehicle.auction_source)}</TableCell>
                        <TableCell>
                          <code className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded">
                            {vehicle.lot_number}
                          </code>
                        </TableCell>
                        <TableCell>
                          {vehicle.auction_date
                            ? format(new Date(vehicle.auction_date), "MMM d, yyyy")
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {vehicle.yard_location || "—"}
                        </TableCell>
                        <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
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
                              {vehicle.status === "active" && (
                                <DropdownMenuItem onClick={() => handleMarkExpired(vehicle)}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Mark as Expired
                                </DropdownMenuItem>
                              )}
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
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Gavel className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No auction listings</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || sourceFilter !== "all" || statusFilter !== "all"
                    ? "No listings match your filters."
                    : "Get started by adding your first auction listing."}
                </p>
                {!searchQuery && sourceFilter === "all" && statusFilter === "all" && (
                  <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Listing
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <AuctionVehicleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vehicle={selectedVehicle}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
        title="Delete Auction Listing"
        description={`Are you sure you want to delete the listing for "${selectedVehicle?.year} ${selectedVehicle?.make} ${selectedVehicle?.model}"? This action cannot be undone.`}
      />
    </AdminDashboardLayout>
  );
}
