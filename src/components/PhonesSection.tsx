
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

const PhonesSection = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts();
      const phoneProducts = fetchedProducts.filter(p => p.category === 'Phones').slice(0, 6);
      setProducts(phoneProducts);
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Latest Smartphones</h2>
            <p className="text-gray-600 text-lg">Loading smartphones...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Latest Smartphones</h2>
          <p className="text-gray-600 text-lg">Discover the newest mobile technology</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    {product.main_tag && (
                      <Badge className="bg-blue-500 text-white">
                        {product.main_tag}
                      </Badge>
                    )}
                    {product.promo_tag && (
                      <Badge className="bg-orange-500 text-white">
                        {product.promo_tag}
                      </Badge>
                    )}
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
                    className="font-semibold text-lg mb-2 text-gray-800 group-hover:text-primary transition-colors cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
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

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => navigate('/products?category=Phones')}
            className="bg-primary hover:bg-primary/90"
          >
            View All Phones
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PhonesSection;
