// Main Payment Configuration - Integrates all payment methods
import MPESA_CONFIG from './mpesaConfig';
import STRIPE_CONFIG from './stripeConfig';

const PAYMENT_CONFIG = {
  // Global payment settings
  APP_NAME: process.env.REACT_APP_NAME || 'Your Payment App',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',

  // Environment
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || 'development',

  // Available payment methods
  PAYMENT_METHODS: {
    STRIPE: {
      id: 'stripe',
      name: 'Card Payment',
      enabled: true,
      config: STRIPE_CONFIG,
      supportedCountries: ['US', 'CA', 'GB', 'AU', 'NZ', 'EU', 'JP', 'SG', 'HK'],
      minimumAmount: 0.50, // USD
      maximumAmount: 10000.00, // USD
      processingTime: 'Instant',
    },
    MPESA: {
      id: 'mpesa',
      name: 'M-Pesa',
      enabled: true,
      config: MPESA_CONFIG,
      supportedCountries: ['KE'], // Kenya
      minimumAmount: 1, // KES
      maximumAmount: 150000, // KES
      processingTime: 'Instant',
      phoneRequired: true,
    },
    PAYPAL: {
      id: 'paypal',
      name: 'PayPal',
      enabled: false, // Set to true when you integrate PayPal
      clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || '',
      supportedCountries: ['US', 'CA', 'GB', 'AU', 'NZ', 'EU'],
      minimumAmount: 1.00,
      maximumAmount: 10000.00,
      processingTime: 'Instant',
    },
    BANK_TRANSFER: {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      enabled: false,
      supportedCountries: ['ALL'],
      minimumAmount: 10.00,
      maximumAmount: 100000.00,
      processingTime: '1-3 business days',
      bankDetails: {
        accountName: 'Your Business Name',
        accountNumber: '1234567890',
        bankName: 'Your Bank',
        branch: 'Main Branch',
        swiftCode: 'ABCDEFGH',
        routingNumber: '123456789',
      },
    },
  },

  // Currency configuration
  CURRENCIES: {
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      decimalDigits: 2,
      paymentMethods: ['stripe', 'paypal', 'bank_transfer'],
    },
    KES: {
      code: 'KES',
      symbol: 'KSh',
      name: 'Kenyan Shilling',
      decimalDigits: 0,
      paymentMethods: ['mpesa'],
    },
    EUR: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimalDigits: 2,
      paymentMethods: ['stripe', 'paypal', 'bank_transfer'],
    },
    GBP: {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound',
      decimalDigits: 2,
      paymentMethods: ['stripe', 'paypal', 'bank_transfer'],
    },
    JPY: {
      code: 'JPY',
      symbol: '¥',
      name: 'Japanese Yen',
      decimalDigits: 0,
      paymentMethods: ['stripe', 'paypal'],
    },
  },

  // Default settings
  DEFAULTS: {
    CURRENCY: 'KES',
    COUNTRY: 'US',
    LANGUAGE: 'en',
    PAYMENT_METHOD: 'stripe',
    THEME: 'light', // 'light', 'dark', 'system'
    SAVE_PAYMENT_METHOD: false,
    AUTO_RETRY: true,
    NOTIFICATIONS: true,
  },

  // Fees and pricing
  FEES: {
    PROCESSING_FEES: {
      stripe: {
        percentage: 2.9,
        fixed: 0.30, // USD
      },
      mpesa: {
        percentage: 0.0,
        fixed: 0.0, // Usually charged to customer by mobile operator
      },
      paypal: {
        percentage: 2.9,
        fixed: 0.30, // USD
      },
      bank_transfer: {
        percentage: 0.0,
        fixed: 0.0,
      },
    },
    TAX_RATE: 0.0, // Default tax rate percentage
  },

  // Security configuration
  SECURITY: {
    ENCRYPTION_KEY: process.env.REACT_APP_ENCRYPTION_KEY || '',
    JWT_SECRET: process.env.REACT_APP_JWT_SECRET || '',
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_MIN_LENGTH: 8,
    TWO_FACTOR_AUTH: false,
    IP_WHITELISTING: false,
    ALLOWED_IPS: [],
  },

  // API Configuration
  API: {
    BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    TIMEOUT: 30000, // 30 seconds
    VERSION: 'v1',
    ENDPOINTS: {
      PAYMENTS: '/payments',
      TRANSACTIONS: '/transactions',
      CUSTOMERS: '/customers',
      WEBHOOKS: '/webhooks',
      REFUNDS: '/refunds',
      INVOICES: '/invoices',
      SUBSCRIPTIONS: '/subscriptions',
    },
  },

  // Webhooks configuration
  WEBHOOKS: {
    STRIPE_SECRET: process.env.REACT_APP_STRIPE_WEBHOOK_SECRET || '',
    MPESA_SECRET: process.env.REACT_APP_MPESA_WEBHOOK_SECRET || '',
    PAYPAL_SECRET: process.env.REACT_APP_PAYPAL_WEBHOOK_SECRET || '',
  },

  // Notification configuration
  NOTIFICATIONS: {
    EMAIL: {
      ENABLED: true,
      PROVIDER: 'sendgrid', // 'sendgrid', 'mailgun', 'smtp'
      FROM_EMAIL: 'noreply@yourdomain.com',
      FROM_NAME: 'Payment System',
    },
    SMS: {
      ENABLED: false,
      PROVIDER: 'twilio', // 'twilio', 'africastalking'
    },
    PUSH: {
      ENABLED: false,
      PROVIDER: 'firebase', // 'firebase', 'onesignal'
    },
  },

  // Analytics configuration
  ANALYTICS: {
    ENABLED: true,
    PROVIDER: 'google', // 'google', 'mixpanel', 'amplitude'
    GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GA_ID || '',
    MIXPANEL_TOKEN: process.env.REACT_APP_MIXPANEL_TOKEN || '',
  },

  // Logging configuration
  LOGGING: {
    LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info', // 'error', 'warn', 'info', 'debug'
    CONSOLE: true,
    REMOTE: false,
    REMOTE_ENDPOINT: '',
  },

  // UI/UX Configuration
  UI: {
    THEMES: {
      LIGHT: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        background: '#ffffff',
        text: '#212529',
        border: '#dee2e6',
      },
      DARK: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        success: '#198754',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#0dcaf0',
        background: '#212529',
        text: '#f8f9fa',
        border: '#495057',
      },
    },
    ANIMATIONS: {
      ENABLED: true,
      DURATION: 300,
      EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    RESPONSIVE: {
      BREAKPOINTS: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
      },
    },
  },

  // Localization
  LOCALIZATION: {
    DEFAULT_LANGUAGE: 'en',
    SUPPORTED_LANGUAGES: ['en', 'sw', 'fr', 'es'],
    FALLBACK_LANGUAGE: 'en',
  },
};

// Utility functions
export const getPaymentMethodConfig = (methodId) => {
  return PAYMENT_CONFIG.PAYMENT_METHODS[methodId.toUpperCase()] || null;
};

export const getCurrencyConfig = (currencyCode) => {
  return PAYMENT_CONFIG.CURRENCIES[currencyCode.toUpperCase()] || null;
};

export const isPaymentMethodSupported = (methodId, country, currency) => {
  const method = getPaymentMethodConfig(methodId);
  if (!method || !method.enabled) return false;

  // Check country support
  if (method.supportedCountries && method.supportedCountries[0] !== 'ALL') {
    if (!method.supportedCountries.includes(country.toUpperCase())) {
      return false;
    }
  }

  // Check currency support
  const currencyConfig = getCurrencyConfig(currency);
  if (!currencyConfig) return false;

  return currencyConfig.paymentMethods.includes(methodId.toLowerCase());
};

export const calculateProcessingFee = (amount, methodId, currency = 'USD') => {
  const method = getPaymentMethodConfig(methodId);
  if (!method) return 0;

  const fees = PAYMENT_CONFIG.FEES.PROCESSING_FEES[methodId.toLowerCase()];
  if (!fees) return 0;

  const percentageFee = (amount * fees.percentage) / 100;
  const totalFee = percentageFee + fees.fixed;

  // Round based on currency decimal places
  const currencyConfig = getCurrencyConfig(currency);
  const decimalPlaces = currencyConfig ? currencyConfig.decimalDigits : 2;

  return parseFloat(totalFee.toFixed(decimalPlaces));
};

export const formatAmount = (amount, currency = 'USD') => {
  const currencyConfig = getCurrencyConfig(currency);
  if (!currencyConfig) {
    return `${amount} ${currency}`;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyConfig.code,
    minimumFractionDigits: currencyConfig.decimalDigits,
    maximumFractionDigits: currencyConfig.decimalDigits,
  });

  return formatter.format(amount);
};

export const validatePaymentAmount = (amount, methodId, currency = 'USD') => {
  const method = getPaymentMethodConfig(methodId);
  if (!method) {
    return {
      valid: false,
      error: 'Payment method not supported',
    };
  }

  if (amount < method.minimumAmount) {
    return {
      valid: false,
      error: `Minimum amount is ${formatAmount(method.minimumAmount, currency)}`,
    };
  }

  if (amount > method.maximumAmount) {
    return {
      valid: false,
      error: `Maximum amount is ${formatAmount(method.maximumAmount, currency)}`,
    };
  }

  return {
    valid: true,
    error: null,
  };
};

export const getSupportedPaymentMethods = (country = 'US', currency = 'USD') => {
  const methods = [];

  Object.keys(PAYMENT_CONFIG.PAYMENT_METHODS).forEach(key => {
    const method = PAYMENT_CONFIG.PAYMENT_METHODS[key];
    if (method.enabled && isPaymentMethodSupported(method.id, country, currency)) {
      methods.push(method);
    }
  });

  return methods;
};

export const getDefaultPaymentMethod = (country = 'US', currency = 'USD') => {
  const supportedMethods = getSupportedPaymentMethods(country, currency);
  return supportedMethods.length > 0 ? supportedMethods[0] : null;
};

// Initialize payment system
export const initializePaymentSystem = async () => {
  console.log(`Initializing ${PAYMENT_CONFIG.APP_NAME} v${PAYMENT_CONFIG.APP_VERSION}`);
  console.log(`Environment: ${PAYMENT_CONFIG.ENVIRONMENT}`);

  // Check if we're in development mode
  if (PAYMENT_CONFIG.ENVIRONMENT === 'development') {
    console.warn('⚠️  Running in development mode. Do not use real payment data.');
  }

  return {
    success: true,
    message: 'Payment system initialized successfully',
    config: PAYMENT_CONFIG,
  };
};

export default PAYMENT_CONFIG;