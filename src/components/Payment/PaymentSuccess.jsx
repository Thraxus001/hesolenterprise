// src/components/Payment/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Share,
  Print,
  Download,
  Email,
  ShoppingBag,
  Home,
  Receipt,
  CalendarToday,
  Payment,
  AccountBalance
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import './PaymentSuccess.css';

const PaymentSuccess = ({ 
  order = {},
  onContinueShopping,
  onViewOrder,
  onPrintReceipt,
  onDownloadReceipt,
  onShare
}) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  
  const defaultOrder = {
    id: 'ORD-20240115-1234',
    number: 'ORD-20240115-1234',
    date: new Date().toISOString(),
    total: 1850,
    subtotal: 1500,
    tax: 240,
    shipping: 110,
    items: 3,
    paymentMethod: 'mpesa',
    paymentReference: 'MPESA123456789',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+254712345678'
    },
    shippingAddress: {
      street: '123 Main Street',
      city: 'Nairobi',
      postalCode: '00100'
    }
  };

  const finalOrder = { ...defaultOrder, ...order };

  useEffect(() => {
    // Show confetti for 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      if (navigator.share) {
        navigator.share({
          title: `Order ${finalOrder.number} Confirmed`,
          text: `I just ordered from Bookshop! Order #${finalOrder.number}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Order link copied to clipboard!');
      }
    }
  };

  const handlePrint = () => {
    if (onPrintReceipt) {
      onPrintReceipt();
    } else {
      window.print();
    }
  };

  const handleDownload = () => {
    if (onDownloadReceipt) {
      onDownloadReceipt();
    } else {
      toast.success('Receipt download started');
      // In a real app, this would trigger a PDF download
    }
  };

  const handleEmailReceipt = () => {
    toast.success('Receipt sent to your email!');
  };

  const actionButtons = [
    {
      icon: <ShoppingBag />,
      label: 'Continue Shopping',
      action: onContinueShopping || (() => navigate('/products')),
      variant: 'contained',
      color: 'primary'
    },
    {
      icon: <Receipt />,
      label: 'View Order Details',
      action: onViewOrder || (() => navigate(`/orders/${finalOrder.id}`)),
      variant: 'outlined'
    },
    {
      icon: <Home />,
      label: 'Back to Home',
      action: () => navigate('/'),
      variant: 'outlined'
    }
  ];

  const quickActions = [
    {
      icon: <Print />,
      label: 'Print Receipt',
      action: handlePrint,
      color: 'default'
    },
    {
      icon: <Download />,
      label: 'Download',
      action: handleDownload,
      color: 'default'
    },
    {
      icon: <Email />,
      label: 'Email Receipt',
      action: handleEmailReceipt,
      color: 'default'
    },
    {
      icon: <Share />,
      label: 'Share',
      action: handleShare,
      color: 'default'
    }
  ];

  return (
    <Box className="payment-success-container">
      {/* Confetti Effect */}
      {showConfetti && (
        <Box className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <Box key={i} className="confetti-piece" />
          ))}
        </Box>
      )}

      <Card className="payment-success-card">
        <CardContent>
          {/* Success Header */}
          <Box className="success-header">
            <CheckCircle className="success-icon" />
            <Typography variant="h4" className="success-title">
              Payment Successful!
            </Typography>
            <Typography variant="body1" className="success-subtitle">
              Thank you for your order. We've received your payment.
            </Typography>
            <Chip 
              label={`Order #${finalOrder.number}`}
              className="order-chip"
              icon={<Receipt />}
            />
          </Box>

          {/* Order Summary */}
          <Box className="order-summary">
            <Typography variant="h6" className="summary-title">
              Order Summary
            </Typography>
            
            <Box className="summary-grid">
              <Box className="summary-item">
                <CalendarToday className="summary-icon" />
                <Box>
                  <Typography variant="body2" className="summary-label">
                    Order Date
                  </Typography>
                  <Typography variant="body1" className="summary-value">
                    {formatDate(finalOrder.date)}
                  </Typography>
                </Box>
              </Box>

              <Box className="summary-item">
                <Payment className="summary-icon" />
                <Box>
                  <Typography variant="body2" className="summary-label">
                    Payment Method
                  </Typography>
                  <Typography variant="body1" className="summary-value">
                    {finalOrder.paymentMethod === 'mpesa' ? 'MPesa' : 'Credit Card'}
                  </Typography>
                </Box>
              </Box>

              <Box className="summary-item">
                <AccountBalance className="summary-icon" />
                <Box>
                  <Typography variant="body2" className="summary-label">
                    Reference
                  </Typography>
                  <Typography variant="body1" className="summary-value">
                    {finalOrder.paymentReference}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Amount Breakdown */}
            <Box className="amount-breakdown">
              <Box className="amount-row">
                <Typography variant="body2" className="amount-label">
                  Subtotal ({finalOrder.items} items)
                </Typography>
                <Typography variant="body2" className="amount-value">
                  {formatCurrency(finalOrder.subtotal)}
                </Typography>
              </Box>
              <Box className="amount-row">
                <Typography variant="body2" className="amount-label">
                  Shipping
                </Typography>
                <Typography variant="body2" className="amount-value">
                  {formatCurrency(finalOrder.shipping)}
                </Typography>
              </Box>
              <Box className="amount-row">
                <Typography variant="body2" className="amount-label">
                  Tax (VAT)
                </Typography>
                <Typography variant="body2" className="amount-value">
                  {formatCurrency(finalOrder.tax)}
                </Typography>
              </Box>
              <Divider className="amount-divider" />
              <Box className="amount-row total">
                <Typography variant="h6" className="amount-label">
                  Total Amount
                </Typography>
                <Typography variant="h5" className="amount-value total">
                  {formatCurrency(finalOrder.total)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Next Steps */}
          <Box className="next-steps">
            <Typography variant="h6" className="steps-title">
              What happens next?
            </Typography>
            <Box className="steps-timeline">
              <Box className="step">
                <Box className="step-number">1</Box>
                <Box className="step-content">
                  <Typography variant="subtitle2" className="step-title">
                    Order Confirmation
                  </Typography>
                  <Typography variant="body2" className="step-description">
                    We've sent a confirmation email to {finalOrder.customer.email}
                  </Typography>
                </Box>
              </Box>
              <Box className="step">
                <Box className="step-number">2</Box>
                <Box className="step-content">
                  <Typography variant="subtitle2" className="step-title">
                    Order Processing
                  </Typography>
                  <Typography variant="body2" className="step-description">
                    We're preparing your items for shipment
                  </Typography>
                </Box>
              </Box>
              <Box className="step">
                <Box className="step-number">3</Box>
                <Box className="step-content">
                  <Typography variant="subtitle2" className="step-title">
                    Shipment
                  </Typography>
                  <Typography variant="body2" className="step-description">
                    Your order will be shipped within 24 hours
                  </Typography>
                </Box>
              </Box>
              <Box className="step">
                <Box className="step-number">4</Box>
                <Box className="step-content">
                  <Typography variant="subtitle2" className="step-title">
                    Delivery
                  </Typography>
                  <Typography variant="body2" className="step-description">
                    Estimated delivery: 3-5 business days
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Customer Information */}
          <Box className="customer-info">
            <Typography variant="h6" className="info-title">
              Delivery Information
            </Typography>
            <Box className="info-grid">
              <Box className="info-item">
                <Typography variant="body2" className="info-label">
                  Customer Name
                </Typography>
                <Typography variant="body1" className="info-value">
                  {finalOrder.customer.name}
                </Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="body2" className="info-label">
                  Email Address
                </Typography>
                <Typography variant="body1" className="info-value">
                  {finalOrder.customer.email}
                </Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="body2" className="info-label">
                  Phone Number
                </Typography>
                <Typography variant="body1" className="info-value">
                  {finalOrder.customer.phone}
                </Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="body2" className="info-label">
                  Shipping Address
                </Typography>
                <Typography variant="body1" className="info-value">
                  {finalOrder.shippingAddress.street}, {finalOrder.shippingAddress.city}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box className="quick-actions">
            <Typography variant="body2" className="actions-label">
              Quick Actions:
            </Typography>
            <Box className="actions-buttons">
              {quickActions.map((action, index) => (
                <IconButton
                  key={index}
                  onClick={action.action}
                  className="action-button"
                  size="small"
                  color={action.color}
                >
                  {action.icon}
                  <Typography variant="caption" className="action-label">
                    {action.label}
                  </Typography>
                </IconButton>
              ))}
            </Box>
          </Box>

          <Divider className="section-divider" />

          {/* Main Actions */}
          <Box className="main-actions">
            {actionButtons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant}
                startIcon={button.icon}
                onClick={button.action}
                className="main-action-button"
                color={button.color}
                size="large"
              >
                {button.label}
              </Button>
            ))}
          </Box>

          {/* Support Info */}
          <Box className="support-info">
            <Typography variant="body2" className="support-text">
              Need help? Contact our support team at support@bookshop.com or call +254 700 000 000
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentSuccess;