// src/pages/ProductDetail/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Rating,
  Tabs,
  Tab,
  TextField
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  ArrowBack,
  LocalShipping,
  Security,
  AssignmentReturn
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import Spinner from '../../components/common/Spinner';

import toast from 'react-hot-toast';
import './ProductDetail.css';

// ProductDetail.jsx
import { productService } from '../../services/productService';

// ... other imports

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductById(id);

      if (data) {
        setProduct(data);
        setSelectedImage(0);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (quantity < 1 || quantity > product.stockQuantity) {
      toast.error('Invalid quantity');
      return;
    }

    setAddingToCart(true);
    try {
      const result = await addToCart(product, quantity);
      if (result.success) {
        toast.success(`${quantity} × ${product.name} added to cart!`);
      } else {
        toast.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Product not found
        </Typography>
        <Button onClick={() => navigate('/products')} startIcon={<ArrowBack />}>
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <MuiLink component="button" onClick={() => navigate('/')} color="inherit">
          Home
        </MuiLink>
        <MuiLink component="button" onClick={() => navigate('/products')} color="inherit">
          Products
        </MuiLink>
        <MuiLink component="button" onClick={() => navigate(`/category/${product.categorySlug}`)} color="inherit">
          {product.categoryName}
        </MuiLink>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Left Column - Images */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 2, overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="400"
              image={product.images?.[selectedImage] || product.mainImage}
              alt={product.name}
              sx={{ objectFit: 'contain', p: 2 }}
            />
          </Card>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <Grid container spacing={1}>
              {product.images.map((img, index) => (
                <Grid item xs={3} key={index}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : '1px solid',
                      borderColor: selectedImage === index ? 'primary.main' : 'divider',
                      overflow: 'hidden'
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <CardMedia
                      component="img"
                      height="80"
                      image={img}
                      alt={`${product.name} view ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        {/* Right Column - Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({product.reviewCount} reviews)
              </Typography>
              <Chip label={product.brand} size="small" />
              {product.stockQuantity > 0 ? (
                <Chip label="In Stock" color="success" size="small" />
              ) : (
                <Chip label="Out of Stock" color="error" size="small" />
              )}
            </Box>
          </Box>

          {/* Price */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
                {formatCurrency(product.price)}
              </Typography>
              {product.comparePrice > product.price && (
                <>
                  <Typography variant="h6" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                    {formatCurrency(product.comparePrice)}
                  </Typography>
                  <Chip
                    label={`Save ${formatCurrency(product.comparePrice - product.price)}`}
                    color="error"
                    size="medium"
                  />
                </>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Inclusive of all taxes
            </Typography>
          </Box>

          {/* Short Description */}
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            {product.shortDescription || product.description?.substring(0, 200)}
          </Typography>

          {/* Key Features */}
          {product.attributes && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Features:
              </Typography>
              <Grid container spacing={1}>
                {Object.entries(product.attributes).map(([key, value]) => (
                  <Grid item xs={6} key={key}>
                    <Typography variant="body2">
                      <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Quantity Selector */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Quantity
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <IconButton onClick={decrementQuantity} disabled={quantity <= 1} size="small">
                  -
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{
                    style: {
                      textAlign: 'center',
                      width: '50px'
                    },
                    min: 1,
                    max: product.stockQuantity
                  }}
                  variant="standard"
                  sx={{ mx: 1 }}
                />
                <IconButton onClick={incrementQuantity} disabled={quantity >= product.stockQuantity} size="small">
                  +
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {product.stockQuantity} available
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={addingToCart || product.stockQuantity <= 0}
              sx={{ flex: 2 }}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleBuyNow}
              disabled={product.stockQuantity <= 0}
              sx={{ flex: 1 }}
            >
              Buy Now
            </Button>
            <IconButton onClick={handleToggleFavorite} size="large">
              {isFavorite ? (
                <Favorite color="error" />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
            <IconButton onClick={handleShare} size="large">
              <Share />
            </IconButton>
          </Box>

          {/* Product Highlights */}
          <Grid container spacing={2}>

            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <AssignmentReturn sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2">Easy Returns</Typography>
                <Typography variant="caption" color="text.secondary">30 Days Return</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Security sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2">Secure Payment</Typography>
                <Typography variant="caption" color="text.secondary">100% Secure</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <LocalShipping sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2">Fast Delivery</Typography>
                <Typography variant="caption" color="text.secondary">Nairobi 1-2 Days</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label={`Reviews (${product.reviewCount})`} />
          <Tab label="Shipping & Returns" />
        </Tabs>

        {tabValue === 0 && (
          <Card sx={{ p: 3 }}>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Features:
            </Typography>
            <ul>
              <li>Comprehensive coverage of physics topics for secondary education</li>
              <li>Includes practical experiments and exercises</li>
              <li>KCSE examination style questions with answers</li>
              <li>Colorful illustrations and diagrams for better understanding</li>
              <li>Written by experienced physics educators</li>
            </ul>
          </Card>
        )}

        {tabValue === 1 && (
          <Card sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        )}

        {tabValue === 2 && (
          <Card sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No reviews yet. Be the first to review this product!
            </Typography>
          </Card>
        )}

        {tabValue === 3 && (
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Typography variant="body1" paragraph>
              • Standard delivery: 3-5 business days
              • Express delivery: 1-2 business days (additional fee applies)
              • We ship nationwide across Kenya
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Return Policy
            </Typography>
            <Typography variant="body1">
              • 30-day return policy for unused items in original packaging
              • Return shipping fees may apply
              • Refunds processed within 5-7 business days
              • Digital products are non-refundable
            </Typography>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default ProductDetail;