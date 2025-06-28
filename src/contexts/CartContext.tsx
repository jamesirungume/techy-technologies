import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { getProductById } from '@/utils/productData';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    stock_quantity: number;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [localCart, setLocalCart] = useState<{ [key: string]: number }>({});
  const { user } = useAuth();

  useEffect(() => {
    const savedCart = localStorage.getItem('techy-cart');
    if (savedCart) {
      try {
        setLocalCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setLocalCart({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('techy-cart', JSON.stringify(localCart));
  }, [localCart]);

  const fetchCartItems = async () => {
    if (!user) {
      const productIds = Object.keys(localCart);
      if (productIds.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const cartItems: CartItem[] = [];
        
        for (const productId of productIds) {
          const product = await getProductById(productId);
          if (product) {
            cartItems.push({
              id: `local-${product.id}`,
              product_id: product.id,
              quantity: localCart[product.id] || 1,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                stock_quantity: product.stock_quantity
              }
            });
          }
        }

        setItems(cartItems);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const cartItems: CartItem[] = [];
      for (const item of data || []) {
        const product = await getProductById(item.product_id);
        if (product) {
          cartItems.push({
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              stock_quantity: product.stock_quantity
            }
          });
        }
      }
      
      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user, localCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    console.log('Adding to cart:', productId, quantity, 'User:', user?.id);
    
    if (!user) {
      setLocalCart(prev => {
        const newCart = {
          ...prev,
          [productId]: (prev[productId] || 0) + quantity
        };
        console.log('Updated local cart:', newCart);
        return newCart;
      });
      toast.success('Added to cart!');
      return;
    }

    toast.success('Adding to cart...');

    try {
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing cart item:', fetchError);
        throw fetchError;
      }

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        setItems(prev => prev.map(item => 
          item.product_id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        ));

        const { error } = await supabase
          .from('cart')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id);

        if (error) {
          console.error('Error updating cart item:', error);
          setItems(prev => prev.map(item => 
            item.product_id === productId 
              ? { ...item, quantity: existingItem.quantity }
              : item
          ));
          throw error;
        }
      } else {
        const product = await getProductById(productId);
        if (product) {
          const newItem: CartItem = {
            id: `temp-${Date.now()}`,
            product_id: productId,
            quantity,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              stock_quantity: product.stock_quantity
            }
          };
          setItems(prev => [...prev, newItem]);
        }

        const { data: insertedItem, error } = await supabase
          .from('cart')
          .insert([{
            user_id: user.id,
            product_id: productId,
            quantity,
          }])
          .select()
          .single();

        if (error) {
          console.error('Error inserting cart item:', error);
          setItems(prev => prev.filter(item => !item.id.startsWith('temp-')));
          throw error;
        }

        if (insertedItem && product) {
          setItems(prev => prev.map(item => 
            item.id.startsWith('temp-') && item.product_id === productId
              ? { ...item, id: insertedItem.id }
              : item
          ));
        }
      }

      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) {
      if (quantity <= 0) {
        const newCart = { ...localCart };
        delete newCart[productId];
        setLocalCart(newCart);
      } else {
        setLocalCart(prev => ({
          ...prev,
          [productId]: quantity
        }));
      }
      return;
    }

    const oldItems = items;
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.product_id !== productId));
    } else {
      setItems(prev => prev.map(item => 
        item.product_id === productId ? { ...item, quantity } : item
      ));
    }

    try {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      setItems(oldItems);
      toast.error('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) {
      const newCart = { ...localCart };
      delete newCart[productId];
      setLocalCart(newCart);
      toast.success('Item removed from cart');
      return;
    }

    const oldItems = items;
    setItems(prev => prev.filter(item => item.product_id !== productId));
    toast.success('Item removed from cart');

    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        setItems(oldItems);
        toast.error('Failed to remove item');
        throw error;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    if (!user) {
      setLocalCart({});
      return;
    }

    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
