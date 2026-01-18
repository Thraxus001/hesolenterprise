// src/components/common/Input.jsx
import React from 'react';
import {
  TextField,
  FormControl,
  FormHelperText,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'medium',
  placeholder,
  startAdornment,
  endAdornment,
  multiline = false,
  rows = 1,
  maxRows,
  minRows,
  sx = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  const getEndAdornment = () => {
    if (type === 'password') {
      return (
        <InputAdornment position="end">
          <IconButton
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      );
    }
    return endAdornment;
  };

  return (
    <FormControl fullWidth={fullWidth} error={!!error} sx={sx}>
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        type={getInputType()}
        required={required}
        disabled={disabled}
        size={size}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        maxRows={maxRows}
        minRows={minRows}
        error={!!error}
        helperText={helperText}
        variant="outlined"
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : null,
          endAdornment: getEndAdornment(),
          sx: {
            borderRadius: 2
          }
        }}
        InputLabelProps={{
          shrink: true
        }}
        {...props}
      />
      {error && !helperText && (
        <FormHelperText>{error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default Input;