// src/components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Box,
  IconButton,
  Divider
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.dark',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
              📚 HesolEnterprises
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
              Your one-stop shop for textbooks, stationery, lab equipment, and ICT accessories.
              Quality products with reliable delivery across Bungoma Town Kenya.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <LinkedIn fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Shop
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/category/textbooks-story-books" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Textbooks
              </MuiLink>
              <MuiLink component={Link} to="/category/stationery-office-supplies" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Stationery
              </MuiLink>
              <MuiLink component={Link} to="/category/lab-equipment-chemicals" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Lab Equipment
              </MuiLink>
              <MuiLink component={Link} to="/category/computer-ict-accessories" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                ICT Accessories
              </MuiLink>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/contact" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Contact Us
              </MuiLink>
              <MuiLink component={Link} to="/faq" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                FAQ
              </MuiLink>
              <MuiLink component={Link} to="/shipping" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Shipping Policy
              </MuiLink>
              <MuiLink component={Link} to="/returns" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Returns & Refunds
              </MuiLink>
            </Box>
          </Grid>

          {/* Company */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} to="/about" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                About Us
              </MuiLink>
              <MuiLink component={Link} to="/careers" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Careers
              </MuiLink>
              <MuiLink component={Link} to="/blog" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Blog
              </MuiLink>
              <MuiLink component={Link} to="/privacy" color="inherit" underline="hover" sx={{ opacity: 0.9 }}>
                Privacy Policy
              </MuiLink>
              <MuiLink component={Link} to="/login" color="inherit" underline="hover" sx={{ opacity: 0.7, fontSize: '0.8rem', mt: 1 }}>
                Admin Panel
              </MuiLink>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Chwele, Bungoma KE
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  0717930932
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  hesolenterprises@gmail.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255,255,255,0.2)' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Bookshop. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            MPesa Payments Powered by Safaricom | Secure Card Payments
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;