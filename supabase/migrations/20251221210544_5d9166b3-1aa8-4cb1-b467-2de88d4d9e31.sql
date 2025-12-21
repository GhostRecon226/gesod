-- Create vehicle type enum
CREATE TYPE public.vehicle_type AS ENUM ('car', 'suv', 'truck');

-- Create vehicle source enum
CREATE TYPE public.vehicle_source AS ENUM ('auction', 'direct');

-- Create auction source enum
CREATE TYPE public.auction_source AS ENUM ('copart', 'iaai', 'other');

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  vehicle_type vehicle_type NOT NULL,
  source vehicle_source NOT NULL,
  auction_source auction_source,
  lot_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for faster lookups
CREATE INDEX idx_vehicles_customer_id ON public.vehicles(customer_id);
CREATE INDEX idx_vehicles_source ON public.vehicles(source);
CREATE INDEX idx_vehicles_vehicle_type ON public.vehicles(vehicle_type);

-- Enable RLS
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Customers can view their own vehicles (via customer_id link)
CREATE POLICY "Customers can view their own vehicles"
ON public.vehicles FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
  )
);

-- Admins can view all vehicles
CREATE POLICY "Admins can view all vehicles"
ON public.vehicles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create vehicles
CREATE POLICY "Admins can create vehicles"
ON public.vehicles FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update vehicles
CREATE POLICY "Admins can update vehicles"
ON public.vehicles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete vehicles
CREATE POLICY "Admins can delete vehicles"
ON public.vehicles FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();