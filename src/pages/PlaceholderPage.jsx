import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { Construction } from '@mui/icons-material';

const PlaceholderPage = ({ title, message = "This page is currently under construction. Please check back later!" }) => {
    return (
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    py: 8,
                    px: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 4,
                    border: '1px dashed',
                    borderColor: 'grey.300'
                }}
            >
                <Construction sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />

                <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="text.primary">
                    {title}
                </Typography>

                <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
                    {message}
                </Typography>

                <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                >
                    Return to Home
                </Button>
            </Box>
        </Container>
    );
};

export default PlaceholderPage;
