import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Loader2,
  Circle,
  RefreshCw,
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { useVinRecords } from "@/hooks/useVinRecords";
import {
  useAllStatusUpdates,
  useCreateStatusUpdate,
  useDeleteStatusUpdate,
} from "@/hooks/useVinStatusUpdates";
import type { VinStatus } from "@/services/vinService";
import type { VinStatusUpdateWithUser } from "@/services/vinStatusUpdateService";

const statusLabels: Record<VinStatus, string> = {
  pending: "Pending",
  active: "Active",
  awaiting_action: "Awaiting Action",
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

const statusOptions: { value: VinStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "awaiting_action", label: "Awaiting Action" },
  { value: "in_progress", label: "In Progress" },
  { value: "delayed", label: "Delayed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminStatusUpdates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<VinStatusUpdateWithUser | null>(null);

  // Add form state
  const [selectedVinRecordId, setSelectedVinRecordId] = useState("");
  const [newStatus, setNewStatus] = useState<VinStatus | "">("");
  const [description, setDescription] = useState("");

  const { data: statusUpdates, isLoading, error } = useAllStatusUpdates();
  const { data: vinRecords } = useVinRecords();
  const createMutation = useCreateStatusUpdate();
  const deleteMutation = useDeleteStatusUpdate();

  const filteredUpdates = useMemo(() => {
    if (!statusUpdates) return [];

    return statusUpdates.filter((update) => {
      const matchesSearch =
        searchQuery === "" ||
        update.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        update.updater_profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        update.updater_profile?.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || update.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [statusUpdates, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    if (!statusUpdates) return { total: 0, today: 0, thisWeek: 0 };
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    return {
      total: statusUpdates.length,
      today: statusUpdates.filter((u) => new Date(u.created_at) >= todayStart).length,
      thisWeek: statusUpdates.filter((u) => new Date(u.created_at) >= weekStart).length,
    };
  }, [statusUpdates]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVinRecordId || !newStatus) return;

    await createMutation.mutateAsync({
      vin_record_id: selectedVinRecordId,
      status: newStatus,
      description: description || undefined,
    });

    resetAddForm();
    setAddOpen(false);
  };

  const resetAddForm = () => {
    setSelectedVinRecordId("");
    setNewStatus("");
    setDescription("");
  };

  const handleDelete = (update: VinStatusUpdateWithUser) => {
    setSelectedUpdate(update);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUpdate) {
      await deleteMutation.mutateAsync(selectedUpdate.id);
      setDeleteOpen(false);
      setSelectedUpdate(null);
    }
  };

  // Create a map to find VIN for each status update
  const vinRecordMap = useMemo(() => {
    if (!vinRecords) return new Map<string, string>();
    return new Map(vinRecords.map((r) => [r.id, r.vin]));
  }, [vinRecords]);

  if (error) {
    return (
      <AdminDashboardLayout pageTitle="Status Updates">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading status updates: {error.message}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout
      pageTitle="Status Updates"
      actions={
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Status Update
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 max-w-md">
          <div>
            <p className="text-sm text-muted-foreground">Total Updates</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.today}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.thisWeek}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by description or updater..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9">
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
          ) : filteredUpdates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-medium uppercase tracking-wider">VIN</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Description</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Updated By</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Date</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUpdates.map((update) => (
                  <TableRow key={update.id} className="hover:bg-muted/20">
                    <TableCell>
                      <code className="text-xs font-mono text-muted-foreground">
                        {vinRecordMap.get(update.vin_record_id) || "—"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Circle className={`h-2 w-2 fill-current ${statusIndicator[update.status]}`} />
                        <span className="text-sm">
                          {statusLabels[update.status]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                        {update.description || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {update.updater_profile?.full_name || update.updater_profile?.email || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {format(new Date(update.created_at), "MMM d, yyyy h:mm a")}
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
                          <DropdownMenuItem
                            onClick={() => handleDelete(update)}
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
              <RefreshCw className="h-10 w-10 mb-3 opacity-50" />
              <p className="text-sm">No status updates found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Status Update Dialog */}
      <Dialog open={addOpen} onOpenChange={(open) => {
        if (!open) resetAddForm();
        setAddOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Status Update</DialogTitle>
            <DialogDescription>
              Add a new status update to a VIN record.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vinRecord">
                VIN Record <span className="text-destructive">*</span>
              </Label>
              <Select value={selectedVinRecordId} onValueChange={setSelectedVinRecordId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select VIN record" />
                </SelectTrigger>
                <SelectContent>
                  {vinRecords?.map((record) => (
                    <SelectItem key={record.id} value={record.id}>
                      {record.vin}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                New Status <span className="text-destructive">*</span>
              </Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as VinStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this status update..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedVinRecordId || !newStatus || createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Update"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Status Update"
        description="Are you sure you want to delete this status update? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </AdminDashboardLayout>
  );
}
