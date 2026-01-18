// src/pages/ProductCategories/StationeryOfficeSupplies.jsx
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
import { productService } from '../../services/productService';
import { CATEGORIES } from '../../utils/constants';
import './CategoryLayout.css';

// Similar structure as TextbooksStoryBooks.jsx but with stationery data
const StationeryOfficeSupplies = () => {
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

      // Set static category info (can be dynamic later if needed)
      setCategory({
        name: 'Stationery & Office Supplies',
        description: 'Complete range of writing materials, office essentials, and organizational supplies for schools, offices, and personal use.',
        productCount: 0 // Will update after fetch? Or just ignore count
      });

      // Fetch products from DB
      const data = await productService.getAllProducts({ category: 'stationery' });
      setProducts(data);

    } catch (error) {
      console.error('Error fetching stationery data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <Container maxWidth="lg" className="category-page">
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
        <MuiLink component="button" onClick={() => navigate('/')} color="inherit">
          Home
        </MuiLink>
        <Typography color="text.primary">Stationery & Office Supplies</Typography>
      </Breadcrumbs>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          {category?.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {category?.description}
        </Typography>
      </Box>

      {/* Add stationery-specific content here */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default StationeryOfficeSupplies;