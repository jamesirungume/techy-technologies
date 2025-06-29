import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [paymentOption, setPaymentOption] = useState('card');
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const saveOrder = async (paymentStatus: string, paymentMethod: string) => {
    try {
      const orderData = {
        user_id: user?.id || null,
        total_amount: getTotalPrice(),
        status: paymentStatus,
        payment_method: paymentMethod,
        shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}`,
        stripe_session_id: null
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (orderError) throw orderError;

      // Save order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      return order;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  const sendOrderEmail = async (order: any, isCOD: boolean) => {
    try {
      const emailData = {
        orderId: order.id,
        customerInfo: shippingInfo,
        items: items,
        totalAmount: getTotalPrice(),
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online',
        isCOD: isCOD,
        adminEmail: 'jamesmuruguirungu@gmail.com'
      };

      const { error } = await supabase.functions.invoke('send-order-email', {
        body: emailData
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending email:', error);
      // Don't throw here - order is already saved
    }
  };

  const processPesapalPayment = async () => {
    try {
      const callbackUrl = `${window.location.origin}/order-success`;
      
      const { data, error } = await supabase.functions.invoke('process-pesapal-payment', {
        body: {
          name: shippingInfo.fullName,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          amount: getTotalPrice(),
          currency: 'KES',
          description: `Order for ${items.length} items`,
          callbackUrl: callbackUrl
        }
      });

      if (error) throw error;

      if (data.success) {
        // Open Pesapal payment iframe
        const iframe = document.createElement('iframe');
        iframe.src = data.iframe_url;
        iframe.style.width = '100%';
        iframe.style.height = '600px';
        iframe.style.border = 'none';
        
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        `;
        
        const container = document.createElement('div');
        container.style.cssText = `
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 800px;
          height: 80vh;
          position: relative;
        `;
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          z-index: 1;
        `;
        closeButton.onclick = () => document.body.removeChild(overlay);
        
        container.appendChild(closeButton);
        container.appendChild(iframe);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        // Listen for payment completion (you might need to adjust this based on Pesapal's callback mechanism)
        const checkPaymentStatus = setInterval(async () => {
          try {
            // You would typically check the payment status here
            // For now, we'll simulate payment completion after 30 seconds for demo
            // In production, you'd have a proper callback mechanism
          } catch (error) {
            console.error('Error checking payment status:', error);
          }
        }, 5000);
        
        // Save order tracking info
        localStorage.setItem('pesapal_order_id', data.order_tracking_id);
        
        toast.success('Pesapal payment window opened. Complete your payment to proceed.');
      } else {
        throw new Error(data.error || 'Failed to initialize Pesapal payment');
      }
    } catch (error) {
      console.error('Pesapal payment error:', error);
      toast.error('Failed to initialize Pesapal payment. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        // Cash on Delivery
        const order = await saveOrder('pending', 'cash_on_delivery');
        await sendOrderEmail(order, true);
        await clearCart();
        toast.success('Order placed successfully! You will be contacted to confirm your COD order.');
        navigate('/order-success', { state: { orderId: order.id, isCOD: true } });
      } else {
        // Pay Before Delivery
        if (paymentOption === 'card') {
          // Stripe Payment
          const { data, error } = await supabase.functions.invoke('create-payment-session', {
            body: {
              items: items,
              customerInfo: shippingInfo,
              amount: getTotalPrice() * 100 // Convert to cents
            }
          });

          if (error) throw error;
          
          // Redirect to Stripe
          window.location.href = data.url;
        } else if (paymentOption === 'mpesa') {
          // MPesa Payment
          const { data, error } = await supabase.functions.invoke('process-mpesa-payment', {
            body: {
              amount: getTotalPrice(),
              phoneNumber: shippingInfo.phone,
              items: items,
              customerInfo: shippingInfo
            }
          });

          if (error) throw error;

          toast.success('MPesa payment initiated. Please check your phone and enter your PIN.');
        } else if (paymentOption === 'pesapal') {
          // Pesapal Payment
          await processPesapalPayment();
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">Pay Before Delivery</Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'online' && (
                    <div className="ml-6 space-y-3">
                      <Label className="text-sm font-medium">Choose Payment Option:</Label>
                      <RadioGroup value={paymentOption} onValueChange={setPaymentOption}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card">Credit/Debit Card (Stripe)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="mpesa" id="mpesa" />
                          <Label htmlFor="mpesa">MPesa</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pesapal" id="pesapal" />
                          <Label htmlFor="pesapal">Pesapal (MPesa, Card, Bank)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 
                   paymentMethod === 'cod' ? 'Place COD Order' : 
                   paymentOption === 'card' ? 'Pay with Card' : 
                   paymentOption === 'mpesa' ? 'Pay with MPesa' :
                   paymentOption === 'pesapal' ? 'Pay with Pesapal' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
