
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
    console.log('Fetching all products from Supabase...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    console.log('Raw products data from Supabase:', data);
    console.log('Total products fetched:', data?.length || 0);

    if (!data || data.length === 0) {
      console.warn('No products found in database');
      return [];
    }

    const processedProducts = data.map(product => {
      console.log('Processing product:', product.name, 'ID:', product.id, 'Price:', product.price);
      
      // Ensure price is a valid number
      const price = typeof product.price === 'string' ? 
        parseFloat(product.price) : 
        Number(product.price);
      
      if (isNaN(price)) {
        console.warn(`Invalid price for product ${product.name}:`, product.price);
      }

      return {
        id: String(product.id),
        name: product.name || 'Unnamed Product',
        description: product.description || '',
        price: isNaN(price) ? 0 : price,
        image_url: product.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop',
        category: product.category || 'Uncategorized',
        main_tag: product.main_tag || undefined,
        promo_tag: product.promo_tag || undefined,
        in_stock: Boolean(product.stock_quantity > 0),
        stock_quantity: Number(product.stock_quantity) || 0
      };
    });

    console.log('Processed products:', processedProducts.length, 'products');
    console.log('Sample processed product:', processedProducts[0]);
    return processedProducts;
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log('Fetching product with ID:', id);
    
    // Try to fetch the product with the ID as-is first
    let { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    // If that fails and the ID looks like a number, try converting it
    if (error && /invalid input syntax for type uuid/.test(error.message)) {
      console.log('UUID format failed, trying with string ID conversion');
      const result = await supabase
        .from('products')
        .select('*')
        .eq('id', id.toString())
        .maybeSingle();
      
      data = result.data;
      error = result.error;
    }

    if (error || !data) {
      console.error('Error fetching product:', error);
      return null;
    }

    return {
      id: data.id.toString(),
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
