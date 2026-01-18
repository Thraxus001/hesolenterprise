// src/pages/Checkout/components/BillingForm.jsx
import React, { useState } from 'react';
import { Business } from '@mui/icons-material';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Divider
} from '@mui/material';
import {
  Payment,
  CreditCard,
  AccountBalance,
  Receipt
} from '@mui/icons-material';

const BillingForm = ({ 
  initialData = {},
  onNext,
  onBack,
  useShippingAddress = true
}) => {
  const [formData, setFormData] = useState({
    ...initialData,
    sameAsShipping: initialData.sameAsShipping !== undefined ? initialData.sameAsShipping : useShippingAddress
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.sameAsShipping) {
      if (!formData.billingFirstName?.trim()) newErrors.billingFirstName = 'First name is required';
      if (!formData.billingLastName?.trim()) newErrors.billingLastName = 'Last name is required';
      if (!formData.billingAddress?.trim()) newErrors.billingAddress = 'Address is required';
      if (!formData.billingCity?.trim()) newErrors.billingCity = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && onNext) {
      onNext(formData);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="billing-form">
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Payment fontSize="small" />
        Billing Information
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            name="sameAsShipping"
            checked={formData.sameAsShipping}
            onChange={handleChange}
            size="small"
          />
        }
        label="Billing address same as shipping address"
        sx={{ mb: 3 }}
      />

      {!formData.sameAsShipping && (
        <>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Billing Address
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="billingFirstName"
                value={formData.billingFirstName || ''}
                onChange={handleChange}
                error={!!errors.billingFirstName}
                helperText={errors.billingFirstName}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="billingLastName"
                value={formData.billingLastName || ''}
                onChange={handleChange}
                error={!!errors.billingLastName}
                helperText={errors.billingLastName}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company (Optional)"
                name="billingCompany"
                value={formData.billingCompany || ''}
                onChange={handleChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="billingAddress"
                value={formData.billingAddress || ''}
                onChange={handleChange}
                error={!!errors.billingAddress}
                helperText={errors.billingAddress}
                required
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="billingCity"
                value={formData.billingCity || ''}
                onChange={handleChange}
                error={!!errors.billingCity}
                helperText={errors.billingCity}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="billingPostalCode"
                value={formData.billingPostalCode || ''}
                onChange={handleChange}
                size="small"
              />
            </Grid>
          </Grid>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Receipt fontSize="small" />
        Receipt Information
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Receipt Type
        </Typography>
        <RadioGroup
          row
          name="receiptType"
          value={formData.receiptType || 'personal'}
          onChange={handleChange}
        >
          <FormControlLabel 
            value="personal" 
            control={<Radio size="small" />} 
            label="Personal Receipt" 
          />
          <FormControlLabel 
            value="business" 
            control={<Radio size="small" />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business fontSize="small" />
                Business Receipt (with VAT)
              </Box>
            } 
          />
        </RadioGroup>
      </Box>

      {formData.receiptType === 'business' && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName || ''}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="VAT Number"
              name="vatNumber"
              value={formData.vatNumber || ''}
              onChange={handleChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Business Registration Number"
              name="businessRegNumber"
              value={formData.businessRegNumber || ''}
              onChange={handleChange}
              size="small"
            />
          </Grid>
        </Grid>
      )}

      <TextField
        fullWidth
        label="Order Notes (Optional)"
        name="orderNotes"
        value={formData.orderNotes || ''}
        onChange={handleChange}
        size="small"
        multiline
        rows={3}
        placeholder="Special instructions for your order..."
        sx={{ mb: 3 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter || false}
            onChange={handleChange}
            size="small"
          />
        }
        label="Subscribe to our newsletter for updates and offers"
      />

      <FormControlLabel
        control={
          <Checkbox
            name="termsAccepted"
            checked={formData.termsAccepted || false}
            onChange={handleChange}
            size="small"
            required
          />
        }
        label={
          <Typography variant="body2">
            I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </Typography>
        }
      />

      {/* Form Actions */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        {onBack && (
          <Button onClick={onBack} variant="outlined">
            Back to Shipping
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={!formData.termsAccepted}>
          Review Order
        </Button>
      </Box>
    </Box>
  );
};

export default BillingForm;