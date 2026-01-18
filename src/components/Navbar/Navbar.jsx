import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Badge,
  Menu,
  MenuItem,
  Container,
  InputBase,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse
} from '@mui/material';
import {
  ShoppingCart,
  MenuBook,
  Create,
  Science,
  Computer,
  Search,
  Menu as MenuIcon,
  Close,
  ExpandMore,
  ExpandLess,
  Category,
  Dashboard,
  Inventory,
  Receipt,
  Analytics,
  People,
  Settings
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import './Navbar.css';

import { PRODUCT_CATEGORIES } from '../../utils/constants';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = getCartCount();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Categories populated as per request
  const categories = [
    {
      name: 'ICT Accessories',
      path: '/category/computer-ict-accessories',
      icon: <Computer />,
      subcategories: []
    },
    {
      name: 'Lab Equipment',
      path: '/category/lab-equipment-chemicals',
      icon: <Science />,
      subcategories: []
    },
    {
      name: 'Stationery',
      path: '/category/stationery-office-supplies',
      icon: <Create />,
      subcategories: []
    }
  ];



  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCategoryToggle = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
      setSearchOpen(false);
      e.target.value = '';
    }
  };

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  const getTextColor = () => isTransparent ? 'white' : 'text.primary';
  const getLogoColor = () => isTransparent ? 'white' : 'primary.main';

  const drawer = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Drawer Header */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component={Link} to="/" onClick={handleDrawerToggle} sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
          📚 HesolEnrprises
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>

      {/* User Section */}
      <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
        <Typography variant="subtitle2">Welcome to Hesol</Typography>
        <Typography variant="body2">Your trusted educational supplier</Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ flex: 1, overflow: 'auto' }}>
        <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem button component={Link} to="/products" onClick={handleDrawerToggle}>
          <ListItemIcon><Inventory /></ListItemIcon>
          <ListItemText primary="All Products" />
        </ListItem>

        {/* Categories with expandable subcategories */}
        {categories.map((category) => (
          <Box key={category.name}>
            <ListItem
              button
              onClick={() => handleCategoryToggle(category.name)}
              sx={{ pl: 2 }}
            >
              <ListItemIcon>{category.icon}</ListItemIcon>
              <ListItemText primary={category.name} />
              {expandedCategory === category.name ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={expandedCategory === category.name} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  component={Link}
                  to={category.path}
                  onClick={handleDrawerToggle}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary={`All ${category.name}`} />
                </ListItem>
                {category.subcategories.map((sub) => (
                  <ListItem
                    key={sub.name}
                    button
                    component={Link}
                    to={sub.path}
                    onClick={handleDrawerToggle}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary={sub.name} />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}

        <Divider sx={{ my: 1 }} />



        {/* Business Links */}
        <ListItem button component={Link} to="/about" onClick={handleDrawerToggle}>
          <ListItemText primary="About Us" />
        </ListItem>
        <ListItem button component={Link} to="/contact" onClick={handleDrawerToggle}>
          <ListItemText primary="Contact" />
        </ListItem>
        <ListItem button component={Link} to="/bulk-orders" onClick={handleDrawerToggle}>
          <ListItemText primary="Bulk Orders" />
        </ListItem>
      </List>

      {/* Footer Section */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} HesolEnrprises
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Educational Supplies & Equipment
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: isTransparent ? 'transparent' : (scrolled ? 'rgba(255, 255, 255, 0.98)' : 'white'),
          boxShadow: isTransparent ? 'none' : (scrolled ? 3 : 1),
          transition: 'all 0.3s ease',
          borderBottom: isTransparent ? 'none' : '1px solid',
          borderColor: 'divider',
          color: getTextColor()
        }}
        className="navbar-main"
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 1 }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                mr: 3,
                display: 'flex',
                alignItems: 'center',
                fontWeight: 800,
                color: getLogoColor(),
                textDecoration: 'none',
                fontFamily: "'Poppins', sans-serif",
                '&:hover': {
                  transform: 'scale(1.02)'
                },
                transition: 'transform 0.2s'
              }}
              className="navbar-logo"
            >
              <Box
                component="span"
                sx={{
                  mr: 1,
                  fontSize: '1.8rem',
                  animation: 'logoFloat 3s ease-in-out infinite'
                }}
              >
                📚
              </Box>
              HesolEnterprises
            </Typography>

            {/* Categories Navigation - Desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, gap: 0.5 }}>
              {categories.map((category) => (
                <Box key={category.name} className="nav-category-container">
                  <Button
                    component={Link}
                    to={category.path}
                    startIcon={category.icon}
                    sx={{
                      color: location.pathname.includes(category.path) ? 'primary.main' : getTextColor(),
                      fontWeight: location.pathname.includes(category.path) ? 600 : 400,
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: location.pathname.includes(category.path) ? '80%' : 0,
                        height: '2px',
                        backgroundColor: isTransparent ? 'white' : 'primary.main',
                        transition: 'width 0.3s ease'
                      },
                      '&:hover:after': {
                        width: '80%'
                      }
                    }}
                    className="nav-category-btn"
                  >
                    {category.name}
                  </Button>
                  <Box className="nav-category-dropdown">
                    <Box className="dropdown-content">
                      <Box component={Link} to={category.path} className="dropdown-main-link">
                        View All {category.name}
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      {category.subcategories.map((sub) => (
                        <Box
                          key={sub.name}
                          component={Link}
                          to={sub.path}
                          className="dropdown-sublink"
                        >
                          {sub.name}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ))}

              <Button
                component={Link}
                to="/products"
                sx={{
                  color: location.pathname === '/products' ? 'primary.main' : getTextColor(),
                  fontWeight: location.pathname === '/products' ? 600 : 400
                }}
              >
                All Products
              </Button>
            </Box>



            {/* Search Bar */}
            <Box sx={{
              flexGrow: 1,
              display: { xs: searchOpen ? 'flex' : 'none', md: 'flex' },
              maxWidth: { md: 400, lg: 500 },
              mx: 2
            }}>
              <Box className="search-container" sx={{
                bgcolor: isTransparent ? 'rgba(255,255,255,0.15)' : undefined,
                border: isTransparent ? '1px solid rgba(255,255,255,0.3)' : undefined,
                color: isTransparent ? 'white' : 'inherit'
              }}>
                <Search sx={{ color: isTransparent ? 'white' : 'action.active', mr: 1 }} />
                <InputBase
                  placeholder="Search textbooks, stationery, lab equipment..."
                  fullWidth
                  onKeyDown={handleSearch}
                  sx={{
                    color: isTransparent ? 'white' : 'text.primary',
                    '& .MuiInputBase-input': {
                      transition: 'width 0.3s',
                      color: isTransparent ? 'white' : 'inherit',
                      '&::placeholder': {
                        color: isTransparent ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                        opacity: 1
                      }
                    }
                  }}
                  className="search-input"
                />
              </Box>
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Search Toggle for Mobile */}
              <IconButton
                sx={{ display: { xs: 'flex', md: 'none' }, color: getTextColor() }}
                onClick={() => setSearchOpen(!searchOpen)}
                className="search-toggle-btn"
              >
                {searchOpen ? <Close /> : <Search />}
              </IconButton>

              {/* Cart */}
              <IconButton
                component={Link}
                to="/cart"
                className="cart-btn"
                sx={{
                  color: getTextColor(),
                  position: 'relative',
                  '&:hover .cart-badge': {
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <ShoppingCart />
                {cartCount > 0 && (
                  <Badge
                    badgeContent={cartCount}
                    color="error"
                    className="cart-badge"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      transition: 'transform 0.2s',
                      '& .MuiBadge-badge': {
                        fontSize: '0.7rem',
                        height: '18px',
                        minWidth: '18px'
                      }
                    }}
                  />
                )}
              </IconButton>

              {/* Admin Link moved to Footer */}

              {/* Mobile Menu Button */}
              <IconButton
                sx={{ display: { xs: 'flex', lg: 'none' }, ml: 1, color: getTextColor() }}
                onClick={handleDrawerToggle}
                className="mobile-menu-btn"
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>


        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 }
        }}
      >
        {drawer}
      </Drawer>

      {/* Spacer for fixed navbar - Only render if NOT transparent (e.g. not Home or is Scrolled) */}
      {!isTransparent && (
        <>
          <Toolbar sx={{
            display: { xs: 'block', sm: 'none' },
            minHeight: { xs: '56px !important', sm: '64px !important' }
          }} />
          <Toolbar sx={{
            display: { xs: 'none', sm: 'block' },
            minHeight: { xs: '56px !important', sm: '64px !important' }
          }} />
        </>
      )}
    </>
  );
};

export default Navbar;