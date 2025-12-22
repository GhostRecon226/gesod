-- Add quote response fields to public_quote_requests
ALTER TABLE public.public_quote_requests 
ADD COLUMN quote_amount numeric,
ADD COLUMN currency text DEFAULT 'USD',
ADD COLUMN valid_until date;