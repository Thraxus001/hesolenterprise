// src/utils/validators.js
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePhone = (phone) => {
    // Kenyan phone numbers: 0712 345 678 or 254712345678
    const re = /^(07\d{8}|2547\d{8}|01\d{8})$/;
    return re.test(phone.replace(/\s+/g, ''));
  };
  
  export const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };
  
  export const validateRequired = (value) => {
    return value && value.toString().trim().length > 0;
  };
  
  export const validateNumber = (value, min = null, max = null) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
  };