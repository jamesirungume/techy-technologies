
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PopularDevices from '../components/PopularDevices';
import CategoryShowcase from '../components/CategoryShowcase';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <PopularDevices />
      <CategoryShowcase />
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default Index;
