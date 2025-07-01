
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Truck, HeadphonesIcon, Award, Users, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">About Techy Technologies</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for cutting-edge technology solutions. We're passionate about bringing 
            you the latest innovations in smartphones, computers, and electronics at unbeatable prices.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-4">
              <p>
                Founded in 2020, Techy Technologies has grown from a small startup to one of Kenya's 
                most trusted technology retailers. Our journey began with a simple mission: to make 
                cutting-edge technology accessible and affordable for everyone.
              </p>
              <p>
                What started as a passion project has evolved into a comprehensive e-commerce platform 
                serving thousands of customers across Kenya. We pride ourselves on offering authentic, 
                high-quality products backed by excellent customer service.
              </p>
              <p>
                Today, we continue to innovate and expand our product range, always keeping our customers' 
                needs at the heart of everything we do.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We guarantee authentic products from trusted manufacturers, ensuring you get 
                  the best value for your money.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <HeadphonesIcon className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Customer First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our dedicated support team is always ready to help you make informed decisions 
                  and resolve any concerns.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quick and reliable delivery service ensures your products reach you safely 
                  and on time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We stay ahead of technology trends to bring you the latest and most innovative 
                  products in the market.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We're more than a store - we're part of your technology journey, building 
                  lasting relationships with our customers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Local Presence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Based in Kenya, we understand the local market and provide solutions 
                  tailored to our customers' needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Why Choose Techy Technologies?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">✓ Authentic Products</h3>
                  <p className="text-gray-600 mb-4">
                    All our products are sourced directly from authorized distributors and manufacturers.
                  </p>
                  
                  <h3 className="font-semibold mb-2">✓ Competitive Pricing</h3>
                  <p className="text-gray-600 mb-4">
                    We offer the best prices in the market without compromising on quality.
                  </p>
                  
                  <h3 className="font-semibold mb-2">✓ Secure Shopping</h3>
                  <p className="text-gray-600">
                    Your data and transactions are protected with industry-standard security measures.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">✓ Expert Support</h3>
                  <p className="text-gray-600 mb-4">
                    Our knowledgeable team provides expert advice to help you make the right choice.
                  </p>
                  
                  <h3 className="font-semibold mb-2">✓ Warranty Protection</h3>
                  <p className="text-gray-600 mb-4">
                    All products come with manufacturer warranties and our additional service guarantee.
                  </p>
                  
                  <h3 className="font-semibold mb-2">✓ Flexible Payment</h3>
                  <p className="text-gray-600">
                    Multiple payment options including Cash on Delivery and secure online payments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Experience the Difference?</h2>
              <p className="mb-6">
                Join thousands of satisfied customers who trust Techy Technologies for their technology needs.
              </p>
              <div className="space-x-4">
                <a 
                  href="/products" 
                  className="inline-block bg-white text-primary px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </a>
                <a 
                  href="/contact" 
                  className="inline-block bg-transparent border border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
