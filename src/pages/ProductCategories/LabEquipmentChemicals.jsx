import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Breadcrumbs,
  Link,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocalOffer as LocalOfferIcon,
  Science as ScienceIcon,
  Biotech as BiotechIcon,
  Coronavirus as ChemicalsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { productService } from '../../services/productService';
import { CATEGORIES } from '../../utils/constants';
import Spinner from '../../components/common/Spinner';

const LabEquipmentChemicals = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500000]);

  const categories = [
    { id: 'all', label: 'All Lab Equipment', icon: <ScienceIcon /> },
    { id: 'microscopes', label: 'Microscopes', icon: <BiotechIcon /> },
    { id: 'chemicals', label: 'Chemicals & Reagents', icon: <ChemicalsIcon /> },
    { id: 'glassware', label: 'Laboratory Glassware', icon: <LocalOfferIcon /> },
    { id: 'safety', label: 'Safety Equipment', icon: <ScienceIcon /> },
    { id: 'instruments', label: 'Measuring Instruments', icon: <BiotechIcon /> },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch products for this specific category
      // Fetch products for this specific category
      const data = await productService.getAllProducts({ category: 'lab-equipment' });
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching lab equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
    setPage(1);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link color="inherit" href="/" underline="hover">
            Home
          </Link>
          <Link color="inherit" href="/products" underline="hover">
            Products
          </Link>
          <Typography color="text.primary">Lab Equipment & Chemicals</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            <ScienceIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 2 }} />
            Laboratory Equipment & Chemicals
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Professional-grade lab equipment, chemicals, and safety gear for educational institutions
            and research facilities
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={3} alignItems="center">

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="name">Name (A-Z)</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="All"
                  onClick={() => setSelectedCategory('all')}
                  color={selectedCategory === 'all' ? 'primary' : 'default'}
                  variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Microscopes"
                  onClick={() => setSelectedCategory('microscopes')}
                  color={selectedCategory === 'microscopes' ? 'primary' : 'default'}
                  variant={selectedCategory === 'microscopes' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Chemicals"
                  onClick={() => setSelectedCategory('chemicals')}
                  color={selectedCategory === 'chemicals' ? 'primary' : 'default'}
                  variant={selectedCategory === 'chemicals' ? 'filled' : 'outlined'}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Category Chips */}
        <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              icon={category.icon}
              label={category.label}
              onClick={() => setSelectedCategory(category.id)}
              color={selectedCategory === category.id ? 'primary' : 'default'}
              variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {paginatedProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.mainImage}
                          alt={product.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        {product.isNew && (
                          <Chip
                            label="NEW"
                            color="secondary"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 10,
                              right: 10,
                            }}
                          />
                        )}
                        {product.stock < 10 && (
                          <Chip
                            label="Low Stock"
                            color="warning"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 10,
                              left: 10,
                            }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h3" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.rating})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                          {product.features?.slice(0, 2).map((feature, index) => (
                            <Chip
                              key={index}
                              label={feature}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                        <Typography variant="h5" color="primary" fontWeight="bold">
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Stock: {product.stock} units
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleProductClick(product.id)}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <ScienceIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter criteria
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}

        {/* Safety Information */}
        <Box sx={{ mt: 8, p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ScienceIcon sx={{ mr: 1 }} />
            Important Safety Information
          </Typography>
          <Typography variant="body1" paragraph>
            All laboratory equipment and chemicals should be used under proper supervision.
            Safety gear must be worn when handling chemicals. Ensure proper storage and disposal
            according to safety guidelines.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                🔬 Equipment Handling
              </Typography>
              <Typography variant="body2">
                Follow manufacturer instructions for all lab equipment
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                ⚗️ Chemical Safety
              </Typography>
              <Typography variant="body2">
                Use proper PPE and work in ventilated areas
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                📚 Educational Use
              </Typography>
              <Typography variant="body2">
                Suitable for school and university laboratories
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );
};

export default LabEquipmentChemicals;