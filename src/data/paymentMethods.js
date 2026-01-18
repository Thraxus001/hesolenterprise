// src/data/paymentMethod.js
export const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Mobile money payment via Safaricom M-Pesa',
      icon: 'mobile',
      status: 'active',
      supportedCountries: ['Kenya'],
      currencies: ['KES'],
      fees: {
        percentage: 0,
        fixed: 0,
        description: 'No transaction fees'
      },
      instructions: [
        'Go to M-Pesa menu on your phone',
        'Select Lipa na M-Pesa',
        'Select Pay Bill',
        'Enter Business Number: 123456',
        'Enter Account Number: Your Order ID',
        'Enter Amount',
        'Enter your M-Pesa PIN'
      ],
      limits: {
        minAmount: 10,
        maxAmount: 150000,
        dailyLimit: 300000
      },
      processingTime: 'Instant',
      requirements: ['Safaricom line with M-Pesa', 'Registered M-Pesa account'],
      isPopular: true,
      iconColor: '#FFC72C',
      backgroundColor: '#00A95C'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, or American Express',
      icon: 'credit_card',
      status: 'active',
      supportedCountries: ['Global'],
      currencies: ['KES', 'USD', 'EUR', 'GBP'],
      fees: {
        percentage: 2.9,
        fixed: 30,
        description: '2.9% + KES 30 per transaction'
      },
      instructions: [
        'Enter your card details',
        'Provide cardholder name',
        'Enter expiry date and CVV',
        'Complete 3D Secure verification if prompted'
      ],
      limits: {
        minAmount: 100,
        maxAmount: 500000,
        dailyLimit: 1000000
      },
      processingTime: '2-3 business days',
      requirements: ['Valid credit/debit card'],
      isPopular: true,
      iconColor: '#1A1F71',
      backgroundColor: '#F0F0F0'
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer or RTGS',
      icon: 'account_balance',
      status: 'active',
      supportedCountries: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'],
      currencies: ['KES', 'USD', 'EUR'],
      fees: {
        percentage: 0,
        fixed: 0,
        description: 'Bank charges may apply'
      },
      instructions: [
        'Initiate transfer from your bank',
        'Use account details provided',
        'Include Order ID as reference',
        'Send proof of payment to payments@hesol.com'
      ],
      bankDetails: {
        bankName: 'Equity Bank Kenya',
        accountName: 'HeSol Enterprise Ltd',
        accountNumber: '1234567890',
        branch: 'Nairobi CBD',
        swiftCode: 'EQBLKENA'
      },
      limits: {
        minAmount: 500,
        maxAmount: 1000000,
        dailyLimit: 5000000
      },
      processingTime: '1-3 business days',
      requirements: ['Bank account', 'Proof of payment'],
      isPopular: false,
      iconColor: '#0066B3',
      backgroundColor: '#E8F4FD'
    },
    {
      id: 'cash_on_delivery',
      name: 'Cash on Delivery',
      description: 'Pay when your order is delivered',
      icon: 'local_shipping',
      status: 'active',
      supportedCountries: ['Kenya'],
      currencies: ['KES'],
      fees: {
        percentage: 0,
        fixed: 200,
        description: 'KES 200 cash handling fee'
      },
      instructions: [
        'Select Cash on Delivery at checkout',
        'Our delivery agent will contact you',
        'Pay exact amount upon delivery',
        'Get your receipt'
      ],
      limits: {
        minAmount: 100,
        maxAmount: 50000,
        dailyLimit: 50000
      },
      processingTime: 'On delivery',
      requirements: ['Cash in exact amount'],
      isPopular: true,
      iconColor: '#4CAF50',
      backgroundColor: '#E8F5E9'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Secure online payments via PayPal',
      icon: 'payments',
      status: 'active',
      supportedCountries: ['Global'],
      currencies: ['USD', 'EUR', 'GBP'],
      fees: {
        percentage: 3.4,
        fixed: 0.30,
        description: '3.4% + $0.30 per transaction'
      },
      instructions: [
        'Click PayPal button',
        'Log in to your PayPal account',
        'Review payment details',
        'Confirm payment'
      ],
      limits: {
        minAmount: 1,
        maxAmount: 10000,
        dailyLimit: 50000
      },
      processingTime: 'Instant',
      requirements: ['PayPal account'],
      isPopular: false,
      iconColor: '#003087',
      backgroundColor: '#F5F5F5'
    }
  ];
  
  // Helper functions
  export const getPaymentMethodById = (id) => {
    return paymentMethods.find(method => method.id === id);
  };
  
  export const getActivePaymentMethods = () => {
    return paymentMethods.filter(method => method.status === 'active');
  };
  
  export const getPopularPaymentMethods = () => {
    return paymentMethods.filter(method => method.isPopular);
  };
  
  export const getPaymentMethodsByCountry = (country) => {
    return paymentMethods.filter(method => 
      method.supportedCountries.includes(country) || 
      method.supportedCountries.includes('Global')
    );
  };
  
  export const getDefaultPaymentMethod = () => {
    return paymentMethods.find(method => method.id === 'mpesa');
  };
  
  // Payment statuses
  export const paymentStatuses = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled'
  };
  
  // Payment currencies
  export const currencies = {
    KES: {
      code: 'KES',
      symbol: 'KSh',
      name: 'Kenyan Shilling',
      decimalDigits: 2
    },
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      decimalDigits: 2
    },
    EUR: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimalDigits: 2
    },
    GBP: {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound',
      decimalDigits: 2
    }
  };
  
  // Example transaction data structure
  export const createTransaction = (data) => {
    return {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: data.orderId,
      paymentMethod: data.paymentMethod,
      amount: data.amount,
      currency: data.currency || 'KES',
      status: paymentStatuses.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: data.metadata || {},
      customer: data.customer || {}
    };
  };