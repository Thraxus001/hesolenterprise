// src/pages/Payment/MpesaPayment.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
} from '@mui/material';
import {
  PhoneAndroid as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AccessTime as TimeIcon,
  ArrowBack as BackIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
  Smartphone as SmartphoneIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { usePayment } from '../../contexts/PaymentContext';
import MpsaService from '../../services/MpsaService';
import toast from 'react-hot-toast';

const steps = ['Enter Phone Number', 'Confirm Payment', 'Complete Payment'];

const MpesaPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { orderDetails, setOrderDetails, updatePaymentStatus } = usePayment();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed
  const [checkoutRequestID, setCheckoutRequestID] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [pollingInterval, setPollingInterval] = useState(null);

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedOption, setSelectedOption] = useState('stk'); // 'stk' or 'manual'
  
  // Dialog states
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [failureDialogOpen, setFailureDialogOpen] = useState(false);

  // Calculate total from location state or cart context
  const [paymentData, setPaymentData] = useState({
    amount: location.state?.total || 0,
    orderId: location.state?.orderId || `ORDER-${Date.now()}`,
    description: 'Payment for educational materials',
  });

  // Validate phone number
  const validatePhoneNumber = (number) => {
    const formatted = MpsaService.formatPhoneNumber(number);
    return MpsaService.validatePhoneNumber(formatted);
  };

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    if (value && !validatePhoneNumber(value)) {
      setPhoneError('Please enter a valid Kenyan phone number (e.g., 0712345678)');
    } else {
      setPhoneError('');
    }
  };

  // Format phone number for display
  const formatDisplayPhone = (number) => {
    const formatted = MpsaService.formatPhoneNumber(number);
    return `+${formatted.substring(0, 3)} ${formatted.substring(3, 6)} ${formatted.substring(6, 9)}${formatted.substring(9)}`;
  };

  // Handle STK Push payment
  const handleSTKPush = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');

    try {
      const formattedPhone = MpsaService.formatPhoneNumber(phoneNumber);
      
      const result = await MpsaService.initiateSTKPush({
        phoneNumber: formattedPhone,
        amount: paymentData.amount,
        accountReference: paymentData.orderId,
        transactionDesc: paymentData.description,
      });

      if (result.success) {
        setCheckoutRequestID(result.checkoutRequestID);
        setActiveStep(1);
        toast.success('MPESA prompt sent to your phone!');
        
        // Start polling for payment status
        startPolling(result.checkoutRequestID);
      } else {
        setPaymentStatus('failed');
        toast.error('Failed to initiate payment');
      }
    } catch (error) {
      console.error('STK Push error:', error);
      setPaymentStatus('failed');
      toast.error('Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  // Start polling for payment status
  const startPolling = (requestID) => {
    // Clear any existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    const interval = setInterval(async () => {
      try {
        const status = await MpsaService.queryTransactionStatus(requestID);
        
        if (status.success && status.status === 'completed') {
          // Payment successful
          clearInterval(interval);
          setPollingInterval(null);
          handlePaymentSuccess(status);
        } else if (status.success === false) {
          // Payment failed or still pending
          // Continue polling
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000); // Poll every 5 seconds

    setPollingInterval(interval);
  };

  // Handle successful payment
  const handlePaymentSuccess = async (status) => {
    setPaymentStatus('success');
    setReceiptNumber(status.data?.MpesaReceiptNumber || 'MPESA' + Date.now());
    
    // Update order in context
    const orderData = {
      ...orderDetails,
      paymentStatus: 'completed',
      paymentMethod: 'mpesa',
      mpesaReceipt: status.data?.MpesaReceiptNumber,
      transactionDate: new Date().toISOString(),
      status: 'confirmed',
    };

    setOrderDetails(orderData);
    updatePaymentStatus('completed', {
      receipt: status.data?.MpesaReceiptNumber,
      transactionId: status.data?.TransactionID,
    });

    // Clear cart
    clearCart();

    // Show success dialog
    setSuccessDialogOpen(true);
    setActiveStep(2);
  };

  // Handle payment failure
  const handlePaymentFailure = (error) => {
    setPaymentStatus('failed');
    toast.error(`Payment failed: ${error}`);
    setFailureDialogOpen(true);
  };

  // Manual payment confirmation
  const handleManualConfirm = () => {
    // For manual payments (Paybill option)
    setActiveStep(1);
    toast.info('Please complete payment via MPESA Paybill');
  };

  // Go back to previous step
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      
      if (activeStep === 1 && pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    } else {
      navigate(-1);
    }
  };

  // Handle payment completion
  const handleComplete = () => {
    navigate('/order-confirmation', {
      state: {
        orderId: paymentData.orderId,
        receiptNumber: receiptNumber,
        paymentMethod: 'mpesa',
        amount: paymentData.amount,
      },
    });
  };

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Get step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Enter your MPESA phone number
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              We'll send a payment request to this number via MPESA STK Push
            </Typography>

            <FormControl component="fieldset" sx={{ mb: 4 }}>
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                row
              >
                <FormControlLabel
                  value="stk"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SmartphoneIcon sx={{ mr: 1 }} />
                      <span>STK Push (Recommended)</span>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="manual"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WalletIcon sx={{ mr: 1 }} />
                      <span>Manual Paybill</span>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {selectedOption === 'stk' ? (
              <>
                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  error={!!phoneError}
                  helperText={phoneError || "Enter your MPESA registered phone number"}
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ mb: 3 }}
                />

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Ensure your phone is nearby. You'll receive an MPESA prompt to enter your PIN.
                  </Typography>
                </Alert>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSTKPush}
                  disabled={!phoneNumber || !!phoneError || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
                >
                  {loading ? 'Sending Request...' : 'Pay with MPESA'}
                </Button>
              </>
            ) : (
              <>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Manual Paybill Instructions
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <WalletIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Go to MPESA on your phone" 
                          secondary="Select Lipa na M-PESA"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ReceiptIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Enter Paybill Number" 
                          secondary="Business No: 174379"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ReceiptIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Enter Account Number" 
                          secondary={paymentData.orderId}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ReceiptIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Enter Amount" 
                          secondary={`KSH ${paymentData.amount.toLocaleString()}`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={handleManualConfirm}
                  startIcon={<WalletIcon />}
                >
                  I've Completed Payment
                </Button>
              </>
            )}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                startIcon={<HelpIcon />}
                onClick={() => setHelpDialogOpen(true)}
                size="small"
              >
                Need help with MPESA?
              </Button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            {selectedOption === 'stk' ? (
              <>
                <Box sx={{ mb: 4 }}>
                  {paymentStatus === 'processing' ? (
                    <CircularProgress size={60} thickness={4} />
                  ) : paymentStatus === 'success' ? (
                    <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main' }} />
                  ) : paymentStatus === 'failed' ? (
                    <ErrorIcon sx={{ fontSize: 60, color: 'error.main' }} />
                  ) : (
                    <TimeIcon sx={{ fontSize: 60, color: 'warning.main' }} />
                  )}
                </Box>

                <Typography variant="h5" gutterBottom>
                  {paymentStatus === 'processing' 
                    ? 'Waiting for Payment'
                    : paymentStatus === 'success'
                    ? 'Payment Successful!'
                    : paymentStatus === 'failed'
                    ? 'Payment Failed'
                    : 'Confirm Payment on Your Phone'}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {paymentStatus === 'processing' 
                    ? `We've sent a request to ${formatDisplayPhone(phoneNumber)}. Please check your phone and enter your MPESA PIN.`
                    : paymentStatus === 'success'
                    ? 'Your payment has been confirmed successfully!'
                    : paymentStatus === 'failed'
                    ? 'There was an issue processing your payment. Please try again.'
                    : 'Enter your MPESA PIN when prompted on your phone.'}
                </Typography>

                {paymentStatus === 'processing' && (
                  <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
                    <Typography variant="body2">
                      • Check your phone for the MPESA prompt<br />
                      • Enter your MPESA PIN when requested<br />
                      • This window will update automatically when payment is confirmed
                    </Typography>
                  </Alert>
                )}

                {paymentStatus === 'processing' && checkoutRequestID && (
                  <Box sx={{ mt: 3 }}>
                    <Chip
                      label={`Request ID: ${checkoutRequestID}`}
                      variant="outlined"
                      size="small"
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <>
                <WalletIcon sx={{ fontSize: 60, color: 'primary.main', mb: 3 }} />
                <Typography variant="h5" gutterBottom>
                  Complete Payment via MPESA
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Please complete your payment using the MPESA Paybill details below:
                </Typography>

                <Card variant="outlined" sx={{ mb: 4, textAlign: 'left' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Paybill Number:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="bold">
                          174379
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Account Number:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="bold">
                          {paymentData.orderId}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Amount:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="bold" color="primary">
                          KSH {paymentData.amount.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
                  <Typography variant="body2">
                    Please ensure you enter the exact Account Number above when making payment.
                    Your order will be processed once payment is confirmed.
                  </Typography>
                </Alert>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handlePaymentSuccess({ data: {} })}
                  startIcon={<CheckCircleIcon />}
                  sx={{ mb: 2 }}
                >
                  I've Completed Payment
                </Button>
                <br />
                <Button
                  variant="outlined"
                  onClick={() => setActiveStep(0)}
                  size="small"
                >
                  Change Payment Method
                </Button>
              </>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            <Typography variant="h4" gutterBottom>
              Payment Confirmed!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Thank you for your payment. Your order is now being processed.
            </Typography>

            <Card variant="outlined" sx={{ maxWidth: 400, mx: 'auto', mb: 4 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Order ID:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      {paymentData.orderId}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Amount Paid:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      KSH {paymentData.amount.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  {receiptNumber && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          MPESA Receipt:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" fontWeight="bold">
                          {receiptNumber}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Method:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="bold">
                      MPESA
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              size="large"
              onClick={handleComplete}
              sx={{ mb: 2 }}
            >
              View Order Details
            </Button>
            <br />
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          startIcon={<BackIcon />}
          onClick={handleBack}
          sx={{ visibility: activeStep > 0 ? 'visible' : 'hidden' }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', flex: 1 }}>
          <PaymentIcon sx={{ verticalAlign: 'middle', mr: 2 }} />
          MPESA Payment
        </Typography>
        <Box sx={{ width: 100 }} /> {/* Spacer for alignment */}
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Payment Amount Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6">
                Total Amount
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order #{paymentData.orderId}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" color="primary">
                KSH {paymentData.amount.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Paper sx={{ p: { xs: 2, sm: 4 } }}>
        {getStepContent(activeStep)}
      </Paper>

      {/* Security Notice */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          <SecurityIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
          Your payment is secure and encrypted. We never store your MPESA PIN.
        </Typography>
      </Box>

      {/* Help Dialog */}
      <Dialog open={helpDialogOpen} onClose={() => setHelpDialogOpen(false)}>
        <DialogTitle>
          <HelpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          MPESA Payment Help
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            <strong>How to pay with MPESA:</strong>
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="1. Ensure you have sufficient funds in your MPESA account"
                secondary="Minimum balance should be amount + transaction fee"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="2. Keep your phone nearby"
                secondary="You'll receive a payment prompt"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="3. Enter your MPESA PIN when prompted"
                secondary="Do not share your PIN with anyone"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="4. Wait for confirmation"
                secondary="This page will update automatically"
              />
            </ListItem>
          </List>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Need immediate assistance?</strong><br />
              Contact MPESA: *234# or 234
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <CheckCircleIcon sx={{ color: 'success.main', fontSize: 60, mb: 2 }} />
          <Typography variant="h5">Payment Successful!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center" paragraph>
            Your payment of <strong>KSH {paymentData.amount.toLocaleString()}</strong> has been confirmed.
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Receipt: {receiptNumber}<br />
            An email confirmation has been sent to you.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => {
              setSuccessDialogOpen(false);
              handleComplete();
            }}
          >
            View Order Details
          </Button>
        </DialogActions>
      </Dialog>

      {/* Failure Dialog */}
      <Dialog open={failureDialogOpen} onClose={() => setFailureDialogOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <ErrorIcon sx={{ color: 'error.main', fontSize: 60, mb: 2 }} />
          <Typography variant="h5">Payment Failed</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center" paragraph>
            We couldn't process your payment. This could be due to:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="• Insufficient MPESA balance" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Incorrect MPESA PIN entered" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Network issues" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Payment timeout" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => {
              setFailureDialogOpen(false);
              setActiveStep(0);
            }}
          >
            Try Again
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setFailureDialogOpen(false);
              navigate('/checkout');
            }}
          >
            Change Payment Method
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MpesaPayment;