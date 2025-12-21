import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Car,
  User,
  FileText,
  Clock,
  CheckCircle2,
  Plus,
  Upload,
  Download,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { AdminDashboardLayout } from "@/components/layout/AdminDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useVehicle } from "@/hooks/useVehicles";
import { useVinStatusUpdates, useCreateStatusUpdate } from "@/hooks/useVinStatusUpdates";
import { useDocumentsByVinRecordId, useCreateDocument, useDeleteDocument, useDocumentDownloadUrl } from "@/hooks/useDocuments";
import { StatusUpdateDialog } from "@/components/admin/StatusUpdateDialog";
import { DocumentUploadDialog } from "@/components/admin/DocumentUploadDialog";
import type { VinStatus } from "@/services/vehicleService";
import type { Document } from "@/services/documentService";

const statusLabels: Record<VinStatus, string> = {
  pending: "Pending",
  active: "Active",
  awaiting_action: "Awaiting Action",
  in_progress: "In Progress",
  delayed: "Delayed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusVariants: Record<VinStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  active: "default",
  awaiting_action: "outline",
  in_progress: "default",
  delayed: "destructive",
  completed: "secondary",
  cancelled: "outline",
};

const documentTypeLabels: Record<string, string> = {
  invoice: "Invoice",
  bill_of_lading: "Bill of Lading",
  photo: "Photo",
  other: "Other",
};

export default function AdminVehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

  const { data: vehicle, isLoading: vehicleLoading, error: vehicleError } = useVehicle(id || "");
  
  // Get the primary VIN record
  const primaryVin = vehicle?.vin_records?.find(v => v.is_active) || vehicle?.vin_records?.[0];
  
  const { data: statusUpdates, isLoading: statusLoading } = useVinStatusUpdates(primaryVin?.id);
  const { data: documents, isLoading: documentsLoading } = useDocumentsByVinRecordId(primaryVin?.id);
  
  const createStatusMutation = useCreateStatusUpdate();
  const createDocumentMutation = useCreateDocument();
  const deleteDocumentMutation = useDeleteDocument();
  const downloadUrlMutation = useDocumentDownloadUrl();

  const handleStatusUpdate = async (status: VinStatus, description: string) => {
    if (!primaryVin) return;
    await createStatusMutation.mutateAsync({
      vin_record_id: primaryVin.id,
      status,
      description: description || undefined,
    });
  };

  const handleDocumentUpload = async (file: File, documentType: string) => {
    if (!primaryVin) return;
    await createDocumentMutation.mutateAsync({
      vin_record_id: primaryVin.id,
      document_type: documentType as "invoice" | "bill_of_lading" | "photo" | "other",
      file,
    });
  };

  const handleDocumentDownload = async (doc: Document) => {
    const url = await downloadUrlMutation.mutateAsync(doc.file_path);
    window.open(url, "_blank");
  };

  const handleDocumentDelete = async () => {
    if (!deleteDocId) return;
    await deleteDocumentMutation.mutateAsync(deleteDocId);
    setDeleteDocId(null);
  };

  const handleMarkCompleted = async () => {
    if (!primaryVin) return;
    await createStatusMutation.mutateAsync({
      vin_record_id: primaryVin.id,
      status: "completed",
      description: "Vehicle processing completed",
    });
  };

  const isCompleted = primaryVin?.current_status === "completed";

  if (vehicleLoading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminDashboardLayout>
    );
  }

  if (vehicleError || !vehicle) {
    return (
      <AdminDashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-lg font-medium">Vehicle not found</p>
          <Link to="/admin/vehicles">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vehicles
            </Button>
          </Link>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Completed Banner */}
        {isCompleted && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                Vehicle Completed
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                This vehicle is marked as completed. Status updates and document uploads are disabled.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/vehicles">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                {primaryVin && (
                  <Badge variant={statusVariants[primaryVin.current_status]}>
                    {statusLabels[primaryVin.current_status]}
                  </Badge>
                )}
              </div>
              {primaryVin && (
                <code className="text-sm font-mono text-muted-foreground">
                  VIN: {primaryVin.vin}
                </code>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setStatusDialogOpen(true)}
              disabled={isCompleted}
              title={isCompleted ? "Cannot add status to completed vehicle" : undefined}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Status
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setDocumentDialogOpen(true)}
              disabled={isCompleted}
              title={isCompleted ? "Cannot upload documents to completed vehicle" : undefined}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
            {!isCompleted && (
              <Button 
                onClick={handleMarkCompleted}
                disabled={createStatusMutation.isPending}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Completed
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Make</p>
                  <p className="font-medium">{vehicle.make}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Model</p>
                  <p className="font-medium">{vehicle.model}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year</p>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{vehicle.vehicle_type}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Source</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={vehicle.source === "auction" ? "outline" : "secondary"}>
                      {vehicle.source === "auction" 
                        ? vehicle.auction_source?.toUpperCase() || "Auction"
                        : "Direct"}
                    </Badge>
                    {vehicle.lot_number && (
                      <span className="text-muted-foreground">
                        Lot #{vehicle.lot_number}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {format(new Date(vehicle.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{vehicle.customers?.full_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{vehicle.customers?.email}</p>
                </div>
              </div>
              <Separator />
              <Link to={`/admin/customers`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Customer Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {primaryVin ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-4 rounded-lg bg-muted/50">
                    {isCompleted ? (
                      <div className="flex flex-col items-center gap-2 text-green-600">
                        <CheckCircle2 className="h-12 w-12" />
                        <span className="font-semibold text-lg">Completed</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Badge 
                          variant={statusVariants[primaryVin.current_status]} 
                          className="text-lg px-4 py-2"
                        >
                          {statusLabels[primaryVin.current_status]}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {format(new Date(primaryVin.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No VIN record found
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
            <CardDescription>
              Chronological history of status updates for this vehicle
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statusLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : statusUpdates && statusUpdates.length > 0 ? (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-6">
                  {statusUpdates.map((update, index) => (
                    <div key={update.id} className="relative flex gap-4 pl-10">
                      <div 
                        className={`absolute left-2.5 w-3 h-3 rounded-full border-2 bg-background ${
                          index === 0 ? 'border-primary' : 'border-muted-foreground'
                        }`}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={statusVariants[update.status]}>
                            {statusLabels[update.status]}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(update.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        {update.description && (
                          <p className="text-sm text-foreground">{update.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          by {update.updater_profile?.full_name || update.updater_profile?.email || 'System'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No status updates yet</p>
                {!isCompleted && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setStatusDialogOpen(true)}
                  >
                    Add First Status Update
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
              <CardDescription>
                Files and documents linked to this VIN
              </CardDescription>
            </div>
            {!isCompleted && (
              <Button variant="outline" size="sm" onClick={() => setDocumentDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {documentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : documents && documents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.file_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {documentTypeLabels[doc.document_type] || doc.document_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(doc.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDocumentDownload(doc)}
                            disabled={downloadUrlMutation.isPending}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {!isCompleted && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteDocId(doc.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No documents uploaded{isCompleted ? "" : " yet"}</p>
                {!isCompleted && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setDocumentDialogOpen(true)}
                  >
                    Upload First Document
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onSubmit={handleStatusUpdate}
        isLoading={createStatusMutation.isPending}
        currentStatus={primaryVin?.current_status}
      />

      {/* Document Upload Dialog */}
      <DocumentUploadDialog
        open={documentDialogOpen}
        onOpenChange={setDocumentDialogOpen}
        onSubmit={handleDocumentUpload}
        isLoading={createDocumentMutation.isPending}
      />

      {/* Delete Document Confirmation */}
      <AlertDialog open={!!deleteDocId} onOpenChange={() => setDeleteDocId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDocumentDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteDocumentMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminDashboardLayout>
  );
}
