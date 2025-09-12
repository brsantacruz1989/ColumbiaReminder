import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LoginForm from '@/components/forms/LoginForm';

export const metadata = {
  title: 'Iniciar sesión'
};

export default function LoginPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" component="h1">
            Iniciar sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingresa tus credenciales para acceder al dashboard
          </Typography>
        </Box>
        <LoginForm />
      </Paper>
    </Container>
  );
}

