
import React from 'react';
import { Smartphone } from 'lucide-react';

interface TechyLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TechyLogo: React.FC<TechyLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <Smartphone className="h-8 w-8 text-primary" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
      </div>
      <span className={`font-bold text-primary ${sizeClasses[size]}`}>
        Techy
      </span>
    </div>
  );
};

export default TechyLogo;
