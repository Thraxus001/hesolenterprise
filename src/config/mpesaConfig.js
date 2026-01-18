// M-Pesa API Configuration
const MPESA_CONFIG = {
    // Environment: 'sandbox' for testing, 'production' for live
    ENVIRONMENT: process.env.REACT_APP_MPESA_ENVIRONMENT || 'sandbox',
    
    // API Endpoints
    API_BASE_URL: process.env.REACT_APP_MPESA_API_BASE_URL || 
      (process.env.REACT_APP_MPESA_ENVIRONMENT === 'production' 
        ? 'https://api.safaricom.co.ke' 
        : 'https://sandbox.safaricom.co.ke'),
    
    // API Paths
    PATHS: {
      AUTH: '/oauth/v1/generate?grant_type=client_credentials',
      STK_PUSH: '/mpesa/stkpush/v1/processrequest',
      STK_QUERY: '/mpesa/stkpushquery/v1/query',
      C2B_REGISTER: '/mpesa/c2b/v1/registerurl',
      C2B_SIMULATE: '/mpesa/c2b/v1/simulate',
      B2C: '/mpesa/b2c/v1/paymentrequest',
      TRANSACTION_STATUS: '/mpesa/transactionstatus/v1/query',
      ACCOUNT_BALANCE: '/mpesa/accountbalance/v1/query',
    },
    
    // API Credentials (Should be stored in environment variables)
    CONSUMER_KEY: process.env.REACT_APP_MPESA_CONSUMER_KEY || 'your_consumer_key_here',
    CONSUMER_SECRET: process.env.REACT_APP_MPESA_CONSUMER_SECRET || 'your_consumer_secret_here',
    PASS_KEY: process.env.REACT_APP_MPESA_PASS_KEY || 'your_pass_key_here',
    SHORT_CODE: process.env.REACT_APP_MPESA_SHORT_CODE || 'your_short_code',
    
    // Transaction Types
    TRANSACTION_TYPES: {
      CUSTOMER_PAY_BILL_ONLINE: 'CustomerPayBillOnline',
      CUSTOMER_BUY_GOODS_ONLINE: 'CustomerBuyGoodsOnline',
    },
    
    // Command IDs
    COMMAND_IDS: {
      CUSTOMER_PAY_BILL_ONLINE: 'CustomerPayBillOnline',
      CUSTOMER_BUY_GOODS_ONLINE: 'CustomerBuyGoodsOnline',
      TRANSACTION_STATUS_QUERY: 'TransactionStatusQuery',
      ACCOUNT_BALANCE: 'AccountBalance',
    },
    
    // Callback URLs (Update these with your actual URLs)
    CALLBACK_URLS: {
      STK_PUSH: process.env.REACT_APP_MPESA_CALLBACK_URL || 'https://yourdomain.com/api/mpesa/callback',
      C2B_VALIDATION: process.env.REACT_APP_MPESA_C2B_VALIDATION_URL || 'https://yourdomain.com/api/mpesa/validate',
      C2B_CONFIRMATION: process.env.REACT_APP_MPESA_C2B_CONFIRMATION_URL || 'https://yourdomain.com/api/mpesa/confirm',
      B2C_RESULT: process.env.REACT_APP_MPESA_B2C_RESULT_URL || 'https://yourdomain.com/api/mpesa/b2c/result',
      B2C_QUEUE_TIMEOUT: process.env.REACT_APP_MPESA_B2C_TIMEOUT_URL || 'https://yourdomain.com/api/mpesa/b2c/timeout',
    },
    
    // Default transaction settings
    DEFAULTS: {
      TRANSACTION_TYPE: 'CustomerPayBillOnline',
      AMOUNT: 1,
      PHONE_NUMBER: '', // Should be provided by user
      ACCOUNT_REFERENCE: 'Payment',
      TRANSACTION_DESC: 'Payment for services',
      PARTY_A: process.env.REACT_APP_MPESA_SHORT_CODE || 'your_short_code',
      PARTY_B: process.env.REACT_APP_MPESA_SHORT_CODE || 'your_short_code',
    },
    
    // Security settings
    SECURITY: {
      TIMEOUT: 30000, // 30 seconds
      MAX_RETRIES: 3,
      ENCRYPTION_KEY: process.env.REACT_APP_MPESA_ENCRYPTION_KEY || '',
    },
    
    // Business Information
    BUSINESS_INFO: {
      NAME: 'Your Business Name',
      LOGO_URL: 'https://yourdomain.com/logo.png',
      SUPPORT_PHONE: '+254700000000',
      SUPPORT_EMAIL: 'support@yourdomain.com',
    },
    
    // M-Pesa supported countries
    SUPPORTED_COUNTRIES: ['KE'], // Kenya
    
    // Currency configuration
    CURRENCY: {
      CODE: 'KES',
      SYMBOL: 'KSh',
      DECIMAL_PLACES: 0, // KSH doesn't have cents
    },
    
    // Validation rules
    VALIDATION: {
      PHONE_NUMBER_REGEX: /^(\+?254|0)[17]\d{8}$/, // Kenyan phone number format
      MIN_AMOUNT: 1,
      MAX_AMOUNT: 150000, // M-Pesa limit for unverified accounts
      MAX_DAILY_TRANSACTIONS: 10,
      MAX_DAILY_AMOUNT: 300000,
    },
  };
  
  // M-Pesa utility functions
  export const generatePassword = (shortCode, passKey, timestamp) => {
    const stringToEncode = shortCode + passKey + timestamp;
    return Buffer.from(stringToEncode).toString('base64');
  };
  
  export const generateTimestamp = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };
  
  export const formatPhoneNumber = (phoneNumber) => {
    // Convert phone number to format 2547XXXXXXXX
    let formatted = phoneNumber.trim();
    
    // Remove spaces, dashes, and parentheses
    formatted = formatted.replace(/[\s\-()]/g, '');
    
    // Convert to international format
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('+')) {
      formatted = formatted.substring(1);
    }
    
    // Ensure it starts with 254
    if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    
    return formatted;
  };
  
  export const validatePhoneNumber = (phoneNumber) => {
    const formatted = formatPhoneNumber(phoneNumber);
    return MPESA_CONFIG.VALIDATION.PHONE_NUMBER_REGEX.test(formatted);
  };
  
  export const validateAmount = (amount) => {
    return amount >= MPESA_CONFIG.VALIDATION.MIN_AMOUNT && 
           amount <= MPESA_CONFIG.VALIDATION.MAX_AMOUNT;
  };
  
  export default MPESA_CONFIG;