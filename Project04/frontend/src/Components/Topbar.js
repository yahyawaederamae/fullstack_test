import React from 'react';
import { Home, Info, LogOut } from 'lucide-react';

const Topbar = () => {
  return (
    <div className="w-full bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800 tracking-wide">
              PSUIE
            </span>
          </div>
          
          {/* Navigation Links */}
          <div className="flex space-x-6">
            <a 
              href="#" 
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
            >
              <Home size={18} />
              <span>Home</span>
            </a>
            <a 
              href="#" 
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
            >
              <Info size={18} />
              <span>About</span>
            </a>
            <a 
              href="#" 
              className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition duration-150 ease-in-out"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;