
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, isCOD } = location.state || {};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Order Placed Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderId && (
                <p className="text-gray-600">
                  Your order ID is: <span className="font-semibold">{orderId}</span>
                </p>
              )}
              
              {isCOD ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Cash on Delivery Order</strong>
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    Our team will contact you shortly to confirm your order and arrange delivery.
                    Please keep your phone accessible.
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    <strong>Payment Successful</strong>
                  </p>
                  <p className="text-sm text-green-700 mt-2">
                    Thank you for your payment. We'll process your order and send you tracking information soon.
                  </p>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <Button 
                  onClick={() => navigate('/products')}
                  className="w-full mb-2"
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderSuccess;
