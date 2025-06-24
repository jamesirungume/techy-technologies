
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface ProductFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ priceRange, setPriceRange }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categories = ['Phones', 'PCs', 'Laptops', 'Accessories'];
  const tags = ['New', 'Featured', 'Hot', 'Top Pick'];

  const currentCategory = searchParams.get('category');
  const currentTag = searchParams.get('tag');

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (currentCategory === category) {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    navigate(`/products?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    if (currentTag === tag) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    navigate(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    navigate('/products');
    setPriceRange([0, 5000]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={currentCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge
                  key={tag}
                  variant={currentTag === tag ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={(values) => setPriceRange(values as [number, number])}
                max={5000}
                min={0}
                step={50}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="w-full text-sm text-primary hover:underline"
          >
            Clear All Filters
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;
