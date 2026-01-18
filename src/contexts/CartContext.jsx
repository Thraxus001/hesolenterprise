import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    try {
      setLoading(true);
      const savedCart = JSON.parse(localStorage.getItem('cart_items') || '[]');
      setCartItems(savedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const saveCart = (items) => {
    try {
      localStorage.setItem('cart_items', JSON.stringify(items));
      setCartItems(items);
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = async (book, quantity = 1) => {
    try {
      const currentCart = [...cartItems];
      const existingItemIndex = currentCart.findIndex(item => item.book_id === book.id);

      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += quantity;
      } else {
        currentCart.push({
          book_id: book.id,
          quantity: quantity,
          books: book, // Storing full book object for easier display
          added_at: new Date().toISOString()
        });
      }

      saveCart(currentCart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const newCart = cartItems.filter(item => item.book_id !== bookId);
      saveCart(newCart);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    if (quantity < 1) return removeFromCart(bookId);
    try {
      const currentCart = [...cartItems];
      const itemIndex = currentCart.findIndex(item => item.book_id === bookId);

      if (itemIndex > -1) {
        currentCart[itemIndex].quantity = quantity;
        saveCart(currentCart);
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      localStorage.removeItem('cart_items');

      setCartItems([]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const calculateTotal = () => cartItems.reduce((acc, item) => acc + (item.books?.price || 0) * item.quantity, 0);
  const getCartCount = () => cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    getCartCount,
    refreshCart: loadCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
