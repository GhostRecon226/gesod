import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Hash,
  Loader2,
  CheckCircle,
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
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { VinFormDialog } from "@/components/admin/VinFormDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import {
  useVinRecords,
  useCreateVinRecord,
  useUpdateVinRecord,
  useDeleteVinRecord,
} from "@/hooks/useVinRecords";
import { useVehicles } from "@/hooks/useVehicles";
import { VinRecordWithRelations, VinStatus, vinStatuses } from "@/services/vinService";

export default function AdminVins() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVin, setSelectedVin] = useState<VinRecordWithRelations | null>(null);

  const { data: vinRecords, isLoading, error } = useVinRecords();
  const { data: vehicles } = useVehicles();
  const createMutation = useCreateVinRecord();
  const updateMutation = useUpdateVinRecord();
  const deleteMutation = useDeleteVinRecord();

  // Filter VIN records
  const filteredRecords = vinRecords?.filter((record) => {
    const matchesSearch =
      searchQuery === "" ||
      record.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.customers?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vehicles?.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.vehicles?.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || record.current_status === statusFilter;

    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "active" && record.is_active) ||
      (activeFilter === "inactive" && !record.is_active);

    return matchesSearch && matchesStatus && matchesActive;
  });

  // Stats
  const totalRecords = vinRecords?.length || 0;
  const activeRecords = vinRecords?.filter((v) => v.is_active).length || 0;
  const completedRecords = vinRecords?.filter((v) => v.current_status === "completed").length || 0;

  const handleCreate = () => {
    setSelectedVin(null);
    setFormOpen(true);
  };

  const handleEdit = (record: VinRecordWithRelations) => {
    setSelectedVin(record);
    setFormOpen(true);
  };

  const handleDelete = (record: VinRecordWithRelations) => {
    setSelectedVin(record);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: {
    vin: string;
    vehicle_id: string;
    customer_id: string;
    current_status: VinStatus;
    is_active: boolean;
  }) => {
    if (selectedVin) {
      await updateMutation.mutateAsync({
        id: selectedVin.id,
        data: {
          vin: data.vin,
          vehicle_id: data.vehicle_id,
          customer_id: data.customer_id,
          current_status: data.current_status,
          is_active: data.is_active,
        },
      });
    } else {
      await createMutation.mutateAsync({
        vin: data.vin,
        vehicle_id: data.vehicle_id,
        customer_id: data.customer_id,
        current_status: data.current_status,
        is_active: data.is_active,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedVin) {
      await deleteMutation.mutateAsync(selectedVin.id);
      setDeleteOpen(false);
      setSelectedVin(null);
    }
  };

  // Map VIN status to StatusBadge status type
  const mapStatusType = (status: VinStatus): StatusType => {
    const statusMap: Record<VinStatus, StatusType> = {
      pending: "pending",
      active: "active",
      awaiting_action: "awaiting",
      in_progress: "in-progress",
      delayed: "delayed",
      completed: "completed",
      cancelled: "cancelled",
    };
    return statusMap[status];
  };

  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading VIN records: {error.message}</p>
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
            <h1 className="text-3xl font-bold text-foreground">VIN Tracking</h1>
            <p className="text-muted-foreground mt-1">
              Manage VIN records and tracking status
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add VIN
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total VINs</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecords}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tracking</CardTitle>
              <CheckCircle className="h-4 w-4 text-active" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-active">{activeRecords}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedRecords}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by VIN, customer, or vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {vinStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
            ) : filteredRecords && filteredRecords.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>VIN</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                          {record.vin}
                        </code>
                      </TableCell>
                      <TableCell>
                        {record.vehicles ? (
                          <span>
                            {record.vehicles.year} {record.vehicles.make} {record.vehicles.model}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.customers?.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.customers?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={mapStatusType(record.current_status)} />
                      </TableCell>
                      <TableCell>
                        {record.is_active ? (
                          <Badge variant="default" className="bg-active text-active-foreground">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(record.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(record)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(record)}
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
                <Hash className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No VIN records found</p>
                <p className="text-sm">
                  {searchQuery || statusFilter !== "all" || activeFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Click 'Add VIN' to create one"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <VinFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        vinRecord={selectedVin}
        vehicles={vehicles || []}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete VIN Record"
        description={`Are you sure you want to delete VIN ${selectedVin?.vin}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </AdminDashboardLayout>
  );
}
