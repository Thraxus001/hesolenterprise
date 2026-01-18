import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseConfig';
import { 
  User, ShoppingCart, Heart, Package, 
  LogOut, ChevronDown, Settings
} from 'lucide-react';

const UserMenu = ({ user }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    setIsOpen(false);
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="text-gray-700 hover:text-indigo-600"
        >
          Sign In
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-sm font-semibold text-indigo-600">
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 border">
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-600">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.email}</p>
                  <p className="text-sm text-gray-600">Customer</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <User size={18} />
                <span>My Profile</span>
              </Link>
              
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <ShoppingCart size={18} />
                <span>My Cart</span>
              </Link>
              
              <Link
                to="/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <Package size={18} />
                <span>My Orders</span>
              </Link>
              
              <Link
                to="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <Heart size={18} />
                <span>Wishlist</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 mt-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;