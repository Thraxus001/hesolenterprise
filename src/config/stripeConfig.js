// Stripe Configuration
const STRIPE_CONFIG = {
    // Environment: 'test' for testing, 'live' for production
    ENVIRONMENT: process.env.REACT_APP_STRIPE_ENVIRONMENT || 'test',
    
    // API Keys (Never expose secret key in frontend - use backend endpoints)
    PUBLISHABLE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 
      (process.env.REACT_APP_STRIPE_ENVIRONMENT === 'live' 
        ? 'pk_live_your_live_key_here'
        : 'pk_test_your_test_key_here'),
    
    // API Version
    API_VERSION: '2023-10-16',
    
    // Your backend API endpoints for secure operations
    API_ENDPOINTS: {
      CREATE_PAYMENT_INTENT: process.env.REACT_APP_API_BASE_URL + '/api/stripe/create-payment-intent',
      CREATE_CUSTOMER: process.env.REACT_APP_API_BASE_URL + '/api/stripe/create-customer',
      SAVE_PAYMENT_METHOD: process.env.REACT_APP_API_BASE_URL + '/api/stripe/save-payment-method',
      LIST_PAYMENT_METHODS: process.env.REACT_APP_API_BASE_URL + '/api/stripe/list-payment-methods',
      CREATE_SUBSCRIPTION: process.env.REACT_APP_API_BASE_URL + '/api/stripe/create-subscription',
      CANCEL_SUBSCRIPTION: process.env.REACT_APP_API_BASE_URL + '/api/stripe/cancel-subscription',
      REFUND_PAYMENT: process.env.REACT_APP_API_BASE_URL + '/api/stripe/refund',
      GET_INVOICE: process.env.REACT_APP_API_BASE_URL + '/api/stripe/invoice',
    },
    
    // Stripe Elements configuration
    ELEMENTS: {
      MODE: 'payment',
      CURRENCY: 'usd',
      ALLOWED_PAYMENT_METHODS: ['card'],
      APPEARANCE: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#007bff',
          colorBackground: '#ffffff',
          colorText: '#30313d',
          colorDanger: '#df1b41',
          fontFamily: 'Inter, system-ui, sans-serif',
          spacingUnit: '4px',
          borderRadius: '8px',
        },
      },
    },
    
    // Supported payment methods
    PAYMENT_METHODS: [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        types: ['visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb'],
        countries: ['US', 'CA', 'GB', 'AU', 'NZ', 'EU'], // Add more as needed
      },
      {
        id: 'apple_pay',
        name: 'Apple Pay',
        supported: typeof window !== 'undefined' && window.ApplePaySession,
      },
      {
        id: 'google_pay',
        name: 'Google Pay',
        supported: typeof window !== 'undefined' && window.PaymentRequest,
      },
    ],
    
    // Business information
    BUSINESS: {
      NAME: 'Your Business Name',
      LOGO_URL: 'https://yourdomain.com/logo.png',
      SUPPORT_EMAIL: 'support@yourdomain.com',
      SUPPORT_PHONE: '+1-800-123-4567',
      ADDRESS: {
        LINE1: '123 Business St',
        CITY: 'San Francisco',
        STATE: 'CA',
        POSTAL_CODE: '94107',
        COUNTRY: 'US',
      },
    },
    
    // Tax configuration
    TAX: {
      CALCULATE_TAX: false, // Set to true if you need to calculate tax
      TAX_RATE_ID: process.env.REACT_APP_STRIPE_TAX_RATE_ID || '', // Stripe Tax Rate ID
      TAX_RATE_PERCENTAGE: 0.0, // Default tax rate percentage
    },
    
    // Shipping configuration
    SHIPPING: {
      COLLECT_SHIPPING: false,
      OPTIONS: [
        {
          id: 'standard',
          label: 'Standard Shipping',
          amount: 0, // in cents
          detail: 'Delivered in 5-7 business days',
        },
        {
          id: 'express',
          label: 'Express Shipping',
          amount: 1000, // $10.00
          detail: 'Delivered in 1-2 business days',
        },
      ],
    },
    
    // Subscription plans (if applicable)
    SUBSCRIPTION_PLANS: [
      {
        id: 'basic',
        name: 'Basic Plan',
        price: 990, // $9.90
        currency: 'usd',
        interval: 'month',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: 1990, // $19.90
        currency: 'usd',
        interval: 'month',
        features: ['All Basic features', 'Feature 4', 'Feature 5', 'Priority Support'],
      },
    ],
    
    // Security settings
    SECURITY: {
      CARD_AUTHENTICATION_REQUIRED: true,
      THREE_D_SECURE_REQUIRED: true,
      FRAUD_DETECTION: true,
      IP_BLOCKING: false,
    },
    
    // Analytics and tracking
    ANALYTICS: {
      ENABLED: true,
      SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
      MAX_EVENTS_PER_SESSION: 100,
    },
    
    // Error handling
    ERROR_MESSAGES: {
      CARD_DECLINED: 'Your card was declined. Please try again or use a different card.',
      INSUFFICIENT_FUNDS: 'Your card has insufficient funds.',
      EXPIRED_CARD: 'Your card has expired.',
      INVALID_NUMBER: 'The card number is invalid.',
      INVALID_CVC: 'The CVC is invalid.',
      INVALID_EXPIRY: 'The expiration date is invalid.',
      PROCESSING_ERROR: 'An error occurred while processing your payment.',
      NETWORK_ERROR: 'A network error occurred. Please check your connection.',
    },
  };
  
  // Stripe utility functions
  export const formatStripeAmount = (amount, currency = 'usd') => {
    // Convert decimal amount to smallest currency unit (cents for USD)
    switch (currency.toLowerCase()) {
      case 'usd':
      case 'cad':
      case 'aud':
      case 'eur':
      case 'gbp':
        return Math.round(amount * 100);
      case 'jpy':
        return Math.round(amount);
      default:
        return Math.round(amount * 100);
    }
  };
  
  export const formatDisplayAmount = (amount, currency = 'usd') => {
    // Convert from smallest currency unit to decimal
    switch (currency.toLowerCase()) {
      case 'usd':
      case 'cad':
      case 'aud':
      case 'eur':
      case 'gbp':
        return (amount / 100).toFixed(2);
      case 'jpy':
        return amount.toString();
      default:
        return (amount / 100).toFixed(2);
    }
  };
  
  export const getCurrencySymbol = (currency = 'usd') => {
    const symbols = {
      usd: '$',
      eur: '€',
      gbp: '£',
      jpy: '¥',
      cad: 'C$',
      aud: 'A$',
    };
    
    return symbols[currency.toLowerCase()] || '$';
  };
  
  export const validateCardNumber = (cardNumber) => {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s\-]/g, '');
    
    // Check if it's all numbers
    if (!/^\d+$/.test(cleaned)) return false;
    
    // Luhn algorithm validation
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };
  
  export const getCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/[\s\-]/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'diners';
    if (/^35/.test(cleaned)) return 'jcb';
    
    return 'unknown';
  };
  
  export default STRIPE_CONFIG;