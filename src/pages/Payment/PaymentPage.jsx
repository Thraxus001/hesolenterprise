import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PaymentPage = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Payment
                </Typography>
                <Typography variant="body1">
                    Payment integration coming soon.
                </Typography>
            </Box>
        </Container>
    );
};

export default PaymentPage;
