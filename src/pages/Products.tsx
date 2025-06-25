import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { getProducts, Product } from '../utils/productData'; // ✅ make sure Product interface is exported

const Products = () => {
  const [searchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [products, setProducts] = useState<Product[]>([]); // ✅ init empty
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getProducts();
      setProducts(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const category = searchParams.get('category');
    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    const tag = searchParams.get('tag');
    if (tag) {
      filtered = filtered.filter(product => product.main_tag === tag);
    }

    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    return filtered;
  }, [products, searchParams, priceRange]);

  const currentCategory = searchParams.get('category');
  const currentTag = searchParams.get('tag');
  const searchQuery = searchParams.get('search');

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
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
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
