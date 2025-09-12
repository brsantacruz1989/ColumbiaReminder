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
    return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 });
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
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
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
  } catch (err) {
    console.error('Error en login:', err);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}

