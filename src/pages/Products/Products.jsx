// src/pages/Products/Products.jsx - FIXED VERSION
import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Breadcrumbs,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  IconButton,
  Button,
  Chip,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Card,
  CardContent
} from '@mui/material';
import {
  NavigateNext,
  Sort,
  FilterList,
  Close,
  Refresh,
  School,
  Computer,
  Science,
  LocalLibrary,
  Category
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';

// Import products data
import { productService } from '../../services/productService';
import ProductFilters from './components/ProductFilters';
import ProductGrid from './components/ProductGrid';
import toast from 'react-hot-toast';

// Product type categories for tabs - ADJUSTED BASED ON ACTUAL DATA
const PRODUCT_TYPE_CATEGORIES = [
  { id: 'all', name: 'All Products', icon: <Category />, color: 'primary' },
  { id: 'educational', name: 'Educational', icon: <School />, color: 'success' },
  { id: 'stationery', name: 'Stationery', icon: <LocalLibrary />, color: 'secondary' },
  { id: 'ict', name: 'ICT Accessories', icon: <Computer />, color: 'info' },
  { id: 'lab-equipment', name: 'Lab Equipment', icon: <Science />, color: 'error' }
];

// Original categories from your data
const ORIGINAL_CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'cbc', name: 'CBC Curriculum' },
  { id: 'old-curriculum', name: 'Old Curriculum' },
  { id: 'story-books', name: 'Story Books' },
  { id: 'stationery', name: 'Stationery' },
  { id: 'ict', name: 'ICT Accessories' },
  { id: 'lab-equipment', name: 'Lab Equipment' }
];

// Grade order for sorting educational products
const GRADE_ORDER = ['pp1', 'pp2', 'grade-1-3', 'grade-4-6', 'grade-7-9', 'form-1-2', 'form-3-4'];

// Function to get main product category - SIMPLIFIED
const getProductMainCategory = (product) => {
  const category = product.category || '';

  // Based on your actual data
  if (category === 'cbc' || category === 'old-curriculum' || category === 'story-books') {
    return 'educational';
  }
  if (category === 'stationery') {
    return 'stationery';
  }
  if (category === 'ict') {
    return 'ict';
  }
  if (category === 'lab-equipment') {
    return 'lab-equipment';
  }

  return 'other';
};

// Function to get sort options based on selected product type
const getSortOptions = (selectedProductType) => {
  const baseOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  // Add grade sorting for educational products
  if (selectedProductType === 'educational' || selectedProductType === 'all') {
    return [
      { value: 'grade', label: 'Grade: PP1 to Form 4' },
      ...baseOptions
    ];
  }

  return baseOptions;
};

const Products = () => {
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [selectedProductTypes, setSelectedProductTypes] = useState([]);
  const [selectedGradeLevels, setSelectedGradeLevels] = useState([]);
  const [selectedCurriculums, setSelectedCurriculums] = useState([]);
  const [selectedProductTypeTab, setSelectedProductTypeTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const navigate = useNavigate();

  const productsPerPage = 12;

  // Initialize with all products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Handle URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const subParam = params.get('sub');
    const searchParam = params.get('q');

    if (tabParam) {
      setSelectedProductTypeTab(tabParam);
    }

    // Handle Navbar subcategory links (e.g., ?sub=primary)
    if (subParam) {
      // Map subparams to filters
      const subMap = {
        'primary': 'grade-1-3',
        'secondary': 'grade-7-9',
        'university': 'all',
        'writing': 'stationery',
        'office': 'stationery',
        'chemistry': 'educational',
        'computers': 'educational'
      };

      const val = subMap[subParam];
      if (val) {
        if (val.startsWith('grade-')) {
          setSelectedGradeLevels([val]);
        } else if (val === 'stationery') {
          // Ensure stationery tab is active if not already
          if (!tabParam) setSelectedProductTypeTab('stationery');
        }
      }
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

  const filterProducts = useCallback(() => {
    console.log('Starting filter...');
    let filtered = [...products];

    // Debug: Log all products with their main categories
    console.log('=== ALL PRODUCTS WITH CATEGORIES ===');
    /* 
    filtered.forEach(p => {
      const mainCat = getProductMainCategory(p);
      console.log(`Product: ${p.name}, Category: ${p.category}, Main Category: ${mainCat}`);
    });
    */

    // Filter by product type tab
    if (selectedProductTypeTab !== 'all') {
      console.log(`Filtering by main category: ${selectedProductTypeTab}`);
      filtered = filtered.filter(product => {
        const mainCat = getProductMainCategory(product);
        return mainCat === selectedProductTypeTab;
      });
    }

    // Filter by original categories
    if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Filter by product types (from filter panel)
    if (selectedProductTypes.length > 0) {
      console.log('Filtering by product types:', selectedProductTypes);
      filtered = filtered.filter(product => {
        const productCategory = product.category || '';

        // CORRECTION: Map IDs from ProductFilters (e.g., 'cbc') to data categories
        const filterToCategoryMap = {
          'cbc': ['cbc'], // Fixed: matches ID from ProductFilters
          'textbooks': ['cbc', 'old-curriculum'],
          'story-books': ['story-books'],
          'cbc-books': ['cbc'],
          'old-curriculum': ['old-curriculum'],
          'stationery': ['stationery'],
          'writing': ['stationery'],
          'paper': ['stationery'],
          'office': ['stationery'],
          'art': ['stationery']
        };

        return selectedProductTypes.some(filterType => {
          const matchingCategories = filterToCategoryMap[filterType] || [];
          return matchingCategories.includes(productCategory);
        });
      });
    }

    // Filter by grade levels
    if (selectedGradeLevels.length > 0) {
      console.log('Filtering by grade levels:', selectedGradeLevels);

      filtered = filtered.filter(product => {
        const grade = product.gradeLevel || product.grade || '';
        const subcategory = product.subcategory || '';

        // CORRECTION: Check both explicit grade field and subcategory ID
        return selectedGradeLevels.includes(grade) || selectedGradeLevels.includes(subcategory);
      });
    }

    // Filter by curriculum
    if (selectedCurriculums.length > 0) {
      console.log('Filtering by curriculum:', selectedCurriculums);
      const before = filtered.length;
      filtered = filtered.filter(product =>
        product.curriculum && selectedCurriculums.includes(product.curriculum)
      );
      console.log(`Curriculum filter: ${before} -> ${filtered.length} products`);
    }

    // Search filter
    if (searchQuery.trim()) {
      console.log('Filtering by search:', searchQuery);
      const before = filtered.length;
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        (product.name || '').toLowerCase().includes(query) ||
        (product.description || '').toLowerCase().includes(query) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query))) ||
        product.author?.toLowerCase().includes(query) ||
        product.publisher?.toLowerCase().includes(query)
      );
      console.log(`Search filter: ${before} -> ${filtered.length} products`);
    }

    // Price filter
    console.log('Filtering by price range:', priceRange);
    const beforePrice = filtered.length;
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    console.log(`Price filter: ${beforePrice} -> ${filtered.length} products`);

    // Sort products
    filtered.sort((a, b) => {
      // Special sorting for grade option
      if (sortBy === 'grade') {
        const aGrade = a.gradeLevel || a.grade || '';
        const bGrade = b.gradeLevel || b.grade || '';

        const aGradeIndex = GRADE_ORDER.indexOf(aGrade);
        const bGradeIndex = GRADE_ORDER.indexOf(bGrade);

        // If both have grades in our order, sort by that
        if (aGradeIndex !== -1 && bGradeIndex !== -1 && aGradeIndex !== bGradeIndex) {
          return aGradeIndex - bGradeIndex;
        }
        // If only one has grade, put it first
        if (aGradeIndex !== -1 && bGradeIndex === -1) return -1;
        if (aGradeIndex === -1 && bGradeIndex !== -1) return 1;
      }

      // Apply other sort criteria
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default: // featured
          const scoreA = (a.discount ? 2 : 0) + (a.rating || 0) + (a.isFeatured ? 1 : 0);
          const scoreB = (b.discount ? 2 : 0) + (b.rating || 0) + (b.isFeatured ? 1 : 0);
          return scoreB - scoreA;
      }
    });

    console.log('Final filtered products:', filtered.length);
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [
    products,
    selectedProductTypeTab,
    selectedCategories,
    selectedProductTypes,
    selectedGradeLevels,
    selectedCurriculums,
    searchQuery,
    priceRange,
    sortBy
  ]);

  // Category filter handler
  const handleCategoryToggle = (categoryId) => {
    if (categoryId === 'all') {
      setSelectedCategories(['all']);
    } else {
      setSelectedCategories(prev => {
        const newSelection = prev.includes(categoryId)
          ? prev.filter(c => c !== categoryId && c !== 'all')
          : [...prev.filter(c => c !== 'all'), categoryId];

        return newSelection.length === 0 ? ['all'] : newSelection;
      });
    }
  };

  // Trigger filter when products are loaded
  useEffect(() => {
    if (products.length > 0) {
      filterProducts();
    }
  }, [products, filterProducts]);

  // Filter products when criteria change
  useEffect(() => {
    // console.log('Filters changed, re-filtering...');
    filterProducts();
  }, [filterProducts]);

  // Product Type filter handler
  const handleProductTypeToggle = (productType) => {
    setSelectedProductTypes(prev =>
      prev.includes(productType)
        ? prev.filter(id => id !== productType)
        : [...prev, productType]
    );
  };

  // Grade Level filter handler
  const handleGradeLevelToggle = (gradeLevel) => {
    setSelectedGradeLevels(prev =>
      prev.includes(gradeLevel)
        ? prev.filter(id => id !== gradeLevel)
        : [...prev, gradeLevel]
    );
  };

  // Curriculum filter handler
  const handleCurriculumToggle = (curriculum) => {
    setSelectedCurriculums(prev =>
      prev.includes(curriculum)
        ? prev.filter(id => id !== curriculum)
        : [...prev, curriculum]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleProductTypeTabChange = (event, newValue) => {
    console.log('Changing tab to:', newValue);
    setSelectedProductTypeTab(newValue);
    // Reset specific filters when changing tabs
    setSelectedCategories(['all']);
    setSelectedProductTypes([]);
    setSelectedGradeLevels([]);
    setSelectedCurriculums([]);
  };

  const resetFilters = () => {
    console.log('Resetting all filters');
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange([0, 50000]);
    setSelectedCategories(['all']);
    setSelectedProductTypes([]);
    setSelectedGradeLevels([]);
    setSelectedCurriculums([]);
    setSelectedProductTypeTab('all');
    setShowResetAlert(true);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategories.length > 0 && !(selectedCategories.length === 1 && selectedCategories[0] === 'all')) {
      count += selectedCategories.length;
    }
    if (selectedProductTypes.length > 0) count += selectedProductTypes.length;
    if (selectedGradeLevels.length > 0) count += selectedGradeLevels.length;
    if (selectedCurriculums.length > 0) count += selectedCurriculums.length;
    if (priceRange[0] > 0 || priceRange[1] < 50000) count += 1;
    if (searchQuery.trim()) count += 1;
    if (selectedProductTypeTab !== 'all') count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get current page products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // TEMPORARY DEBUG - Show sample products when no filters match
  const debugProducts = products.slice(0, 4);
  const isDebugMode = filteredProducts.length === 0 && products.length > 0;

  if (loading) {
    return <Spinner fullScreen />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
          <MuiLink component="button" onClick={() => navigate('/')} color="inherit">
            Home
          </MuiLink>
          <Typography color="text.primary">All Products</Typography>
        </Breadcrumbs>

        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Bookshop Products
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse all {products.length} products including Educational and Stationery
        </Typography>
      </Box>

      {/* Product Type Tabs - UPDATED */}
      <Box sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedProductTypeTab}
          onChange={handleProductTypeTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="product type tabs"
        >
          {PRODUCT_TYPE_CATEGORIES.map((category) => (
            <Tab
              key={category.id}
              value={category.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {category.icon}
                  {category.name}
                  {category.id !== 'all' && (
                    <Chip
                      label={products.filter(p => getProductMainCategory(p) === category.id).length}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem', ml: 1 }}
                    />
                  )}
                </Box>
              }
              sx={{
                minHeight: 60,
                color: selectedProductTypeTab === category.id ? `${category.color}.main` : 'text.secondary'
              }}
            />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar - Desktop */}
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <ProductFilters
            products={products}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedMainCategory={selectedProductTypeTab}
            setSelectedMainCategory={setSelectedProductTypeTab}
            selectedCategories={selectedCategories}
            handleCategoryToggle={handleCategoryToggle}
            selectedProductTypes={selectedProductTypes}
            handleProductTypeToggle={handleProductTypeToggle}
            selectedGradeLevels={selectedGradeLevels}
            handleGradeLevelToggle={handleGradeLevelToggle}
            selectedCurriculums={selectedCurriculums}
            handleCurriculumToggle={handleCurriculumToggle}
            priceRange={priceRange}
            handlePriceChange={handlePriceChange}
            resetFilters={resetFilters}
            activeFilterCount={activeFilterCount}
            categories={ORIGINAL_CATEGORIES}
            availableTabs={PRODUCT_TYPE_CATEGORIES}
          />
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          {/* Mobile Filters Button */}
          <Box sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6">
                {filteredProducts.length} Products
              </Typography>
              {activeFilterCount > 0 && (
                <Chip
                  label={activeFilterCount}
                  size="small"
                  color="primary"
                  sx={{ height: 24 }}
                />
              )}
            </Box>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setMobileFiltersOpen(true)}
              sx={{ position: 'relative' }}
            >
              Filters
              {activeFilterCount > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    width: 18,
                    height: 18,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {activeFilterCount}
                </Box>
              )}
            </Button>
          </Box>

          {/* Desktop Header */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">
                Showing {filteredProducts.length} products
                {selectedProductTypeTab !== 'all' && (
                  <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                    ({PRODUCT_TYPE_CATEGORIES.find(c => c.id === selectedProductTypeTab)?.name})
                  </Typography>
                )}
              </Typography>
              {activeFilterCount > 0 && (
                <>
                  <Chip
                    label={`${activeFilterCount} active filters`}
                    size="small"
                    color="primary"
                    onDelete={resetFilters}
                    deleteIcon={<Refresh fontSize="small" />}
                  />
                  <Button
                    size="small"
                    startIcon={<Refresh />}
                    onClick={resetFilters}
                  >
                    Reset
                  </Button>
                </>
              )}
            </Box>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<Sort sx={{ mr: 1, color: 'action.active' }} />}
              >
                {getSortOptions(selectedProductTypeTab).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Mobile Sort */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 2, gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                {getSortOptions(selectedProductTypeTab).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {activeFilterCount > 0 && (
              <Button
                size="small"
                startIcon={<Refresh />}
                onClick={resetFilters}
                variant="outlined"
              >
                Reset
              </Button>
            )}
          </Box>

          {/* DEBUG VIEW - Shows when no products match filters */}
          {isDebugMode && (
            <Box sx={{
              mb: 4,
              p: 3,
              bgcolor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: 2
            }}>
              <Typography variant="h6" color="#856404" gutterBottom>
                ⚠️ No products match current filters
              </Typography>
              <Typography variant="body2" color="#856404" sx={{ mb: 3 }}>
                Showing {debugProducts.length} sample products from your data.
                Your filters returned {filteredProducts.length} products.
              </Typography>

              <Grid container spacing={3}>
                {debugProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Category:</strong> {product.category || 'None'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Main Type:</strong> {getProductMainCategory(product)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Price:</strong> Ksh {product.price}
                        </Typography>
                        {product.gradeLevel && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Grade:</strong> {product.gradeLevel}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: '#e9ecef', borderRadius: 1 }}>
                <Typography variant="caption" display="block" gutterBottom>
                  <strong>All Categories Found:</strong> {[...new Set(products.map(p => p.category))].join(', ')}
                </Typography>
                <Typography variant="caption" display="block">
                  <strong>Total Products:</strong> {products.length} |
                  <strong> Filtered:</strong> {filteredProducts.length} |
                  <strong> Current Tab:</strong> {selectedProductTypeTab}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="warning"
                startIcon={<Refresh />}
                onClick={resetFilters}
                sx={{ mt: 2 }}
              >
                Reset All Filters
              </Button>
            </Box>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <>
              <ProductGrid
                products={currentProducts}
                selectedProductType={selectedProductTypeTab}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <nav>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      gap: '8px'
                    }}>
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        return (
                          <li key={pageNumber}>
                            <Button
                              variant={currentPage === pageNumber ? "contained" : "outlined"}
                              onClick={(e) => {
                                setCurrentPage(pageNumber);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              size="small"
                              sx={{ minWidth: '40px' }}
                            >
                              {pageNumber}
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </Box>
              )}
            </>
          ) : !isDebugMode ? (
            <Box sx={{
              textAlign: 'center',
              py: 8,
              bgcolor: 'grey.50',
              borderRadius: 2
            }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your filters or search terms
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={resetFilters}
              >
                Reset All Filters
              </Button>
            </Box>
          ) : null}
        </Grid>
      </Grid>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="right"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 }
          }
        }}
      >
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <ProductFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedMainCategory={selectedProductTypeTab}
              setSelectedMainCategory={setSelectedProductTypeTab}
              selectedCategories={selectedCategories}
              handleCategoryToggle={handleCategoryToggle}
              selectedProductTypes={selectedProductTypes}
              handleProductTypeToggle={handleProductTypeToggle}
              selectedGradeLevels={selectedGradeLevels}
              handleGradeLevelToggle={handleGradeLevelToggle}
              selectedCurriculums={selectedCurriculums}
              handleCurriculumToggle={handleCurriculumToggle}
              priceRange={priceRange}
              handlePriceChange={handlePriceChange}
              resetFilters={() => {
                resetFilters();
                setMobileFiltersOpen(false);
              }}
              activeFilterCount={activeFilterCount}
              categories={ORIGINAL_CATEGORIES}
              availableTabs={PRODUCT_TYPE_CATEGORIES}
            />
          </Box>

          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Reset Alert Snackbar */}
      <Snackbar
        open={showResetAlert}
        autoHideDuration={3000}
        onClose={() => setShowResetAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowResetAlert(false)}
          severity="info"
          sx={{ width: '100%' }}
        >
          All filters have been reset
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Products;