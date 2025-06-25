// lib/api/getProducts.ts

import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  main_tag?: string | null;
  promo_tag?: string | null;
  in_stock: boolean;
  stock_quantity: number;
  created_at?: string;
  seller_id?: string | null;
}

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error.message);
    return [];
  }

  // ✅ Ensure data is always an array
  if (!Array.isArray(data)) {
    console.error('Supabase returned non-array data:', data);
    return [];
  }

  return data;
};

// Get single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product by ID:', error.message);
    return null;
  }

  return data;
};

// Add a product
export const addProduct = async (
  productData: Omit<Product, 'id' | 'created_at' | 'in_stock'>
): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .insert([{ ...productData, in_stock: productData.stock_quantity > 0 }])
    .select()
    .single();

  if (error) {
    console.error('Error adding product:', error.message);
    return null;
  }

  return data;
};

// Update a product
export const updateProduct = async (
  id: string,
  updates: Partial<Product>
): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error.message);
    return null;
  }

  return data;
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error.message);
    return false;
  }

  return true;
};
