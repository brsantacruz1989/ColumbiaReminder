# Demo Next.js + MUI: Login (ES)

Proyecto de ejemplo con Next.js (App Router) + React + TypeScript + Material UI para implementar el flujo de Login con DB PostgreSQL sin ORM.

## Requisitos

- Node.js 18+
- PostgreSQL accesible vía `DATABASE_URL`

## Configuración

1) Copia las variables de entorno:

```
cp .env.example .env
```

Edita `.env` con tus valores (DB y secreto de sesión).

2) Instala dependencias:

```
npm install
```

3) Crea la base de datos `CR` (una vez):

```
npm run db:create
```

Asegúrate de que tu `DATABASE_URL` tenga credenciales válidas al servidor. El script se conecta a la BD `postgres` y crea `CR` si no existe. Puedes cambiar el nombre con `TARGET_DB_NAME` si lo necesitas.

4) Aplica el esquema SQL (fuente de verdad: `schema.sql`) sobre la BD de tu `DATABASE_URL` (idealmente apuntando a `CR`):

```
npm run db:apply
```

Este script lee `schema.sql` y lo ejecuta contra `DATABASE_URL` usando `pg`.

5) (Opcional) Crea un usuario de prueba. Primero genera un hash:

```
npm run user:hash
# Ingresa una contraseña y copia el hash
```

Luego inserta el usuario en la tabla (p.ej. usando `psql` o tu cliente preferido):

```sql
INSERT INTO users (name, email, password_hash) VALUES (
  'Usuario Demo',
  'demo@acme.com',
  '<PEGA_AQUI_EL_HASH>'
);
```

6) Levanta el entorno de desarrollo:

```
npm run dev
```

Abre `http://localhost:3000`.

## Estructura relevante

- Páginas
  - `src/app/auth/login/page.tsx`: Pantalla de login.
  - `src/app/auth/forgot/page.tsx`: Placeholder “no implementado”.
  - `src/app/page.tsx`: Dashboard placeholder; muestra diferente contenido con/sin sesión.
- API
  - `src/app/api/auth/login/route.ts`: Endpoint `POST /api/auth/login`.
- Utilidades
  - `src/lib/db.ts`: Conexión a Postgres con `pg`.
  - `src/lib/password.ts`: Hash y verificación con `bcryptjs`.
  - `src/lib/session.ts`: Creación/verificación de token (JWT) y config de cookie.
- UI
  - `src/components/forms/LoginForm.tsx`: Form con React Hook Form + Zod.
  - `src/components/ui/PasswordField.tsx`: Campo de contraseña con mostrar/ocultar.
- Tema
  - `src/theme.ts`: Tema MUI con tipografías/colores estándar.
- Base de datos
  - `schema.sql`: Esquema mínimo de usuarios (fuente de verdad). Edita este archivo para cambios.

## Flujo de Login

1. El usuario envía email y contraseña desde `/auth/login`.
2. `POST /api/auth/login` valida, consulta el usuario por email (consulta parametrizada) y compara contraseña vs `password_hash`.
3. Si es válido, firma un JWT y lo guarda en cookie HttpOnly (`SameSite=Lax`, `Secure` en prod).
4. Redirige al dashboard (`/`), que lee la cookie en el servidor y muestra contenido según sesión.

## Accesibilidad / UX

- Labels y mensajes de error en español.
- `aria-*` para errores y estados de carga.
- Auto-complete para email/contraseña.
- Estilo consistente con MUI (botones, inputs, helpers) tipo dashboard.

## Variables de entorno

Consulta `.env.example`:

- `DATABASE_URL`: cadena de conexión de Postgres.
- `SESSION_SECRET`: secreto para firmar el JWT de sesión.
- `SESSION_COOKIE_NAME`: nombre de la cookie de sesión (opcional, por defecto `app_sesion`).
- `SESSION_COOKIE_MAX_AGE_DAYS`: días de duración de la cookie (por defecto `7`).

## Notas

- No se usan ORMs ni migraciones automáticas; toda la DB se define en `schema.sql`.
- Para cambiar la DB, edita `schema.sql` y vuelve a ejecutar `npm run db:apply`.
