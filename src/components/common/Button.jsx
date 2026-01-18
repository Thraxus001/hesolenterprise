// src/components/common/Button.jsx
import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
  ...props 
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        ...sx
      }}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button;