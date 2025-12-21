-- Create VIN status enum for tracking states
CREATE TYPE public.vin_status AS ENUM (
  'pending',
  'active',
  'awaiting_action',
  'in_progress',
  'delayed',
  'completed',
  'cancelled'
);

-- Create VIN records table
CREATE TABLE public.vin_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vin TEXT NOT NULL UNIQUE,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  current_status vin_status NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX idx_vin_records_vin ON public.vin_records(vin);
CREATE INDEX idx_vin_records_vehicle_id ON public.vin_records(vehicle_id);
CREATE INDEX idx_vin_records_customer_id ON public.vin_records(customer_id);
CREATE INDEX idx_vin_records_current_status ON public.vin_records(current_status);
CREATE INDEX idx_vin_records_is_active ON public.vin_records(is_active);

-- Enable RLS
ALTER TABLE public.vin_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Customers can view their own VIN records
CREATE POLICY "Customers can view their own VIN records"
ON public.vin_records FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
  )
);

-- Admins can view all VIN records
CREATE POLICY "Admins can view all VIN records"
ON public.vin_records FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create VIN records
CREATE POLICY "Admins can create VIN records"
ON public.vin_records FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update VIN records
CREATE POLICY "Admins can update VIN records"
ON public.vin_records FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete VIN records
CREATE POLICY "Admins can delete VIN records"
ON public.vin_records FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_vin_records_updated_at
  BEFORE UPDATE ON public.vin_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();