import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Car,
  FileText,
  Download,
  Gavel,
  Store,
} from "lucide-react";
import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { StatusTimeline, type TimelineStatus } from "@/components/ui/status-timeline";
import { useCustomerVehicleDetail } from "@/hooks/useCustomerVehicles";
import { getDocumentDownloadUrl, VehicleDocument } from "@/services/customerVehicleService";
import { toast } from "@/hooks/use-toast";
import { Circle } from "lucide-react";

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

const documentTypeLabels: Record<string, string> = {
  invoice: "Invoice",
  bill_of_lading: "Bill of Lading",
  photo: "Photo",
  other: "Other",
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CustomerVehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading, error } = useCustomerVehicleDetail(id || "");

  const handleDownload = async (doc: VehicleDocument) => {
    try {
      const url = await getDocumentDownloadUrl(doc.file_path);
      window.open(url, "_blank");
    } catch (err) {
      toast({
        title: "Download Failed",
        description: "Could not download the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const currentStatus = vehicle?.vin_record?.current_status || "pending";

  if (error) {
    return (
      <CustomerDashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-sm text-destructive">Failed to load vehicle details.</p>
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/vehicles")}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Vehicles
          </Button>
        </div>
      </CustomerDashboardLayout>
    );
  }

  // Transform status updates to timeline format
  const timelineItems: TimelineStatus[] = vehicle?.status_updates?.map((update) => ({
    id: update.id,
    status: update.status,
    date: update.created_at,
    description: update.description,
  })) || [];

  return (
    <CustomerDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/dashboard/vehicles")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <Skeleton className="h-7 w-48" />
            ) : (
              <>
                <h1 className="text-xl font-semibold text-foreground">
                  {vehicle?.year} {vehicle?.make} {vehicle?.model}
                </h1>
                <code className="text-sm text-muted-foreground font-mono">
                  {vehicle?.vin_record?.vin || "No VIN"}
                </code>
              </>
            )}
          </div>
          {!isLoading && vehicle?.vin_record && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Circle className={`h-2 w-2 fill-current ${statusIndicator[currentStatus]}`} />
              <span className="text-sm font-medium">{statusLabels[currentStatus]}</span>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 lg:col-span-2" />
          </div>
        ) : vehicle ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Vehicle Information */}
            <div className="bg-card rounded-lg border border-border p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Car className="h-4 w-4" />
                Vehicle Details
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">VIN</p>
                  <code className="text-sm font-mono">{vehicle.vin_record?.vin || "—"}</code>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Make</p>
                    <p className="text-sm">{vehicle.make}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Model</p>
                    <p className="text-sm">{vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Year</p>
                    <p className="text-sm">{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm capitalize">{vehicle.vehicle_type}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <div className="flex items-center gap-2 mt-1">
                    {vehicle.source === "auction" ? (
                      <>
                        <Gavel className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">Auction</span>
                        {vehicle.auction_source && (
                          <Badge variant="secondary" className="uppercase text-[10px] px-1.5 py-0">
                            {vehicle.auction_source}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <>
                        <Store className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">Direct</span>
                      </>
                    )}
                  </div>
                  {vehicle.lot_number && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Lot #{vehicle.lot_number}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-card rounded-lg border border-border p-5 lg:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-5">
                Status History
              </div>

              <StatusTimeline 
                items={timelineItems}
                emptyMessage="No status updates yet."
              />
            </div>

            {/* Documents */}
            <div className="bg-card rounded-lg border border-border p-5 lg:col-span-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                <FileText className="h-4 w-4" />
                Documents
                {vehicle.documents.length > 0 && (
                  <span className="text-xs">({vehicle.documents.length})</span>
                )}
              </div>

              {vehicle.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No documents uploaded yet.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {vehicle.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted/30 transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{doc.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {documentTypeLabels[doc.document_type] || doc.document_type}
                          <span className="mx-1">·</span>
                          {formatFileSize(doc.file_size)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </CustomerDashboardLayout>
  );
}
