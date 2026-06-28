
CREATE POLICY "public_read_product_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'product-images');
CREATE POLICY "public_read_shop_assets" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'shop-assets');

CREATE POLICY "auth_upload_product_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "auth_update_product_images" ON storage.objects FOR UPDATE
  TO authenticated USING (
    bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "auth_delete_product_images" ON storage.objects FOR DELETE
  TO authenticated USING (
    bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "auth_upload_shop_assets" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (
    bucket_id = 'shop-assets' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "auth_update_shop_assets" ON storage.objects FOR UPDATE
  TO authenticated USING (
    bucket_id = 'shop-assets' AND auth.uid()::text = (storage.foldername(name))[1]
  );
CREATE POLICY "auth_delete_shop_assets" ON storage.objects FOR DELETE
  TO authenticated USING (
    bucket_id = 'shop-assets' AND auth.uid()::text = (storage.foldername(name))[1]
  );
