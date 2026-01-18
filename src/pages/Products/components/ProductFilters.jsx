// ProductFilters.jsx - FIXED VERSION
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Chip,
  Divider,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import ScienceIcon from '@mui/icons-material/Science';
import ComputerIcon from '@mui/icons-material/Computer';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

// Define product main categories BASED ON ACTUAL DATA
const PRODUCT_MAIN_CATEGORIES = [
  { id: 'all', label: 'All', icon: <CategoryIcon /> },
  { id: 'educational', label: 'Educational', icon: <SchoolIcon /> },
  { id: 'stationery', label: 'Stationery', icon: <LocalLibraryIcon /> }
  // Only show categories that actually exist in data
];

// Define product sub-types BASED ON ACTUAL DATA
const PRODUCT_SUB_TYPES = {
  educational: [
    { id: 'cbc', label: 'CBC Books', icon: '📚', categoryMatch: 'cbc' },
    { id: 'old-curriculum', label: 'Old Curriculum', icon: '📘', categoryMatch: 'old-curriculum' },
    { id: 'story-books', label: 'Story Books', icon: '📖', categoryMatch: 'story-books' }
  ],
  stationery: [
    { id: 'stationery', label: 'Stationery', icon: '✏️', categoryMatch: 'stationery' }
  ]
  // Removed ict and lab since no products exist
};

// Helper to get grade levels
const getActualGradeLevels = (products) => {
  const grades = [];
  products.forEach(product => {
    const grade = product.gradeLevel || product.grade;
    if (grade && !grades.includes(grade)) {
      grades.push(grade);
    }
  });
  return grades;
};

// Helper to get curriculums
const getActualCurriculums = (products) => {
  const curriculums = [];
  products.forEach(product => {
    if (product.curriculum && !curriculums.includes(product.curriculum)) {
      curriculums.push(product.curriculum);
    }
  });
  return curriculums;
};

const ProductFilters = ({
  products = [], // Default to empty array
  searchQuery,
  setSearchQuery,
  selectedMainCategory,
  setSelectedMainCategory,
  selectedProductTypes,
  handleProductTypeToggle,
  selectedGradeLevels,
  handleGradeLevelToggle,
  selectedCurriculums,
  handleCurriculumToggle,
  priceRange,
  handlePriceChange,
  resetFilters,
  activeFilterCount,
  selectedCategories,
  handleCategoryToggle,
  categories
}) => {
  const ACTUAL_GRADE_LEVELS = getActualGradeLevels(products);
  const ACTUAL_CURRICULUMS = getActualCurriculums(products);

  // Only show grade levels that actually exist
  const GRADE_LEVELS = [
    { id: 'pp1', label: 'PP1', curriculum: 'CBC' },
    { id: 'pp2', label: 'PP2', curriculum: 'CBC' },
    { id: 'grade-1-3', label: 'Grade 1-3', curriculum: 'CBC' },
    { id: 'grade-4-6', label: 'Grade 4-6', curriculum: 'CBC' },
    { id: 'grade-7-9', label: 'Grade 7-9', curriculum: 'CBC' },
    { id: 'form-1-2', label: 'Form 1-2', curriculum: '8-4-4' },
    { id: 'form-3-4', label: 'Form 3-4', curriculum: '8-4-4' }
  ].filter(grade => ACTUAL_GRADE_LEVELS.length === 0 || ACTUAL_GRADE_LEVELS.includes(grade.id));

  const CURRICULUM_TYPES = [
    { id: 'cbc', label: 'CBC Curriculum' },
    { id: '8-4-4', label: '8-4-4 System' }
  ].filter(curriculum => ACTUAL_CURRICULUMS.length === 0 || ACTUAL_CURRICULUMS.includes(curriculum.id));

  const [expandedAccordion, setExpandedAccordion] = useState('search');

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleMainCategoryChange = (event, newValue) => {
    setSelectedMainCategory(newValue);
  };

  // Get current product sub-types based on selected main category
  const getCurrentProductSubTypes = () => {
    if (selectedMainCategory === 'all') {
      // Show all product types when "All" is selected
      return Object.values(PRODUCT_SUB_TYPES).flat();
    }
    return PRODUCT_SUB_TYPES[selectedMainCategory] || [];
  };

  // Check if category has any products
  const getCategoryProductCount = (categoryId) => {
    if (categoryId === 'all') return products.length;

    if (categoryId === 'educational') {
      return products.filter(p =>
        p.category === 'cbc' ||
        p.category === 'old-curriculum' ||
        p.category === 'story-books'
      ).length;
    }

    if (categoryId === 'stationery') {
      return products.filter(p => p.category === 'stationery').length;
    }

    return 0;
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 0 }}>
        {/* Filter Header */}
        <Box sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="primary" />
            <Typography variant="h6">Filters</Typography>
            {activeFilterCount > 0 && (
              <Chip
                label={activeFilterCount}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          <Button
            onClick={resetFilters}
            color="primary"
            size="small"
            disabled={activeFilterCount === 0}
          >
            Clear All
          </Button>
        </Box>

        {/* Main Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedMainCategory}
            onChange={handleMainCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="product category tabs"
            sx={{ minHeight: 48 }}
          >
            {PRODUCT_MAIN_CATEGORIES.map((category) => {
              const productCount = getCategoryProductCount(category.id);
              return (
                <Tab
                  key={category.id}
                  value={category.id}
                  icon={category.icon}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{category.label}</span>
                      {productCount > 0 && category.id !== 'all' && (
                        <Chip
                          label={productCount}
                          size="small"
                          sx={{ height: 16, fontSize: '0.6rem' }}
                        />
                      )}
                    </Box>
                  }
                  sx={{
                    minHeight: 48,
                    minWidth: 'auto',
                    px: 1.5,
                    fontSize: '0.75rem'
                  }}
                />
              );
            })}
          </Tabs>
        </Box>



        {/* Product Type Accordion - ONLY SHOW IF HAS TYPES */}
        {getCurrentProductSubTypes().length > 0 && (
          <Accordion
            expanded={expandedAccordion === 'productType'}
            onChange={handleAccordionChange('productType')}
            elevation={0}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 48 }}>
              <MenuBookIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Product Type</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {getCurrentProductSubTypes().map((type) => {
                  // Count how many products match this type
                  const productCount = products.filter(p => {
                    if (type.categoryMatch) {
                      return p.category === type.categoryMatch;
                    }
                    return false;
                  }).length;

                  return (
                    <FormControlLabel
                      key={type.id}
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedProductTypes.includes(type.id)}
                          onChange={() => handleProductTypeToggle(type.id)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                          <Chip
                            label={productCount}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.6rem',
                              marginLeft: 'auto'
                            }}
                          />
                        </Box>
                      }
                    />
                  );
                })}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Grade Levels Accordion (only if products have grades) */}
        {GRADE_LEVELS.length > 0 && (selectedMainCategory === 'educational' || selectedMainCategory === 'all') && (
          <Accordion
            expanded={expandedAccordion === 'grade'}
            onChange={handleAccordionChange('grade')}
            elevation={0}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 48 }}>
              <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Grade Level</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {/* CBC Grades */}
              {GRADE_LEVELS.filter(g => g.curriculum === 'CBC').length > 0 && (
                <>
                  <Typography variant="caption" color="primary" gutterBottom>
                    CBC Curriculum
                  </Typography>
                  <FormGroup sx={{ mb: 2, ml: 1 }}>
                    {GRADE_LEVELS.filter(g => g.curriculum === 'CBC').map((grade) => {
                      // Count products with this grade
                      const productCount = products.filter(p =>
                        (p.gradeLevel === grade.id || p.grade === grade.id)
                      ).length;

                      return (
                        <FormControlLabel
                          key={grade.id}
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedGradeLevels.includes(grade.id)}
                              onChange={() => handleGradeLevelToggle(grade.id)}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                              <span>{grade.label}</span>
                              <Chip
                                label={productCount}
                                size="small"
                                sx={{
                                  height: 16,
                                  fontSize: '0.6rem',
                                  marginLeft: 'auto'
                                }}
                              />
                            </Box>
                          }
                        />
                      );
                    })}
                  </FormGroup>
                </>
              )}

              {/* Old Curriculum Grades */}
              {GRADE_LEVELS.filter(g => g.curriculum === '8-4-4').length > 0 && (
                <>
                  <Typography variant="caption" color="secondary" gutterBottom>
                    8-4-4 System
                  </Typography>
                  <FormGroup sx={{ ml: 1 }}>
                    {GRADE_LEVELS.filter(g => g.curriculum === '8-4-4').map((grade) => {
                      const productCount = products.filter(p =>
                        (p.gradeLevel === grade.id || p.grade === grade.id)
                      ).length;

                      return (
                        <FormControlLabel
                          key={grade.id}
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedGradeLevels.includes(grade.id)}
                              onChange={() => handleGradeLevelToggle(grade.id)}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                              <span>{grade.label}</span>
                              <Chip
                                label={productCount}
                                size="small"
                                sx={{
                                  height: 16,
                                  fontSize: '0.6rem',
                                  marginLeft: 'auto'
                                }}
                              />
                            </Box>
                          }
                        />
                      );
                    })}
                  </FormGroup>
                </>
              )}

              {GRADE_LEVELS.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No grade information available for products.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {/* Curriculum Accordion (only if products have curriculums) */}
        {CURRICULUM_TYPES.length > 0 && (selectedMainCategory === 'educational' || selectedMainCategory === 'all') && (
          <Accordion
            expanded={expandedAccordion === 'curriculum'}
            onChange={handleAccordionChange('curriculum')}
            elevation={0}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 48 }}>
              <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Curriculum</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {CURRICULUM_TYPES.map((curriculum) => {
                  const productCount = products.filter(p => p.curriculum === curriculum.id).length;

                  return (
                    <FormControlLabel
                      key={curriculum.id}
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedCurriculums.includes(curriculum.id)}
                          onChange={() => handleCurriculumToggle(curriculum.id)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                          <span>{curriculum.label}</span>
                          <Chip
                            label={productCount}
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.6rem',
                              marginLeft: 'auto'
                            }}
                          />
                        </Box>
                      }
                    />
                  );
                })}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Original Categories Accordion - SIMPLIFIED */}
        {categories && categories.length > 0 && selectedMainCategory === 'all' && (
          <Accordion
            expanded={expandedAccordion === 'originalCategories'}
            onChange={handleAccordionChange('originalCategories')}
            elevation={0}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 48 }}>
              <CategoryIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="subtitle2">Categories</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {categories
                  .filter(cat => cat.id !== 'all') // Hide "All Products"
                  .map((category) => {
                    // Count products in this category
                    const productCount = products.filter(p => p.category === category.id).length;

                    if (productCount === 0) return null; // Hide empty categories

                    return (
                      <FormControlLabel
                        key={category.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => handleCategoryToggle(category.id)}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                            <span>{category.name}</span>
                            <Chip
                              label={productCount}
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: '0.6rem',
                                marginLeft: 'auto'
                              }}
                            />
                          </Box>
                        }
                      />
                    );
                  })}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Price Range Accordion */}
        <Accordion
          expanded={expandedAccordion === 'price'}
          onChange={handleAccordionChange('price')}
          elevation={0}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 48 }}>
            <LocalOfferIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Price Range (KES)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={50000}
              step={100}
              valueLabelFormat={(value) => `KES ${value.toLocaleString()}`}
              sx={{ mt: 1 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption">KES {priceRange[0].toLocaleString()}</Typography>
              <Typography variant="caption">KES {priceRange[1].toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePriceChange(null, [0, 1000])}
              >
                Under 1,000
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePriceChange(null, [1000, 5000])}
              >
                1K - 5K
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePriceChange(null, [5000, 20000])}
              >
                5K - 20K
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handlePriceChange(null, [20000, 50000])}
              >
                20K+
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Active Filters (Always Visible) */}
        {activeFilterCount > 0 && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Filters
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {/* Main Category Filter */}
              {selectedMainCategory !== 'all' && (
                <Chip
                  label={PRODUCT_MAIN_CATEGORIES.find(c => c.id === selectedMainCategory)?.label}
                  onDelete={() => setSelectedMainCategory('all')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}

              {/* Product Type Filters */}
              {selectedProductTypes.map(typeId => {
                const allTypes = Object.values(PRODUCT_SUB_TYPES).flat();
                const type = allTypes.find(t => t.id === typeId);
                return type ? (
                  <Chip
                    key={`type-${typeId}`}
                    label={`${type.icon} ${type.label}`}
                    onDelete={() => handleProductTypeToggle(typeId)}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                ) : null;
              })}

              {/* Grade Level Filters */}
              {selectedGradeLevels.map(gradeId => {
                const grade = GRADE_LEVELS.find(g => g.id === gradeId);
                return grade ? (
                  <Chip
                    key={`grade-${gradeId}`}
                    label={grade.label}
                    onDelete={() => handleGradeLevelToggle(gradeId)}
                    size="small"
                    color={grade.curriculum === 'CBC' ? 'primary' : 'secondary'}
                    variant="outlined"
                  />
                ) : null;
              })}

              {/* Curriculum Filters */}
              {selectedCurriculums.map(curriculumId => {
                const curriculum = CURRICULUM_TYPES.find(c => c.id === curriculumId);
                return curriculum ? (
                  <Chip
                    key={`curriculum-${curriculumId}`}
                    label={curriculum.label}
                    onDelete={() => handleCurriculumToggle(curriculumId)}
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                ) : null;
              })}

              {/* Original Category Filters */}
              {selectedCategories && selectedCategories.map(categoryId => {
                const category = categories?.find(c => c.id === categoryId);
                return category && category.id !== 'all' ? (
                  <Chip
                    key={`cat-${categoryId}`}
                    label={category.name}
                    onDelete={() => handleCategoryToggle(categoryId)}
                    size="small"
                    color="default"
                    variant="outlined"
                  />
                ) : null;
              })}

              {/* Price Range Filter */}
              {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                <Chip
                  label={`KES ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}`}
                  onDelete={() => handlePriceChange(null, [0, 50000])}
                  size="small"
                  color="default"
                  variant="outlined"
                />
              )}

              {/* Search Filter */}
              {searchQuery.trim() && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  onDelete={() => setSearchQuery('')}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductFilters;