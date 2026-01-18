import React from 'react';
import './PaymentMethodSelector.css';

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🔗' },
    { id: 'applepay', label: 'Apple Pay', icon: '🍎' },
    { id: 'googlepay', label: 'Google Pay', icon: '📱' }
  ];

  return (
    <div className="payment-method-selector">
      <h3>Select Payment Method</h3>
      <div className="payment-methods-grid">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            className={`payment-method-option ${
              selectedMethod === method.id ? 'selected' : ''
            }`}
            onClick={() => onSelectMethod(method.id)}
            type="button"
          >
            <span className="method-icon">{method.icon}</span>
            <span className="method-label">{method.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;