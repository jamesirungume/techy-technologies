import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  main_tag?: string;
  promo_tag?: string;
  in_stock: boolean;
  stock_quantity: number;
  seller_id?: string | null;
}

// Fetch all products
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

// Fetch one product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
};

// Add a new product
export const addProduct = async (productData: Omit<Product, 'id' | 'in_stock'>): Promise<Product> => {
  const newProduct = {
    ...productData,
    in_stock: productData.stock_quantity > 0,
  };

  const { data, error } = await supabase
    .from('products')
    .insert([newProduct])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Update an existing product
export const updateProduct = async (
  id: string,
  productData: Partial<Omit<Product, 'id' | 'in_stock'>>
): Promise<Product | null> => {
  const updatedData = {
    ...productData,
    ...(productData.stock_quantity !== undefined && {
      in_stock: productData.stock_quantity > 0
    })
  };

  const { data, error } = await supabase
    .from('products')
    .update(updatedData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Delete a product
export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete product:', error);
    return false;
  }

  return true;
};
