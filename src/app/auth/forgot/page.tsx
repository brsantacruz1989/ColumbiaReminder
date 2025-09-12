import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export const metadata = { title: 'Recuperar contraseña' };

export default function ForgotPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          ¿Olvidaste tu contraseña?
        </Typography>
        <Typography color="text.secondary">
          Pantalla no implementada aún. Este enlace es solo de navegación.
        </Typography>
      </Paper>
    </Container>
  );
}

