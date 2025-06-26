
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import ContactBar from '../components/ContactBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProductById, Product } from '../utils/productData';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ContactBar />
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-lg">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <ContactBar />
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'New':
        return 'bg-green-500 hover:bg-green-600';
      case 'Featured':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Hot':
        return 'bg-red-500 hover:bg-red-600';
      case 'Top Pick':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ContactBar />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              {product.main_tag && (
                <Badge className={`absolute top-4 right-4 ${getTagColor(product.main_tag)} text-lg px-4 py-2`}>
                  {product.main_tag}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-primary">${product.price}</span>
                <Badge variant={product.in_stock ? "outline" : "destructive"}>
                  {product.in_stock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!product.in_stock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.in_stock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span>{product.category}</span>
                  </div>
                  {product.main_tag && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tag:</span>
                      <span>{product.main_tag}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability:</span>
                    <span className={product.in_stock ? "text-green-600" : "text-red-600"}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock Quantity:</span>
                    <span>{product.stock_quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product ID:</span>
                    <span className="font-mono text-xs">{product.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
