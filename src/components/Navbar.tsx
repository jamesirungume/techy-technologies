
import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import TechyLogo from './TechyLogo';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const cartItemCount = getTotalItems();
  const wishlistItemCount = wishlistItems.length;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* First Row - Main Navigation */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="cursor-pointer"
            onClick={() => navigate('/')}
          >
            <TechyLogo />
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="relative"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlistItemCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
            >
              Seller?
            </Button>
            
            {user ? (
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Second Row - Category Navigation */}
        <div className="hidden md:flex items-center justify-center space-x-6 py-3 border-t">
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
          >
            All Products
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/products?category=Phones')}
          >
            Phones
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/products?category=Laptops')}
          >
            Laptops
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/products?category=PCs')}
          >
            PCs
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate('/products?category=Accessories')}
          >
            Accessories
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {navigate('/products'); setIsMenuOpen(false);}}
              >
                All Products
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {navigate('/products?category=Phones'); setIsMenuOpen(false);}}
              >
                Phones
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {navigate('/products?category=Laptops'); setIsMenuOpen(false);}}
              >
                Laptops
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {navigate('/products?category=PCs'); setIsMenuOpen(false);}}
              >
                PCs
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {navigate('/products?category=Accessories'); setIsMenuOpen(false);}}
              >
                Accessories
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start relative"
                onClick={() => {navigate('/wishlist'); setIsMenuOpen(false);}}
              >
                <Heart className="h-5 w-5 mr-2" />
                Wishlist {wishlistItemCount > 0 && `(${wishlistItemCount})`}
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start relative"
                onClick={() => {navigate('/cart'); setIsMenuOpen(false);}}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Button>
              
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {navigate('/admin'); setIsMenuOpen(false);}}
              >
                Seller?
              </Button>
              
              {user ? (
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => {handleSignOut(); setIsMenuOpen(false);}}
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => {navigate('/auth'); setIsMenuOpen(false);}}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
