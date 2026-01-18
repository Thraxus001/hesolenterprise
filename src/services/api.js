// src/services/api.js
import { auth } from '../config/firebaseConfig';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  async request(endpoint, options = {}) {
    const token = await auth.currentUser?.getIdToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  // MPesa endpoints
  async initiateMpesaPayment(data) {
    return this.request('/payments/mpesa/initiate', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async checkMpesaPaymentStatus(checkoutRequestId) {
    return this.request('/payments/mpesa/status', {
      method: 'POST',
      body: JSON.stringify({ checkoutRequestId })
    });
  },

  // Order endpoints
  async createOrder(data) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getOrders() {
    return this.request('/orders');
  },

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }
};