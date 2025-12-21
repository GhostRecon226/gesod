-- Create document type enum
CREATE TYPE public.document_type AS ENUM ('invoice', 'bill_of_lading', 'photo', 'other');

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vin_record_id UUID NOT NULL REFERENCES public.vin_records(id) ON DELETE CASCADE,
  document_type public.document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_documents_vin_record_id ON public.documents(vin_record_id);
CREATE INDEX idx_documents_uploaded_by ON public.documents(uploaded_by);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can create documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all documents"
ON public.documents
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents"
ON public.documents
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete documents"
ON public.documents
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Customer policy - can only view documents linked to their VINs
CREATE POLICY "Customers can view their own documents"
ON public.documents
FOR SELECT
TO authenticated
USING (
  vin_record_id IN (
    SELECT vr.id FROM vin_records vr
    JOIN customers c ON vr.customer_id = c.id
    WHERE c.user_id = auth.uid()
  )
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'image/heic']
);

-- Storage policies for documents bucket
CREATE POLICY "Admins can upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can view all document files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete document files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Customers can view their own document files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] IN (
    SELECT vr.id::text FROM vin_records vr
    JOIN customers c ON vr.customer_id = c.id
    WHERE c.user_id = auth.uid()
  )
);