import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Car,
  FileText,
  Download,
  Clock,
  CheckCircle2,
  Gavel,
  Store,
} from "lucide-react";
import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { StatusBadge, StatusType } from "@/components/ui/status-badge";
import { useCustomerVehicleDetail } from "@/hooks/useCustomerVehicles";
import { getDocumentDownloadUrl, VehicleStatusUpdate, VehicleDocument } from "@/services/customerVehicleService";
import { toast } from "@/hooks/use-toast";

// Map database status to StatusBadge status type
function mapStatus(dbStatus: string): StatusType {
  const statusMap: Record<string, StatusType> = {
    pending: "pending",
    active: "active",
    awaiting_action: "awaiting",
    in_progress: "in-progress",
    delayed: "delayed",
    completed: "completed",
    cancelled: "cancelled",
  };
  return statusMap[dbStatus] || "pending";
}

// Document type labels
const documentTypeLabels: Record<string, string> = {
  invoice: "Invoice",
  bill_of_lading: "Bill of Lading",
  photo: "Photo",
  other: "Other",
};

// Format file size
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

  const isCompleted = vehicle?.vin_record?.current_status === "completed";

  if (error) {
    return (
      <CustomerDashboardLayout>
        <div className="p-6">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                Failed to load vehicle details. Please try again.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/dashboard/vehicles")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Vehicles
              </Button>
            </CardContent>
          </Card>
        </div>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/vehicles")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            {isLoading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-foreground">
                  {vehicle?.year} {vehicle?.make} {vehicle?.model}
                </h1>
                <p className="text-muted-foreground font-mono">
                  {vehicle?.vin_record?.vin || "No VIN"}
                </p>
              </>
            )}
          </div>
          {!isLoading && vehicle && (
            <div className="flex items-center gap-3">
              {vehicle.vin_record && (
                <StatusBadge
                  status={mapStatus(vehicle.vin_record.current_status)}
                  showIcon
                  size="lg"
                />
              )}
              {isCompleted && (
                <Badge
                  variant="outline"
                  className="border-success text-success bg-success-muted"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-64 md:col-span-2" />
          </div>
        ) : vehicle ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Vehicle Information */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  Vehicle Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">VIN</p>
                  <p className="font-mono font-medium">
                    {vehicle.vin_record?.vin || "—"}
                  </p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Make</p>
                    <p className="font-medium">{vehicle.make}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model</p>
                    <p className="font-medium">{vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{vehicle.vehicle_type}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <div className="flex items-center gap-2 mt-1">
                    {vehicle.source === "auction" ? (
                      <>
                        <Gavel className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Auction</span>
                        {vehicle.auction_source && (
                          <Badge variant="secondary" className="uppercase">
                            {vehicle.auction_source}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <>
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Direct</span>
                      </>
                    )}
                  </div>
                  {vehicle.lot_number && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Lot #{vehicle.lot_number}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Status History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.status_updates.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No status updates yet.
                  </p>
                ) : (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
                    
                    <div className="space-y-6">
                      {vehicle.status_updates.map((update, index) => (
                        <TimelineItem
                          key={update.id}
                          update={update}
                          isFirst={index === 0}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  Documents
                  {vehicle.documents.length > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">
                      ({vehicle.documents.length})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {vehicle.documents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No documents uploaded yet.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {vehicle.documents.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onDownload={handleDownload}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </CustomerDashboardLayout>
  );
}

// Timeline Item Component
function TimelineItem({
  update,
  isFirst,
}: {
  update: VehicleStatusUpdate;
  isFirst: boolean;
}) {
  return (
    <div className="relative flex gap-4 pl-7">
      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-1 h-[22px] w-[22px] rounded-full border-2 flex items-center justify-center ${
          isFirst
            ? "bg-primary border-primary"
            : "bg-card border-border"
        }`}
      >
        <div
          className={`h-2 w-2 rounded-full ${
            isFirst ? "bg-primary-foreground" : "bg-muted-foreground"
          }`}
        />
      </div>

      <div className="flex-1 pb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={mapStatus(update.status)} showIcon />
          <span className="text-sm text-muted-foreground">
            {format(new Date(update.created_at), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>
        {update.description && (
          <p className="mt-2 text-sm text-foreground">{update.description}</p>
        )}
      </div>
    </div>
  );
}

// Document Card Component
function DocumentCard({
  document,
  onDownload,
}: {
  document: VehicleDocument;
  onDownload: (doc: VehicleDocument) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
        <FileText className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{document.file_name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{documentTypeLabels[document.document_type] || document.document_type}</span>
          <span>•</span>
          <span>{formatFileSize(document.file_size)}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0"
        onClick={() => onDownload(document)}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
