-- Create a secure function for public VIN tracking
-- This function only returns non-sensitive status information
CREATE OR REPLACE FUNCTION public.track_vin_public(p_vin TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_vin_record RECORD;
BEGIN
  -- Normalize VIN to uppercase
  p_vin := UPPER(TRIM(p_vin));
  
  -- Validate VIN format (basic check: 17 alphanumeric characters, no I, O, Q)
  IF LENGTH(p_vin) != 17 OR p_vin !~ '^[A-HJ-NPR-Z0-9]{17}$' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'invalid_format',
      'message', 'Invalid VIN format. VIN must be 17 characters.'
    );
  END IF;
  
  -- Find the VIN record with vehicle info
  SELECT 
    vr.id,
    vr.vin,
    vr.current_status,
    vr.is_active,
    v.make,
    v.model,
    v.year,
    v.vehicle_type
  INTO v_vin_record
  FROM vin_records vr
  JOIN vehicles v ON v.id = vr.vehicle_id
  WHERE vr.vin = p_vin
  LIMIT 1;
  
  -- If not found, return error
  IF v_vin_record IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'not_found',
      'message', 'VIN not found. Please check and try again.'
    );
  END IF;
  
  -- Build result with status history (limited info)
  SELECT json_build_object(
    'success', true,
    'data', json_build_object(
      'vin', v_vin_record.vin,
      'vehicle', json_build_object(
        'make', v_vin_record.make,
        'model', v_vin_record.model,
        'year', v_vin_record.year,
        'type', v_vin_record.vehicle_type
      ),
      'current_status', v_vin_record.current_status,
      'is_active', v_vin_record.is_active,
      'status_history', COALESCE(
        (SELECT json_agg(
          json_build_object(
            'status', vsu.status,
            'description', vsu.description,
            'date', vsu.created_at
          ) ORDER BY vsu.created_at DESC
        )
        FROM vin_status_updates vsu
        WHERE vsu.vin_record_id = v_vin_record.id
        LIMIT 10),
        '[]'::json
      )
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.track_vin_public(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.track_vin_public(TEXT) TO authenticated;