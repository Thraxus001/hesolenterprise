import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseConfig';
import {
  User,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
  ChevronDown,
  Package,
  CreditCard,
  MapPin,
  Bell,
  ShoppingCart,
  User as UserIcon
} from 'lucide-react';

const UserDropdown = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
        await fetchCartCount(session.user.id);
      } else {
        setUserProfile(null);
        setCartCount(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await fetchUserProfile(user.id);
        await fetchCartCount(user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, email, role, avatar_url')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchCartCount = async (userId) => {
    try {
      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      setCartCount(count || 0);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setDropdownOpen(false);
      setUser(null);
      setUserProfile(null);
      setCartCount(0);
      navigate('/');
      // Show logout success message
      // You can add a toast notification here
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          Sign in
        </Link>
        <Link
          to="/register"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
        >
          Join Free
        </Link>
      </div>
    );
  }

  const userInitial = userProfile?.full_name?.charAt(0)?.toUpperCase() || 
                     user.email?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="relative user-dropdown-container">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
        aria-label="User menu"
        aria-expanded={dropdownOpen}
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
            {userProfile?.avatar_url ? (
              <img 
                src={userProfile.avatar_url} 
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {userInitial}
              </span>
            )}
          </div>
          
          {/* Cart badge */}
          {cartCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount > 9 ? '9+' : cartCount}
            </div>
          )}
        </div>
        
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
            {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
          </p>
          <p className="text-xs text-gray-500">
            {userProfile?.role === 'admin' ? 'Administrator' : 'Customer'}
          </p>
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setDropdownOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-200 overflow-hidden">
            {/* User header */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow">
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-xl">
                      {userInitial}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {userProfile?.full_name || 'User'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      userProfile?.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {userProfile?.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-2">
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <UserIcon size={18} className="text-gray-500" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/cart"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors relative"
              >
                <ShoppingCart size={18} className="text-gray-500" />
                <span>My Cart</span>
                {cartCount > 0 && (
                  <span className="absolute right-4 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {cartCount} items
                  </span>
                )}
              </Link>

              <Link
                to="/orders"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Package size={18} className="text-gray-500" />
                <span>My Orders</span>
              </Link>

              <Link
                to="/wishlist"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Heart size={18} className="text-gray-500" />
                <span>Wishlist</span>
              </Link>

              <Link
                to="/addresses"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <MapPin size={18} className="text-gray-500" />
                <span>Address Book</span>
              </Link>

              <Link
                to="/notifications"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Bell size={18} className="text-gray-500" />
                <span>Notifications</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <Settings size={18} className="text-gray-500" />
                <span>Settings</span>
              </Link>

              {/* Admin link (only show if user is admin) */}
              {(userProfile?.role === 'admin' || userProfile?.role === 'staff') && (
                <Link
                  to="/admin"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-purple-700 border-t border-gray-100 mt-2"
                >
                  <Settings size={18} className="text-purple-600" />
                  <span className="font-medium">Admin Dashboard</span>
                </Link>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 text-red-600 w-full text-left transition-colors"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Member since</span>
                <span className="font-medium">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short'
                  })}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDropdown;