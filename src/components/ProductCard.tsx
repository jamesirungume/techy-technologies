
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Product } from '../utils/productData';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const navigate = useNavigate();

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

  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-in"
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <Badge className={`absolute top-2 right-2 ${getTagColor(product.tag)}`}>
            {product.tag}
          </Badge>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">${product.price}</span>
            <Button 
              size="sm" 
              className="hover-scale"
              disabled={!product.inStock}
            >
              {product.inStock ? 'View Details' : 'Unavailable'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
