import { SignJWT, jwtVerify } from 'jose';

const alg = 'HS256';

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET no está configurado');
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string; // user id
  name: string;
  email: string;
};

export async function createSessionToken(payload: SessionPayload, maxAgeDays = 7) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + maxAgeDays * 24 * 60 * 60;
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret(), { algorithms: [alg] });
  return payload as unknown as SessionPayload & { iat: number; exp: number };
}

export function getCookieName() {
  return process.env.SESSION_COOKIE_NAME || 'app_sesion';
}

export function getCookieMaxAgeSeconds() {
  const days = Number(process.env.SESSION_COOKIE_MAX_AGE_DAYS || '7');
  return days * 24 * 60 * 60;
}

