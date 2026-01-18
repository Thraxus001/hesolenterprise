import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const UserDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // If not logged in, show Login button
  if (!currentUser) {
    return (
      <Button
        component={Link}
        to="/login"
        variant="outlined"
        startIcon={<LoginIcon />}
        size="small"
        sx={{ ml: 2, borderRadius: 2 }}
      >
        Sign In
      </Button>
    );
  }

  // Get display name or email
  const displayName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User';
  const displayEmail = currentUser.email;

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {/* You could check for an avatar URL in user_metadata if you have one */}
          <AccountIcon />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            minWidth: 220,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {displayEmail}
          </Typography>
        </Box>
        <Divider />

        <MenuItem component={Link} to="/profile" onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>

        <MenuItem component={Link} to="/cart" onClick={handleClose}>
          <ListItemIcon>
            <CartIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Cart</ListItemText>
        </MenuItem>

        {/*
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Order History</ListItemText>
        </MenuItem>
        */}

        <Divider />

        {/*
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        */}

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserDropdown;