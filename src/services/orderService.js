// src/services/orderService.js
// CHANGE THIS:
// import { db, auth } from '../config/firebaseConfig';
// TO THIS:
import { db, auth } from '../config/supabaseConfig';

export const orderService = {
  async createOrder(orderData) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: 'Not logged in' };
    
    try {
      // Start a transaction (Supabase doesn't have transactions in JS, so we use RPC or sequential)
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // 1. Create order
      const { data: order, error: orderError } = await db
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          status: 'pending',
          total_amount: orderData.total,
          subtotal: orderData.subtotal,
          tax_amount: orderData.tax || 0,
          shipping_amount: orderData.shipping || 0,
          discount_amount: orderData.discount || 0,
          shipping_address: orderData.shippingAddress,
          billing_address: orderData.billingAddress,
          payment_method: orderData.paymentMethod
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // 2. Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        book_id: item.bookId,
        title: item.title,
        unit_price: item.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await db
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // 3. Update book stock (if needed)
      for (const item of orderData.items) {
        const { error: stockError } = await db.rpc('decrement_stock', {
          book_id: item.bookId,
          quantity: item.quantity
        });
        
        if (stockError) {
          console.error('Failed to update stock:', stockError);
          // Continue anyway
        }
      }
      
      // 4. Clear cart
      if (orderData.clearCart) {
        await db
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
      }
      
      return { success: true, order };
    } catch (error) {
      console.error('Order creation error:', error);
      return { success: false, error: error.message };
    }
  },

  async getOrders(userId, filters = {}) {
    try {
      let query = db
        .from('orders')
        .select(`
          *,
          order_items (*, books (*))
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, orders: data || [] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getOrderById(orderId) {
    try {
      const { data, error } = await db
        .from('orders')
        .select(`
          *,
          order_items (*, books (*)),
          users (email, full_name)
        `)
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      return { success: true, order: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const { error } = await db
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};