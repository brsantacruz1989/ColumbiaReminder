-- Esquema mínimo de usuarios para autenticación
-- Fuente de verdad: edita este archivo para cambios de DB
-- Nota: La creación de la base de datos "CR" se realiza con el script
--       `npm run db:create` para evitar transacciones alrededor de CREATE DATABASE.

-- Opcional: configura zona horaria
-- SET TIME ZONE 'UTC';

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger simple para updated_at (opcional)
-- Creamos/actualizamos la función y recreamos el trigger de forma idempotente
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $func$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
