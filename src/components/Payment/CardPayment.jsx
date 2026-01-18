import React, { useState } from 'react';
import './CardPayment.css';

const CardPayment = ({ 
  paymentDetails, 
  onUpdateDetails, 
  processing = false 
}) => {
  const [errors, setErrors] = useState({});

  const validateCardNumber = (number) => {
    const cleaned = number.replace(/\s+/g, '');
    return /^\d{16}$/.test(cleaned);
  };

  const validateExpiry = (expiry) => {
    return /^\d{2}\/\d{2}$/.test(expiry);
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    onUpdateDetails({ cardNumber: formatted });
    
    if (formatted.replace(/\s/g, '').length === 16) {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    onUpdateDetails({ expiryDate: value });
    
    if (value.length === 5) {
      setErrors(prev => ({ ...prev, expiryDate: '' }));
    }
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    onUpdateDetails({ cvv: value.substring(0, 4) });
    
    if (value.length >= 3) {
      setErrors(prev => ({ ...prev, cvv: '' }));
    }
  };

  const handleNameChange = (e) => {
    onUpdateDetails({ nameOnCard: e.target.value });
  };

  const handleSaveCardChange = (e) => {
    onUpdateDetails({ saveCard: e.target.checked });
  };

  const validateAll = () => {
    const newErrors = {};
    if (!validateCardNumber(paymentDetails.cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    if (!validateExpiry(paymentDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date as MM/YY';
    }
    if (!validateCVV(paymentDetails.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV (3-4 digits)';
    }
    if (!paymentDetails.nameOnCard.trim()) {
      newErrors.nameOnCard = 'Please enter name on card';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="card-payment-form">
      <h3>Card Details</h3>
      
      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          value={paymentDetails.cardNumber}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          disabled={processing}
          className={errors.cardNumber ? 'error' : ''}
        />
        {errors.cardNumber && (
          <span className="error-message">{errors.cardNumber}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            value={paymentDetails.expiryDate}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            maxLength="5"
            disabled={processing}
            className={errors.expiryDate ? 'error' : ''}
          />
          {errors.expiryDate && (
            <span className="error-message">{errors.expiryDate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="password"
            id="cvv"
            value={paymentDetails.cvv}
            onChange={handleCVVChange}
            placeholder="123"
            maxLength="4"
            disabled={processing}
            className={errors.cvv ? 'error' : ''}
          />
          {errors.cvv && (
            <span className="error-message">{errors.cvv}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="nameOnCard">Name on Card</label>
        <input
          type="text"
          id="nameOnCard"
          value={paymentDetails.nameOnCard}
          onChange={handleNameChange}
          placeholder="John Doe"
          disabled={processing}
          className={errors.nameOnCard ? 'error' : ''}
        />
        {errors.nameOnCard && (
          <span className="error-message">{errors.nameOnCard}</span>
        )}
      </div>

      <div className="form-group checkbox-group">
        <input
          type="checkbox"
          id="saveCard"
          checked={paymentDetails.saveCard}
          onChange={handleSaveCardChange}
          disabled={processing}
        />
        <label htmlFor="saveCard">Save this card for future payments</label>
      </div>

      <div className="card-icons">
        <span className="card-icon visa">Visa</span>
        <span className="card-icon mastercard">MasterCard</span>
        <span className="card-icon amex">Amex</span>
        <span className="card-icon discover">Discover</span>
      </div>
    </div>
  );
};

export default CardPayment;