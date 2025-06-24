
import React from 'react';
import { Headphones, Truck, Shield, CreditCard } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: <Headphones className="h-8 w-8 text-primary" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Pay on Delivery",
      description: "Cash on delivery available"
    },
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Fast Delivery",
      description: "Quick shipping nationwide"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Guaranteed Quality",
      description: "100% authentic products"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                {badge.icon}
              </div>
              <h3 className="font-semibold text-lg mb-1">{badge.title}</h3>
              <p className="text-gray-600 text-sm">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
