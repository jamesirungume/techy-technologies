
import React from 'react';
import { Phone, Mail } from 'lucide-react';

const ContactBar = () => {
  return (
    <div className="bg-gray-900 text-white py-2 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>0793708416</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>jamesmuruuirungu@gmail.com</span>
            </div>
          </div>
          <div className="text-gray-400">
            <span>Welcome to Techy Technologies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;
