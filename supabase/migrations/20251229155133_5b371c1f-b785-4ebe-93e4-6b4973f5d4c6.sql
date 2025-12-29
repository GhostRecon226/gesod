DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typname='vin_status' AND e.enumlabel='Pending') THEN
    ALTER TYPE public.vin_status ADD VALUE 'Pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typname='vin_status' AND e.enumlabel='Active') THEN
    ALTER TYPE public.vin_status ADD VALUE 'Active';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typname='vin_status' AND e.enumlabel='Awaiting Action') THEN
    ALTER TYPE public.vin_status ADD VALUE 'Awaiting Action';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typname='vin_status' AND e.enumlabel='In Progress') THEN
    ALTER TYPE public.vin_status ADD VALUE 'In Progress';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typname='vin_status' AND e.enumlabel='Delayed') THEN
    ALTER TYPE public.vin_status ADD VALUE 'Delayed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typname='vin_status' AND e.enumlabel='Completed') THEN
    ALTER TYPE public.vin_status ADD VALUE 'Completed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON t.oid=e.enumtypid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typname='vin_status' AND e.enumlabel='Cancelled') THEN
    ALTER TYPE public.vin_status ADD VALUE 'Cancelled';
  END IF;
END $$;