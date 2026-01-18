// src/components/common/Spinner.jsx
import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const Spinner = ({ size = 40, color = 'primary', fullScreen = false }) => {
  const spinner = (
    <CircularProgress 
      size={size} 
      color={color} 
      sx={{ display: 'block' }}
    />
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        {spinner}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4
      }}
    >
      {spinner}
    </Box>
  );
};

export default Spinner;