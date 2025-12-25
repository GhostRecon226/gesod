-- Add remarks column to auction_vehicles
ALTER TABLE public.auction_vehicles 
ADD COLUMN remarks TEXT;

-- Create storage bucket for auction vehicle images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('auction-images', 'auction-images', true);

-- Allow public read access to auction images
CREATE POLICY "Public can view auction images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'auction-images');

-- Allow authenticated admins to manage auction images
CREATE POLICY "Admins can upload auction images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'auction-images' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update auction images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'auction-images' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can delete auction images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'auction-images' AND EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));