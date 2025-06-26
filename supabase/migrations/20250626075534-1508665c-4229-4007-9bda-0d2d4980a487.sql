
-- Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- Create policy to allow anyone to view product images
CREATE POLICY "Anyone can view product images" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Create policy to allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'products');

-- Create policy to allow users to update their own uploaded images
CREATE POLICY "Users can update product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'products');

-- Create policy to allow users to delete their own uploaded images
CREATE POLICY "Users can delete product images" ON storage.objects
FOR DELETE USING (bucket_id = 'products');
