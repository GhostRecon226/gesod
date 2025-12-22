-- Create trigger function for notifying customers about quote status changes
CREATE OR REPLACE FUNCTION public.notify_public_quote_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_vehicle_info TEXT;
  v_vehicle_details JSONB;
BEGIN
  -- Only notify if customer is linked and status changed
  IF NEW.customer_id IS NOT NULL AND OLD.quote_status IS DISTINCT FROM NEW.quote_status THEN
    
    -- Parse vehicle details for display
    BEGIN
      v_vehicle_details := NEW.vehicle_details::jsonb;
      v_vehicle_info := COALESCE(
        v_vehicle_details->>'year' || ' ' || 
        v_vehicle_details->>'make' || ' ' || 
        v_vehicle_details->>'model',
        'your vehicle'
      );
    EXCEPTION WHEN OTHERS THEN
      v_vehicle_info := 'your vehicle';
    END;
    
    -- Notify when quote is issued
    IF NEW.quote_status = 'issued' THEN
      INSERT INTO public.notifications (customer_id, type, title, message, related_id, related_type)
      VALUES (
        NEW.customer_id,
        'quote_issued',
        'Quote Issued',
        'Your ' || 
          CASE NEW.quote_type
            WHEN 'ocean_freight' THEN 'Ocean Freight'
            WHEN 'inland_freight' THEN 'Inland Freight'
            ELSE 'freight'
          END || ' quote for ' || v_vehicle_info || ' has been issued.' ||
          CASE WHEN NEW.quote_amount IS NOT NULL 
            THEN ' Quote amount: ' || NEW.currency || ' ' || NEW.quote_amount::TEXT
            ELSE ''
          END,
        NEW.id,
        'public_quote'
      );
    END IF;
    
    -- Notify when quote expires
    IF NEW.quote_status = 'expired' THEN
      INSERT INTO public.notifications (customer_id, type, title, message, related_id, related_type)
      VALUES (
        NEW.customer_id,
        'quote_expired',
        'Quote Expired',
        'Your ' || 
          CASE NEW.quote_type
            WHEN 'ocean_freight' THEN 'Ocean Freight'
            WHEN 'inland_freight' THEN 'Inland Freight'
            ELSE 'freight'
          END || ' quote for ' || v_vehicle_info || ' has expired. Please submit a new request if needed.',
        NEW.id,
        'public_quote'
      );
    END IF;
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for quote status changes
DROP TRIGGER IF EXISTS on_public_quote_status_change ON public.public_quote_requests;
CREATE TRIGGER on_public_quote_status_change
  AFTER UPDATE ON public.public_quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_public_quote_status_change();

-- Create trigger function for notifying admins about new quote requests
-- We'll store admin notifications with a special admin customer record or use a different approach
-- For now, we'll create an admin_notifications table for admin-specific notifications

CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  related_id uuid,
  related_type text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can view admin notifications
CREATE POLICY "Admins can view admin notifications"
ON public.admin_notifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update admin notifications (mark as read)
CREATE POLICY "Admins can update admin notifications"
ON public.admin_notifications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete admin notifications
CREATE POLICY "Admins can delete admin notifications"
ON public.admin_notifications
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger function for new quote submissions
CREATE OR REPLACE FUNCTION public.notify_admin_new_quote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_vehicle_info TEXT;
  v_vehicle_details JSONB;
BEGIN
  -- Parse vehicle details for display
  BEGIN
    v_vehicle_details := NEW.vehicle_details::jsonb;
    v_vehicle_info := COALESCE(
      v_vehicle_details->>'year' || ' ' || 
      v_vehicle_details->>'make' || ' ' || 
      v_vehicle_details->>'model',
      'Vehicle'
    );
  EXCEPTION WHEN OTHERS THEN
    v_vehicle_info := 'Vehicle';
  END;
  
  -- Create admin notification for new quote
  INSERT INTO public.admin_notifications (type, title, message, related_id, related_type)
  VALUES (
    'new_quote_request',
    'New Quote Request',
    NEW.contact_name || ' submitted a ' ||
      CASE NEW.quote_type
        WHEN 'ocean_freight' THEN 'Ocean Freight'
        WHEN 'inland_freight' THEN 'Inland Freight'
        ELSE 'freight'
      END || ' quote request for ' || v_vehicle_info || '.',
    NEW.id,
    'public_quote'
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger for new quote submissions
DROP TRIGGER IF EXISTS on_new_public_quote ON public.public_quote_requests;
CREATE TRIGGER on_new_public_quote
  AFTER INSERT ON public.public_quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_new_quote();