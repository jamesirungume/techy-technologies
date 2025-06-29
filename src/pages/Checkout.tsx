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
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online with Pesapal',
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
      
      console.log("Initiating Pesapal payment...");
      console.log("Payment data:", {
        name: shippingInfo.fullName,
        phone: shippingInfo.phone,
        email: shippingInfo.email,
        amount: getTotalPrice(),
        currency: 'KES',
        description: `Order for ${items.length} items`,
        callbackUrl: callbackUrl
      });
      
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

      if (error) {
        console.error("Supabase function invocation error:", error);
        throw new Error(error.message || 'Failed to invoke payment function');
      }

      console.log("Pesapal response:", data);

      if (data && data.success) {
        // Save order as pending first
        const order = await saveOrder('pending', 'pesapal');
        
        // Store order info in localStorage
        localStorage.setItem('pesapal_order_id', data.order_tracking_id);
        localStorage.setItem('pending_order_id', order.id);
        
        // Use the redirect URL or iframe URL provided by Pesapal
        const paymentUrl = data.iframe_url || data.redirect_url;
        
        if (paymentUrl) {
          console.log("Opening payment URL:", paymentUrl);
          
          // Open payment in a new window
          const paymentWindow = window.open(
            paymentUrl,
            'pesapal_payment',
            'width=900,height=700,scrollbars=yes,resizable=yes,location=yes'
          );
          
          if (paymentWindow) {
            // Monitor the payment window
            const checkClosed = setInterval(() => {
              if (paymentWindow.closed) {
                clearInterval(checkClosed);
                console.log('Payment window closed');
                toast.info('Payment window closed. Redirecting to success page...');
                // Clear cart and redirect to success
                clearCart();
                setTimeout(() => {
                  navigate('/order-success', { 
                    state: { 
                      orderId: order.id, 
                      isCOD: false,
                      paymentMethod: 'Pesapal' 
                    } 
                  });
                }, 1500);
              }
            }, 1000);
            
            toast.success('Pesapal payment window opened. Complete your payment to proceed.');
          } else {
            // Fallback: redirect current window if popup blocked
            console.log("Popup blocked, redirecting current window");
            window.location.href = paymentUrl;
          }
        } else {
          throw new Error('No payment URL received from Pesapal');
        }
      } else {
        const errorMessage = data?.error || 'Unknown error occurred';
        console.error('Pesapal payment failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Pesapal payment error:', error);
      const errorMessage = error.message || 'Please try again';
      toast.error(`Failed to initialize Pesapal payment: ${errorMessage}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        // Cash on Delivery - save order and send email
        const order = await saveOrder('pending', 'cash_on_delivery');
        await sendOrderEmail(order, true);
        await clearCart();
        toast.success('Order placed successfully! You will be contacted to confirm your COD order.');
        navigate('/order-success', { state: { orderId: order.id, isCOD: true } });
      } else {
        // Pesapal Payment
        await processPesapalPayment();
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
                      placeholder="e.g., 0712345678"
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
                      <RadioGroupItem value="pesapal" id="pesapal" />
                      <Label htmlFor="pesapal">Pay Now (M-Pesa, Card, Bank) - Pesapal</Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'pesapal' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        <strong>Secure Payment with Pesapal</strong>
                      </p>
                      <p className="text-blue-700 text-sm mt-1">
                        Pay securely using M-Pesa, Credit/Debit Card, or Bank transfer through Pesapal's secure payment gateway.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800 text-sm">
                        <strong>Cash on Delivery</strong>
                      </p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Pay cash when your order is delivered. Our team will contact you to confirm your order.
                      </p>
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
                   'Pay with Pesapal'}
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
