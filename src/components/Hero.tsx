
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to <span className="text-yellow-400">Techy</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your Ultimate Destination for Premium Tech Devices
            </p>
          </div>
          
          <div className="animate-scale-in">
            <div className="bg-red-500 text-white px-8 py-4 rounded-full inline-block mb-8 animate-pulse">
              <span className="text-2xl font-bold">🔥 50% OFF</span>
              <span className="ml-2">on Selected Items!</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
              onClick={() => navigate('/products')}
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
              onClick={() => navigate('/products?tag=Featured')}
            >
              View Featured
            </Button>
          </div>
        </div>
      </div>
      
      {/* Floating Animation Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-green-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
    </section>
  );
};

export default Hero;
