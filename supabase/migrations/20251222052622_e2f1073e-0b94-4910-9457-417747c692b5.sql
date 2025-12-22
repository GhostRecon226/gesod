-- Create enum for auction vehicle status
CREATE TYPE auction_vehicle_status AS ENUM ('active', 'expired');

-- Create auction_vehicles table
CREATE TABLE public.auction_vehicles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  vehicle_type vehicle_type NOT NULL,
  auction_source auction_source NOT NULL,
  lot_number text NOT NULL,
  auction_date date,
  yard_location text,
  vehicle_images text[] DEFAULT '{}',
  status auction_vehicle_status NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_auction_vehicles_status ON public.auction_vehicles(status);
CREATE INDEX idx_auction_vehicles_auction_source ON public.auction_vehicles(auction_source);
CREATE INDEX idx_auction_vehicles_auction_date ON public.auction_vehicles(auction_date);

-- Enable RLS
ALTER TABLE public.auction_vehicles ENABLE ROW LEVEL SECURITY;

-- Admins can view all auction vehicles
CREATE POLICY "Admins can view all auction vehicles"
ON public.auction_vehicles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can create auction vehicles
CREATE POLICY "Admins can create auction vehicles"
ON public.auction_vehicles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update auction vehicles
CREATE POLICY "Admins can update auction vehicles"
ON public.auction_vehicles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete auction vehicles
CREATE POLICY "Admins can delete auction vehicles"
ON public.auction_vehicles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Public can view active auction vehicles (for public auction listings page)
CREATE POLICY "Anyone can view active auction vehicles"
ON public.auction_vehicles
FOR SELECT
USING (status = 'active');

-- Create trigger for updated_at
CREATE TRIGGER update_auction_vehicles_updated_at
  BEFORE UPDATE ON public.auction_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();