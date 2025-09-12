import { Pool } from 'pg';

// Singleton del Pool para evitar múltiples conexiones en dev
let pool: Pool;

export function getDb(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL no está configurado');
  }
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

