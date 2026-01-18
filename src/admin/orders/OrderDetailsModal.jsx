import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Grid,
    Divider,
    Box,
    Chip,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import { X } from 'lucide-react';

const OrderDetailsModal = ({ open, onClose, order }) => {
    if (!order) return null;

    const formatCurrency = (amount) => {
        return 'Ksh ' + new Intl.NumberFormat('en-KE', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount || 0);
    };

    const shippingAddress = order.shipping_address || {};
    const items = order.order_items || order.items || []; // Support both order_items (table) and items (legacy/json)
    const customer = order.users || {};

    // Resolve Customer Name: Priority to Shipping Address as it's order-specific
    const customerName =
        shippingAddress.fullName ||
        shippingAddress.name ||
        (shippingAddress.firstName ? `${shippingAddress.firstName} ${shippingAddress.lastName || ''}` : null) ||
        customer.full_name ||
        'Guest';

    // Resolve Email
    const customerEmail =
        shippingAddress.email ||
        order.customer_email ||
        customer.email ||
        'N/A';

    // Resolve Address
    const addressLine1 = shippingAddress.address || shippingAddress.street || 'N/A';
    const addressCity = shippingAddress.city || shippingAddress.town || '';
    const addressPostal = shippingAddress.postalCode || shippingAddress.zip || '';
    const addressCountry = shippingAddress.country || 'Kenya';
    const addressPhone = shippingAddress.phone || shippingAddress.phoneNumber || customer.phone || 'N/A';

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div">
                    Order Details #{order.order_number}
                </Typography>
                <Button onClick={onClose} color="inherit" size="small">
                    <X size={20} />
                </Button>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Grid container spacing={3}>
                    {/* Status & Date */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Chip
                                label={order.status?.toUpperCase()}
                                color={
                                    order.status === 'delivered' ? 'success' :
                                        order.status === 'completed' ? 'success' :
                                            order.status === 'cancelled' ? 'error' : 'warning'
                                }
                            />
                            <Typography variant="body1" color="text.secondary">
                                Placed on: {new Date(order.created_at).toLocaleString()}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Customer & Shipping Info */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Customer Information
                        </Typography>
                        <Typography variant="body2">
                            Name: {customerName}
                        </Typography>
                        <Typography variant="body2">
                            Email: {customerEmail || 'No Email Found'}
                        </Typography>
                        <Typography variant="body2">
                            Phone: {addressPhone}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Shipping Address
                        </Typography>
                        <Typography variant="body2">
                            {addressLine1}
                        </Typography>
                        <Typography variant="body2">
                            {addressCity} {addressPostal}
                        </Typography>
                        <Typography variant="body2">
                            {addressCountry}
                        </Typography>
                    </Grid>

                    {/* Order Items */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                            Order Items
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item, index) => {
                                    const unitPrice = item.unit_price || item.price || 0;
                                    const totalLinePrice = item.total_price || (unitPrice * item.quantity);

                                    return (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {item.name || item.title || 'Product'}
                                                </Typography>
                                                {item.variant && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.variant}
                                                    </Typography>
                                                )}
                                                {/* Debug info if price is 0 */}
                                                {unitPrice === 0 && (
                                                    <div style={{ fontSize: '10px', color: '#999' }}>
                                                        (Debug: p={item.price}, up={item.unit_price}, tp={item.total_price})
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell align="right">{formatCurrency(unitPrice)}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{formatCurrency(totalLinePrice)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Grid>

                    {/* Summary */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Box sx={{ minWidth: 200 }}>
                                {/* 
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">{formatCurrency(order.total_amount)}</Typography>
                </Box>
                 */}
                                {/* Assuming total_amount includes shipping for now, or if we had breakdowns we'd show them */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: 1, borderColor: 'divider', pt: 1 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                        {formatCurrency(order.total_amount)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsModal;
