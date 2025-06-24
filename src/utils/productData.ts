
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  main_tag?: string;
  promo_tag?: string;
  in_stock: boolean;
  stock_quantity: number;
}

export const getProducts = (): Product[] => {
  return [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      description: 'Latest Apple iPhone with A17 Pro chip and titanium design',
      price: 1199,
      image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop',
      category: 'Phones',
      main_tag: 'Featured',
      promo_tag: '10% OFF',
      in_stock: true,
      stock_quantity: 25
    },
    {
      id: '2',
      name: 'MacBook Pro M3',
      description: 'Powerful laptop for professionals with M3 chip',
      price: 1999,
      image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=400&fit=crop',
      category: 'Laptops',
      main_tag: 'Hot',
      promo_tag: '15% OFF',
      in_stock: true,
      stock_quantity: 15
    },
    {
      id: '3',
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Android flagship with S Pen and 200MP camera',
      price: 1199,
      image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop',
      category: 'Phones',
      main_tag: 'New',
      promo_tag: '20% OFF',
      in_stock: true,
      stock_quantity: 20
    },
    {
      id: '4',
      name: 'Gaming PC RTX 4080',
      description: 'High-end gaming desktop with RTX 4080 graphics card',
      price: 2499,
      image_url: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&h=400&fit=crop',
      category: 'PCs',
      main_tag: 'Top Pick',
      in_stock: true,
      stock_quantity: 8
    },
    {
      id: '5',
      name: 'Dell XPS 13',
      description: 'Ultra-portable laptop with stunning display',
      price: 999,
      image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=400&fit=crop',
      category: 'Laptops',
      main_tag: 'Featured',
      promo_tag: '25% OFF',
      in_stock: true,
      stock_quantity: 12
    },
    {
      id: '6',
      name: 'AirPods Pro 2',
      description: 'Premium wireless earbuds with active noise cancellation',
      price: 249,
      image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=400&fit=crop',
      category: 'Accessories',
      main_tag: 'Featured',
      in_stock: true,
      stock_quantity: 50
    },
    {
      id: '7',
      name: 'Xiaomi Mi 14 Pro',
      description: 'Premium Xiaomi smartphone with Leica camera system',
      price: 899,
      image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop',
      category: 'Phones',
      main_tag: 'Hot',
      promo_tag: '30% OFF',
      in_stock: true,
      stock_quantity: 30
    },
    {
      id: '8',
      name: 'OnePlus 12',
      description: 'Flagship Android phone with fast charging',
      price: 799,
      image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop',
      category: 'Phones',
      main_tag: 'New',
      promo_tag: '15% OFF',
      in_stock: true,
      stock_quantity: 18
    }
  ];
};
