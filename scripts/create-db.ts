import 'dotenv/config';
import { Pool } from 'pg';

const TARGET_DB = process.env.TARGET_DB_NAME || 'CR';

function getAdminConnectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL no está definido');
  const u = new URL(url);
  // Conéctate a la BD "postgres" para poder crear otras BD
  u.pathname = '/postgres';
  return u.toString();
}

async function main() {
  const adminCs = getAdminConnectionString();
  const pool = new Pool({ connectionString: adminCs });
  try {
    const { rows } = await pool.query('SELECT 1 FROM pg_database WHERE datname = $1', [TARGET_DB]);
    if (rows.length > 0) {
      console.log(`La base de datos "${TARGET_DB}" ya existe.`);
      return;
    }
    // IMPORTANTE: CREATE DATABASE no puede ejecutarse dentro de una transacción
    await pool.query(`CREATE DATABASE "${TARGET_DB}"`);
    console.log(`Base de datos "${TARGET_DB}" creada.`);
  } catch (err) {
    console.error('Error creando la base de datos:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
