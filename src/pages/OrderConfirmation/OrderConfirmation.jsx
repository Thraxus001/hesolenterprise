import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as ShippingIcon,
  Home as HomeIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import './OrderConfirmation.css';
import { formatCurrency } from '../../utils/formatters';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shippingProgress, setShippingProgress] = useState(0);

  useEffect(() => {
    fetchOrderDetails();

    // Simulate shipping progress updates
    const progressInterval = setInterval(() => {
      setShippingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 2000);

    return () => clearInterval(progressInterval);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);

      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock order data - replace with actual data from your API
      const mockOrder = {
        id: orderId || 'ORD-2023-00125',
        date: new Date().toISOString(),
        status: 'confirmed',
        customer: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+254 712 345 678',
          address: '123 Main Street, Nairobi, Kenya',
        },
        shipping: {
          method: 'Standard Delivery',
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          trackingNumber: 'TRK-78901234',
          address: '123 Main Street, Nairobi, Kenya',
        },
        payment: {
          method: 'mesa',
          transactionId: 'MPESA-789012',
          status: 'completed',
          amount: 8750.00,
        },
        items: [
          {
            id: 'ITEM-001',
            name: 'Mathematics Textbook Grade 5',
            price: 1500.00,
            quantity: 2,
            image: '/images/math-textbook.jpg',
            category: 'Textbooks',
          },
          {
            id: 'ITEM-002',
            name: 'Science Lab Kit',
            price: 3250.00,
            quantity: 1,
            image: '/images/science-kit.jpg',
            category: 'Lab Equipment',
          },
          {
            id: 'ITEM-003',
            name: 'Premium Stationery Set',
            price: 750.00,
            quantity: 3,
            image: '/images/stationery-set.jpg',
            category: 'Stationery',
          },
          {
            id: 'ITEM-004',
            name: 'Wireless Mouse',
            price: 2500.00,
            quantity: 1,
            image: '/images/wireless-mouse.jpg',
            category: 'ICT Accessories',
          },
        ],
        summary: {
          subtotal: 10750.00,
          shipping: 500.00,
          tax: 1500.00,
          discount: 1000.00,
          total: 8750.00,
        },
        timeline: [
          {
            step: 'Order Placed',
            description: 'Your order has been received',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            completed: true,
          },
          {
            step: 'Payment Confirmed',
            description: 'MPESA payment has been processed',
            date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            completed: true,
          },
          {
            step: 'Processing',
            description: 'Your items are being prepared for shipping',
            date: new Date().toISOString(),
            completed: false,
            current: true,
          },
          {
            step: 'Shipped',
            description: 'Your order is on its way',
            date: null,
            completed: false,
          },
          {
            step: 'Delivered',
            description: 'Order delivered successfully',
            date: null,
            completed: false,
          },
        ],
      };

      setOrder(mockOrder);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Implement PDF generation and download
    alert('Receipt download feature will be implemented soon!');
  };

  const handleShare = (platform) => {
    const shareText = `I just ordered educational materials from Bookshop! Order ID: ${order?.id}`;
    const shareUrl = window.location.href;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=My Order Confirmation&body=${encodeURIComponent(shareText + '\n\nView order: ' + shareUrl)}`;
        break;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  if (loading) {
    return (
      <div className="order-confirmation">
        <Container maxWidth="lg" className="confirmation-container">
          <div className="confirmation-loading">
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
              Loading order details...
            </Typography>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation">
        <Container maxWidth="lg" className="confirmation-container">
          <div className="confirmation-error">
            <ErrorIcon className="error-icon" />
            <Typography variant="h4" className="error-title">
              Order Not Found
            </Typography>
            <Typography variant="body1" className="error-message">
              {error || 'The order you are looking for does not exist or has been removed.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/products')}
              sx={{ mt: 3 }}
            >
              Continue Shopping
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <Container maxWidth="lg" className="confirmation-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper elevation={3} className="confirmation-card">
            {/* Header */}
            <div className="confirmation-header">
              <CheckCircleIcon className="success-icon" />
              <Typography variant="h3" className="confirmation-title">
                Order Confirmed!
              </Typography>
              <Typography variant="h6" className="confirmation-subtitle">
                Thank you for your purchase
              </Typography>
              <Chip
                label={`Order #${order.id}`}
                className="order-number"
                sx={{ fontSize: '1.1rem', fontWeight: 600 }}
              />
            </div>

            {/* Content */}
            <div className="confirmation-content">
              {/* Order Summary */}
              <div className="order-details-section">
                <Typography variant="h5" className="section-title">
                  <ShoppingBagIcon />
                  Order Summary
                </Typography>

                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {order.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 60, height: 60 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                {item.category}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Qty: {item.quantity}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {formatCurrency(item.price * item.quantity)}
                                </Typography>
                              </Box>
                            </>
                          }
                        />
                      </ListItem>
                      {index < order.items.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>

                <div className="order-summary">
                  <div className="summary-item">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">{formatCurrency(order.summary.subtotal)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Shipping</span>
                    <span className="summary-value">{formatCurrency(order.summary.shipping)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Tax</span>
                    <span className="summary-value">{formatCurrency(order.summary.tax)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Discount</span>
                    <span className="summary-value">-{formatCurrency(order.summary.discount)}</span>
                  </div>
                  <Divider sx={{ my: 2 }} />
                  <div className="summary-item total">
                    <span className="summary-label">Total</span>
                    <span className="summary-value">{formatCurrency(order.summary.total)}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline */}
              <div className="order-timeline">
                <Typography variant="h5" className="section-title">
                  <CalendarIcon />
                  Order Status
                </Typography>

                <div className="timeline">
                  {order.timeline.map((step, index) => (
                    <div
                      key={step.step}
                      className={`timeline-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                    >
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <Typography variant="subtitle1" className="timeline-title">
                          {step.step}
                        </Typography>
                        <Typography variant="body2" className="timeline-description">
                          {step.description}
                        </Typography>
                        <Typography variant="caption" className="timeline-date">
                          {formatDate(step.date)}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Progress */}
              {shippingProgress > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Shipping Progress
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          height: 8,
                          bgcolor: 'primary.light',
                          borderRadius: 4,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            bgcolor: 'primary.main',
                            width: `${shippingProgress}%`,
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {Math.min(shippingProgress, 100).toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Order Details Grid */}
              <div className="details-grid">
                {/* Customer Information */}
                <Card className="detail-item">
                  <CardContent>
                    <PersonIcon color="primary" sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" className="detail-label">
                      Customer Information
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      {order.customer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customer.phone}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
                <Card className="detail-item">
                  <CardContent>
                    <ShippingIcon color="primary" sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" className="detail-label">
                      Shipping Information
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      {order.shipping.method}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tracking: {order.shipping.trackingNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Est. Delivery: {formatDate(order.shipping.estimatedDelivery)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.shipping.address}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card className="detail-item">
                  <CardContent>
                    <PaymentIcon color="primary" sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" className="detail-label">
                      Payment Information
                    </Typography>
                    <Typography variant="body1" className="detail-value">
                      {order.payment.method}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Transaction: {order.payment.transactionId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: <Chip
                        label={order.payment.status}
                        size="small"
                        color="success"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Amount: {formatCurrency(order.payment.amount)}
                    </Typography>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="confirmation-actions">
                <Button
                  variant="contained"
                  color="primary"
                  className="action-button"
                  onClick={() => navigate('/products')}
                  startIcon={<ShoppingBagIcon />}
                  size="large"
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  className="action-button"
                  onClick={handleDownloadReceipt}
                  startIcon={<DownloadIcon />}
                  size="large"
                >
                  Download Receipt
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  className="action-button"
                  onClick={handlePrintReceipt}
                  startIcon={<PrintIcon />}
                  size="large"
                >
                  Print Receipt
                </Button>
              </div>

              {/* Share Section */}
              <div className="social-share">
                <Typography variant="h6" className="share-title">
                  Share Your Purchase
                </Typography>
                <div className="share-buttons">
                  <IconButton
                    className="share-button facebook"
                    onClick={() => handleShare('facebook')}
                  >
                    <FacebookIcon />
                  </IconButton>
                  <IconButton
                    className="share-button twitter"
                    onClick={() => handleShare('twitter')}
                  >
                    <TwitterIcon />
                  </IconButton>
                  <IconButton
                    className="share-button whatsapp"
                    onClick={() => handleShare('whatsapp')}
                  >
                    <WhatsAppIcon />
                  </IconButton>
                  <IconButton
                    className="share-button email"
                    onClick={() => handleShare('email')}
                  >
                    <EmailIcon />
                  </IconButton>
                </div>
              </div>

              {/* Next Steps */}
              <div className="next-steps">
                <Typography variant="h5" className="next-steps-title">
                  What's Next?
                </Typography>
                <div className="next-steps-grid">
                  <Card className="next-step">
                    <EmailIcon className="next-step-icon" />
                    <Typography variant="h6">Order Confirmation Email</Typography>
                    <Typography variant="body2">
                      You will receive a confirmation email with all order details
                    </Typography>
                  </Card>
                  <Card className="next-step">
                    <ShippingIcon className="next-step-icon" />
                    <Typography variant="h6">Shipping Updates</Typography>
                    <Typography variant="body2">
                      Track your order status and get shipping notifications
                    </Typography>
                  </Card>
                  <Card className="next-step">
                    <PhoneIcon className="next-step-icon" />
                    <Typography variant="h6">Need Help?</Typography>
                    <Typography variant="body2">
                      Contact our customer support for any questions about your order
                    </Typography>
                  </Card>
                </div>
              </div>
            </div>
          </Paper>
        </motion.div>
      </Container>
    </div>
  );
};

export default OrderConfirmation;