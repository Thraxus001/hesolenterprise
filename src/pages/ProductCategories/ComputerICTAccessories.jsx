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
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Computer as ComputerIcon,
  Memory as MemoryIcon,
  Mouse as MouseIcon,
  Keyboard as KeyboardIcon,
  Headset as HeadsetIcon,
  Cable as CableIcon,
  Speed as PerformanceIcon,
  NewReleases as NewIcon,
  Sell as DiscountIcon,
  MenuBook as MenuBookIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import { CATEGORIES } from '../../utils/constants';

const ComputerICTAccessories = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500000]);

  const categories = [
    { id: 'all', label: 'All ICT', icon: <ComputerIcon /> },
    { id: 'storage', label: 'Storage Devices', icon: <MemoryIcon /> },
    { id: 'peripherals', label: 'Peripherals', icon: <MouseIcon /> },
    { id: 'input', label: 'Input Devices', icon: <KeyboardIcon /> },
    { id: 'audio', label: 'Audio & Headsets', icon: <HeadsetIcon /> },
    { id: 'cables', label: 'Cables & Adapters', icon: <CableIcon /> },
    { id: 'network', label: 'Networking', icon: <PerformanceIcon /> },
    { id: 'technology', label: 'Tech Books', icon: <MenuBookIcon /> },
  ];

  // ... inside component

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch products for this specific category
      const data = await productService.getAllProducts({ category: ['ict', 'technology'] });
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching ICT products:', error);
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
      if (selectedCategory === 'technology') {
        filtered = filtered.filter(product => product.category === 'technology');
      } else {
        filtered = filtered.filter(product => product.subcategory === selectedCategory);
      }
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          // Simulate popularity based on rating and new/hot status
          const aScore = a.rating + (a.isNew ? 0.5 : 0) + (a.isHot ? 0.3 : 0);
          const bScore = b.rating + (b.isNew ? 0.5 : 0) + (b.isHot ? 0.3 : 0);
          return bScore - aScore;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
    setPage(1);
  }, [searchTerm, selectedCategory, sortBy, priceRange, products]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
          <Typography color="text.primary">Computer & ICT Accessories</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            <ComputerIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 2 }} />
            Computer & ICT Accessories
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            High-quality computer peripherals, networking equipment, and ICT accessories for schools,
            offices, and personal use
          </Typography>
        </Box>

        {/* Featured Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <MemoryIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="primary">Storage</Typography>
              <Typography variant="body2">HDD, SSD, Flash Drives</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <MouseIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="secondary">Peripherals</Typography>
              <Typography variant="body2">Mice, Keyboards, Webcams</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CableIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="success">Cables</Typography>
              <Typography variant="body2">HDMI, USB, Adapters</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <PerformanceIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" color="warning">Networking</Typography>
              <Typography variant="body2">Routers, Switches</Typography>
            </Card>
          </Grid>
        </Grid>

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
                  <MenuItem value="popularity">Most Popular</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Chip
                  label="All Categories"
                  onClick={() => setSelectedCategory('all')}
                  color={selectedCategory === 'all' ? 'primary' : 'default'}
                  variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
                />
                <Chip
                  icon={<MemoryIcon />}
                  label="Storage"
                  onClick={() => setSelectedCategory('storage')}
                  color={selectedCategory === 'storage' ? 'primary' : 'default'}
                />
                <Chip
                  icon={<MouseIcon />}
                  label="Peripherals"
                  onClick={() => setSelectedCategory('peripherals')}
                  color={selectedCategory === 'peripherals' ? 'primary' : 'default'}
                />
                <Chip
                  icon={<CableIcon />}
                  label="Cables"
                  onClick={() => setSelectedCategory('cables')}
                  color={selectedCategory === 'cables' ? 'primary' : 'default'}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Category Navigation */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Browse Categories
          </Typography>
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={category.id}>
                <Card
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: selectedCategory === category.id ? '2px solid' : '1px solid',
                    borderColor: selectedCategory === category.id ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Box sx={{ color: selectedCategory === category.id ? 'primary.main' : 'text.secondary', mb: 1 }}>
                    {React.cloneElement(category.icon, { sx: { fontSize: 30 } })}
                  </Box>
                  <Typography variant="body2" fontWeight={selectedCategory === category.id ? 'bold' : 'normal'}>
                    {category.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {paginatedProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <motion.div
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={product.mainImage}
                          alt={product.name}
                          sx={{ objectFit: 'cover' }}
                        />
                        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                          {product.isNew && (
                            <Badge color="secondary" badgeContent="NEW">
                              <NewIcon fontSize="small" />
                            </Badge>
                          )}
                          {product.isHot && (
                            <Badge color="error" badgeContent="HOT">
                              <DiscountIcon fontSize="small" />
                            </Badge>
                          )}
                        </Box>
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="h3" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden' }}>
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.rating})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                          {product.features?.slice(0, 3).map((feature, index) => (
                            <Chip
                              key={index}
                              label={feature}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h5" color="primary" fontWeight="bold">
                            ${product.price.toFixed(2)}
                          </Typography>
                          <Chip
                            label={product.stock > 20 ? 'In Stock' : 'Low Stock'}
                            color={product.stock > 20 ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleProductClick(product.id)}
                          startIcon={<ComputerIcon />}
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
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <ComputerIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
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
                setPriceRange([0, 1000]);
              }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}

        {/* Tech Support Section */}
        <Box sx={{ mt: 8, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                Need Help Choosing ICT Equipment?
              </Typography>
              <Typography variant="body1" paragraph>
                Our technical support team can help you select the right equipment for your
                school or organization. We provide compatibility advice and bulk purchase discounts.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="contained" startIcon={<ComputerIcon />}>
                  Request Consultation
                </Button>
                <Button variant="outlined">
                  View Compatibility Guide
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <PerformanceIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6">Bulk Purchase Discount</Typography>
                <Typography variant="body2" color="text.secondary">
                  Get up to 20% off on orders over 10 units
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );
};

export default ComputerICTAccessories;