// src/pages/Payment/components/PaymentInstructions.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  PhoneAndroid,
  CreditCard,
  AccountBalance,
  LocalAtm,
  Smartphone,
  Laptop,
  QuestionAnswer,
  SupportAgent
} from '@mui/icons-material';

const PaymentInstructions = ({ paymentMethod = 'mpesa' }) => {
  const [expanded, setExpanded] = useState('mpesa');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'MPesa',
      icon: <PhoneAndroid />,
      description: 'Mobile money payment via Safaricom MPesa',
      steps: [
        'Enter your MPesa registered phone number',
        'Click "Pay with MPesa" button',
        'Check your phone for STK Push prompt',
        'Enter your MPesa PIN when prompted',
        'Wait for payment confirmation',
        'You will receive an SMS from MPesa'
      ],
      tips: [
        'Ensure your phone has network connectivity',
        'Keep this window open until payment completes',
        'Have sufficient balance in your MPesa account',
        'Check for SMS confirmation from MPesa (transaction code)'
      ]
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard />,
      description: 'Secure card payment (Visa, MasterCard, Amex)',
      steps: [
        'Enter your card details (number, expiry, CVV)',
        'Provide cardholder name as on the card',
        'Complete 3D Secure authentication if prompted',
        'Review and confirm payment amount',
        'Wait for payment processing',
        'Save your card for faster checkout next time'
      ],
      tips: [
        'Ensure your card supports online transactions',
        'Have your phone ready for OTP verification',
        'Check with your bank if payment fails',
        'Look for "https://" and padlock icon in browser'
      ]
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: <AccountBalance />,
      description: 'Direct bank transfer to our account',
      steps: [
        'Select "Bank Transfer" as payment method',
        'Note down our bank account details',
        'Make transfer from your bank account or app',
        'Use order number as payment reference',
        'Upload proof of payment (optional)',
        'Wait for manual verification (1-2 hours)'
      ],
      tips: [
        'Use exact amount shown during checkout',
        'Include order number in payment reference',
        'Keep proof of payment for reference',
        'Contact support if verification takes longer'
      ]
    }
  ];

  const currentMethod = paymentMethods.find(method => method.id === paymentMethod) || paymentMethods[0];

  return (
    <Box className="payment-instructions">
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <QuestionAnswer />
        Payment Instructions
      </Typography>

      {/* Current Method Instructions */}
      <Box sx={{ mb: 4 }}>
        <Chip 
          icon={currentMethod.icon} 
          label={currentMethod.name}
          color="primary"
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Typography variant="body1" color="text.secondary" paragraph>
          {currentMethod.description}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Steps to Complete Payment:
          </Typography>
          <List dense>
            {currentMethod.steps.map((step, index) => (
              <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 40, pt: 0.5 }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    {index + 1}
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={step}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'warning.dark' }}>
            💡 Important Tips:
          </Typography>
          <List dense>
            {currentMethod.tips.map((tip, index) => (
              <ListItem key={index} sx={{ alignItems: 'flex-start', py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Box sx={{ fontSize: 8 }}>•</Box>
                </ListItemIcon>
                <ListItemText 
                  primary={tip}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* All Payment Methods Accordion */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        All Payment Methods
      </Typography>
      
      {paymentMethods.map((method) => (
        <Accordion 
          key={method.id}
          expanded={expanded === method.id}
          onChange={handleChange(method.id)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {method.icon}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {method.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {method.description}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {method.steps.map((step, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start', py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 600
                    }}>
                      {index + 1}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={step}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Support Information */}
      <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', borderRadius: 2, color: 'white' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SupportAgent />
          Need Help?
        </Typography>
        <Typography variant="body2" paragraph sx={{ opacity: 0.9 }}>
          Our support team is here to help you with any payment issues
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            sx={{ bgcolor: 'white', color: 'primary.main' }}
            startIcon={<Smartphone />}
          >
            Call: +254 700 000 000
          </Button>
          <Button 
            variant="contained" 
            sx={{ bgcolor: 'white', color: 'primary.main' }}
            startIcon={<Laptop />}
          >
            Email: support@bookshop.com
          </Button>
          <Button 
            variant="outlined" 
            sx={{ color: 'white', borderColor: 'white' }}
            startIcon={<QuestionAnswer />}
          >
            Live Chat
          </Button>
        </Box>
      </Box>

      {/* Processing Time Info */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'info.dark' }}>
          ⏱️ Processing Times:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>MPesa:</Typography>
            <Typography variant="caption" color="text.secondary">Instant - 2 minutes</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Card Payment:</Typography>
            <Typography variant="caption" color="text.secondary">Instant - 5 minutes</Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Bank Transfer:</Typography>
            <Typography variant="caption" color="text.secondary">1 - 4 hours</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentInstructions;