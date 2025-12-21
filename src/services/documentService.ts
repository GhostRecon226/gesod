import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DocumentType = Database["public"]["Enums"]["document_type"];

export interface Document {
  id: string;
  vin_record_id: string;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string;
  created_at: string;
}

export interface CreateDocumentInput {
  vin_record_id: string;
  document_type: DocumentType;
  file: File;
}

export interface DocumentWithDetails extends Document {
  vin_record?: {
    vin: string;
    customer_id: string;
  };
}

// Upload file to storage and create document record
export async function createDocument(input: CreateDocumentInput): Promise<Document> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Create unique file path: vin_record_id/timestamp_filename
  const timestamp = Date.now();
  const filePath = `${input.vin_record_id}/${timestamp}_${input.file.name}`;

  // Upload file to storage
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, input.file);

  if (uploadError) throw uploadError;

  // Create document record
  const { data, error } = await supabase
    .from("documents")
    .insert({
      vin_record_id: input.vin_record_id,
      document_type: input.document_type,
      file_name: input.file.name,
      file_path: filePath,
      file_size: input.file.size,
      mime_type: input.file.type,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) {
    // Clean up uploaded file if record creation fails
    await supabase.storage.from("documents").remove([filePath]);
    throw error;
  }

  return data;
}

// Get all documents (admin)
export async function getDocuments(): Promise<DocumentWithDetails[]> {
  const { data, error } = await supabase
    .from("documents")
    .select(`
      *,
      vin_record:vin_records(vin, customer_id)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as DocumentWithDetails[];
}

// Get document by ID
export async function getDocument(id: string): Promise<DocumentWithDetails> {
  const { data, error } = await supabase
    .from("documents")
    .select(`
      *,
      vin_record:vin_records(vin, customer_id)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as DocumentWithDetails;
}

// Get documents by VIN record ID
export async function getDocumentsByVinRecordId(vinRecordId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("vin_record_id", vinRecordId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Delete document (also removes file from storage)
export async function deleteDocument(id: string): Promise<void> {
  // First get the document to get the file path
  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from("documents")
    .remove([doc.file_path]);

  if (storageError) throw storageError;

  // Delete record
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw error;
}

// Get download URL for a document
export async function getDocumentDownloadUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
}

// Search documents
export async function searchDocuments(query: string): Promise<DocumentWithDetails[]> {
  const { data, error } = await supabase
    .from("documents")
    .select(`
      *,
      vin_record:vin_records(vin, customer_id)
    `)
    .or(`file_name.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as DocumentWithDetails[];
}
