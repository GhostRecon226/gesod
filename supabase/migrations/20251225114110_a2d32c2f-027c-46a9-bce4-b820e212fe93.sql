-- Insert a test vehicle for customer "Chibuzor Opara"
INSERT INTO public.vehicles (
  id,
  customer_id,
  make,
  model,
  year,
  vehicle_type,
  source,
  auction_source,
  lot_number
) VALUES (
  gen_random_uuid(),
  'ff0c5413-6e8a-4446-b55b-c9a1a78e81e0',
  'Toyota',
  'Camry',
  2022,
  'car',
  'auction',
  'copart',
  'LOT-12345'
);

-- Get the vehicle ID we just created and insert a VIN record
INSERT INTO public.vin_records (
  id,
  vin,
  vehicle_id,
  customer_id,
  current_status,
  is_active
)
SELECT 
  gen_random_uuid(),
  '1HGBH41JXMN109186',
  v.id,
  v.customer_id,
  'pending',
  true
FROM vehicles v 
WHERE v.customer_id = 'ff0c5413-6e8a-4446-b55b-c9a1a78e81e0'
AND v.lot_number = 'LOT-12345'
LIMIT 1;