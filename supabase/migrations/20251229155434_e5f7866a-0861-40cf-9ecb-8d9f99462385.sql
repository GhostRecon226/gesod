CREATE OR REPLACE FUNCTION public.sync_vin_current_status()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  normalized_status vin_status;
BEGIN
  -- Normalize status: lowercase and replace spaces with underscores
  normalized_status := lower(replace(NEW.status::text, ' ', '_'))::vin_status;
  
  UPDATE public.vin_records
  SET current_status = normalized_status,
      updated_at = now()
  WHERE id = NEW.vin_record_id;
  RETURN NEW;
END;
$function$;