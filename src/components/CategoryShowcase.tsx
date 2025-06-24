
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const CategoryShowcase = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Phones',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=300&fit=crop',
      description: 'Latest smartphones and mobile devices',
      color: 'from-blue-500 to-purple-600'
    },
    {
      name: 'Laptops',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=300&fit=crop',
      description: 'High-performance laptops for work and gaming',
      color: 'from-green-500 to-teal-600'
    },
    {
      name: 'PCs',
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&h=300&fit=crop',
      description: 'Custom builds and pre-built desktop computers',
      color: 'from-orange-500 to-red-600'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=300&fit=crop',
      description: 'Headphones, chargers, cables, and more',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card
              key={category.name}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              onClick={() => navigate(`/products?category=${category.name}`)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white font-bold text-lg">Shop Now</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
