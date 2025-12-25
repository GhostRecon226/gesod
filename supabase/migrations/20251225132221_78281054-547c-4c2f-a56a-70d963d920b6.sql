-- Create storage bucket for ticket attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('ticket-attachments', 'ticket-attachments', false);

-- Storage policies for ticket attachments
CREATE POLICY "Customers can upload attachments to their tickets"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'ticket-attachments' AND
  (
    -- Allow customers to upload to their own tickets
    EXISTS (
      SELECT 1 FROM support_tickets st
      JOIN customers c ON st.customer_id = c.id
      WHERE c.user_id = auth.uid()
      AND (storage.foldername(name))[1] = st.id::text
    )
    OR has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Users can view attachments on their tickets"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'ticket-attachments' AND
  (
    EXISTS (
      SELECT 1 FROM support_tickets st
      JOIN customers c ON st.customer_id = c.id
      WHERE c.user_id = auth.uid()
      AND (storage.foldername(name))[1] = st.id::text
    )
    OR has_role(auth.uid(), 'admin')
  )
);

CREATE POLICY "Admins can delete ticket attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'ticket-attachments' AND
  has_role(auth.uid(), 'admin')
);

-- Create ticket_attachments table to track uploaded files
CREATE TABLE public.ticket_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.ticket_replies(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ticket_attachments ENABLE ROW LEVEL SECURITY;

-- RLS policies for ticket_attachments
CREATE POLICY "Customers can view attachments on their tickets"
ON public.ticket_attachments
FOR SELECT
USING (
  ticket_id IN (
    SELECT st.id FROM support_tickets st
    JOIN customers c ON st.customer_id = c.id
    WHERE c.user_id = auth.uid()
  )
);

CREATE POLICY "Customers can add attachments to their tickets"
ON public.ticket_attachments
FOR INSERT
WITH CHECK (
  ticket_id IN (
    SELECT st.id FROM support_tickets st
    JOIN customers c ON st.customer_id = c.id
    WHERE c.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can view all attachments"
ON public.ticket_attachments
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can add attachments"
ON public.ticket_attachments
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete attachments"
ON public.ticket_attachments
FOR DELETE
USING (has_role(auth.uid(), 'admin'));