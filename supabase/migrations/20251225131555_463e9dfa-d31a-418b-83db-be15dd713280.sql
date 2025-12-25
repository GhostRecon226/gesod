-- Create enums for ticket system
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'awaiting_customer', 'resolved', 'closed');
CREATE TYPE public.ticket_category AS ENUM ('general', 'shipping', 'documents', 'billing', 'other');

-- Create support_tickets table
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  category ticket_category NOT NULL DEFAULT 'general',
  related_vin_record_id UUID REFERENCES public.vin_records(id) ON DELETE SET NULL,
  related_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ticket_replies table
CREATE TABLE public.ticket_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  is_admin_reply BOOLEAN NOT NULL DEFAULT false,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

-- RLS policies for support_tickets
CREATE POLICY "Customers can create their own tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (customer_id IN (
  SELECT id FROM customers WHERE user_id = auth.uid()
));

CREATE POLICY "Customers can view their own tickets"
ON public.support_tickets
FOR SELECT
USING (customer_id IN (
  SELECT id FROM customers WHERE user_id = auth.uid()
));

CREATE POLICY "Customers can update their own tickets"
ON public.support_tickets
FOR UPDATE
USING (customer_id IN (
  SELECT id FROM customers WHERE user_id = auth.uid()
))
WITH CHECK (customer_id IN (
  SELECT id FROM customers WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can view all tickets"
ON public.support_tickets
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all tickets"
ON public.support_tickets
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tickets"
ON public.support_tickets
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for ticket_replies
CREATE POLICY "Customers can create replies on their tickets"
ON public.ticket_replies
FOR INSERT
WITH CHECK (ticket_id IN (
  SELECT st.id FROM support_tickets st
  JOIN customers c ON st.customer_id = c.id
  WHERE c.user_id = auth.uid()
) OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can view replies on their tickets"
ON public.ticket_replies
FOR SELECT
USING (ticket_id IN (
  SELECT st.id FROM support_tickets st
  JOIN customers c ON st.customer_id = c.id
  WHERE c.user_id = auth.uid()
));

CREATE POLICY "Admins can view all replies"
ON public.ticket_replies
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create replies"
ON public.ticket_replies
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete replies"
ON public.ticket_replies
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_support_tickets_updated_at
BEFORE UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Notification trigger for new tickets (notify admins)
CREATE OR REPLACE FUNCTION public.notify_admin_new_ticket()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_name TEXT;
BEGIN
  SELECT full_name INTO v_customer_name
  FROM customers WHERE id = NEW.customer_id;
  
  INSERT INTO public.admin_notifications (type, title, message, related_id, related_type)
  VALUES (
    'new_support_ticket',
    'New Support Ticket',
    COALESCE(v_customer_name, 'A customer') || ' submitted a ' || NEW.priority || ' priority ticket: ' || NEW.subject,
    NEW.id,
    'support_ticket'
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_support_ticket
AFTER INSERT ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_new_ticket();

-- Notification trigger for admin replies (notify customer)
CREATE OR REPLACE FUNCTION public.notify_customer_ticket_reply()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_ticket_subject TEXT;
BEGIN
  IF NEW.is_admin_reply = true THEN
    SELECT st.customer_id, st.subject
    INTO v_customer_id, v_ticket_subject
    FROM support_tickets st
    WHERE st.id = NEW.ticket_id;
    
    INSERT INTO public.notifications (customer_id, type, title, message, related_id, related_type)
    VALUES (
      v_customer_id,
      'ticket_reply',
      'New Reply on Your Ticket',
      'An admin has replied to your support ticket: ' || v_ticket_subject,
      NEW.ticket_id,
      'support_ticket'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_ticket_reply
AFTER INSERT ON public.ticket_replies
FOR EACH ROW
EXECUTE FUNCTION public.notify_customer_ticket_reply();

-- Notification trigger for ticket status changes (notify customer)
CREATE OR REPLACE FUNCTION public.notify_ticket_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (customer_id, type, title, message, related_id, related_type)
    VALUES (
      NEW.customer_id,
      'ticket_status',
      'Ticket Status Updated',
      'Your support ticket "' || NEW.subject || '" status changed to ' ||
        CASE NEW.status
          WHEN 'open' THEN 'Open'
          WHEN 'in_progress' THEN 'In Progress'
          WHEN 'awaiting_customer' THEN 'Awaiting Your Response'
          WHEN 'resolved' THEN 'Resolved'
          WHEN 'closed' THEN 'Closed'
          ELSE NEW.status::text
        END,
      NEW.id,
      'support_ticket'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_ticket_status_change
AFTER UPDATE ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.notify_ticket_status_change();