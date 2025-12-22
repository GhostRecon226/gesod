-- Add auction_vehicle_id column to bid_requests for proper linking
ALTER TABLE public.bid_requests
ADD COLUMN auction_vehicle_id UUID REFERENCES public.auction_vehicles(id) ON DELETE SET NULL;

-- Create an index for better query performance
CREATE INDEX idx_bid_requests_auction_vehicle_id ON public.bid_requests(auction_vehicle_id);

-- Comment explaining the design
COMMENT ON COLUMN public.bid_requests.auction_vehicle_id IS 'Foreign key to auction_vehicles. SET NULL on delete to preserve bid request history.';
COMMENT ON COLUMN public.bid_requests.auction_vehicle_reference IS 'Text snapshot of vehicle details for display after vehicle deletion/expiry.';