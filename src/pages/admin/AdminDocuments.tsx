import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  Loader2,
  Download,
  FileText,
  Image,
  File,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import {
  useDocuments,
  useCreateDocument,
  useDeleteDocument,
  useDocumentDownloadUrl,
} from "@/hooks/useDocuments";
import { useVinRecords } from "@/hooks/useVinRecords";
import type { DocumentWithDetails } from "@/services/documentService";
import type { Database } from "@/integrations/supabase/types";

type DocumentType = Database["public"]["Enums"]["document_type"];

const documentTypeLabels: Record<DocumentType, string> = {
  invoice: "Invoice",
  bill_of_lading: "Bill of Lading",
  photo: "Photo",
  other: "Other",
};

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: "invoice", label: "Invoice" },
  { value: "bill_of_lading", label: "Bill of Lading" },
  { value: "photo", label: "Photo" },
  { value: "other", label: "Other" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getFileIcon(mimeType: string | null) {
  if (mimeType?.startsWith("image/")) return Image;
  return FileText;
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminDocuments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithDetails | null>(null);

  // Upload form state
  const [selectedVinRecordId, setSelectedVinRecordId] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: documents, isLoading, error } = useDocuments();
  const { data: vinRecords } = useVinRecords();
  const createMutation = useCreateDocument();
  const deleteMutation = useDeleteDocument();
  const downloadUrlMutation = useDocumentDownloadUrl();

  const filteredDocuments = useMemo(() => {
    if (!documents) return [];

    return documents.filter((doc) => {
      const matchesSearch =
        searchQuery === "" ||
        doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.vin_record?.vin.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        typeFilter === "all" || doc.document_type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [documents, searchQuery, typeFilter]);

  const stats = useMemo(() => {
    if (!documents) return { total: 0, invoices: 0, photos: 0 };
    return {
      total: documents.length,
      invoices: documents.filter((d) => d.document_type === "invoice").length,
      photos: documents.filter((d) => d.document_type === "photo").length,
    };
  }, [documents]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setUploadError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError("File size must be less than 10MB");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !documentType || !selectedVinRecordId) return;

    await createMutation.mutateAsync({
      vin_record_id: selectedVinRecordId,
      document_type: documentType,
      file,
    });

    resetUploadForm();
    setUploadOpen(false);
  };

  const resetUploadForm = () => {
    setSelectedVinRecordId("");
    setDocumentType("");
    setFile(null);
    setUploadError(null);
  };

  const handleDelete = (doc: DocumentWithDetails) => {
    setSelectedDocument(doc);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDocument) {
      await deleteMutation.mutateAsync(selectedDocument.id);
      setDeleteOpen(false);
      setSelectedDocument(null);
    }
  };

  const handleDownload = async (doc: DocumentWithDetails) => {
    const url = await downloadUrlMutation.mutateAsync(doc.file_path);
    window.open(url, "_blank");
  };

  if (error) {
    return (
      <AdminDashboardLayout pageTitle="Documents">
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading documents: {error.message}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout
      pageTitle="Documents"
      actions={
        <Button size="sm" onClick={() => setUploadOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          Upload Document
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 max-w-md">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.total}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Invoices</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.invoices}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Photos</p>
            <p className="text-2xl font-semibold tabular-nums">{stats.photos}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by file name or VIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
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
          ) : filteredDocuments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-medium uppercase tracking-wider">File</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">VIN</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Type</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Size</TableHead>
                  <TableHead className="text-xs font-medium uppercase tracking-wider">Uploaded</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => {
                  const FileIcon = getFileIcon(doc.mime_type);
                  return (
                    <TableRow key={doc.id} className="hover:bg-muted/20">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[200px]">
                            {doc.file_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs font-mono text-muted-foreground">
                          {doc.vin_record?.vin || "—"}
                        </code>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {documentTypeLabels[doc.document_type]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(doc.file_size)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground tabular-nums">
                          {format(new Date(doc.created_at), "MMM d, yyyy")}
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
                              onClick={() => handleDownload(doc)}
                              disabled={downloadUrlMutation.isPending}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(doc)}
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
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <File className="h-10 w-10 mb-3 opacity-50" />
              <p className="text-sm">No documents found</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={(open) => {
        if (!open) resetUploadForm();
        setUploadOpen(open);
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document and attach it to a VIN record.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
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
              <Label htmlFor="documentType">
                Document Type <span className="text-destructive">*</span>
              </Label>
              <Select value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                File <span className="text-destructive">*</span>
              </Label>
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
              />
              {uploadError && (
                <p className="text-sm text-destructive">{uploadError}</p>
              )}
              <p className="text-xs text-muted-foreground">Max file size: 10MB</p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!file || !documentType || !selectedVinRecordId || createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
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
        title="Delete Document"
        description={`Are you sure you want to delete "${selectedDocument?.file_name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </AdminDashboardLayout>
  );
}
