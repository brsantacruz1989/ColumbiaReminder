"use client";
import React from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type Props = {
  label?: string;
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: boolean;
  helperText?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  id?: string;
  required?: boolean;
};

const PasswordField = React.forwardRef<HTMLInputElement, Props>(function PasswordField(
  { label = 'Contraseña', ...props },
  ref
) {
  const [show, setShow] = React.useState(false);
  return (
    <TextField
      type={show ? 'text' : 'password'}
      label={label}
      autoComplete="current-password"
      inputRef={ref}
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setShow((v) => !v)}
              edge="end"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
});

export default PasswordField;

