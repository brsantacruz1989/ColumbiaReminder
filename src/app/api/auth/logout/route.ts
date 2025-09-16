import { NextResponse } from 'next/server';
import { getCookieMaxAgeSeconds, getCookieName } from '@/lib/session';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear cookie by setting maxAge to 0
  res.cookies.set(getCookieName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
  return res;
}

