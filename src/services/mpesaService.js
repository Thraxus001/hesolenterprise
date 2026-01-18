// src/services/MpsaService.js (MPESA Payment Service for Kenya)
import { doc, setDoc, updateDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import axios from 'axios';
import toast from 'react-hot-toast';

// MPESA API Configuration
const MPESA_CONFIG = {
  // Sandbox credentials (for testing)
  sandbox: {
    consumerKey: process.env.REACT_APP_MPESA_CONSUMER_KEY,
    consumerSecret: process.env.REACT_APP_MPESA_CONSUMER_SECRET,
    shortCode: process.env.REACT_APP_MPESA_SHORTCODE,
    passkey: process.env.REACT_APP_MPESA_PASSKEY,
    baseUrl: 'https://sandbox.safaricom.co.ke',
  },
  // Production credentials
  production: {
    consumerKey: process.env.REACT_APP_MPESA_CONSUMER_KEY_PROD,
    consumerSecret: process.env.REACT_APP_MPESA_CONSUMER_SECRET_PROD,
    shortCode: process.env.REACT_APP_MPESA_SHORTCODE_PROD,
    passkey: process.env.REACT_APP_MPESA_PASSKEY_PROD,
    baseUrl: 'https://api.safaricom.co.ke',
  }
};

// Get current environment
const isProduction = process.env.NODE_ENV === 'production';
const CONFIG = isProduction ? MPESA_CONFIG.production : MPESA_CONFIG.sandbox;

export const MpsaService = {
  // =============== MPESA AUTHENTICATION ===============
  /**
   * Get MPESA OAuth access token
   * @returns {Promise<string>} Access token
   */
  async getAccessToken() {
    try {
      const auth = btoa(`${CONFIG.consumerKey}:${CONFIG.consumerSecret}`);
      
      const response = await axios.get(`${CONFIG.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          Authorization: `Basic ${auth}`
        }
      });

      return response.data.access_token;
    } catch (error) {
      console.error('MPESA Token Error:', error);
      throw new Error('Failed to get MPESA access token');
    }
  },

  // =============== STK PUSH (Lipa na M-PESA Online) ===============
  /**
   * Initiate STK Push payment
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.phoneNumber - Customer's phone number (2547XXXXXXXX)
   * @param {number} paymentData.amount - Amount to charge
   * @param {string} paymentData.accountReference - Payment reference
   * @param {string} paymentData.transactionDesc - Transaction description
   * @returns {Promise<Object>} STK Push response
   */
  async initiateSTKPush(paymentData) {
    try {
      const accessToken = await this.getAccessToken();
      
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);
      
      const requestData = {
        BusinessShortCode: CONFIG.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: paymentData.amount,
        PartyA: paymentData.phoneNumber,
        PartyB: CONFIG.shortCode,
        PhoneNumber: paymentData.phoneNumber,
        CallBackURL: `${window.location.origin}/api/mpesa-callback`,
        AccountReference: paymentData.accountReference || 'Bookshop Purchase',
        TransactionDesc: paymentData.transactionDesc || 'Payment for educational materials'
      };

      const response = await axios.post(
        `${CONFIG.baseUrl}/mpesa/stkpush/v1/processrequest`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Save payment record to Firestore
      await this.savePaymentRecord({
        ...paymentData,
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage,
        status: 'pending'
      });

      return {
        success: true,
        checkoutRequestID: response.data.CheckoutRequestID,
        customerMessage: response.data.CustomerMessage,
        data: response.data
      };
    } catch (error) {
      console.error('STK Push Error:', error);
      
      // Save failed payment record
      await this.savePaymentRecord({
        ...paymentData,
        status: 'failed',
        error: error.message
      });

      toast.error('Failed to initiate MPESA payment');
      return {
        success: false,
        error: error.message
      };
    }
  },

  // =============== QUERY TRANSACTION STATUS ===============
  /**
   * Query transaction status
   * @param {string} checkoutRequestID - Checkout Request ID from STK Push
   * @returns {Promise<Object>} Transaction status
   */
  async queryTransactionStatus(checkoutRequestID) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const requestData = {
        BusinessShortCode: CONFIG.shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };

      const response = await axios.post(
        `${CONFIG.baseUrl}/mpesa/stkpushquery/v1/query`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data.ResultCode === '0' 
        ? { success: true, status: 'completed' }
        : { success: false, status: 'failed' };

      // Update payment record
      await this.updatePaymentRecord(checkoutRequestID, {
        queryResultCode: response.data.ResultCode,
        queryResultDesc: response.data.ResultDesc,
        status: result.status,
        updatedAt: serverTimestamp()
      });

      return {
        ...result,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc,
        data: response.data
      };
    } catch (error) {
      console.error('Query Transaction Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // =============== C2B (CUSTOMER TO BUSINESS) ===============
  /**
   * Register C2B URLs
   * @returns {Promise<Object>} Registration response
   */
  async registerC2BUrls() {
    try {
      const accessToken = await this.getAccessToken();
      
      const requestData = {
        ShortCode: CONFIG.shortCode,
        ResponseType: 'Completed',
        ConfirmationURL: `${window.location.origin}/api/mpesa-confirmation`,
        ValidationURL: `${window.location.origin}/api/mpesa-validation`
      };

      const response = await axios.post(
        `${CONFIG.baseUrl}/mpesa/c2b/v1/registerurl`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('C2B Registration Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Simulate C2B payment (for testing)
   * @param {Object} simulationData - Simulation data
   * @returns {Promise<Object>} Simulation response
   */
  async simulateC2BPayment(simulationData) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios.post(
        `${CONFIG.baseUrl}/mpesa/c2b/v1/simulate`,
        {
          ShortCode: CONFIG.shortCode,
          CommandID: 'CustomerPayBillOnline',
          Amount: simulationData.amount,
          Msisdn: simulationData.phoneNumber,
          BillRefNumber: simulationData.reference
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('C2B Simulation Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // =============== B2C (BUSINESS TO CUSTOMER) ===============
  /**
   * Send B2C payment (for refunds or payouts)
   * @param {Object} payoutData - Payout details
   * @returns {Promise<Object>} B2C response
   */
  async sendB2CPayment(payoutData) {
    try {
      const accessToken = await this.getAccessToken();
      
      const requestData = {
        InitiatorName: process.env.REACT_APP_MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.REACT_APP_MPESA_SECURITY_CREDENTIAL,
        CommandID: 'BusinessPayment',
        Amount: payoutData.amount,
        PartyA: CONFIG.shortCode,
        PartyB: payoutData.phoneNumber,
        Remarks: payoutData.remarks || 'Refund payment',
        QueueTimeOutURL: `${window.location.origin}/api/mpesa-timeout`,
        ResultURL: `${window.location.origin}/api/mpesa-result`,
        Occasion: payoutData.occasion || 'Refund'
      };

      const response = await axios.post(
        `${CONFIG.baseUrl}/mpesa/b2c/v1/paymentrequest`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Save payout record
      await this.savePayoutRecord({
        ...payoutData,
        conversationID: response.data.ConversationID,
        originatorConversationID: response.data.OriginatorConversationID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        status: 'pending'
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('B2C Payment Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // =============== TRANSACTION REVERSAL ===============
  /**
   * Reverse a transaction
   * @param {Object} reversalData - Reversal details
   * @returns {Promise<Object>} Reversal response
   */
  async reverseTransaction(reversalData) {
    try {
      const accessToken = await this.getAccessToken();
      
      const requestData = {
        Initiator: process.env.REACT_APP_MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.REACT_APP_MPESA_SECURITY_CREDENTIAL,
        CommandID: 'TransactionReversal',
        TransactionID: reversalData.transactionID,
        Amount: reversalData.amount,
        ReceiverParty: reversalData.receiverParty,
        RecieverIdentifierType: '11',
        ResultURL: `${window.location.origin}/api/mpesa-reversal-result`,
        QueueTimeOutURL: `${window.location.origin}/api/mpesa-reversal-timeout`,
        Remarks: reversalData.remarks || 'Transaction reversal',
        Occasion: reversalData.occasion || 'Reversal'
      };

      const response = await axios.post(
        `${CONFIG.baseUrl}/mpesa/reversal/v1/request`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Reversal Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // =============== PAYMENT RECORDS MANAGEMENT ===============
  /**
   * Save payment record to Firestore
   * @param {Object} paymentData - Payment data
   * @returns {Promise<string>} Document ID
   */
  async savePaymentRecord(paymentData) {
    try {
      const paymentRef = await addDoc(collection(db, 'mpesaPayments'), {
        ...paymentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return paymentRef.id;
    } catch (error) {
      console.error('Save Payment Record Error:', error);
      throw error;
    }
  },

  /**
   * Update payment record
   * @param {string} checkoutRequestID - Checkout Request ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<void>}
   */
  async updatePaymentRecord(checkoutRequestID, updates) {
    try {
      // Find payment by checkoutRequestID
      const paymentsRef = collection(db, 'mpesaPayments');
      // You might need to query first or pass the document ID directly
      // This is simplified - in practice, you'd query for the document
      const paymentDoc = doc(db, 'mpesaPayments', checkoutRequestID);
      
      await updateDoc(paymentDoc, updates);
    } catch (error) {
      console.error('Update Payment Record Error:', error);
      throw error;
    }
  },

  /**
   * Get payment record by ID
   * @param {string} paymentId - Payment document ID
   * @returns {Promise<Object>} Payment data
   */
  async getPaymentRecord(paymentId) {
    try {
      const paymentDoc = await getDoc(doc(db, 'mpesaPayments', paymentId));
      
      if (paymentDoc.exists()) {
        return {
          id: paymentDoc.id,
          ...paymentDoc.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Get Payment Record Error:', error);
      throw error;
    }
  },

  /**
   * Save payout record to Firestore
   * @param {Object} payoutData - Payout data
   * @returns {Promise<string>} Document ID
   */
  async savePayoutRecord(payoutData) {
    try {
      const payoutRef = await addDoc(collection(db, 'mpesaPayouts'), {
        ...payoutData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return payoutRef.id;
    } catch (error) {
      console.error('Save Payout Record Error:', error);
      throw error;
    }
  },

  // =============== UTILITY FUNCTIONS ===============
  /**
   * Generate timestamp in yyyyMMddHHmmss format
   * @returns {string} Timestamp
   */
  generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  },

  /**
   * Generate password for MPESA API
   * @param {string} timestamp - Timestamp
   * @returns {string} Base64 encoded password
   */
  generatePassword(timestamp) {
    const password = `${CONFIG.shortCode}${CONFIG.passkey}${timestamp}`;
    return btoa(password);
  },

  /**
   * Format phone number to MPESA format (254XXXXXXXXX)
   * @param {string} phoneNumber - Raw phone number
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    // If starts with +254, remove the +
    else if (cleaned.startsWith('254')) {
      // Already in correct format
    }
    // If starts with 7 (Kenya mobile without country code)
    else if (cleaned.startsWith('7') && cleaned.length === 9) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  },

  /**
   * Validate MPESA phone number
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} True if valid
   */
  validatePhoneNumber(phoneNumber) {
    const formatted = this.formatPhoneNumber(phoneNumber);
    const regex = /^2547\d{8}$/;
    return regex.test(formatted);
  },

  /**
   * Generate random transaction reference
   * @param {string} prefix - Reference prefix
   * @returns {string} Transaction reference
   */
  generateTransactionReference(prefix = 'BOOK') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${prefix}-${timestamp}-${random}`;
  },

  // =============== WEBHOOK HANDLERS (For your backend) ===============
  /**
   * Handle MPESA callback (to be implemented in your backend)
   * @param {Object} callbackData - Callback data from MPESA
   * @returns {Promise<Object>} Processing result
   */
  async handleMpesaCallback(callbackData) {
    try {
      // This should be implemented in your backend server
      // For now, we'll just log and update the payment status
      
      const { Body: { stkCallback: callback } } = callbackData;
      
      if (callback.ResultCode === 0) {
        // Payment successful
        const metadata = callback.CallbackMetadata.Item.reduce((acc, item) => {
          acc[item.Name] = item.Value;
          return acc;
        }, {});

        // Update payment record
        await this.updatePaymentRecord(callback.CheckoutRequestID, {
          status: 'completed',
          mpesaReceiptNumber: metadata.MpesaReceiptNumber,
          transactionDate: metadata.TransactionDate,
          phoneNumber: metadata.PhoneNumber,
          amount: metadata.Amount,
          updatedAt: serverTimestamp()
        });

        return {
          success: true,
          message: 'Payment processed successfully',
          receiptNumber: metadata.MpesaReceiptNumber
        };
      } else {
        // Payment failed
        await this.updatePaymentRecord(callback.CheckoutRequestID, {
          status: 'failed',
          error: callback.ResultDesc,
          updatedAt: serverTimestamp()
        });

        return {
          success: false,
          message: callback.ResultDesc
        };
      }
    } catch (error) {
      console.error('Callback Handler Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default MpsaService;