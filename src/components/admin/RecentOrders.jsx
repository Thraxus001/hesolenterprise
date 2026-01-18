import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  Box
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

const RecentOrders = ({ orders = [] }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'delivered': return 'success';
      case 'processing': return 'info';
      case 'shipped': return 'warning';
      case 'pending': return 'secondary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (!orders || orders.length === 0) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Recent Orders
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
          No recent orders found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Recent Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last {orders.length} orders
        </Typography>
      </Box>

      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>{order.order_number || order.id.substring(0, 8)}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {order.users?.full_name || order.shipping_address?.fullName || order.shipping_address?.name || 'Guest'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.users?.email || order.shipping_address?.email || order.customer_email || 'N/A'}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>{order.items ? order.items.length : 0}</TableCell>
                <TableCell>Ksh {order.total_amount?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate('/admin/orders')}
                    title="View All Orders"
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default RecentOrders;