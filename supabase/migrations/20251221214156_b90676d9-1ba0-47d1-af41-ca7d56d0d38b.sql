-- Create trigger to sync current_status when a new status update is created
CREATE TRIGGER sync_vin_status_on_insert
  AFTER INSERT ON public.vin_status_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vin_current_status();

-- Also create trigger for updates (in case a status update is modified)
CREATE TRIGGER sync_vin_status_on_update
  AFTER UPDATE OF status ON public.vin_status_updates
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vin_current_status();