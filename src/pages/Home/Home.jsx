// src/pages/Home/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button as MuiButton
} from '@mui/material';
import {
  MenuBook,
  Create,
  Science,
  Computer,
  ShoppingCart,
  LocalShipping,
  Security,
  Payment,
  ArrowForward
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { CATEGORIES, CATEGORY_NAMES, CATEGORY_ICONS } from '../../utils/constants';
import { productService } from '../../services/productService';

// Featured products will be loaded from database

const features = [

  {
    icon: <Payment sx={{ fontSize: 40 }} />,
    title: 'Secure Payment',
    description: 'MPesa & Card Payments'
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: 'Quality Guaranteed',
    description: '100% authentic products'
  },
  {
    icon: <ShoppingCart sx={{ fontSize: 40 }} />,
    title: 'Easy Returns',
    description: '30-day return policy'
  }
];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const products = await productService.getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(to right, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.6) 100%), url('/images/bookshop_hero.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: { xs: 12, md: 20 }, // Increased padding for better height
          mb: 6,
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          <Grid container alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                Welcome to Hesol Enterprises
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 4, opacity: 0.95, textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                Everything you need for education, office, and laboratory supplies
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  },
                  px: 4,
                  py: 1.5,
                  boxShadow: 3
                }}
              >
                Shop Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {/* Categories Section */}
        <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Shop by Category
        </Typography>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {Object.entries(CATEGORIES).map(([key, slug]) => (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Card
                component={Link}
                to={`/category/${slug}`}
                sx={{
                  height: '100%',
                  textDecoration: 'none',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}>
                    {CATEGORY_ICONS[slug] === 'MenuBook' && <MenuBook fontSize="inherit" />}
                    {CATEGORY_ICONS[slug] === 'Create' && <Create fontSize="inherit" />}
                    {CATEGORY_ICONS[slug] === 'Science' && <Science fontSize="inherit" />}
                    {CATEGORY_ICONS[slug] === 'Computer' && <Computer fontSize="inherit" />}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {CATEGORY_NAMES[slug]}
                  </Typography>
                  <MuiButton
                    endIcon={<ArrowForward />}
                    sx={{ mt: 2 }}
                  >
                    Browse
                  </MuiButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Featured Products */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Featured Products
            </Typography>
            <Button component={Link} to="/products" variant="outlined">
              View All Products
            </Button>
          </Box>
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.mainImage || product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                      {formatCurrency(product.price)}
                    </Typography>
                    {product.stockQuantity > 0 ? (
                      <Chip label="In Stock" color="success" size="small" />
                    ) : (
                      <Chip label="Out of Stock" color="error" size="small" />
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to={`/products/${product.id}`}
                      startIcon={<ShoppingCart />}
                    >
                      View Details
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Features */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Call to Action */}
        <Box
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: 2,
            p: 6,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of satisfied customers shopping with us
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: '#f5f5f5'
              },
              px: 6,
              py: 1.5
            }}
          >
            Start Shopping Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;