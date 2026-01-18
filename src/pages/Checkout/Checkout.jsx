import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  LocalAtm,
  PhoneAndroid,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';

const CheckoutPage = () => {
  const navigate = useNavigate();
  // user Removed from cart context
  const { cartItems, calculateTotal, clearCart, loading: cartLoading } = useCart();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Guest & Shipping State
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Confirmed Order State (for success screen)
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Form states
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('mpesa'); // Default to M-Pesa since card is hidden
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [isWaitingForMpesa, setIsWaitingForMpesa] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const steps = ['Cart Review', 'Details & Shipping', 'Payment', 'Confirmation'];

  // Calculate functions
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.books?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const calculateShippingCost = () => {
    const subtotal = calculateSubtotal();
    if (shippingMethod === 'express') return 9.99;
    if (shippingMethod === 'standard') return 5.99;
    return subtotal > 50 ? 0 : 5.99;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.16; // 16% VAT
  };

  const calculateOrderTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShippingCost();
  };

  const handleGuestInput = (e) => {
    setGuestDetails({ ...guestDetails, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (activeStep === 0 && cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (activeStep === 1) {
      const { firstName, lastName, email, phone, address, city, zipCode } = guestDetails;
      if (!firstName || !lastName || !email || !phone || !address || !city || !zipCode) {
        setError('Please fill in all required fields');
        return;
      }
    }

    setError('');
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const fullAddress = {
        street: guestDetails.address,
        city: guestDetails.city,
        state: guestDetails.state,
        zipCode: guestDetails.zipCode,
        name: `${guestDetails.firstName} ${guestDetails.lastName}`,
        phone: guestDetails.phone,
        email: guestDetails.email // Added email to address
      };

      // Ensure M-Pesa phone is set
      const finalMpesaPhone = mpesaPhone || guestDetails.phone;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: null, // Explicitly null for guest
          guest_name: `${guestDetails.firstName} ${guestDetails.lastName}`,
          guest_email: guestDetails.email,
          customer_email: guestDetails.email, // Added standard field
          guest_phone: guestDetails.phone,
          status: 'pending',
          total_amount: calculateOrderTotal(),
          subtotal: calculateSubtotal(),
          tax_amount: calculateTax(),
          shipping_amount: calculateShippingCost(),
          shipping_address: fullAddress,
          billing_address: billingSameAsShipping ? fullAddress : fullAddress, // simplified for now
          payment_method: paymentMethod,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Store confirmed order details for the summary view
      setConfirmedOrder(order);

      // Fetch fresh book details to ensure we have titles and current prices
      const bookIds = cartItems.map(item => item.book_id);
      const { data: books, error: booksError } = await supabase
        .from('books')
        .select('id, title, price, stock_quantity')
        .in('id', bookIds);

      if (booksError) throw booksError;

      // Create a map for easy lookup
      const bookMap = books.reduce((acc, book) => {
        acc[book.id] = book;
        return acc;
      }, {});

      // Create order items using fresh data
      const orderItems = cartItems.map(item => {
        const book = bookMap[item.book_id];
        if (!book) {
          throw new Error(`Book with ID ${item.book_id} not found`);
        }
        return {
          order_id: order.id,
          book_id: item.book_id,
          title: book.title, // Ensure title is from DB
          unit_price: book.price, // Ensure price is from DB
          quantity: item.quantity
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update book stock quantities
      for (const item of cartItems) {
        if (item.books) {
          await supabase
            .from('books')
            .update({
              stock_quantity: Math.max(0, (item.books.stock_quantity || 0) - item.quantity)
            })
            .eq('id', item.book_id);
        }
      }


      // Handle M-Pesa Payment Flow
      if (paymentMethod === 'mpesa') {
        setIsWaitingForMpesa(true);

        // 1. Trigger STK Push
        const { data: mpesaData, error: mpesaError } = await supabase.functions.invoke('mpesa-initiate', {
          body: {
            amount: Math.ceil(calculateOrderTotal()), // M-Pesa requires integer
            phoneNumber: finalMpesaPhone.replace('+', ''), // Format: 2547XXXXXXXX
            accountReference: "HesolBooks"
          }
        });

        if (mpesaError) throw mpesaError;

        // 2. Update Order with Request ID (so callback can find it)
        if (mpesaData?.CheckoutRequestID) {
          await supabase.from('orders').update({
            mpesa_request_id: mpesaData.CheckoutRequestID
          }).eq('id', order.id);
        }

        // 3. Listen for Payment Confirmation
        const channel = supabase
          .channel('mpesa-payment')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'orders',
              filter: `id=eq.${order.id}`
            },
            (payload) => {
              if (payload.new.payment_status === 'paid') {
                setIsWaitingForMpesa(false);
                clearCart();
                setActiveStep(3);
                supabase.removeChannel(channel);
              } else if (payload.new.status === 'failed') {
                setIsWaitingForMpesa(false);
                setError('Payment failed or was cancelled. Please try again.');
                supabase.removeChannel(channel);
              }
            }
          )
          .subscribe();

        // Stop listening after 2 minutes of no action
        setTimeout(() => {
          if (isWaitingForMpesa) {
            setIsWaitingForMpesa(false);
            supabase.removeChannel(channel);
            setError('Payment timed out. Please try again.');
          }
        }, 120000);

        return; // Pause here, let realtime handle the next step
      }

      // Clear cart for other methods
      await clearCart();

      // Move to confirmation step
      setActiveStep(3);

    } catch (error) {
      console.error('Error placing order:', error);
      setError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Review Your Cart</Typography>
              <List>
                {cartItems.map((item) => (
                  <ListItem key={item.book_id} divider>
                    <ListItemAvatar>
                      <Avatar src={item.books?.image_url} variant="rounded">{item.books?.title?.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.books?.title}
                      secondary={`Quantity: ${item.quantity} × ${formatCurrency(item.books?.price)}`}
                    />
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatCurrency((item.books?.price || 0) * item.quantity)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
              {cartItems.length === 0 && <Typography sx={{ py: 2, textAlign: 'center' }}>Your cart is empty.</Typography>}
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Guest Details & Shipping</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="First Name" name="firstName" value={guestDetails.firstName} onChange={handleGuestInput} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Last Name" name="lastName" value={guestDetails.lastName} onChange={handleGuestInput} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email" name="email" type="email" value={guestDetails.email} onChange={handleGuestInput} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone" name="phone" value={guestDetails.phone} onChange={handleGuestInput} required />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}><Typography variant="caption">ADDRESS</Typography></Divider>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Street Address" name="address" value={guestDetails.address} onChange={handleGuestInput} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="City" name="city" value={guestDetails.city} onChange={handleGuestInput} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="State/Province" name="state" value={guestDetails.state} onChange={handleGuestInput} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Zip Code" name="zipCode" value={guestDetails.zipCode} onChange={handleGuestInput} required />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Shipping Method</FormLabel>
                  <RadioGroup value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                    <FormControlLabel
                      value="standard"
                      control={<Radio />}
                      label={`Standard Shipping - ${calculateSubtotal() > 50 ? 'FREE' : formatCurrency(5.99)}`}
                    />
                    <FormControlLabel
                      value="express"
                      control={<Radio />}
                      label={`Express Shipping - ${formatCurrency(9.99)}`}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Method</Typography>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  {/* 
                  <FormControlLabel value="credit_card" control={<Radio />} label={<Box sx={{ display: 'flex', gap: 1 }}><CreditCard />Credit Card</Box>} />
                  */}
                  <FormControlLabel value="mpesa" control={<Radio />} label={<Box sx={{ display: 'flex', gap: 1 }}><PhoneAndroid />M-Pesa (Mobile Money)</Box>} />
                  <FormControlLabel value="cash_on_delivery" control={<Radio />} label={<Box sx={{ display: 'flex', gap: 1 }}><LocalAtm />Cash on Delivery</Box>} />
                </RadioGroup>
              </FormControl>

              {paymentMethod === 'mpesa' && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>M-Pesa Payment</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    We will send a payment request to your phone. Please enter your PIN to complete the transaction.
                  </Typography>
                  <TextField
                    fullWidth
                    label="M-Pesa Phone Number"
                    placeholder="2547XXXXXXXX"
                    value={mpesaPhone || guestDetails.phone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    helperText="Ensure this phone is on and has M-Pesa active."
                  />
                  {isWaitingForMpesa && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
                      <CircularProgress size={24} />
                      <Typography color="primary" fontWeight="bold">Waiting for payment confirmation...</Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Credit Card Form - Hidden for now
              {paymentMethod === 'credit_card' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Simulated Payment Form</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Card Number" placeholder="0000 0000 0000 0000" />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="Expiry" placeholder="MM/YY" />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField fullWidth label="CVV" placeholder="123" />
                    </Grid>
                  </Grid>
                </Box>
              )}
              */}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
              <Typography variant="h4" gutterBottom>Order Confirmed!</Typography>
              <Typography paragraph>Thank you! Your order has been placed successfully.</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                We have sent a confirmation to {guestDetails.email}.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/')}>Return Home</Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (cartLoading || loading) {
    return (
      <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>{renderStepContent(activeStep)}</Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">
                  {formatCurrency(confirmedOrder ? confirmedOrder.subtotal : calculateSubtotal())}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">
                  {formatCurrency(confirmedOrder ? confirmedOrder.shipping_amount : calculateShippingCost())}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">
                  {formatCurrency(confirmedOrder ? confirmedOrder.tax_amount : calculateTax())}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  {formatCurrency(confirmedOrder ? confirmedOrder.total_amount : calculateOrderTotal())}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                {activeStep > 0 && activeStep < 3 && (
                  <Button fullWidth variant="outlined" onClick={handleBack}>Back</Button>
                )}
                {activeStep < 3 && (
                  <Button fullWidth variant="contained" onClick={activeStep === steps.length - 2 ? handlePlaceOrder : handleNext}>
                    {activeStep === steps.length - 2 ? 'Place Order' : 'Continue'}
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;