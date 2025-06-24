
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PromotionalBanners from '../components/PromotionalBanners';
import TrustBadges from '../components/TrustBadges';
import PopularDevices from '../components/PopularDevices';
import PhonesSection from '../components/PhonesSection';
import CategoryShowcase from '../components/CategoryShowcase';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <PromotionalBanners />
      <TrustBadges />
      <PopularDevices />
      <PhonesSection />
      <CategoryShowcase />  
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default Index;
