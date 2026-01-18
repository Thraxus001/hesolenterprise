// src/pages/Checkout/components/ShippingForm.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  LocationOn,
  Person,
  Phone,
  Home,
  Business,
  LocalShipping
} from '@mui/icons-material';
import { validatePhone } from '../../../utils/validators';

const ShippingForm = ({ 
  initialData = {},
  onNext,
  onBack,
  shippingMethods = []
}) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    postalCode: initialData.postalCode || '',
    country: initialData.country || 'Kenya',
    addressType: initialData.addressType || 'home',
    shippingMethod: initialData.shippingMethod || '',
    saveAddress: initialData.saveAddress || false,
    sameAsBilling: initialData.sameAsBilling || true
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid Kenyan phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.shippingMethod) newErrors.shippingMethod = 'Please select a shipping method';
    
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
    <Box component="form" onSubmit={handleSubmit} className="shipping-form">
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person fontSize="small" />
        Contact Information
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone || 'Format: 0712 345 678'}
            required
            size="small"
            InputProps={{
              startAdornment: <Phone fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
            }}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocationOn fontSize="small" />
        Shipping Address
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Address Type
        </Typography>
        <RadioGroup
          row
          name="addressType"
          value={formData.addressType}
          onChange={handleChange}
        >
          <FormControlLabel 
            value="home" 
            control={<Radio size="small" />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Home fontSize="small" />
                Home
              </Box>
            } 
          />
          <FormControlLabel 
            value="business" 
            control={<Radio size="small" />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business fontSize="small" />
                Business
              </Box>
            } 
          />
        </RadioGroup>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={!!errors.address}
            helperText={errors.address}
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
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={!!errors.city}
            helperText={errors.city}
            required
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State/Region"
            name="state"
            value={formData.state}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            size="small"
            disabled
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocalShipping fontSize="small" />
        Shipping Method
      </Typography>

      <FormControl fullWidth error={!!errors.shippingMethod} sx={{ mb: 3 }}>
        <InputLabel>Select Shipping Method</InputLabel>
        <Select
          name="shippingMethod"
          value={formData.shippingMethod}
          onChange={handleChange}
          label="Select Shipping Method"
          size="small"
          required
        >
          {shippingMethods.map((method) => (
            <MenuItem key={method.id} value={method.id}>
              {method.name} - {method.price === 0 ? 'FREE' : `KES ${method.price}`} ({method.duration})
            </MenuItem>
          ))}
        </Select>
        {errors.shippingMethod && (
          <Typography variant="caption" color="error">
            {errors.shippingMethod}
          </Typography>
        )}
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            name="saveAddress"
            checked={formData.saveAddress}
            onChange={handleChange}
            size="small"
          />
        }
        label="Save this address for future orders"
      />

      <FormControlLabel
        control={
          <Checkbox
            name="sameAsBilling"
            checked={formData.sameAsBilling}
            onChange={handleChange}
            size="small"
          />
        }
        label="Billing address same as shipping address"
      />

      {/* Form Actions */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        {onBack && (
          <Button onClick={onBack} variant="outlined">
            Back to Cart
          </Button>
        )}
        <Button type="submit" variant="contained">
          Continue to Payment
        </Button>
      </Box>
    </Box>
  );
};

export default ShippingForm;