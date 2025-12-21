-- Create vin_status_updates table
CREATE TABLE public.vin_status_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vin_record_id UUID NOT NULL REFERENCES public.vin_records(id) ON DELETE CASCADE,
  status public.vin_status NOT NULL,
  description TEXT,
  updated_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for ordering by date
CREATE INDEX idx_vin_status_updates_vin_record_id ON public.vin_status_updates(vin_record_id);
CREATE INDEX idx_vin_status_updates_created_at ON public.vin_status_updates(created_at DESC);

-- Enable RLS
ALTER TABLE public.vin_status_updates ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins can create status updates"
ON public.vin_status_updates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all status updates"
ON public.vin_status_updates
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update status updates"
ON public.vin_status_updates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete status updates"
ON public.vin_status_updates
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Customer policy: can view status updates for their own VINs
CREATE POLICY "Customers can view their own VIN status updates"
ON public.vin_status_updates
FOR SELECT
USING (
  vin_record_id IN (
    SELECT vr.id FROM public.vin_records vr
    JOIN public.customers c ON vr.customer_id = c.id
    WHERE c.user_id = auth.uid()
  )
);

-- Trigger function to sync current_status in vin_records
CREATE OR REPLACE FUNCTION public.sync_vin_current_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.vin_records
  SET current_status = NEW.status,
      updated_at = now()
  WHERE id = NEW.vin_record_id;
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER trigger_sync_vin_current_status
AFTER INSERT ON public.vin_status_updates
FOR EACH ROW
EXECUTE FUNCTION public.sync_vin_current_status();