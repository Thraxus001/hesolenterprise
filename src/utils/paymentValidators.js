// src/utils/paymentValidators.js

/**
 * Validates a credit card number using the Luhn algorithm.
 * @param {string} cardNumber 
 * @returns {boolean}
 */
export const validateCardNumber = (cardNumber) => {
    if (!cardNumber) return false;

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

/**
 * Determines the card type (brand) based on the number.
 * @param {string} cardNumber 
 * @returns {string} 'visa', 'mastercard', 'amex', 'discover', 'diners', 'jcb', or 'unknown'
 */
export const getCardType = (cardNumber) => {
    if (!cardNumber) return 'unknown';
    const cleaned = cardNumber.replace(/[\s\-]/g, '');

    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'diners';
    if (/^35/.test(cleaned)) return 'jcb';

    return 'unknown';
};

/**
 * Validates the card expiration date.
 * @param {string} expiry - Format "MM/YY" or "MM / YY"
 * @returns {boolean}
 */
export const validateExpiry = (expiry) => {
    if (!expiry) return false;

    const [monthStr, yearStr] = expiry.split('/').map(s => s.trim());

    if (!monthStr || !yearStr) return false;

    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;

    // Check if expired
    const now = new Date();
    const currentYear = parseInt(now.getFullYear().toString().slice(-2));
    const currentMonth = now.getMonth() + 1; // 1-indexed

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
};

/**
 * Validates the CVV/CVC code.
 * @param {string} cvv 
 * @param {string} cardType - Optional, 'amex' uses 4 digits.
 * @returns {boolean}
 */
export const validateCVV = (cvv, cardType = 'unknown') => {
    if (!cvv) return false;
    const cleaned = cvv.replace(/\D/g, '');

    if (cardType === 'amex') {
        return /^\d{4}$/.test(cleaned);
    }
    // Most others are 3 digits
    return /^\d{3,4}$/.test(cleaned);
};
