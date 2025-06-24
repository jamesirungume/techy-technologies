
import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = ['Phones', 'PCs', 'Laptops', 'Accessories'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => navigate('/')} className="text-2xl font-bold text-primary">
              Techy
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigate('/')} className="text-gray-700 hover:text-primary transition-colors">
              Home
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => navigate(`/products?category=${category}`)}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="ml-2">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className="hidden md:flex"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <form onSubmit={handleSearch} className="flex mb-4">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" className="ml-2">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              <button
                onClick={() => { navigate('/'); setIsMenuOpen(false); }}
                className="text-left py-2 text-gray-700 hover:text-primary"
              >
                Home
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => { navigate(`/products?category=${category}`); setIsMenuOpen(false); }}
                  className="text-left py-2 text-gray-700 hover:text-primary"
                >
                  {category}
                </button>
              ))}
              <button
                onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                className="text-left py-2 text-gray-700 hover:text-primary"
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
