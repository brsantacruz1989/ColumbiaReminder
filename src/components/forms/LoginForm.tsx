"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PasswordField from '@/components/ui/PasswordField';

const schema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es obligatoria')
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (data: FormData) => {
    setSubmitError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        router.replace('/');
      } else {
        const body = await res.json().catch(() => ({}));
        const prefix = body?.type === 'db' ? '[DB] ' : body?.type === 'auth' ? '[AUTH] ' : '';
        setSubmitError(prefix + (body?.message || 'No se pudo iniciar sesión.'));
      }
    } catch (err) {
      setSubmitError('Error de red. Intenta de nuevo.');
    }
  };

  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); }}>
      <Stack spacing={2}>
        {submitError && (
          <Alert role="alert" severity="error" aria-live="assertive">
            {submitError}
          </Alert>
        )}
        <TextField
          label="Correo"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby="email-helper"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />
        <PasswordField
          label="Contraseña"
          aria-invalid={!!errors.password}
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password')}
        />
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Iniciando…' : 'Iniciar sesión'}
        </Button>
        <Link href="/auth/forgot">¿Olvidaste tu contraseña?</Link>
      </Stack>
    </form>
  );
}

