// src/components/common/Modal.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box
} from '@mui/material';
import { Close } from '@mui/icons-material';

const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  dividers = false,
  showCloseButton = true
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 200
        }
      }}
    >
      {title && (
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: dividers ? '1px solid' : 'none',
          borderColor: 'divider'
        }}>
          {title}
          {showCloseButton && (
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          )}
        </DialogTitle>
      )}
      
      <DialogContent dividers={dividers} sx={{ pt: 3 }}>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          borderTop: dividers ? '1px solid' : 'none',
          borderColor: 'divider'
        }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;