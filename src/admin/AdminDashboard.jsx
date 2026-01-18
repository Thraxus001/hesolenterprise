import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabaseConfig';
import StatsCard from '../components/admin/StatsCard';
import RecentOrders from '../components/admin/RecentOrders';
import SalesChart from '../components/admin/SalesChart';
import {
  Users,
  Package,
  CreditCard,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
  Tag
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch customers count (all users)
      const { count: customersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch products count
      const { count: productsCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true });

      // Fetch ALL orders for stats and chart (paid and others if needed, but revenue usually paid)
      // For chart we might want all orders or just paid. Let's stick to paid for revenue.
      const { data: ordersData } = await supabase
        .from('orders')
        .select('total_amount, status, created_at')
        .order('created_at', { ascending: true }); // Order by date for chart processing

      // Process Stats
      const totalOrders = ordersData?.length || 0;
      // Revenue from paid/delivered orders - STRICT FILTER
      const revenueOrders = ordersData?.filter(o => {
        const s = o.status?.toLowerCase();
        return s === 'completed' || s === 'delivered' || s === 'paid';
      });
      const totalRevenue = revenueOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
      const pendingOrders = ordersData?.filter(order => ['pending', 'processing'].includes(order.status?.toLowerCase())).length || 0;

      // Process Chart Data (Last 6 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const today = new Date();
      const last6Months = [];

      // Generate last 6 months buckets
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = months[d.getMonth()];
        last6Months.push({
          month: monthName,
          year: d.getFullYear(),
          monthIndex: d.getMonth(),
          sales: 0,
          orders: 0
        });
      }

      ordersData?.forEach(order => {
        const date = new Date(order.created_at);
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        // Find matching bucket
        const bucket = last6Months.find(m => m.monthIndex === monthIndex && m.year === year);

        if (bucket) {
          if (['completed', 'delivered', 'paid'].includes(order.status?.toLowerCase())) {
            bucket.sales += (order.total_amount || 0);
          }
          if (['completed', 'delivered', 'paid', 'processing', 'shipped'].includes(order.status?.toLowerCase())) {
            bucket.orders += 1; // Count valid orders
          }
        }
      });

      setSalesData(last6Months);

      // Fetch low stock products
      const { count: lowStockCount } = await supabase
        .from('books')
        .select('*', { count: 'exact', head: true })
        .lt('stock_quantity', 10);

      // Fetch recent orders with details
      const { data: recentOrdersData } = await supabase
        .from('orders')
        .select(`
          *,
          users(email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5); // Last 5 only

      setStats({
        totalCustomers: customersCount || 0,
        totalProducts: productsCount || 0,
        totalOrders,
        totalRevenue,
        lowStockProducts: lowStockCount || 0,
        pendingOrders
      });

      setRecentOrders(recentOrdersData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your bookshop administration panel</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          color="blue"
          trend="All registered users"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="green"
          trend={`${stats.lowStockProducts} low stock`}
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="purple"
          trend={`${stats.pendingOrders} pending`}
        />
        <StatsCard
          title="Total Revenue"
          value={`Ksh ${stats.totalRevenue.toLocaleString()}`}
          icon={CreditCard}
          color="orange"
          trend="Lifetime revenue"
        />
        <StatsCard
          title="Low Stock Alert"
          value={stats.lowStockProducts}
          icon={AlertCircle}
          color="red"
          trend={stats.lowStockProducts > 0 ? "Action needed" : "Stock is healthy"}
        />
        <StatsCard
          title="Avg. Order Value"
          value={`Ksh ${stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00'}`}
          icon={TrendingUp}
          color="indigo"
          trend="Per order"
        />
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
          <SalesChart salesData={salesData} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <RecentOrders orders={recentOrders} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products/add"
            className="p-4 border rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center"
          >
            <Package className="mx-auto mb-2 text-indigo-600" size={24} />
            <h3 className="font-medium text-gray-900">Add New Product</h3>
            <p className="text-sm text-gray-600 mt-1">Add a new book to inventory</p>
          </a>

          <a
            href="/admin/categories"
            className="p-4 border rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center"
          >
            <Tag className="mx-auto mb-2 text-green-600" size={24} />
            <h3 className="font-medium text-gray-900">Manage Categories</h3>
            <p className="text-sm text-gray-600 mt-1">Organize book categories</p>
          </a>

          <a
            href="/admin/analytics"
            className="p-4 border rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center"
          >
            <TrendingUp className="mx-auto mb-2 text-purple-600" size={24} />
            <h3 className="font-medium text-gray-900">View Analytics</h3>
            <p className="text-sm text-gray-600 mt-1">Site traffic and performance</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;