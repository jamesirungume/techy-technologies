
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
import ContactBar from '@/components/ContactBar';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Package, DollarSign, Tag, Image, Trash2 } from 'lucide-react';

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

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(error.message || 'Failed to add product');
      }

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

      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw error;
      }

      toast.success('Product deleted successfully!');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <ContactBar />
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
          <p className="text-gray-600">Manage your products and inventory</p>
        </div>
        
        {!user && (
          <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Authentication Optional</h3>
                <p className="text-blue-700">
                  You can add products without signing in, but signing in will associate products with your account.
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/auth'} className="mt-4 bg-white hover:bg-blue-50 border-blue-200">
              Sign In
            </Button>
          </div>
        )}
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="xl:col-span-2">
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Package className="h-6 w-6" />
                  <span>Add New Product</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Product Name *
                      </Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        className="h-12"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 block">
                        Price *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          className="h-12 pl-10"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      className="min-h-[100px] resize-none"
                      placeholder="Describe your product..."
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Product Image
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                      <div className="text-center">
                        <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <div className="flex flex-col items-center space-y-2">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <div className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors">
                              <Upload className="h-4 w-4" />
                              <span>{imageUploading ? 'Uploading...' : 'Upload Image'}</span>
                            </div>
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              disabled={imageUploading}
                            />
                          </label>
                          <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Input
                        placeholder="Or enter image URL"
                        value={productForm.image_url}
                        onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                        className="h-12"
                      />
                    </div>
                    
                    {productForm.image_url && (
                      <div className="mt-4 flex justify-center">
                        <img 
                          src={productForm.image_url} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-lg shadow-md border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-2 block">
                        Category *
                      </Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) => setProductForm({...productForm, category: value})}
                        required
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Phones">📱 Phones</SelectItem>
                          <SelectItem value="PCs">🖥️ PCs</SelectItem>
                          <SelectItem value="Laptops">💻 Laptops</SelectItem>
                          <SelectItem value="Accessories">🔌 Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="stock_quantity" className="text-sm font-medium text-gray-700 mb-2 block">
                        Stock Quantity *
                      </Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        min="0"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                        className="h-12"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="main_tag" className="text-sm font-medium text-gray-700 mb-2 block">
                        Main Tag
                      </Label>
                      <Select
                        value={productForm.main_tag}
                        onValueChange={(value) => setProductForm({...productForm, main_tag: value === 'none' ? '' : value})}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select main tag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="New">🆕 New</SelectItem>
                          <SelectItem value="Featured">⭐ Featured</SelectItem>
                          <SelectItem value="Hot">🔥 Hot</SelectItem>
                          <SelectItem value="Top Pick">🎯 Top Pick</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="promo_tag" className="text-sm font-medium text-gray-700 mb-2 block">
                        Promo Tag
                      </Label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="promo_tag"
                          value={productForm.promo_tag}
                          onChange={(e) => setProductForm({...productForm, promo_tag: e.target.value})}
                          className="h-12 pl-10"
                          placeholder="e.g., 50% OFF"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading || imageUploading} 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg"
                  >
                    {loading ? 'Adding Product...' : 'Add Product'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Products List */}
          <div>
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-xl">
                  <div className="flex items-center space-x-2">
                    <Package className="h-6 w-6" />
                    <span>Products ({products.length})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-[800px] overflow-y-auto">
                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No products added yet</p>
                      <p className="text-gray-400 text-sm">Start by adding your first product</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start space-x-4">
                          <img
                            src={product.image_url || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="font-bold text-green-600">${product.price}</p>
                              <div className="flex items-center space-x-2">
                                {product.main_tag && (
                                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {product.main_tag}
                                  </span>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Stock: {product.stock_quantity} • {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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

export default AdminDashboard;
