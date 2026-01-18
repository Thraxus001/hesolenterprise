// src/pages/ProductCategories/TextbooksStoryBooks.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Breadcrumbs,
  Link as MuiLink,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { NavigateNext, Sort } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import Spinner from '../../components/common/Spinner';
import { formatCurrency } from '../../utils/formatters';
import './CategoryLayout.css';

// Mock data - will replace with Firebase service
import { productService } from '../../services/productService';
import { CATEGORIES } from '../../utils/constants';

// ...

const TextbooksStoryBooks = () => {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoryData();
  }, []);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      // Fetch products for 'cbc' category (which contains textbooks/storybooks in our seed data)
      const products = await productService.getAllProducts({ category: ['cbc', 'old-curriculum', 'story-books'] });

      setCategory({
        name: 'Textbooks & Story Books',
        description: 'Explore our extensive collection of educational textbooks and captivating story books.',
        productCount: products.length
      });
      setProducts(products);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    // Here you would typically re-fetch or sort the products
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Here you would typically fetch the next page of products
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <Container maxWidth="lg" className="category-page">
      {/* Breadcrumbs */}
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <MuiLink component="button" onClick={() => navigate('/')} color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Textbooks & Story Books</Typography>
      </Breadcrumbs>

      {/* Category Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          {category?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {category?.description}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {category?.productCount} products available
        </Typography>
      </Box>

      {/* Category Stats */}
      <Box sx={{
        backgroundColor: 'primary.light',
        color: 'white',
        borderRadius: 2,
        p: 3,
        mb: 4,
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>1,200+</Typography>
          <Typography variant="body2">Textbooks Available</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>500+</Typography>
          <Typography variant="body2">Story Books</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>98%</Typography>
          <Typography variant="body2">Positive Reviews</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Free</Typography>
          <Typography variant="body2">Delivery Over KES 5,000</Typography>
        </Box>
      </Box>

      {/* Filters and Sorting */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h6">
          Showing {products.length} of {category?.productCount} products
        </Typography>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
            startAdornment={<Sort sx={{ mr: 1, color: 'action.active' }} />}
          >
            <MenuItem value="featured">Featured</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="newest">Newest Arrivals</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Subcategories */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Browse by Subject</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'History', 'Geography', 'Business', 'Languages', 'Story Books'].map((subject) => (
            <MuiLink
              key={subject}
              component="button"
              onClick={() => { }}
              sx={{
                px: 2,
                py: 1,
                backgroundColor: 'action.hover',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.selected'
                }
              }}
            >
              {subject}
            </MuiLink>
          ))}
        </Box>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
        <Pagination
          count={Math.ceil(category?.productCount / 12)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* Category Description */}
      <Box sx={{ backgroundColor: 'background.paper', borderRadius: 2, p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          About Our Textbooks & Story Books Collection
        </Typography>
        <Typography variant="body1" paragraph>
          Our collection features a wide range of educational materials for students of all ages.
          From primary school storybooks to university-level textbooks, we have everything you need
          for academic success.
        </Typography>
        <Typography variant="body1" paragraph>
          We source our books from reputable publishers and ensure they meet the Kenyan curriculum
          standards. All our textbooks are up-to-date with the latest syllabus changes and include
          relevant exercises and practice questions.
        </Typography>
        <Typography variant="body1">
          Whether you're a student looking for study materials, a teacher seeking classroom resources,
          or a parent buying books for your child, you'll find exactly what you need in our collection.
        </Typography>
      </Box>

      {/* Featured Brands */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Featured Publishers</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['KLB', 'Longhorn', 'Oxford', 'Moran', 'EAEP', 'Storymoja', 'Jomo Kenyatta', 'Phoenix'].map((brand) => (
            <Box
              key={brand}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                minWidth: 120,
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle1" fontWeight="medium">{brand}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default TextbooksStoryBooks;