
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url: string;
  category: string;
  main_tag?: string;
  promo_tag?: string;
  in_stock: boolean;
  stock_quantity: number;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'New':
        return 'bg-green-500 hover:bg-green-600';
      case 'Featured':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Hot':
        return 'bg-red-500 hover:bg-red-600';
      case 'Top Pick':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToCart(product.id);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 h-full flex flex-col"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 sm:h-56 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
            onClick={() => navigate(`/product/${product.id}`)}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.main_tag && (
              <Badge className={`${getTagColor(product.main_tag)} text-white text-xs`}>
                {product.main_tag}
              </Badge>
            )}
            {product.promo_tag && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">
                {product.promo_tag}
              </Badge>
            )}
          </div>
          <div className="absolute top-2 left-2">
            <Button
              size="icon"
              variant="ghost"
              className={`bg-white/80 hover:bg-white h-8 w-8 ${isWishlisted ? 'text-red-500' : 'text-gray-600'}`}
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </Button>
          </div>
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            <Badge variant={product.in_stock ? "outline" : "destructive"} className="text-xs">
              {product.in_stock ? `${product.stock_quantity} in stock` : "Out of Stock"}
            </Badge>
          </div>
          
          <h3 
            className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 cursor-pointer hover:text-primary flex-grow"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{product.description}</p>
          )}
          
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg sm:text-xl font-bold text-primary">${product.price}</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/product/${product.id}`)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                className="bg-primary hover:bg-primary/90 w-full sm:w-auto text-xs sm:text-sm"
              >
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
