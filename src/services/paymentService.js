// src/services/paymentService.js
import { 
    collection, 
    addDoc, 
    doc, 
    updateDoc,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from '../config/firebaseConfig';
  import { mpesaService } from './mpesaService';
  import { cardPaymentService } from './cardPaymentService';
  import { orderService } from './orderService';
  import { generateOrderNumber } from '../utils/formatters';
  import toast from 'react-hot-toast';
  
  export const paymentService = {
    // Process payment
    async processPayment(paymentData) {
      try {
        const { orderId, paymentMethod, amount, details } = paymentData;
        
        // Create payment record
        const paymentId = await this.createPaymentRecord({
          orderId,
          paymentMethod,
          amount,
          status: 'pending',
          details
        });
  
        let paymentResult;
        
        // Process based on payment method
        switch (paymentMethod) {
          case 'mpesa':
            paymentResult = await mpesaService.initiatePayment(
              orderId,
              details.phoneNumber,
              amount
            );
            break;
            
          case 'card':
            paymentResult = await cardPaymentService.processCardPayment(
              details.cardToken,
              amount,
              details.currency || 'KES'
            );
            break;
            
          case 'cash_on_delivery':
            paymentResult = { 
              success: true, 
              paymentId,
              message: 'Cash on delivery selected. Pay when you receive your order.' 
            };
            break;
            
          default:
            throw new Error('Unsupported payment method');
        }
  
        if (paymentResult.success) {
          // Update payment status
          await this.updatePaymentStatus(paymentId, 'processing');
          
          // Update order payment status
          await orderService.updateOrderStatus(orderId, 'confirmed', 'processing');
          
          return paymentResult;
        } else {
          // Update payment as failed
          await this.updatePaymentStatus(paymentId, 'failed', paymentResult.error);
          throw new Error(paymentResult.error);
        }
      } catch (error) {
        console.error('Process payment error:', error);
        toast.error('Payment processing failed');
        return { success: false, error: error.message };
      }
    },
  
    // Create payment record
    async createPaymentRecord(paymentData) {
      try {
        const paymentsRef = collection(db, 'payments');
        
        const paymentPayload = {
          ...paymentData,
          paymentNumber: `PAY-${generateOrderNumber()}`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
  
        const docRef = await addDoc(paymentsRef, paymentPayload);
        return docRef.id;
      } catch (error) {
        console.error('Create payment record error:', error);
        throw error;
      }
    },
  
    // Update payment status
    async updatePaymentStatus(paymentId, status, errorMessage = '') {
      try {
        const paymentRef = doc(db, 'payments', paymentId);
        const updateData = {
          status,
          updatedAt: serverTimestamp()
        };
  
        if (status === 'completed') {
          updateData.completedAt = serverTimestamp();
        } else if (status === 'failed' && errorMessage) {
          updateData.errorMessage = errorMessage;
        }
  
        await updateDoc(paymentRef, updateData);
        
        return { success: true };
      } catch (error) {
        console.error('Update payment status error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Get payment by ID
    async getPayment(paymentId) {
      try {
        const { getDoc } = await import('firebase/firestore');
        const paymentRef = doc(db, 'payments', paymentId);
        const paymentSnap = await getDoc(paymentRef);
        
        if (!paymentSnap.exists()) {
          return { success: false, error: 'Payment not found' };
        }
        
        return { 
          success: true, 
          payment: { id: paymentSnap.id, ...paymentSnap.data() } 
        };
      } catch (error) {
        console.error('Get payment error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Get payment by order ID
    async getPaymentByOrder(orderId) {
      try {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const paymentsRef = collection(db, 'payments');
        const q = query(paymentsRef, where('orderId', '==', orderId));
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          return { success: false, error: 'Payment not found' };
        }
        
        const paymentDoc = querySnapshot.docs[0];
        return { 
          success: true, 
          payment: { id: paymentDoc.id, ...paymentDoc.data() } 
        };
      } catch (error) {
        console.error('Get payment by order error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Handle payment callback (for MPesa webhooks)
    async handlePaymentCallback(paymentId, callbackData) {
      try {
        const paymentRef = doc(db, 'payments', paymentId);
        
        if (callbackData.ResultCode === 0) {
          // Payment successful
          await updateDoc(paymentRef, {
            status: 'completed',
            mpesaReceipt: callbackData.MpesaReceiptNumber,
            resultCode: callbackData.ResultCode,
            resultDescription: callbackData.ResultDesc,
            transactionDate: new Date().toISOString(),
            completedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
  
          // Get order ID from payment
          const { getDoc } = await import('firebase/firestore');
          const paymentSnap = await getDoc(paymentRef);
          const paymentData = paymentSnap.data();
          
          // Update order status
          await orderService.updateOrderStatus(
            paymentData.orderId, 
            'confirmed', 
            'paid'
          );
  
          toast.success('Payment completed successfully!');
          return { success: true, status: 'completed' };
        } else {
          // Payment failed
          await updateDoc(paymentRef, {
            status: 'failed',
            resultCode: callbackData.ResultCode,
            resultDescription: callbackData.ResultDesc,
            errorMessage: callbackData.ResultDesc,
            updatedAt: serverTimestamp()
          });
  
          return { 
            success: false, 
            status: 'failed', 
            error: callbackData.ResultDesc 
          };
        }
      } catch (error) {
        console.error('Handle payment callback error:', error);
        return { success: false, error: error.message };
      }
    },
  
    // Refund payment
    async refundPayment(paymentId, amount, reason = '') {
      try {
        const paymentRef = doc(db, 'payments', paymentId);
        
        await updateDoc(paymentRef, {
          status: 'refunded',
          refundAmount: amount,
          refundReason: reason,
          refundedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
  
        // Get order ID and update order status
        const { getDoc } = await import('firebase/firestore');
        const paymentSnap = await getDoc(paymentRef);
        const paymentData = paymentSnap.data();
        
        if (paymentData.orderId) {
          await orderService.updateOrderStatus(
            paymentData.orderId,
            'refunded',
            'refunded'
          );
        }
  
        toast.success('Refund processed successfully');
        return { success: true };
      } catch (error) {
        console.error('Refund payment error:', error);
        toast.error('Failed to process refund');
        return { success: false, error: error.message };
      }
    },
  
    // Check payment status
    async checkPaymentStatus(paymentId) {
      try {
        const { getDoc } = await import('firebase/firestore');
        const paymentRef = doc(db, 'payments', paymentId);
        const paymentSnap = await getDoc(paymentRef);
        
        if (!paymentSnap.exists()) {
          return { success: false, error: 'Payment not found' };
        }
        
        const paymentData = paymentSnap.data();
        
        // If payment is via MPesa and still processing, check status
        if (paymentData.paymentMethod === 'mpesa' && 
            paymentData.status === 'processing' &&
            paymentData.mpesaCheckoutRequestId) {
          
          const mpesaStatus = await mpesaService.checkPaymentStatus(
            paymentData.mpesaCheckoutRequestId
          );
          
          if (mpesaStatus.success) {
            await this.handlePaymentCallback(paymentId, mpesaStatus.data);
            // Re-fetch updated payment data
            const updatedSnap = await getDoc(paymentRef);
            return { 
              success: true, 
              payment: { id: updatedSnap.id, ...updatedSnap.data() } 
            };
          }
        }
        
        return { 
          success: true, 
          payment: { id: paymentSnap.id, ...paymentSnap.data() } 
        };
      } catch (error) {
        console.error('Check payment status error:', error);
        return { success: false, error: error.message };
      }
    }
  };