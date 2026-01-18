import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeContextProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import PaymentPage from './pages/Payment/PaymentPage';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import About from './pages/About/About';
import Login from './pages/Login';
import PlaceholderPage from './pages/PlaceholderPage';

// Category Pages
import TextbooksStoryBooks from './pages/ProductCategories/TextbooksStoryBooks';
import StationeryOfficeSupplies from './pages/ProductCategories/StationeryOfficeSupplies';
import LabEquipmentChemicals from './pages/ProductCategories/LabEquipmentChemicals';
import ComputerICTAccessories from './pages/ProductCategories/ComputerICTAccessories';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProductList from './admin/products/ProductList';
import AddProduct from './admin/products/AddProduct';
import EditProduct from './admin/products/EditProduct';
import TransactionList from './admin/transactions/TransactionList';
import SiteAnalytics from './admin/analytics/SiteAnalytics';
import CategoryManager from './admin/categories/CategoryManager';
import UserList from './admin/users/UserList';
import OrderList from './admin/orders/OrderList';
import Settings from './admin/settings/Settings';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  shape: { borderRadius: 8 },
});

// Inner component to handle route-based logic like hiding Navbar
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isLoginRoute = location.pathname === '/login';
  const showNavbar = !isAdminRoute && !isLoginRoute;

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showNavbar && <Navbar />}

      <main style={{ flex: 1, padding: location.pathname === '/' ? '0' : '20px 0' }}>
        {/* START OF ROUTES: Every direct child here MUST be a <Route> */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />

          {/* Store Routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Category Routes */}
          <Route path="/category/textbooks-story-books" element={<TextbooksStoryBooks />} />
          <Route path="/category/stationery-office-supplies" element={<StationeryOfficeSupplies />} />
          <Route path="/category/lab-equipment-chemicals" element={<LabEquipmentChemicals />} />
          <Route path="/category/computer-ict-accessories" element={<ComputerICTAccessories />} />

          {/* Customer Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderConfirmation />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/payment" element={<PaymentPage />} />

          {/* Admin Routes: Note how nesting is handled without a second <Routes> tag */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="transactions" element={<TransactionList />} />
            <Route path="analytics" element={<SiteAnalytics />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="customers" element={<UserList />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Missing Pages Placeholders */}
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" message="Our contact form is coming soon. You can reach us at hesolenterprises@gmail.com" />} />
          <Route path="/bulk-orders" element={<PlaceholderPage title="Bulk Orders" message="For bulk orders, please call us directly at 0717930932" />} />
          <Route path="/faq" element={<PlaceholderPage title="Frequently Asked Questions" />} />
          <Route path="/shipping" element={<PlaceholderPage title="Shipping Policy" />} />
          <Route path="/returns" element={<PlaceholderPage title="Returns & Refunds" />} />
          <Route path="/careers" element={<PlaceholderPage title="Careers" message="We are not currently hiring, but check back soon!" />} />
          <Route path="/blog" element={<PlaceholderPage title="Our Blog" />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
          <Route path="/search" element={<PlaceholderPage title="Search Results" message="Search functionality is being upgraded." />} />

          {/* 404 Route */}
          <Route path="*" element={
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <h1>404 - Page Not Found</h1>
            </div>
          } />
        </Routes>
        {/* END OF ROUTES */}
      </main>

      {showNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ThemeContextProvider>
        <AuthProvider>
          <CartProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <CssBaseline />
              <Toaster position="top-right" />
              <AppContent />
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeContextProvider>
    </ThemeProvider>
  );
}

export default App;