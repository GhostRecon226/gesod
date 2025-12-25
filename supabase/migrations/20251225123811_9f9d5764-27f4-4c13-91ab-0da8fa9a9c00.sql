-- Create app_settings table for admin-controlled settings
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT 'false'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view settings
CREATE POLICY "Admins can view all settings"
ON public.app_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Only admins can update settings
CREATE POLICY "Admins can update settings"
ON public.app_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can insert settings
CREATE POLICY "Admins can insert settings"
ON public.app_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Anyone can read specific public settings (maintenance mode check)
CREATE POLICY "Anyone can read maintenance mode setting"
ON public.app_settings
FOR SELECT
USING (key = 'maintenance_mode');

-- Create trigger to update updated_at
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.app_settings (key, value) VALUES
  ('maintenance_mode', 'false'::jsonb),
  ('debug_mode', 'false'::jsonb),
  ('email_notifications', 'false'::jsonb),
  ('new_quote_alerts', 'true'::jsonb),
  ('bid_request_alerts', 'true'::jsonb),
  ('require_2fa', 'false'::jsonb),
  ('session_timeout_enabled', 'true'::jsonb),
  ('session_timeout_minutes', '30'::jsonb),
  ('dark_mode', 'false'::jsonb),
  ('compact_view', 'false'::jsonb);