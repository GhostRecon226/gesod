import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Circle,
  Eye,
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
import { CustomerFormDialog } from "@/components/admin/CustomerFormDialog";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/hooks/useCustomers";
import { Customer, AccountStatus } from "@/services/customerService";
import { useToast } from "@/hooks/use-toast";

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const navigate = useNavigate();

  const { data: customers, isLoading, error } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();
  const { toast } = useToast();

  const filteredCustomers = customers?.filter((customer) => {
    const matchesSearch =
      searchQuery === "" ||
      customer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || customer.account_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: customers?.length || 0,
    active: customers?.filter((c) => c.account_status === "active").length || 0,
    suspended: customers?.filter((c) => c.account_status === "suspended").length || 0,
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: {
    full_name: string;
    email: string;
    phone?: string;
    country?: string;
    account_status: AccountStatus;
  }) => {
    if (selectedCustomer) {
      await updateMutation.mutateAsync({
        id: selectedCustomer.id,
        data: {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          country: data.country || null,
          account_status: data.account_status,
        },
      });
    } else {
      toast({
        variant: "destructive",
        title: "Cannot create customer",
        description: "New customers are created when users register.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedCustomer) {
      await deleteMutation.mutateAsync(selectedCustomer.id);
      setDeleteOpen(false);
      setSelectedCustomer(null);
    }
  };

  if (error) {
    return (
      <AdminDashboardLayout pageTitle="Customers">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading customers: {error.message}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout pageTitle="Customers">
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 max-w-sm">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.active}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Suspended</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.suspended}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCustomers && filteredCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Name</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Email</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Phone</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Country</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Joined</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/20">
                    <TableCell>
                      <button 
                        onClick={() => navigate(`/admin/customers/${customer.id}`)}
                        className="text-sm font-medium hover:text-primary transition-colors text-left"
                      >
                        {customer.full_name}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{customer.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{customer.phone || "—"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{customer.country || "—"}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Circle 
                          className={`h-2 w-2 fill-current ${
                            customer.account_status === "active" 
                              ? "text-success" 
                              : "text-destructive"
                          }`} 
                        />
                        <span className="text-sm capitalize">{customer.account_status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground tabular-nums">
                        {format(new Date(customer.created_at), "MMM d, yyyy")}
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
                          <DropdownMenuItem onClick={() => navigate(`/admin/customers/${customer.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(customer)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(customer)}
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
              <p className="text-sm">No customers found</p>
            </div>
          )}
        </div>
      </div>

      <CustomerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        customer={selectedCustomer}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        description={`Are you sure you want to delete ${selectedCustomer?.full_name}? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </AdminDashboardLayout>
  );
}
