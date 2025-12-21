import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FileText, Download, Search, ChevronDown, ChevronRight, Car } from "lucide-react";
import { CustomerDashboardLayout } from "@/components/layout/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useCustomerDocuments, VinDocumentGroup } from "@/hooks/useCustomerDocuments";
import { getDocumentDownloadUrl, CustomerDocument } from "@/services/customerDocumentService";
import { toast } from "@/hooks/use-toast";

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

export default function CustomerDocuments() {
  const navigate = useNavigate();
  const { data: documentGroups, isLoading, error } = useCustomerDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedVins, setExpandedVins] = useState<Set<string>>(new Set());

  // Filter groups by search query
  const filteredGroups = (documentGroups || []).filter((group) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    
    // Search in VIN
    if (group.vin.toLowerCase().includes(query)) return true;
    
    // Search in vehicle info
    const vehicleStr = `${group.vehicle.year} ${group.vehicle.make} ${group.vehicle.model}`.toLowerCase();
    if (vehicleStr.includes(query)) return true;
    
    // Search in document names
    if (group.documents.some((doc) => doc.file_name.toLowerCase().includes(query))) return true;
    
    return false;
  });

  // Count total documents
  const totalDocuments = (documentGroups || []).reduce(
    (sum, group) => sum + group.documents.length,
    0
  );

  const toggleVin = (vinRecordId: string) => {
    setExpandedVins((prev) => {
      const next = new Set(prev);
      if (next.has(vinRecordId)) {
        next.delete(vinRecordId);
      } else {
        next.add(vinRecordId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedVins(new Set(filteredGroups.map((g) => g.vin_record_id)));
  };

  const collapseAll = () => {
    setExpandedVins(new Set());
  };

  const handleDownload = async (doc: CustomerDocument) => {
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

  const handleVehicleClick = (vehicleId: string) => {
    navigate(`/dashboard/vehicles/${vehicleId}`);
  };

  if (error) {
    return (
      <CustomerDashboardLayout>
        <div className="p-6">
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                Failed to load documents. Please try again.
              </p>
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
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1">
            View and download documents for your vehicles
          </p>
        </div>

        {/* Search and Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by VIN, vehicle, or document name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {filteredGroups.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={expandAll}>
                    Expand All
                  </Button>
                  <Button variant="outline" size="sm" onClick={collapseAll}>
                    Collapse All
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents by VIN */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              All Documents
              {!isLoading && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({totalDocuments} documents across {documentGroups?.length || 0} vehicles)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? (
                  <p>No documents match your search.</p>
                ) : (
                  <p>No documents have been uploaded yet.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGroups.map((group) => (
                  <VinDocumentCard
                    key={group.vin_record_id}
                    group={group}
                    isExpanded={expandedVins.has(group.vin_record_id)}
                    onToggle={() => toggleVin(group.vin_record_id)}
                    onDownload={handleDownload}
                    onVehicleClick={() => handleVehicleClick(group.vehicle.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CustomerDashboardLayout>
  );
}

// VIN Document Group Card
function VinDocumentCard({
  group,
  isExpanded,
  onToggle,
  onDownload,
  onVehicleClick,
}: {
  group: VinDocumentGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onDownload: (doc: CustomerDocument) => void;
  onVehicleClick: () => void;
}) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <div className="border rounded-lg overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors text-left">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono font-medium text-sm">{group.vin}</span>
                <Badge variant="secondary" className="text-xs">
                  {group.documents.length} document{group.documents.length !== 1 ? "s" : ""}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {group.vehicle.year} {group.vehicle.make} {group.vehicle.model}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onVehicleClick();
              }}
            >
              <Car className="h-4 w-4 mr-1" />
              View Vehicle
            </Button>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t bg-muted/30 p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.documents.map((doc) => (
                <DocumentCard key={doc.id} document={doc} onDownload={onDownload} />
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

// Document Card Component
function DocumentCard({
  document,
  onDownload,
}: {
  document: CustomerDocument;
  onDownload: (doc: CustomerDocument) => void;
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
          <span>{format(new Date(document.created_at), "MMM d, yyyy")}</span>
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
