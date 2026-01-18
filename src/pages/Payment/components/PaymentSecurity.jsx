// src/pages/Payment/components/PaymentSecurity.jsx
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Security,
  Lock,
  VerifiedUser,
  Payment,
  CreditCard,
  Shield
} from '@mui/icons-material';

const PaymentSecurity = () => {
  const securityFeatures = [
    {
      icon: <Lock fontSize="large" />,
      title: 'SSL Encryption',
      description: 'All transactions are protected with 256-bit SSL encryption'
    },
    {
      icon: <VerifiedUser fontSize="large" />,
      title: 'PCI DSS Compliant',
      description: 'We comply with Payment Card Industry Data Security Standards'
    },
    {
      icon: <Shield fontSize="large" />,
      title: 'Fraud Protection',
      description: 'Advanced fraud detection and prevention systems'
    },
    {
      icon: <CreditCard fontSize="large" />,
      title: 'Secure Payments',
      description: 'Your card details are never stored on our servers'
    }
  ];

  return (
    <Box className="payment-security">
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Security sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Your Payment is Secure
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We use industry-leading security to protect your payment information
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {securityFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  p: 3,
                  height: '100%'
                }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 4, p: 3, bgcolor: 'success.light', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600, mb: 1 }}>
              🔒 100% Secure Payment Guarantee
            </Typography>
            <Typography variant="caption" sx={{ color: 'success.dark' }}>
              Your payment is protected by our secure payment partners. In case of any issues, we offer a full refund.
            </Typography>
          </Box>

          {/* Trust Seals */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mb: 1,
                mx: 'auto'
              }}>
                <Payment sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Secure Payments
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mb: 1,
                mx: 'auto'
              }}>
                <Lock sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                SSL Protected
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mb: 1,
                mx: 'auto'
              }}>
                <VerifiedUser sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Verified Partner
              </Typography>
            </Box>
          </Box>

          {/* Security Tips */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'info.light', borderRadius: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'info.dark' }}>
              💡 Security Tips:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Never share your payment details via email or phone
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Look for the padlock icon in your browser address bar
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Ensure the URL starts with "https://"
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Keep your device and antivirus software updated
                </Typography>
              </li>
            </ul>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentSecurity;