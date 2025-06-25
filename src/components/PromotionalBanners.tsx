
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromotionalBanners = () => {
  const navigate = useNavigate();

  const banners = [
    {
      id: 1,
      title: "Discounted prices on Phones & Accessories",
      subtitle: "Up to 30% off on selected items",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=400&fit=crop",
      cta: "Shop Phones",
      link: "/products?category=Phones",
      gradient: "from-blue-600 to-purple-700"
    },
    {
      id: 2,
      title: "Gaming PCs & Laptops",
      subtitle: "High performance at unbeatable prices",
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&h=400&fit=crop",
      cta: "Shop Gaming",
      link: "/products?category=PCs",
      gradient: "from-red-600 to-orange-700"
    },
    {
      id: 3,
      title: "Latest MacBooks & Windows Laptops",
      subtitle: "Productivity redefined",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=400&fit=crop",
      cta: "Shop Laptops",
      link: "/products?category=Laptops",
      gradient: "from-green-600 to-teal-700"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Special Offers</h2>
          <p className="text-gray-600 text-lg">Don't miss out on these amazing deals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative overflow-hidden rounded-2xl shadow-2xl group cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => navigate(banner.link)}
            >
              <div className="relative h-80">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-75`}></div>
                
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                  <p className="text-lg mb-6 opacity-90">{banner.subtitle}</p>
                  <Button
                    variant="secondary"
                    className="bg-white text-gray-800 hover:bg-gray-100 group-hover:scale-110 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(banner.link);
                    }}
                  >
                    {banner.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
