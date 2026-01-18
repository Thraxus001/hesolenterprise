// src/services/cardPaymentService.js
import axios from 'axios';
import STRIPE_CONFIG from '../config/stripeConfig';

/**
 * Service to handle card payment operations.
 * Communicates with the backend API to process Stripe payments.
 */
export const cardPaymentService = {
    /**
     * Create a PaymentIntent on the server.
     * @param {number} amount - Amount in cents (or smallest currency unit).
     * @param {string} currency - Currency code (e.g., 'usd').
     * @param {object} metadata - Additional data (order ID, etc).
     * @returns {Promise<object>} The client_secret and id.
     */
    createPaymentIntent: async (amount, currency = 'usd', metadata = {}) => {
        try {
            const response = await axios.post(STRIPE_CONFIG.API_ENDPOINTS.CREATE_PAYMENT_INTENT, {
                amount,
                currency,
                metadata
            });
            return response.data;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw new Error(error.response?.data?.message || 'Failed to initialize payment');
        }
    },

    /**
     * Create a Stripe Customer (for saving cards).
     * @param {string} email 
     * @param {string} name 
     * @returns {Promise<object>} Customer object
     */
    createCustomer: async (email, name) => {
        try {
            const response = await axios.post(STRIPE_CONFIG.API_ENDPOINTS.CREATE_CUSTOMER, {
                email,
                name
            });
            return response.data;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    },

    /**
     * Retrieve saved payment methods for a customer.
     * @param {string} customerId 
     * @returns {Promise<Array>} List of payment methods
     */
    listPaymentMethods: async (customerId) => {
        try {
            const response = await axios.post(STRIPE_CONFIG.API_ENDPOINTS.LIST_PAYMENT_METHODS, {
                customerId
            });
            return response.data;
        } catch (error) {
            console.error('Error listing payment methods:', error);
            throw error;
        }
    },

    /**
     * Process a refund.
     * @param {string} paymentIntentId 
     * @returns {Promise<object>} Refund status
     */
    refundPayment: async (paymentIntentId) => {
        try {
            const response = await axios.post(STRIPE_CONFIG.API_ENDPOINTS.REFUND_PAYMENT, {
                paymentIntentId
            });
            return response.data;
        } catch (error) {
            console.error('Error processing refund:', error);
            throw error;
        }
    }
};
