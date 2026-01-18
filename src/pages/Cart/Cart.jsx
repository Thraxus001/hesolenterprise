import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseConfig';
import { useCart } from '../../contexts/CartContext';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowBack,
  LocalShipping,
  Discount,
  ClearAll,
  Login,
  ShoppingCartCheckout,
  Lock,
  Payment,
  CheckCircle
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    loading,
    user,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    getCartCount
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [updatingQuantities, setUpdatingQuantities] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [shippingAddress, setShippingAddress] = useState(null);

  useEffect(() => {
    // Fetch user's shipping address if logged in
    if (user) {
      fetchShippingAddress();
    }
  }, [user]);

  const fetchShippingAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('shipping_address')
        .eq('id', user.id)
        .single();

      if (!error && data?.shipping_address) {
        setShippingAddress(data.shipping_address);
      }
    } catch (error) {
      console.error('Error fetching shipping address:', error);
    }
  };

  const handleQuantityChange = async (cartItemId, bookId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
      handleRemoveItem(cartItemId);
      return;
    }

    setUpdatingQuantities(prev => ({ ...prev, [cartItemId]: true }));

    try {
      const result = await updateQuantity(cartItemId, newQuantity);
      if (!result.success) {
        showNotification(result.error || 'Failed to update quantity', 'error');
      } else {
        showNotification('Quantity updated successfully', 'success');
      }
    } catch (error) {
      showNotification('An error occurred', 'error');
    } finally {
      setUpdatingQuantities(prev => ({ ...prev, [cartItemId]: false }));
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      const result = await removeFromCart(cartItemId);
      if (!result.success) {
        showNotification(result.error || 'Failed to remove item', 'error');
      } else {
        showNotification('Item removed from cart', 'success');
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      const result = await clearCart();
      if (!result.success) {
        showNotification(result.error || 'Failed to clear cart', 'error');
      } else {
        showNotification('Cart cleared successfully', 'success');
      }
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showNotification('Please enter a coupon code', 'error');
      return;
    }

    setApplyingCoupon(true);
    try {
      // Check coupon validity in database
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .single();

      if (error || !data) {
        throw new Error('Invalid or expired coupon code');
      }

      // Check if coupon has usage limits
      if (data.usage_limit && data.times_used >= data.usage_limit) {
        throw new Error('Coupon usage limit reached');
      }

      // Apply coupon logic here (you would store this in cart or session)
      showNotification(`Coupon "${data.code}" applied! ${data.discount_percent ? `${data.discount_percent}% off` : `${formatCurrency(data.discount_amount)} off`}`, 'success');
      setCouponCode('');

      // You can store the applied coupon in state or context
      // setAppliedCoupon(data);

    } catch (error) {
      showNotification(error.message || 'Invalid coupon code', 'error');
    } finally {
      setApplyingCoupon(false);
    }
  };



  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.books?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.16; // 16% VAT
  };

  const calculateShipping = () => {
    // Standard shipping rate
    return 500;
  };

  const calculateOrderTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }



  if (cartItems.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCartCheckout sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Looks like you haven't added any items to your cart yet.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/products')}
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Browse Books
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Shopping Cart ({getCartCount()} {getCartCount() === 1 ? 'item' : 'items'})
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Cart Items
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<ClearAll />}
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  Clear Cart
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.book_id} className="cart-item-row" hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              component="img"
                              src={item.books?.mainImage || item.books?.image_url || item.books?.images?.[0] || '/placeholder-book.jpg'}
                              alt={item.books?.name || item.books?.title}
                              sx={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 1 }}
                              onError={(e) => {
                                e.target.src = '/placeholder-book.jpg';
                              }}
                            />
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {item.books?.name || item.books?.title || 'Unknown Book'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                by {item.books?.author || 'Unknown Author'}
                              </Typography>
                              <Chip
                                label={item.books?.category || 'General'}
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(item.books?.price || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.book_id, item.book_id, item.quantity, -1)}
                              disabled={updatingQuantities[item.book_id] || loading}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" sx={{ minWidth: 30, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.book_id, item.book_id, item.quantity, 1)}
                              disabled={updatingQuantities[item.book_id] || loading}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency((item.books?.price || 0) * item.quantity)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleRemoveItem(item.book_id)}
                            disabled={loading}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Continue Shopping Button */}
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/books')}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            Continue Shopping
          </Button>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Order Summary
              </Typography>

              {/* Shipping Address Preview */}
              {shippingAddress && (
                <Box sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Shipping to:
                  </Typography>
                  <Typography variant="body2">
                    {shippingAddress.street}
                  </Typography>
                  <Typography variant="body2">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/profile?tab=address')}
                    sx={{ mt: 1 }}
                  >
                    Change Address
                  </Button>
                </Box>
              )}

              {/* Coupon Code */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Have a coupon code?
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={applyingCoupon || loading}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon || !couponCode.trim() || loading}
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Order Details */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal ({getCartCount()} items)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(calculateSubtotal())}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Shipping
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShipping fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(calculateShipping())}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tax (VAT 16%)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(calculateTax())}
                  </Typography>
                </Box>



                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatCurrency(calculateOrderTotal())}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Prices are inclusive of all taxes
                </Typography>

                {/* Checkout Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/checkout')}
                  disabled={loading || cartItems.length === 0}
                  startIcon={<ShoppingCartCheckout />}
                  sx={{ py: 1.5 }}
                >
                  Proceed to Checkout
                </Button>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
                  By proceeding, you agree to our Terms & Conditions
                </Typography>
              </Box>

              {/* Payment Methods */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  We Accept:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip icon={<Payment />} label="Credit Card" size="small" color="primary" variant="outlined" />
                  <Chip icon={<Payment />} label="Debit Card" size="small" color="primary" variant="outlined" />
                  <Chip label="PayPal" size="small" color="primary" variant="outlined" />
                  <Chip label="Bank Transfer" size="small" color="primary" variant="outlined" />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Security Badge */}
          <Card sx={{ mt: 2, bgcolor: 'success.light' }}>
            <CardContent sx={{ py: 2, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                <Lock fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  Secure Checkout
                </Typography>
              </Box>
              <Typography variant="caption" color="success.contrastText">
                Your payment information is encrypted and secure
              </Typography>
            </CardContent>
          </Card>

          {/* Return Policy */}
          <Card sx={{ mt: 2 }}>
            <CardContent sx={{ py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircle fontSize="small" color="success" />
                <Typography variant="subtitle2">
                  30-Day Return Policy
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Easy returns within 30 days of delivery
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;