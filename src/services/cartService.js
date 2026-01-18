// src/services/cartService.js
// CHANGE THIS:
// import { db, auth } from '../config/firebaseConfig';
// TO THIS:
import { db, auth } from '../config/supabaseConfig';

export const cartService = {
  async getCartItems(userId) {
    try {
      const { data, error } = await db
        .from('cart_items')
        .select(`
          *,
          books (*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      return { success: true, items: data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async addItem(bookId, quantity = 1) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      // Check if already in cart
      const { data: existing } = await db
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .maybeSingle();
      
      if (existing) {
        // Update quantity
        const { error } = await db
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await db
          .from('cart_items')
          .insert({
            user_id: user.id,
            book_id: bookId,
            quantity
          });
        
        if (error) throw error;
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async removeItem(cartItemId) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      const { error } = await db
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateItemQuantity(cartItemId, quantity) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      const { error } = await db
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async clearCart() {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      const { error } = await db
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};