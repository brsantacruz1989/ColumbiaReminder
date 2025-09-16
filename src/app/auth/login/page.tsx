import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LoginForm from '@/components/forms/LoginForm';

export const metadata = {
  title: 'Iniciar sesión'
};

const LOGO_URL = 'https://columbiapjc.edu.py//storage/images/Logo%20Columbia.png';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: `radial-gradient(ellipse at top left, rgba(46,125,50,0.25), transparent 60%),
                     radial-gradient(ellipse at bottom right, rgba(0,105,92,0.25), transparent 60%),
                     linear-gradient(135deg, #0e3b2e 0%, #0b2a22 100%)`
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Box sx={{ width: 96, height: 96, mb: 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO_URL} alt="Logo Columbia" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </Box>
            <Typography variant="h5" component="h1" color="primary" fontWeight={700}>
              Bienvenido
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Ingresa tus credenciales para acceder al dashboard
            </Typography>
          </Box>
          <LoginForm />
        </Paper>
      </Container>
    </Box>
  );
}

