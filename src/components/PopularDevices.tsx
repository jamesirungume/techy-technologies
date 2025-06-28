import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProducts, Product } from '../utils/productData';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';

const PopularDevices = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      console.log('PopularDevices: Fetching products...');
      const fetchedProducts = await getProducts();
      console.log('PopularDevices: All products:', fetchedProducts.length);
      const popularProducts = fetchedProducts.filter(p => p.main_tag === 'Hot' || p.main_tag === 'Featured').slice(0, 6);
      console.log('PopularDevices: Popular products found:', popularProducts.length);
      setProducts(popularProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (processingItems.has(`cart-${productId}`)) return;
    
    setProcessingItems(prev => new Set(prev).add(`cart-${productId}`));
    try {
      await addToCart(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(`cart-${productId}`);
        return newSet;
      });
    }
  };

  const handleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (processingItems.has(`wishlist-${productId}`)) return;
    
    setProcessingItems(prev => new Set(prev).add(`wishlist-${productId}`));
    const inWishlist = isInWishlist(productId);
    
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(`wishlist-${productId}`);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Popular Devices</h2>
            <p className="text-gray-600 text-lg">Loading popular products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in">Popular Devices</h2>
          <p className="text-gray-600 text-lg">Discover our most sought-after tech products</p>
          {products.length === 0 && (
            <p className="text-red-500 text-sm mt-2">
              No popular products found. Make sure to add products with "Hot" or "Featured" tags.
            </p>
          )}
        </div>

        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">
                        {product.main_tag}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`bg-white/80 hover:bg-white h-8 w-8 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'}`}
                        onClick={(e) => handleWishlist(product.id, e)}
                        disabled={processingItems.has(`wishlist-${product.id}`)}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 
                      className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-3 text-sm">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-primary">${product.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${product.id}`);
                        }}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => handleAddToCart(product.id, e)}
                        className="bg-primary hover:bg-primary/90"
                        disabled={!product.in_stock || processingItems.has(`cart-${product.id}`)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {processingItems.has(`cart-${product.id}`) ? 'Adding...' : (product.in_stock ? 'Add to Cart' : 'Out of Stock')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => navigate('/products')}
            className="hover-scale"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularDevices;
