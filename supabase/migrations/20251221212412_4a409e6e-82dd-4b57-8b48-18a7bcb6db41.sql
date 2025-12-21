-- Create quote type enum
CREATE TYPE public.quote_type AS ENUM ('ocean_freight', 'inland_freight');

-- Create quote status enum
CREATE TYPE public.quote_status AS ENUM ('pending', 'issued', 'expired', 'accepted');

-- Create quote requests table
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  quote_type public.quote_type NOT NULL,
  vehicle_details TEXT NOT NULL,
  origin_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  quote_amount DECIMAL(10, 2),
  quote_status public.quote_status NOT NULL DEFAULT 'pending',
  valid_until DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_quote_requests_customer_id ON public.quote_requests(customer_id);
CREATE INDEX idx_quote_requests_status ON public.quote_requests(quote_status);

-- Enable RLS
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Customer policies
CREATE POLICY "Customers can create their own quote requests"
ON public.quote_requests
FOR INSERT
TO authenticated
WITH CHECK (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Customers can view their own quote requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (
  customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  )
);

-- Admin policies
CREATE POLICY "Admins can view all quote requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update quote requests"
ON public.quote_requests
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quote requests"
ON public.quote_requests
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_quote_requests_updated_at
BEFORE UPDATE ON public.quote_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();