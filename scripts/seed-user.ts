import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

async function main() {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.error('Uso: npm run user:seed -- "Nombre" email@example.com password');
    process.exit(1);
  }

  const cs = process.env.DATABASE_URL;
  if (!cs) {
    console.error('DATABASE_URL no está definido en el entorno.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: cs });
  const client = await pool.connect();
  try {
    const hash = await bcrypt.hash(password, 12);
    const upsertSql = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW()
      RETURNING id, email;
    `;
    const { rows } = await client.query(upsertSql, [name, email.toLowerCase(), hash]);
    console.log(`Usuario listo: id=${rows[0].id}, email=${rows[0].email}`);
  } catch (err) {
    console.error('Error creando/actualizando el usuario:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();

