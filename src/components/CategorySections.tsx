
import React, { useEffect, useState } from 'react';
import { getProducts, Product } from '../utils/productData';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CategorySection: React.FC<{ category: string; title: string }> = ({ category, title }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log(`CategorySection (${category}): Fetching products...`);
        const fetchedProducts = await getProducts();
        console.log(`CategorySection (${category}): All products:`, fetchedProducts.length);
        const categoryProducts = fetchedProducts.filter(product => product.category === category).slice(0, 4);
        console.log(`CategorySection (${category}): Category products found:`, categoryProducts.length);
        setProducts(categoryProducts);
      } catch (error) {
        console.error(`Error fetching ${category} products:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Button 
            variant="outline"
            onClick={() => navigate(`/products?category=${category}`)}
          >
            View All {category}
          </Button>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No {category.toLowerCase()} products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const CategorySections = () => {
  return (
    <>
      <CategorySection category="Phones" title="Latest Phones" />
      <CategorySection category="Laptops" title="Premium Laptops" />
    </>
  );
};

export default CategorySections;
