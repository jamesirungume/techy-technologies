
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Truck, HeadphonesIcon, Award, Users, MapPin, Star, Zap, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Techy Technologies</h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Your trusted partner for cutting-edge technology solutions. We're passionate about bringing 
              you the latest innovations in smartphones, computers, and electronics at unbeatable prices.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="mb-20">
          <Card className="shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
              <CardTitle className="text-3xl mb-6 text-center">Our Story</CardTitle>
            </div>
            <CardContent className="p-8 md:p-12">
              <div className="text-gray-700 space-y-6 text-lg leading-relaxed">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="bg-primary/10 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  We guarantee authentic products from trusted manufacturers, ensuring you get 
                  the best value for your money.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="bg-primary/10 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <HeadphonesIcon className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Customer First</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Our dedicated support team is always ready to help you make informed decisions 
                  and resolve any concerns.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="bg-primary/10 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Truck className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Quick and reliable delivery service ensures your products reach you safely 
                  and on time.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="bg-primary/10 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  We stay ahead of technology trends to bring you the latest and most innovative 
                  products in the market.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="bg-primary/10 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Heart className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  We're more than a store - we're part of your technology journey, building 
                  lasting relationships with our customers.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="bg-primary/10 w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-xl">Local Presence</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
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
          <Card className="shadow-2xl bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 p-8">
              <CardTitle className="text-3xl text-center">Why Choose Techy Technologies?</CardTitle>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Star className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Authentic Products</h3>
                      <p className="text-gray-600">
                        All our products are sourced directly from authorized distributors and manufacturers.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Competitive Pricing</h3>
                      <p className="text-gray-600">
                        We offer the best prices in the market without compromising on quality.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Secure Shopping</h3>
                      <p className="text-gray-600">
                        Your data and transactions are protected with industry-standard security measures.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
                      <p className="text-gray-600">
                        Our knowledgeable team provides expert advice to help you make the right choice.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Award className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Warranty Protection</h3>
                      <p className="text-gray-600">
                        All products come with manufacturer warranties and our additional service guarantee.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Zap className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Flexible Payment</h3>
                      <p className="text-gray-600">
                        Multiple payment options including Cash on Delivery and secure online payments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-2xl">
            <CardContent className="py-16 px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Difference?</h2>
              <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust Techy Technologies for their technology needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/products" 
                  className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
                >
                  Shop Now
                </a>
                <a 
                  href="/contact" 
                  className="inline-block bg-transparent border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors text-lg"
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
