
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../utils/productData';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const products = getProducts();
  const featuredProducts = products.filter(p => p.tag === 'Featured').slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-300 text-lg">Hand-picked items just for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
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
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-black hover:bg-yellow-600">
                    {product.tag}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-yellow-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-300 mb-3 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-400">${product.price}</span>
                    <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                      View Details
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
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black"
            onClick={() => navigate('/products?tag=Featured')}
          >
            View All Featured
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
