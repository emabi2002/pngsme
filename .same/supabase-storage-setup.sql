-- Supabase Storage Setup for PNG SME Marketplace
-- Run this in Supabase SQL Editor after running the main schema

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('business-logos', 'business-logos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']),
  ('business-covers', 'business-covers', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for product-images bucket
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Set up storage policies for business-logos bucket
CREATE POLICY "Anyone can view business logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-logos');

CREATE POLICY "Authenticated users can upload business logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-logos'
  AND auth.role() = 'authenticated'
);

-- Set up storage policies for business-covers bucket
CREATE POLICY "Anyone can view business covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-covers');

CREATE POLICY "Authenticated users can upload business covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-covers'
  AND auth.role() = 'authenticated'
);

-- Function to increment product view count
CREATE OR REPLACE FUNCTION increment_product_view(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_product_view TO authenticated;
GRANT EXECUTE ON FUNCTION increment_product_view TO anon;

COMMENT ON FUNCTION increment_product_view IS 'Increments the view count for a product';
