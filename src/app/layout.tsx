import type { Metadata } from 'next';
import React from 'react';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';

export const metadata: Metadata = {
  title: 'Demo Dashboard - Login',
  description: 'Ejemplo de login con Next.js y MUI'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

