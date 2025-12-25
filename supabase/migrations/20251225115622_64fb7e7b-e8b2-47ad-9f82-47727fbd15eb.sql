-- Insert a test auction vehicle with remarks and sample images
INSERT INTO public.auction_vehicles (
  make,
  model,
  year,
  vehicle_type,
  auction_source,
  lot_number,
  auction_date,
  yard_location,
  remarks,
  vehicle_images,
  status
) VALUES (
  'Ford',
  'Mustang GT',
  2021,
  'car',
  'copart',
  'LOT-98765',
  '2025-01-15',
  'Houston, TX',
  'Clean title vehicle with minor front-end damage. Engine runs great, all electronics functional. Great candidate for repair or parts. Original paint, no rust. Low mileage - only 32,000 miles.',
  ARRAY[
    'https://images.unsplash.com/photo-1584345604476-8ec5f82d4e96?w=800',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800'
  ],
  'active'
);