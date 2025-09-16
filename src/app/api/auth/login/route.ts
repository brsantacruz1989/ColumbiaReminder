import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDb } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { createSessionToken, getCookieMaxAgeSeconds, getCookieName } from '@/lib/session';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation', message: 'Datos inválidos', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const db = getDb();

  try {
    const { rows } = await db.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ type: 'auth', message: 'Credenciales inválidas: usuario no encontrado' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ type: 'auth', message: 'Credenciales inválidas: contraseña incorrecta' }, { status: 401 });
    }

    const token = await createSessionToken({ sub: String(user.id), name: user.name, email: user.email }, getCookieMaxAgeSeconds() / 86400);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(getCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: getCookieMaxAgeSeconds()
    });
    return res;
  } catch (err: any) {
    console.error('Error en login:', err);
    const code = err?.code || 'UNKNOWN';
    const detail = process.env.NODE_ENV === 'development' ? String(err?.message || err) : undefined;
    return NextResponse.json(
      { type: 'db', message: `Error en base de datos (código: ${code})`, detail },
      { status: 500 }
    );
  }
}

