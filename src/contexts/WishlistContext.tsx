import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { getProductById } from '@/utils/productData';

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    category: string;
  };
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [localWishlist, setLocalWishlist] = useState<string[]>([]);
  const { user } = useAuth();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('techy-wishlist');
    if (savedWishlist) {
      try {
        setLocalWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        setLocalWishlist([]);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('techy-wishlist', JSON.stringify(localWishlist));
  }, [localWishlist]);

  const fetchWishlistItems = async () => {
    if (!user) {
      // Convert local wishlist to items format
      if (localWishlist.length === 0) {
        setItems([]);
        return;
      }

      setLoading(true);
      try {
        const wishlistItems: WishlistItem[] = [];
        
        for (const productId of localWishlist) {
          const product = await getProductById(productId);
          if (product) {
            wishlistItems.push({
              id: `local-${product.id}`,
              product_id: product.id,
              product: {
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                category: product.category
              }
            });
          }
        }

        setItems(wishlistItems);
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
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Transform the data to include product information
      const wishlistItems: WishlistItem[] = [];
      for (const item of data || []) {
        const product = await getProductById(item.product_id);
        if (product) {
          wishlistItems.push({
            id: item.id,
            product_id: item.product_id,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              category: product.category
            }
          });
        }
      }
      
      setItems(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [user, localWishlist]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      // Add to local wishlist
      if (!localWishlist.includes(productId)) {
        setLocalWishlist(prev => [...prev, productId]);
        toast.success('Added to wishlist!');
      }
      return;
    }

    // Check if already in wishlist
    if (items.some(item => item.product_id === productId)) {
      toast.info('Already in wishlist');
      return;
    }

    // Optimistic update - add to UI immediately
    const product = await getProductById(productId);
    if (product) {
      const newItem: WishlistItem = {
        id: `temp-${Date.now()}`,
        product_id: productId,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          category: product.category
        }
      };
      setItems(prev => [...prev, newItem]);
      toast.success('Added to wishlist!');
    }

    try {
      const { data: insertedItem, error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId,
        })
        .select()
        .single();

      if (error && error.code !== '23505') {
        // Revert optimistic update if error (except duplicate key)
        setItems(prev => prev.filter(item => !item.id.startsWith('temp-')));
        toast.error('Failed to add to wishlist');
        throw error;
      }

      // Update with real ID
      if (insertedItem && product) {
        setItems(prev => prev.map(item => 
          item.id.startsWith('temp-') && item.product_id === productId
            ? { ...item, id: insertedItem.id }
            : item
        ));
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      setLocalWishlist(prev => prev.filter(id => id !== productId));
      toast.success('Removed from wishlist');
      return;
    }

    // Optimistic update - remove from UI immediately
    const oldItems = items;
    setItems(prev => prev.filter(item => item.product_id !== productId));
    toast.success('Removed from wishlist');

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        // Revert optimistic update
        setItems(oldItems);
        toast.error('Failed to remove from wishlist');
        throw error;
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  const value = {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
