import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseConfig';
import {
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard as CreditCardIcon,
  Banknote,
  Smartphone
} from 'lucide-react';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateRange]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('transactions')
        .select(`
          *,
          orders(order_number, total_amount, shipping_address),
          users(email, full_name)
        `)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (statusFilter !== 'all') {
        console.log('Applying status filter:', statusFilter);
        query = query.eq('status', statusFilter);
      }

      // Apply date range filter
      if (dateRange !== 'all') {
        console.log('Applying date range filter:', dateRange);
        const now = new Date();
        const startDate = new Date();

        switch (dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        }

        query = query.gte('created_at', startDate.toISOString());
      }

      // Apply search
      if (searchTerm) {
        query = query.or(`transaction_id.ilike.%${searchTerm}%,gateway_transaction_id.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase Transaction Fetch Error:', error);
        throw error;
      }

      console.log('Transactions fetched:', data?.length || 0, data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'failed':
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentMethodInfo = (method) => {
    const normalized = method?.toLowerCase().replace('_', ' ') || 'unknown';
    if (normalized.includes('mpesa') || normalized.includes('mobile')) {
      return { icon: <Smartphone size={16} className="text-green-600" />, label: 'M-Pesa (Online)', color: 'bg-green-50 text-green-700' };
    }
    if (normalized.includes('cash') || normalized.includes('delivery') || normalized.includes('manual')) {
      return { icon: <Banknote size={16} className="text-blue-600" />, label: 'Cash on Delivery', color: 'bg-blue-50 text-blue-700' };
    }
    return { icon: <CreditCardIcon size={16} className="text-gray-600" />, label: normalized, color: 'bg-gray-50 text-gray-700' };
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount).replace('KES', 'Ksh');
  };

  const handleExport = () => {
    const headers = ['ID', 'Date', 'Amount', 'Status', 'Payment Method', 'Customer Name', 'Email', 'Phone', 'Order'];
    const csvData = transactions.map(t => {
      const customerName = t.users?.full_name ||
        t.orders?.shipping_address?.fullName ||
        t.orders?.shipping_address?.name ||
        'Guest / N/A';

      const customerEmail = t.orders?.shipping_address?.email || t.users?.email || 'N/A';

      const customerPhone = t.orders?.shipping_address?.phone ||
        t.orders?.shipping_address?.phoneNumber ||
        t.users?.phone ||
        'N/A';

      return [
        t.transaction_id,
        new Date(t.created_at).toLocaleDateString(),
        t.amount,
        t.status,
        t.payment_method,
        customerName,
        customerEmail,
        customerPhone,
        t.orders?.order_number || 'N/A'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Track all payment transactions</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={fetchTransactions}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTransactions()}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          {/* Search Button */}
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-600">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatAmount(transactions.reduce((sum, t) => sum + t.amount, 0))}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {transactions.filter(t => t.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-gray-600">Avg. Transaction</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatAmount(
              transactions.length > 0
                ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
                : 0
            )}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <CreditCardIcon size={48} className="mb-4" />
            <p className="text-lg">No transactions found</p>
            <p className="text-sm mt-1">Transactions will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.transaction_id}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.gateway}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(transaction.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.status)}
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const info = getPaymentMethodInfo(transaction.payment_method);
                        return (
                          <div className={`flex items-center space-x-2 px-2 py-1 rounded-lg w-fit ${info.color}`}>
                            {info.icon}
                            <span className="text-sm font-medium capitalize">{info.label}</span>
                          </div>
                        );
                      })()}
                      {transaction.card_last_four && (
                        <div className="text-xs text-gray-500 mt-1 ml-6">
                          **** {transaction.card_last_four}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {
                          transaction.users?.full_name ||
                          transaction.orders?.shipping_address?.fullName ||
                          transaction.orders?.shipping_address?.name ||
                          'Guest / N/A'
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        <div className="text-xs text-gray-500">
                          {transaction.orders?.shipping_address?.email || transaction.users?.email}
                        </div>
                        <div className="text-xs text-indigo-600 mt-0.5">
                          {
                            transaction.orders?.shipping_address?.phone ||
                            transaction.orders?.shipping_address?.phoneNumber ||
                            transaction.users?.phone ||
                            ''
                          }
                        </div>                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.orders?.order_number || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          // View transaction details
                          alert(`Transaction Details:\nID: ${transaction.transaction_id}\nAmount: ${formatAmount(transaction.amount)}\nStatus: ${transaction.status}`);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;