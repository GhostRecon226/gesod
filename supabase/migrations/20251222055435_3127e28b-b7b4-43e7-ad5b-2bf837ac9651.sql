-- Create function to notify admin of new bid requests
CREATE OR REPLACE FUNCTION public.notify_admin_new_bid_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_customer_name TEXT;
  v_vehicle_info TEXT;
BEGIN
  -- Get customer name
  SELECT full_name INTO v_customer_name
  FROM customers WHERE id = NEW.customer_id;
  
  -- Get vehicle info if linked
  IF NEW.auction_vehicle_id IS NOT NULL THEN
    SELECT year || ' ' || make || ' ' || model INTO v_vehicle_info
    FROM auction_vehicles WHERE id = NEW.auction_vehicle_id;
  ELSE
    v_vehicle_info := NEW.auction_vehicle_reference;
  END IF;
  
  -- Create admin notification
  INSERT INTO public.admin_notifications (type, title, message, related_id, related_type)
  VALUES (
    'new_bid_request',
    'New Bid Request',
    COALESCE(v_customer_name, 'A customer') || ' submitted a bid request for ' || 
    COALESCE(v_vehicle_info, NEW.auction_vehicle_reference) || 
    ' with max bid $' || NEW.max_bid_amount::TEXT || '.',
    NEW.id,
    'bid_request'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for admin notification on new bid request
DROP TRIGGER IF EXISTS on_bid_request_created ON public.bid_requests;
CREATE TRIGGER on_bid_request_created
  AFTER INSERT ON public.bid_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_new_bid_request();

-- Create trigger for customer notification on bid status change
-- (uses existing notify_bid_outcome function)
DROP TRIGGER IF EXISTS on_bid_request_status_change ON public.bid_requests;
CREATE TRIGGER on_bid_request_status_change
  AFTER UPDATE ON public.bid_requests
  FOR EACH ROW
  WHEN (OLD.request_status IS DISTINCT FROM NEW.request_status)
  EXECUTE FUNCTION public.notify_bid_outcome();