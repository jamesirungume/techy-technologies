
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PromotionalBanners = () => {
  const navigate = useNavigate();

  const banners = [
    {
      title: "iPhone 10% OFF",
      description: "Get amazing deals on the latest iPhones",
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop",
      bgColor: "bg-gradient-to-r from-blue-500 to-purple-600",
      onClick: () => navigate('/products?search=iPhone')
    },
    {
      title: "Samsung Deals",
      description: "Exclusive offers on Samsung devices",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop",
      bgColor: "bg-gradient-to-r from-green-500 to-blue-500",
      onClick: () => navigate('/products?search=Samsung')
    },
    {
      title: "Laptop Sale",
      description: "Up to 25% off on premium laptops",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
      bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
      onClick: () => navigate('/products?category=Laptops')
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Special Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`${banner.bgColor} rounded-lg p-6 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg`}
              onClick={banner.onClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                  <p className="text-white/90 mb-4">{banner.description}</p>
                  <Button variant="secondary" size="sm">
                    Shop Now
                  </Button>
                </div>
                <div className="w-20 h-20 ml-4">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
