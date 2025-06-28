
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { getProducts, Product } from '../utils/productData';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    console.log('Products page: Starting to fetch products...');
    setLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getProducts();
      console.log('Products page: Successfully fetched products:', fetchedProducts.length);
      setProducts(fetchedProducts);
      
      if (fetchedProducts.length === 0) {
        setError('No products found in the database');
      }
    } catch (error) {
      console.error('Products page: Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Force refresh when user navigates back to the page
  useEffect(() => {
    const handleFocus = () => {
      console.log('Page focused, refreshing products...');
      fetchProducts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const filteredProducts = useMemo(() => {
    if (products.length === 0) return [];
    
    let filtered = [...products];
    console.log('Starting filtration with products:', filtered.length);

    // Search filter
    const searchQuery = searchParams.get('search');
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      console.log('After search filter:', filtered.length);
    }

    // Category filter
    const category = searchParams.get('category');
    if (category && category.trim()) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
      console.log('After category filter:', filtered.length);
    }

    // Tag filter
    const tag = searchParams.get('tag');
    if (tag && tag.trim()) {
      filtered = filtered.filter(product => 
        product.main_tag && product.main_tag.toLowerCase() === tag.toLowerCase()
      );
      console.log('After tag filter:', filtered.length);
    }

    // Price filter
    filtered = filtered.filter(product => {
      const price = Number(product.price);
      const inRange = !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
      return inRange;
    });
    console.log('After price filter:', filtered.length);

    console.log('Final filtered products:', filtered.length);
    return filtered;
  }, [products, searchParams, priceRange]);

  const currentCategory = searchParams.get('category');
  const currentTag = searchParams.get('tag');
  const searchQuery = searchParams.get('search');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-lg">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-lg text-red-500">{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {currentCategory ? `${currentCategory}` : 
             currentTag ? `${currentTag} Products` :
             searchQuery ? `Search Results for "${searchQuery}"` :
             'All Products'}
          </h1>
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {products.length > 0 && (
            <p className="text-sm text-gray-500">
              Total products in database: {products.length}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <ProductFilters 
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {products.length === 0 
                    ? 'No products available in the database.' 
                    : 'No products found matching your criteria.'
                  }
                </p>
                {products.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Please check your Supabase connection and ensure products are added to the database.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
