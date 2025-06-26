
import React from 'react';
import { Phone, Mail } from 'lucide-react';

const ContactBar = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2.5 text-sm shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 hover:text-blue-300 transition-colors">
              <Phone className="h-4 w-4 text-blue-400" />
              <a href="tel:0793708416" className="font-medium">0793708416</a>
            </div>
            <div className="flex items-center space-x-2 hover:text-blue-300 transition-colors">
              <Mail className="h-4 w-4 text-blue-400" />
              <a href="mailto:jamesmuruuirungu@gmail.com" className="font-medium">jamesmuruuirungu@gmail.com</a>
            </div>
          </div>
          <div className="text-gray-300">
            <span className="font-medium">Welcome to Techy Technologies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;
