import React, { useState } from 'react';
import { Home, UserRoundPlus, ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { icon: <Home size={18} />, text: 'Home', path: '/' },
    { icon: <UserRoundPlus size={18} />, text: 'Create User', path: '/create' },
    { icon: <ShoppingCart size={18} />, text: 'Store', path: '/store' },
    { icon: <LogOut size={18} />, text: 'Log Out', path: '/logout', className: 'text-red-600 hover:text-red-700' }
  ];

  return (
    <div className="w-full bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 tracking-wide">
              PSUIE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-1 ${
                  item.className || 'text-gray-600 hover:text-gray-900'
                } transition duration-150 ease-in-out ${
                  item.text === 'Log Out' ? 'px-4 py-2 rounded-lg hover:bg-red-50' : ''
                }`}
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                    item.className || 'text-gray-600 hover:text-gray-900'
                  } transition duration-150 ease-in-out ${
                    item.text === 'Log Out' ? 'hover:bg-red-50 mt-2' : 'hover:bg-gray-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;