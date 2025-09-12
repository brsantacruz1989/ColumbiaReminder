import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { getCookieName, verifySessionToken } from '@/lib/session';

async function getSession() {
  const jar = cookies();
  const token = jar.get(getCookieName())?.value;
  if (!token) return null;
  try {
    const payload = await verifySessionToken(token);
    return payload;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const session = await getSession();
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        {session ? (
          <>
            <Typography variant="h5" gutterBottom>
              Bienvenido, {session.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Este es tu dashboard. Aquí iría el contenido principal.
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Sesión activa para {session.email}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              No has iniciado sesión
            </Typography>
            <Typography variant="body1" gutterBottom>
              Por favor inicia sesión para ver tu panel.
            </Typography>
            <Button component={Link} href="/auth/login" variant="contained">
              Ir a iniciar sesión
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}

