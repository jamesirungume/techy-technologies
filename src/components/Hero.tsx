
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6">
              Welcome to <span className="text-yellow-400">Techy</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 md:mb-8 opacity-90 px-2">
              Your Ultimate Destination for Premium Tech Devices
            </p>
          </div>
          
          <div className="animate-scale-in mb-6 md:mb-8">
            <div className="bg-red-500 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full inline-block animate-pulse">
              <span className="text-lg sm:text-xl md:text-2xl font-bold">🔥 50% OFF</span>
              <span className="ml-2 text-sm sm:text-base md:text-lg">on Selected Items!</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto"
              onClick={() => navigate('/products')}
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto"
              onClick={() => navigate('/products?tag=Featured')}
            >
              View Featured
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating Animation Elements - Hidden on mobile for cleaner look */}
      <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce"></div>
      <div className="hidden md:block absolute bottom-20 right-10 w-16 h-16 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="hidden md:block absolute top-1/2 left-1/4 w-12 h-12 bg-green-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
    </section>
  );
};

export default Hero;
