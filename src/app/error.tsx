"use client";
import React from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function Error({ error, reset }: { error: Error & { digest?: string } ; reset: () => void }) {
  React.useEffect(() => {
    console.error('App error boundary:', error);
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Ocurrió un error en la página
        </Typography>
        <Typography variant="body2" paragraph>
          {process.env.NODE_ENV === 'development' ? error.message : 'Intenta recargar la página.'}
        </Typography>
        {error?.digest && (
          <Typography variant="caption" display="block" sx={{ opacity: 0.7 }}>
            Código: {error.digest}
          </Typography>
        )}
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => reset()}>
          Reintentar
        </Button>
      </Paper>
    </Container>
  );
}

