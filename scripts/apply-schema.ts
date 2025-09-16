import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { Pool } from 'pg';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL no está definido en el entorno.');
    process.exit(1);
  }

  const sql = readFileSync('schema.sql', 'utf8');
  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
      console.log('Esquema aplicado correctamente.');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error aplicando schema.sql:', err);
      process.exitCode = 1;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
}

main();
