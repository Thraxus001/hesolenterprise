// src/components/common/Toast.jsx
import React from 'react';
import { 
  Snackbar, 
  Alert, 
  AlertTitle 
} from '@mui/material';

const Toast = ({
  open,
  onClose,
  message,
  title,
  severity = 'info',
  autoHideDuration = 6000,
  variant = 'filled',
  action,
  anchorOrigin = { vertical: 'top', horizontal: 'right' }
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      sx={{ maxWidth: 400 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={variant}
        sx={{ width: '100%' }}
        action={action}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;