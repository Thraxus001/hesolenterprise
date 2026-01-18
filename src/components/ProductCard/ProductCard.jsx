// src/components/ProductCard/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Visibility
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product, showActions = true }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAddingToCart(true);
    try {
      // Use addToCart from context - works for both Guests AND Users
      const result = await addToCart(product, 1);

      if (result.success) {
        toast.success(`${product.name} added to cart!`);
      } else {
        toast.error(result.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription || product.description,
        url: window.location.origin + `/products/${product.id}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/products/${product.id}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Card
      className="product-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          '& .product-actions': {
            opacity: 1,
            transform: 'translateY(0)'
          },
          '& .product-image': {
            transform: 'scale(1.05)'
          }
        }
      }}
    >
      {/* Product Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Link to={`/products/${product.id}`} style={{ display: 'block' }}>
          <CardMedia
            component="img"
            height="200"
            image={product.mainImage || product.images?.[0] || '/placeholder-book.jpg'}
            alt={product.name}
            className="product-image"
            sx={{
              transition: 'transform 0.5s ease',
              objectFit: 'cover'
            }}
          />
        </Link>

        {/* Stock Status */}
        {product.stockQuantity <= 0 ? (
          <Chip
            label="Out of Stock"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10
            }}
          />
        ) : product.stockQuantity <= 10 ? (
          <Chip
            label={`Only ${product.stockQuantity} left`}
            color="warning"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10
            }}
          />
        ) : null}

        {/* Quick Actions */}
        <Box
          className="product-actions"
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            opacity: 0,
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease'
          }}
        >
          <IconButton
            size="small"
            onClick={handleToggleFavorite}
            sx={{
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            {isFavorite ? (
              <Favorite sx={{ color: 'error.main' }} fontSize="small" />
            ) : (
              <FavoriteBorder fontSize="small" />
            )}
          </IconButton>
          <IconButton
            size="small"
            onClick={handleShare}
            sx={{
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <Share fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          gutterBottom
          variant="subtitle1"
          component={Link}
          to={`/products/${product.id}`}
          sx={{
            fontWeight: 600,
            minHeight: '2.5em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': { color: 'primary.main' }
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            minHeight: '3em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {product.shortDescription || product.description}
        </Typography>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            {formatCurrency(product.price)}
          </Typography>
          {product.comparePrice > product.price && (
            <Typography variant="body2" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
              {formatCurrency(product.comparePrice)}
            </Typography>
          )}
        </Box>

        {/* Discount Badge */}
        {product.comparePrice > product.price && (
          <Chip
            label={`${Math.round((1 - product.price / product.comparePrice) * 100)}% OFF`}
            color="error"
            size="small"
            sx={{ mb: 1 }}
          />
        )}
      </CardContent>

      {/* Action Buttons */}
      {showActions && (
        <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={addingToCart || product.stockQuantity <= 0}
            size="small"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
          <Button
            variant="outlined"
            size="small"
            component={Link}
            to={`/products/${product.id}`}
            startIcon={<Visibility />}
            sx={{ minWidth: 'auto' }}
          >
            View
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default ProductCard;