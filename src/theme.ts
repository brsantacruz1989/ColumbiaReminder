"use client";
import { createTheme } from '@mui/material/styles';
import { esES as coreEsES } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' }
    },
    typography: {
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif'
    },
    shape: { borderRadius: 8 }
  },
  coreEsES
);

export default theme;

