
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Phones' | 'PCs' | 'Laptops' | 'Accessories';
  tag: 'New' | 'Featured' | 'Hot' | 'Top Pick';
  inStock: boolean;
}

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    description: 'Latest Apple iPhone with A17 Pro chip and titanium design',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop',
    category: 'Phones',
    tag: 'Featured',
    inStock: true
  },
  {
    id: '2',
    name: 'MacBook Pro M3',
    description: 'Powerful laptop for professionals with M3 chip',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
    category: 'Laptops',
    tag: 'Hot',
    inStock: true
  },
  {
    id: '3',
    name: 'Gaming PC RTX 4080',
    description: 'High-end gaming desktop with RTX 4080 graphics card',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&h=400&fit=crop',
    category: 'PCs',
    tag: 'Top Pick',
    inStock: true
  },
  {
    id: '4',
    name: 'AirPods Pro 2',
    description: 'Premium wireless earbuds with active noise cancellation',
    price: 249,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=400&fit=crop',
    category: 'Accessories',
    tag: 'Featured',
    inStock: true
  },
  {
    id: '5',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Android flagship with S Pen and 200MP camera',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop',
    category: 'Phones',
    tag: 'New',
    inStock: true
  },
  {
    id: '6',
    name: 'Dell XPS 13',
    description: 'Ultra-portable laptop with stunning display',
    price: 999,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=400&fit=crop',
    category: 'Laptops',
    tag: 'Featured',
    inStock: true
  },
  {
    id: '7',
    name: 'USB-C Fast Charger',
    description: '65W fast charging adapter for laptops and phones',
    price: 49,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=400&fit=crop',
    category: 'Accessories',
    tag: 'Hot',
    inStock: true
  },
  {
    id: '8',
    name: 'Workstation PC i9',
    description: 'Professional workstation for content creators',
    price: 3299,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&h=400&fit=crop',
    category: 'PCs',
    tag: 'New',
    inStock: true
  }
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem('techy-products');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultProducts;
    }
  }
  return defaultProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem('techy-products', JSON.stringify(products));
};

export const addProduct = (product: Omit<Product, 'id'>) => {
  const products = getProducts();
  const newProduct = {
    ...product,
    id: Date.now().toString()
  };
  const updatedProducts = [...products, newProduct];
  saveProducts(updatedProducts);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>) => {
  const products = getProducts();
  const updatedProducts = products.map(p => 
    p.id === id ? { ...p, ...updates } : p
  );
  saveProducts(updatedProducts);
  return updatedProducts.find(p => p.id === id);
};

export const deleteProduct = (id: string) => {
  const products = getProducts();
  const updatedProducts = products.filter(p => p.id !== id);
  saveProducts(updatedProducts);
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};
