// src/components/CartItem/CartItem.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './CartItem.css';
import { formatCurrency } from '../../utils/formatters';

// Icons (you can use Material-UI icons or any other)
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorIcon from '@mui/icons-material/Error';

const CartItem = ({
  item,
  onQuantityChange,
  onRemove,
  className = '',
  isUpdating = false,
  error = null
}) => {
  const {
    id,
    name,
    sku,
    price,
    originalPrice,
    quantity,
    image,
    stock,
    maxQuantity = 10
  } = item;

  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const stockStatus = stock > 5 ? 'in-stock' : stock > 0 ? 'low-stock' : 'out-of-stock';
  const stockText = stock > 5 ? 'In Stock' : stock > 0 ? `Low Stock (${stock})` : 'Out of Stock';

  const total = (price * localQuantity).toFixed(2);
  const hasDiscount = originalPrice && originalPrice > price;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || newQuantity > maxQuantity) return;

    setLocalQuantity(newQuantity);
    setIsAnimating(true);

    // Trigger animation
    setTimeout(() => setIsAnimating(false), 500);

    if (onQuantityChange) {
      onQuantityChange(id, newQuantity);
    }
  };

  const increment = () => handleQuantityChange(localQuantity + 1);
  const decrement = () => handleQuantityChange(localQuantity - 1);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      if (onRemove) {
        onRemove(id);
      }
    }, 300);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    handleQuantityChange(Math.min(Math.max(1, value), maxQuantity));
  };

  const animationClass = isAnimating ? 'cart-item-added' : '';
  const removingClass = isRemoving ? 'cart-item-removing' : '';
  const loadingClass = isUpdating ? 'cart-item-loading' : '';
  const errorClass = error ? 'cart-item-error' : '';

  return (
    <div className={`cart-item ${animationClass} ${removingClass} ${loadingClass} ${errorClass} ${className}`}>
      {/* Product Image */}
      <div className="cart-item-image-container">
        <img
          src={image || `https://via.placeholder.com/80x80?text=${name.substring(0, 1)}`}
          alt={name}
          className="cart-item-image"
        />
      </div>

      {/* Product Details */}
      <div className="cart-item-details">
        <h4 className="cart-item-title">{name}</h4>

        <div className="cart-item-meta">
          <span className="cart-item-sku">SKU: {sku}</span>
          <span className={`cart-item-stock ${stockStatus}`}>
            {stockText}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="cart-item-error-message">
            <ErrorIcon fontSize="small" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="cart-item-actions">
          {/* Quantity Control */}
          <div className="cart-item-quantity">
            <button
              className="quantity-button"
              onClick={decrement}
              disabled={localQuantity <= 1 || isUpdating}
              aria-label="Decrease quantity"
            >
              <RemoveIcon fontSize="small" />
            </button>

            <input
              type="number"
              min="1"
              max={maxQuantity}
              value={localQuantity}
              onChange={handleInputChange}
              className="quantity-input"
              disabled={isUpdating}
              aria-label="Quantity"
            />

            <button
              className="quantity-button"
              onClick={increment}
              disabled={localQuantity >= maxQuantity || isUpdating || stock === 0}
              aria-label="Increase quantity"
            >
              <AddIcon fontSize="small" />
            </button>
          </div>

          {/* Price Display */}
          <div className="cart-item-price">
            <span className="cart-item-price-current">
              {formatCurrency(price)}
            </span>
            {hasDiscount && (
              <span className="cart-item-price-original">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>

          {/* Total */}
          <div className="cart-item-total">
            <span className="cart-item-total-label">Total</span>
            <span className="cart-item-total-value">{formatCurrency(price * localQuantity)}</span>
          </div>

          {/* Remove Button */}
          <button
            className="cart-item-remove"
            onClick={handleRemove}
            disabled={isUpdating}
            aria-label="Remove item"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    sku: PropTypes.string,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    quantity: PropTypes.number.isRequired,
    image: PropTypes.string,
    stock: PropTypes.number,
    maxQuantity: PropTypes.number
  }).isRequired,
  onQuantityChange: PropTypes.func,
  onRemove: PropTypes.func,
  className: PropTypes.string,
  isUpdating: PropTypes.bool,
  error: PropTypes.string
};

CartItem.defaultProps = {
  onQuantityChange: null,
  onRemove: null,
  className: '',
  isUpdating: false,
  error: null
};

export default CartItem;