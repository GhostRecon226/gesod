-- Create a table to store public quote requests (from non-authenticated users)
CREATE TABLE public.public_quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_type public.quote_type NOT NULL,
  vehicle_details TEXT NOT NULL,
  origin_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  quote_status public.quote_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.public_quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can submit a quote request)
CREATE POLICY "Anyone can create public quote requests"
ON public.public_quote_requests
FOR INSERT
WITH CHECK (true);

-- Only admins can view public quote requests
CREATE POLICY "Admins can view all public quote requests"
ON public.public_quote_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update public quote requests
CREATE POLICY "Admins can update public quote requests"
ON public.public_quote_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete public quote requests
CREATE POLICY "Admins can delete public quote requests"
ON public.public_quote_requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_public_quote_requests_updated_at
BEFORE UPDATE ON public.public_quote_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function for public quote request submission
CREATE OR REPLACE FUNCTION public.create_public_quote_request(
  p_quote_type public.quote_type,
  p_vehicle_details TEXT,
  p_origin_location TEXT,
  p_destination_location TEXT,
  p_contact_email TEXT,
  p_contact_name TEXT,
  p_contact_phone TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.public_quote_requests (
    quote_type,
    vehicle_details,
    origin_location,
    destination_location,
    contact_name,
    contact_email,
    contact_phone
  ) VALUES (
    p_quote_type,
    p_vehicle_details,
    p_origin_location,
    p_destination_location,
    p_contact_name,
    p_contact_email,
    p_contact_phone
  )
  RETURNING id INTO v_id;

  RETURN json_build_object(
    'success', true,
    'id', v_id,
    'message', 'Quote request submitted successfully'
  );
END;
$$;