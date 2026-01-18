import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabaseConfig';
import {
    Search,
    Filter,
    Eye,
    RefreshCw,
    ShoppingBag,
    CheckCircle,
    XCircle,
    Clock,
    Truck,
    CheckSquare,
    Download
} from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);


    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log('Current Auth User:', user);
            if (user) {
                const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
                console.log('User Role DB:', userData?.role);
            }
        };
        checkUser();
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('orders')
                .select(`
          *,
          users (
            email,
            full_name
          ),
          order_items (*)
        `)
                .order('created_at', { ascending: false });

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            if (searchTerm) {
                query = query.or(`order_number.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return <CheckCircle className="text-green-500" size={16} />;
            case 'cancelled':
                return <XCircle className="text-red-500" size={16} />;
            case 'shipping':
            case 'shipped':
                return <Truck className="text-blue-500" size={16} />;
            default:
                return <Clock className="text-yellow-500" size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'shipping':
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount).replace('KES', 'Ksh');
    };

    const handleExport = () => {
        const headers = ['Order Number', 'Date', 'Customer', 'Email', 'Phone', 'Status', 'Total', 'Items Count'];
        const csvData = orders.map(o => {
            const customerName = o.shipping_address?.fullName ||
                o.shipping_address?.name ||
                (o.shipping_address?.firstName ? `${o.shipping_address.firstName} ${o.shipping_address.lastName || ''}` : null) ||
                o.users?.full_name ||
                'Guest';

            const customerPhone = o.shipping_address?.phone ||
                o.shipping_address?.phoneNumber ||
                o.users?.phone ||
                'N/A';

            return [
                o.order_number,
                new Date(o.created_at).toLocaleDateString(),
                customerName,
                o.shipping_address?.email || o.customer_email || o.users?.email || 'N/A',
                customerPhone,
                o.status,
                o.total_amount,
                o.order_items ? o.order_items.length : 0
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
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

        try {
            console.log(`Attempting to update order ${orderId} to ${newStatus}`);

            // 1. Update order status and SELECT back to verify it happened
            const { data: updatedData, error: updateError } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId)
                .select();

            if (updateError) {
                console.error('Supabase Update Error:', updateError);
                throw updateError;
            }

            if (!updatedData || updatedData.length === 0) {
                console.error('Update succeeded but NO rows were returned. RLS likely blocking access.');
                alert('Update failed: You might not have permission (RLS). Check console.');
                return;
            }

            console.log('Update successful, rows:', updatedData);

            // 2. If completing, create a transaction record if it doesn't exist
            if (newStatus === 'delivered') {
                const order = orders.find(o => o.id === orderId);
                if (order) {
                    // Check if transaction already exists
                    const { data: existingTx } = await supabase
                        .from('transactions')
                        .select('id')
                        .eq('order_id', orderId)
                        .maybeSingle();

                    if (!existingTx) {
                        const { error: txError } = await supabase
                            .from('transactions')
                            .insert({
                                transaction_id: `MAN-${Date.now()}`, // Manual transaction ID
                                amount: order.total_amount,
                                status: 'completed',
                                payment_method: 'cash_on_delivery',
                                user_id: order.user_id, // Might be null for guests, handle gracefully
                                order_id: orderId,
                                gateway: 'manual',
                                currency: 'KES',
                                created_at: new Date().toISOString()
                            });

                        if (txError) {
                            console.error('Error creating transaction:', txError);
                            throw new Error(`Order Status Updated, BUT Transaction Creation Failed: ${txError.message}`);
                        }
                    } else {
                        console.log('Transaction already exists for this order');
                    }
                }
            }

            // Refresh orders
            // Refresh orders
            fetchOrders();
            // Show explicit success message with transaction status
            alert(`SUCCESS: Order marked as ${newStatus}. Transaction record created.`);
        } catch (error) {
            console.error('Error updating order:', error);
            alert(`FAILED: ${error.message || 'Unknown error'}. Check if you have the ADMIN role.`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <div className="flex flex-col">
                        <p className="text-gray-600 mt-1">Manage customer orders</p>
                        <p className="text-xs text-indigo-600 mt-1 font-mono bg-indigo-50 p-1 rounded inline-block">
                            Logged in as: {currentUserEmail} | Role: <strong>{currentUserRole?.toUpperCase()}</strong>
                            {currentUserRole !== 'admin' && currentUserRole !== 'staff' && (
                                <span className="text-red-600 font-bold ml-2"> (WARNING: READ-ONLY ACCESS)</span>
                            )}
                        </p>
                    </div>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 mt-4 md:mt-0"
                >
                    <RefreshCw size={18} />
                    <span>Refresh</span>
                </button>
                <button
                    onClick={handleExport}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mt-4 md:mt-0 ml-2"
                >
                    <Download size={18} />
                    <span>Export</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
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
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Filter Button */}
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <ShoppingBag size={48} className="mb-4" />
                        <p className="text-lg">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {order.order_number}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {
                                                    // Prioritize Shipping Name for consistency with Modal
                                                    order.shipping_address?.fullName ||
                                                    order.shipping_address?.name ||
                                                    (order.shipping_address?.firstName ? `${order.shipping_address.firstName} ${order.shipping_address.lastName || ''}` : null) ||
                                                    order.users?.full_name ||
                                                    'Guest'
                                                }
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {order.shipping_address?.email || order.customer_email || order.users?.email || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                <span className="mr-1">{getStatusIcon(order.status)}</span>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {formatAmount(order.total_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {order.order_items ? order.order_items.length : 0} items
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setIsDetailsOpen(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Mark as Paid/Delivered"
                                                    >
                                                        <CheckSquare size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* Order Details Modal */}
            <OrderDetailsModal
                open={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};

export default OrderList;
