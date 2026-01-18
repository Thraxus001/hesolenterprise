// src/pages/Checkout/components/CheckoutSummary.jsx
import React from 'react';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip
} from '@mui/material';
import {
  LocalShipping,
  Payment,
  Discount,
  Security
} from '@mui/icons-material';
import { formatCurrency } from '../../../utils/formatters';

const CheckoutSummary = ({ 
  cart,
  shippingMethod,
  discount = 0,
  taxRate = 0.16
}) => {
  const subtotal = cart?.subtotal || 0;
  const shippingCost = shippingMethod?.price || 0;
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax - discount;

  const orderItems = cart?.items || [];

  return (
    <Box className="checkout-summary">
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Payment fontSize="small" />
        Order Summary
      </Typography>

      {/* Order Items */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Items ({orderItems.length})
        </Typography>
        <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
          {orderItems.map((item, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemAvatar>
                <Avatar 
                  src={item.image} 
                  alt={item.name}
                  variant="rounded"
                  sx={{ width: 40, height: 40 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={`${item.quantity} × ${formatCurrency(item.price)}`}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
              <Typography variant="body2" fontWeight={600}>
                {formatCurrency(item.total)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Price Breakdown */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Subtotal
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatCurrency(subtotal)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Shipping
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping fontSize="small" />
            <Typography variant="body2" fontWeight={600}>
              {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Tax (VAT {taxRate * 100}%)
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {formatCurrency(tax)}
          </Typography>
        </Box>
        
        {discount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Discount
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Discount fontSize="small" color="success" />
              <Typography variant="body2" fontWeight={600} color="success.main">
                -{formatCurrency(discount)}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Total */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            Total Amount
          </Typography>
          <Typography variant="h5" fontWeight={700} color="primary">
            {formatCurrency(total)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Prices are inclusive of all taxes
        </Typography>
      </Box>

      {/* Shipping Info */}
      {shippingMethod && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalShipping fontSize="small" />
            Shipping Method
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {shippingMethod.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Estimated delivery: {shippingMethod.duration}
          </Typography>
        </Box>
      )}

      {/* Security Badge */}
      <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, textAlign: 'center' }}>
        <Security fontSize="small" sx={{ color: 'success.main', mb: 1 }} />
        <Typography variant="caption" sx={{ color: 'success.main', display: 'block' }}>
          🔒 Secure Checkout
        </Typography>
        <Typography variant="caption" sx={{ color: 'success.dark' }}>
          Your payment information is encrypted and secure
        </Typography>
      </Box>

      {/* Payment Methods */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          We Accept:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="MPesa" size="small" />
          <Chip label="Visa" size="small" />
          <Chip label="MasterCard" size="small" />
          <Chip label="Cash on Delivery" size="small" />
        </Box>
      </Box>
    </Box>
  );
};

export default CheckoutSummary;