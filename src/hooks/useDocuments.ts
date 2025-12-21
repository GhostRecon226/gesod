import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getDocuments,
  getDocument,
  getDocumentsByVinRecordId,
  createDocument,
  deleteDocument,
  getDocumentDownloadUrl,
  searchDocuments,
  type Document,
  type DocumentWithDetails,
  type CreateDocumentInput,
} from "@/services/documentService";

// Query keys
export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: (filters: string) => [...documentKeys.lists(), { filters }] as const,
  details: () => [...documentKeys.all, "detail"] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
  byVinRecord: (vinRecordId: string) => [...documentKeys.all, "vinRecord", vinRecordId] as const,
  search: (query: string) => [...documentKeys.all, "search", query] as const,
};

// Fetch all documents
export function useDocuments() {
  return useQuery({
    queryKey: documentKeys.lists(),
    queryFn: getDocuments,
  });
}

// Fetch single document
export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => getDocument(id),
    enabled: !!id,
  });
}

// Fetch documents by VIN record ID
export function useDocumentsByVinRecordId(vinRecordId: string | undefined) {
  return useQuery({
    queryKey: documentKeys.byVinRecord(vinRecordId || ""),
    queryFn: () => getDocumentsByVinRecordId(vinRecordId!),
    enabled: !!vinRecordId,
  });
}

// Search documents
export function useSearchDocuments(query: string) {
  return useQuery({
    queryKey: documentKeys.search(query),
    queryFn: () => searchDocuments(query),
    enabled: query.length > 0,
  });
}

// Create document mutation
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocument,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: documentKeys.byVinRecord(data.vin_record_id) });
      toast.success("Document uploaded successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to upload document: ${error.message}`);
    },
  });
}

// Delete document mutation
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      toast.success("Document deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });
}

// Get download URL
export function useDocumentDownloadUrl() {
  return useMutation({
    mutationFn: getDocumentDownloadUrl,
    onError: (error: Error) => {
      toast.error(`Failed to get download URL: ${error.message}`);
    },
  });
}
