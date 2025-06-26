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
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (data || []).map(product => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: parseFloat(product.price.toString()),
      image_url: product.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop',
      category: product.category,
      main_tag: product.main_tag || undefined,
      promo_tag: product.promo_tag || undefined,
      in_stock: product.stock_quantity > 0,
      stock_quantity: product.stock_quantity
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching product:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: parseFloat(data.price.toString()),
      image_url: data.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop',
      category: data.category,
      main_tag: data.main_tag || undefined,
      promo_tag: data.promo_tag || undefined,
      in_stock: data.stock_quantity > 0,
      stock_quantity: data.stock_quantity
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: productData.image_url,
        category: productData.category,
        main_tag: productData.main_tag,
        promo_tag: productData.promo_tag,
        stock_quantity: productData.stock_quantity
      }])
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: parseFloat(data.price.toString()),
      image_url: data.image_url || '',
      category: data.category,
      main_tag: data.main_tag || undefined,
      promo_tag: data.promo_tag || undefined,
      in_stock: data.stock_quantity > 0,
      stock_quantity: data.stock_quantity
    };
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

export const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id'>>): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: parseFloat(data.price.toString()),
      image_url: data.image_url || '',
      category: data.category,
      main_tag: data.main_tag || undefined,
      promo_tag: data.promo_tag || undefined,
      in_stock: data.stock_quantity > 0,
      stock_quantity: data.stock_quantity
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    return !error;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
