
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { getProducts, Product } from '../utils/productData';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]); // Increased max range
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log('Products page: Starting to fetch products...');
      setLoading(true);
      try {
        const fetchedProducts = await getProducts();
        console.log('Products page: Fetched products:', fetchedProducts.length);
        console.log('Products data:', fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Force refresh when user navigates back to the page
  useEffect(() => {
    const handleFocus = () => {
      console.log('Page focused, refreshing products...');
      const fetchProducts = async () => {
        try {
          const fetchedProducts = await getProducts();
          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Error refreshing products:', error);
        }
      };
      fetchProducts();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    const searchQuery = searchParams.get('search');
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    const category = searchParams.get('category');
    if (category && category.trim()) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Tag filter
    const tag = searchParams.get('tag');
    if (tag && tag.trim()) {
      filtered = filtered.filter(product => 
        product.main_tag && product.main_tag.toLowerCase() === tag.toLowerCase()
      );
    }

    // Price filter - only apply if products have valid prices
    filtered = filtered.filter(product => {
      const price = Number(product.price);
      return !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
    });

    console.log('Filtered products:', filtered.length, 'from total:', products.length);
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
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            {products.length > 0 && ` (${products.length} total products in database)`}
          </p>
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
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Total products in database: {products.length}
                </p>
                {products.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    No products found in database. Please check your Supabase connection.
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
