-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('status_update', 'document_upload', 'quote_response', 'bid_outcome')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_id UUID,
  related_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Customers can view their own notifications
CREATE POLICY "Customers can view their own notifications"
  ON public.notifications
  FOR SELECT
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Customers can update (mark as read) their own notifications
CREATE POLICY "Customers can update their own notifications"
  ON public.notifications
  FOR UPDATE
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ))
  WITH CHECK (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
  ON public.notifications
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Admins can create notifications (for manual creation if needed)
CREATE POLICY "Admins can create notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- System can insert notifications via triggers (using SECURITY DEFINER functions)
-- Create function to generate notification for status updates
CREATE OR REPLACE FUNCTION public.notify_status_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_vin TEXT;
  v_vehicle_info TEXT;
BEGIN
  -- Get customer_id and vehicle info from vin_record
  SELECT vr.customer_id, vr.vin, 
         v.year || ' ' || v.make || ' ' || v.model
  INTO v_customer_id, v_vin, v_vehicle_info
  FROM vin_records vr
  JOIN vehicles v ON v.id = vr.vehicle_id
  WHERE vr.id = NEW.vin_record_id;

  -- Insert notification
  INSERT INTO notifications (customer_id, type, title, message, related_id, related_type)
  VALUES (
    v_customer_id,
    'status_update',
    'Vehicle Status Updated',
    'Your ' || v_vehicle_info || ' (VIN: ' || v_vin || ') status changed to ' || 
      CASE NEW.status
        WHEN 'pending' THEN 'Pending'
        WHEN 'active' THEN 'Active'
        WHEN 'awaiting_action' THEN 'Awaiting Action'
        WHEN 'in_progress' THEN 'In Progress'
        WHEN 'delayed' THEN 'Delayed'
        WHEN 'completed' THEN 'Completed'
        WHEN 'cancelled' THEN 'Cancelled'
        ELSE NEW.status
      END,
    NEW.vin_record_id,
    'vin_record'
  );

  RETURN NEW;
END;
$$;

-- Create trigger for status updates
CREATE TRIGGER on_status_update_notify
  AFTER INSERT ON public.vin_status_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_status_update();

-- Create function to generate notification for document uploads
CREATE OR REPLACE FUNCTION public.notify_document_upload()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_vin TEXT;
BEGIN
  -- Get customer_id and VIN from vin_record
  SELECT customer_id, vin
  INTO v_customer_id, v_vin
  FROM vin_records
  WHERE id = NEW.vin_record_id;

  -- Insert notification
  INSERT INTO notifications (customer_id, type, title, message, related_id, related_type)
  VALUES (
    v_customer_id,
    'document_upload',
    'New Document Available',
    'A new ' || 
      CASE NEW.document_type
        WHEN 'invoice' THEN 'invoice'
        WHEN 'bill_of_lading' THEN 'bill of lading'
        WHEN 'photo' THEN 'photo'
        ELSE 'document'
      END || ' has been uploaded for VIN: ' || v_vin,
    NEW.vin_record_id,
    'document'
  );

  RETURN NEW;
END;
$$;

-- Create trigger for document uploads
CREATE TRIGGER on_document_upload_notify
  AFTER INSERT ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_document_upload();

-- Create function to generate notification for quote responses
CREATE OR REPLACE FUNCTION public.notify_quote_response()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only notify on status changes (not on insert)
  IF OLD.quote_status IS DISTINCT FROM NEW.quote_status THEN
    INSERT INTO notifications (customer_id, type, title, message, related_id, related_type)
    VALUES (
      NEW.customer_id,
      'quote_response',
      'Quote Request Updated',
      'Your ' || 
        CASE NEW.quote_type
          WHEN 'ocean_freight' THEN 'Ocean Freight'
          WHEN 'inland_freight' THEN 'Inland Freight'
          ELSE 'freight'
        END || ' quote request status changed to ' ||
        CASE NEW.quote_status
          WHEN 'pending' THEN 'Pending'
          WHEN 'issued' THEN 'Issued'
          WHEN 'expired' THEN 'Expired'
          WHEN 'accepted' THEN 'Accepted'
          ELSE NEW.quote_status
        END ||
        CASE WHEN NEW.quote_status = 'issued' AND NEW.quote_amount IS NOT NULL 
          THEN ' - Quote amount: $' || NEW.quote_amount::TEXT
          ELSE ''
        END,
      NEW.id,
      'quote'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for quote responses
CREATE TRIGGER on_quote_response_notify
  AFTER UPDATE ON public.quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_quote_response();

-- Create function to generate notification for bid outcomes
CREATE OR REPLACE FUNCTION public.notify_bid_outcome()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only notify on status changes (not on insert)
  IF OLD.request_status IS DISTINCT FROM NEW.request_status THEN
    INSERT INTO notifications (customer_id, type, title, message, related_id, related_type)
    VALUES (
      NEW.customer_id,
      'bid_outcome',
      'Bid Request Updated',
      'Your bid for ' || NEW.auction_vehicle_reference || ' status changed to ' ||
        CASE NEW.request_status
          WHEN 'pending' THEN 'Pending'
          WHEN 'approved' THEN 'Approved'
          WHEN 'rejected' THEN 'Rejected'
          WHEN 'won' THEN 'Won'
          WHEN 'lost' THEN 'Lost'
          ELSE NEW.request_status
        END,
      NEW.id,
      'bid'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for bid outcomes
CREATE TRIGGER on_bid_outcome_notify
  AFTER UPDATE ON public.bid_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_bid_outcome();

-- Create index for faster queries
CREATE INDEX idx_notifications_customer_id ON public.notifications(customer_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);