-- Create bid request status enum
CREATE TYPE public.bid_request_status AS ENUM ('pending', 'approved', 'rejected', 'won', 'lost');

-- Create bid requests table
CREATE TABLE public.bid_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  auction_vehicle_reference TEXT NOT NULL,
  max_bid_amount DECIMAL(10, 2) NOT NULL,
  destination_country TEXT NOT NULL,
  destination_port TEXT NOT NULL,
  request_status public.bid_request_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_bid_requests_customer_id ON public.bid_requests(customer_id);
CREATE INDEX idx_bid_requests_status ON public.bid_requests(request_status);

-- Enable RLS
ALTER TABLE public.bid_requests ENABLE ROW LEVEL SECURITY;

-- Customer policies
CREATE POLICY "Customers can create their own bid requests"
ON public.bid_requests
FOR INSERT
TO authenticated
WITH CHECK (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Customers can view their own bid requests"
ON public.bid_requests
FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- Admin policies
CREATE POLICY "Admins can view all bid requests"
ON public.bid_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update bid requests"
ON public.bid_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete bid requests"
ON public.bid_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_bid_requests_updated_at
BEFORE UPDATE ON public.bid_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();