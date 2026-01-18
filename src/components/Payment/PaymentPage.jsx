// src/pages/Payment/PaymentPage.jsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as WalletIcon,
  Smartphone as PhoneIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { usePayment } from '../../contexts/PaymentContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartTotal } = useCart();
  const { setPaymentMethod } = usePayment();

  const [activeStep, setActiveStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const totalAmount = location.state?.total || getCartTotal();
  const orderId = location.state?.orderId || `ORDER-${Date.now()}`;

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'MPESA',
      description: 'Pay instantly via MPESA (Kenya)',
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      color: '#00A859', // MPESA green
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay with Visa, MasterCard, or American Express',
      icon: <CreditCardIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay securely with your PayPal account',
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: '#00457C',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Manual bank transfer (requires confirmation)',
      icon: <WalletIcon sx={{ fontSize: 40 }} />,
      color: '#673ab7',
    },
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setActiveStep(1);
  };

  const handleProceed = () => {
    if (!selectedMethod) return;

    setPaymentMethod(selectedMethod);

    switch (selectedMethod) {
      case 'mpesa':
        navigate('/payment/mpesa', {
          state: { total: totalAmount, orderId },
        });
        break;
      case 'card':
        navigate('/payment/card', {
          state: { total: totalAmount, orderId },
        });
        break;
      case 'paypal':
        // Handle PayPal integration
        break;
      case 'bank':
        navigate('/payment/bank', {
          state: { total: totalAmount, orderId },
        });
        break;
      default:
        break;
    }
  };

  const steps = ['Select Payment Method', 'Complete Payment'];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <PaymentIcon sx={{ verticalAlign: 'middle', mr: 2 }} />
          Complete Your Payment
        </Typography>
        <Typography variant="h6" color="primary">
          Total Amount: KSH {totalAmount.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Order #{orderId}
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 ? (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Choose Payment Method
          </Typography>
          <Alert severity="info" sx={{ mb: 4 }}>
            Your payment information is secure and encrypted. We support multiple payment methods for your convenience.
          </Alert>

          <Grid container spacing={3}>
            {paymentMethods.map((method) => (
              <Grid item xs={12} sm={6} key={method.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: selectedMethod === method.id ? 2 : 1,
                    borderColor: selectedMethod === method.id ? method.color : 'divider',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      borderColor: method.color,
                    },
                  }}
                  onClick={() => handleMethodSelect(method.id)}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ color: method.color, mb: 2 }}>
                      {method.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {method.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {method.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant={selectedMethod === method.id ? 'contained' : 'outlined'}
                      sx={{
                        backgroundColor: selectedMethod === method.id ? method.color : 'transparent',
                        borderColor: method.color,
                        color: selectedMethod === method.id ? 'white' : method.color,
                        '&:hover': {
                          backgroundColor: method.color,
                          color: 'white',
                        },
                      }}
                    >
                      {selectedMethod === method.id ? 'Selected' : 'Select'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/checkout')}
            >
              Back to Checkout
            </Button>
            <Button
              variant="contained"
              onClick={handleProceed}
              disabled={!selectedMethod}
            >
              Proceed to Payment
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Redirecting to {paymentMethods.find(m => m.id === selectedMethod)?.name}...
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Please wait while we redirect you to the secure payment page.
          </Typography>
        </Box>
      )}

      {/* Security Notice */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'background.paper', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          🔒 Your payment is secured with 256-bit SSL encryption. We do not store your payment details.
        </Typography>
      </Box>
    </Container>
  );
};

export default PaymentPage;