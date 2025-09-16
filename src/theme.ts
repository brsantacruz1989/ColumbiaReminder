"use client";
import { createTheme } from '@mui/material/styles';
import { esES as coreEsES } from '@mui/material/locale';

const theme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: { main: '#2e7d32', light: '#60ad5e', dark: '#1b5e20', contrastText: '#fff' },
      secondary: { main: '#00695c' }
    },
    typography: {
      fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif'
    },
    shape: { borderRadius: 8 }
  },
  coreEsES
);

export default theme;
