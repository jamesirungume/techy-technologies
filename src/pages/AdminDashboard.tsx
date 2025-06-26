
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Upload } from 'lucide-react';

const AdminDashboard = () => {
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    main_tag: '',
    promo_tag: '',
    stock_quantity: ''
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setProductForm(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.stock_quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: productForm.name.trim(),
        description: productForm.description.trim() || null,
        price: parseFloat(productForm.price),
        image_url: productForm.image_url.trim() || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop',
        category: productForm.category,
        main_tag: productForm.main_tag || null,
        promo_tag: productForm.promo_tag.trim() || null,
        stock_quantity: parseInt(productForm.stock_quantity),
        seller_id: user?.id || null
      };

      console.log('Submitting product data:', productData);

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(error.message || 'Failed to add product');
      }

      console.log('Product added successfully:', data);
      toast.success('Product added successfully!');
      
      // Reset form
      setProductForm({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: '',
        main_tag: '',
        promo_tag: '',
        stock_quantity: ''
      });

      // Refresh the products list
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
        
        {!user && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              <strong>Note:</strong> You can add products without signing in, but signing in will associate products with your account.
              <Button variant="link" onClick={() => window.location.href = '/auth'} className="ml-2">
                Sign In
              </Button>
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Product Form */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Product Image</Label>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="flex-1"
                        disabled={imageUploading}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        disabled={imageUploading}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        {imageUploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                    <Input
                      placeholder="Or enter image URL"
                      value={productForm.image_url}
                      onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                    />
                    {productForm.image_url && (
                      <img 
                        src={productForm.image_url} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) => setProductForm({...productForm, category: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Phones">Phones</SelectItem>
                        <SelectItem value="PCs">PCs</SelectItem>
                        <SelectItem value="Laptops">Laptops</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      min="0"
                      value={productForm.stock_quantity}
                      onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="main_tag">Main Tag</Label>
                    <Select
                      value={productForm.main_tag}
                      onValueChange={(value) => setProductForm({...productForm, main_tag: value === 'none' ? '' : value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select main tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Featured">Featured</SelectItem>
                        <SelectItem value="Hot">Hot</SelectItem>
                        <SelectItem value="Top Pick">Top Pick</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promo_tag">Promo Tag</Label>
                    <Input
                      id="promo_tag"
                      value={productForm.promo_tag}
                      onChange={(e) => setProductForm({...productForm, promo_tag: e.target.value})}
                      placeholder="e.g., 50% OFF"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading || imageUploading} className="w-full">
                  {loading ? 'Adding Product...' : 'Add Product'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Recent Products ({products.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No products added yet</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={product.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop'}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="font-bold text-primary">${product.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
                        {product.main_tag && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {product.main_tag}
                          </span>
                        )}
                        <p className="text-xs text-gray-400">
                          {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
