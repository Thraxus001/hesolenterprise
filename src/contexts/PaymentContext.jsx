import React, { createContext, useState, useContext, useCallback } from 'react';

const PaymentContext = createContext(null);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    saveCard: false
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const updatePaymentDetails = useCallback((details) => {
    setPaymentDetails(prev => ({ ...prev, ...details }));
  }, []);

  const processPayment = useCallback(async (amount) => {
    setPaymentProcessing(true);
    setPaymentError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      if (paymentMethod === 'card') {
        if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
          throw new Error('Please fill in all card details');
        }
      }
      
      setPaymentSuccess(true);
      return { success: true, transactionId: 'TXN_' + Date.now() };
    } catch (error) {
      setPaymentError(error.message);
      return { success: false, error: error.message };
    } finally {
      setPaymentProcessing(false);
    }
  }, [paymentMethod, paymentDetails]);

  const resetPayment = useCallback(() => {
    setPaymentSuccess(false);
    setPaymentError(null);
    setPaymentDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      saveCard: false
    });
  }, []);

  const value = {
    paymentMethod,
    setPaymentMethod,
    paymentDetails,
    updatePaymentDetails,
    paymentProcessing,
    paymentError,
    paymentSuccess,
    processPayment,
    resetPayment
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};