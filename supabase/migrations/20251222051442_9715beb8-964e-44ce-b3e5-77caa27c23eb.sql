-- Add nullable customer_id column to public_quote_requests for optional linking
ALTER TABLE public.public_quote_requests 
ADD COLUMN customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL;

-- Create index for customer_id lookups
CREATE INDEX idx_public_quote_requests_customer_id ON public.public_quote_requests(customer_id);

-- Update the RPC function to accept optional customer_id
CREATE OR REPLACE FUNCTION public.create_public_quote_request(
  p_quote_type quote_type, 
  p_vehicle_details text, 
  p_origin_location text, 
  p_destination_location text, 
  p_contact_email text, 
  p_contact_name text, 
  p_contact_phone text,
  p_customer_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    contact_phone,
    customer_id
  ) VALUES (
    p_quote_type,
    p_vehicle_details,
    p_origin_location,
    p_destination_location,
    p_contact_name,
    p_contact_email,
    p_contact_phone,
    p_customer_id
  )
  RETURNING id INTO v_id;

  RETURN json_build_object(
    'success', true,
    'id', v_id,
    'message', 'Quote request submitted successfully'
  );
END;
$function$;