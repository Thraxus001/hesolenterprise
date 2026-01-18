// src/components/Payment/PaymentProcessing.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  Card,
  CardContent,
  Button
} from '@mui/material';
import {
  CheckCircle,
  Error,
  HourglassEmpty,
  Payment,
  ArrowBack
} from '@mui/icons-material';
import './PaymentProcessing.css';

const PaymentProcessing = ({ 
  status = 'processing',
  paymentMethod = 'mpesa',
  amount = 0,
  orderNumber = '',
  onCancel,
  onRetry,
  processingTime = 120, // seconds
  steps = [
    'Initiating payment',
    'Processing transaction',
    'Verifying payment',
    'Completing order'
  ]
}) => {
  const [timeRemaining, setTimeRemaining] = useState(processingTime);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'processing') {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Simulate step progression
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(stepInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);

      // Simulate progress bar
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / processingTime);
        });
      }, 1000);

      return () => {
        clearInterval(timer);
        clearInterval(stepInterval);
        clearInterval(progressInterval);
      };
    }
  }, [status, processingTime, steps.length]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="status-icon success" />;
      case 'failed':
        return <Error className="status-icon error" />;
      case 'cancelled':
        return <Error className="status-icon error" />;
      default:
        return <HourglassEmpty className="status-icon processing" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'cancelled':
        return 'Payment Cancelled';
      default:
        return 'Processing Your Payment';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'success':
        return 'Your payment has been successfully processed. Your order is now being prepared.';
      case 'failed':
        return 'There was an issue processing your payment. Please try again or use a different payment method.';
      case 'cancelled':
        return 'The payment was cancelled. No amount has been deducted from your account.';
      default:
        return `Please wait while we process your ${paymentMethod === 'mpesa' ? 'MPesa' : 'card'} payment. Do not close this window.`;
    }
  };

  return (
    <Card className="payment-processing">
      <CardContent>
        <Box className="payment-header">
          <Payment className="payment-icon" />
          <Typography variant="h5" className="payment-title">
            Payment Processing
          </Typography>
        </Box>

        <Box className="status-section">
          {getStatusIcon()}
          <Typography variant="h6" className="status-title">
            {getStatusMessage()}
          </Typography>
          <Typography variant="body2" className="status-description">
            {getStatusDescription()}
          </Typography>
        </Box>

        {/* Order Details */}
        <Box className="order-details">
          <Box className="detail-row">
            <Typography variant="body2" className="detail-label">
              Order Number:
            </Typography>
            <Typography variant="body2" className="detail-value">
              {orderNumber}
            </Typography>
          </Box>
          <Box className="detail-row">
            <Typography variant="body2" className="detail-label">
              Amount:
            </Typography>
            <Typography variant="body2" className="detail-value">
              KES {amount.toLocaleString()}
            </Typography>
          </Box>
          <Box className="detail-row">
            <Typography variant="body2" className="detail-label">
              Payment Method:
            </Typography>
            <Typography variant="body2" className="detail-value">
              {paymentMethod === 'mpesa' ? 'MPesa' : 'Credit/Debit Card'}
            </Typography>
          </Box>
        </Box>

        {/* Processing Progress */}
        {status === 'processing' && (
          <Box className="processing-section">
            <Box className="progress-section">
              <Box className="progress-header">
                <Typography variant="body2" className="progress-label">
                  Processing...
                </Typography>
                <Typography variant="body2" className="time-remaining">
                  {formatTime(timeRemaining)}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                className="progress-bar"
              />
              <Typography variant="caption" className="progress-text">
                {Math.round(progress)}% complete
              </Typography>
            </Box>

            {/* Processing Steps */}
            <Box className="steps-section">
              {steps.map((step, index) => (
                <Box 
                  key={index} 
                  className={`step-item ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                >
                  <Box className="step-indicator">
                    {index < currentStep ? (
                      <CheckCircle className="step-icon" />
                    ) : (
                      <CircularProgress 
                        size={20} 
                        className={`step-spinner ${index === currentStep ? 'active' : ''}`}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" className="step-label">
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Processing Tips */}
            <Box className="tips-section">
              <Typography variant="body2" className="tips-title">
                ⚡ Tips for faster processing:
              </Typography>
              {paymentMethod === 'mpesa' ? (
                <ul className="tips-list">
                  <li>Ensure your phone has network connectivity</li>
                  <li>Enter your MPesa PIN when prompted</li>
                  <li>Keep this window open until processing completes</li>
                  <li>Check for SMS confirmation from MPesa</li>
                </ul>
              ) : (
                <ul className="tips-list">
                  <li>Do not refresh or close this window</li>
                  <li>Complete any 3D Secure authentication if prompted</li>
                  <li>Check your email for payment confirmation</li>
                  <li>Contact your bank if asked for additional verification</li>
                </ul>
              )}
            </Box>
          </Box>
        )}

        {/* Actions */}
        <Box className="action-buttons">
          {status === 'processing' && (
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onCancel}
              className="cancel-button"
            >
              Cancel Payment
            </Button>
          )}

          {(status === 'failed' || status === 'cancelled') && (
            <>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={onCancel}
                className="back-button"
              >
                Back to Payment
              </Button>
              <Button
                variant="contained"
                onClick={onRetry}
                className="retry-button"
              >
                Retry Payment
              </Button>
            </>
          )}
        </Box>

        {/* Security Note */}
        <Box className="security-note">
          <Typography variant="caption" className="security-text">
            🔒 Your payment is secured with SSL encryption. All transactions are protected.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessing;