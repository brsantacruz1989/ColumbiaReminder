# Columbia Reminder (Universidad Columbia) — Next.js + MUI: Login (ES)

Este repositorio pertenece a “Columbia Reminder”, un sistema de recordatorios de eventos para la Universidad Columbia. La visión del producto es ofrecer a estudiantes, docentes y personal un panel tipo dashboard para:

- Gestionar eventos académicos y administrativos (clases, exámenes, inscripciones, vencimientos).
- Programar recordatorios por fecha/hora (notificaciones futuras por email u otros canales).
- Visualizar calendario y listas de pendientes filtradas por materia, carrera o dependencia.

En esta entrega inicial se implementa únicamente el flujo de autenticación (login) como base del dashboard.

## Requisitos

- Windows 11
- Node.js 18.17+ o 20+ (LTS recomendado)
- PostgreSQL 13+ (con `psql` o pgAdmin)

## Instalación en Windows 11 (paso a paso)

1) Instalar Node.js

- Descarga Node LTS desde https://nodejs.org y sigue el instalador. Acepta agregar Node al PATH.
- Verifica en PowerShell:

```
node -v
npm -v
```

2) Instalar PostgreSQL

- Descarga el instalador desde https://www.postgresql.org/download/windows/
- Durante la instalación:
  - Anota la contraseña del usuario `postgres` (administrador).
  - Asegúrate de instalar componentes: Server, `psql` (Command Line Tools) y pgAdmin (opcional).
- Verifica `psql` en PowerShell (ajusta la ruta según tu versión):

```
"C:\Program Files\PostgreSQL\16\bin\psql.exe" --version
```

3) Clonar/descargar este proyecto y abrir PowerShell en la carpeta del repo

4) Instalar dependencias

```
npm install
```

5) Configurar variables de entorno (.env)

- Crea el archivo `.env` a partir del ejemplo:

```
Copy-Item .env.example .env
```

- Edita `.env` y establece al menos:

```
DATABASE_URL=postgres://postgres:TU_CONTRASENA@localhost:5432/postgres
SESSION_SECRET=super-secreto-cambia-esto
```

Nota: inicialmente apuntamos a la BD `postgres` para poder crear la nueva BD `CR` con el script. Luego cambiaremos `DATABASE_URL` para apuntar a `CR`.

6) Crear la base de datos CR

```
npm run db:create
```

Este script:
- Usa `DATABASE_URL` para conectarse al servidor (cambiando internamente a la BD `postgres`).
- Crea la base `CR` si no existe. Para otro nombre, define `TARGET_DB_NAME` en el entorno.

7) Cambiar `DATABASE_URL` para apuntar a CR

Edita `.env` y reemplaza la parte final por `/CR`:

```
DATABASE_URL=postgres://postgres:TU_CONTRASENA@localhost:5432/CR
```

8) Aplicar el esquema SQL (fuente de verdad: `schema.sql`)

```
npm run db:apply
```

Esto crea la tabla `users` y el trigger de `updated_at`.

9) Crear un usuario de prueba

a) Genera el hash de una contraseña:

```
npm run user:hash
# Escribe, por ejemplo: 123456 y copia el hash resultante
```

b) Inserta el usuario con `psql` (dos opciones):

- Usando la ruta completa a `psql` (ajusta versión si corresponde):

```
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -U postgres -d CR -c "INSERT INTO users (name, email, password_hash) VALUES ('Usuario Demo','demo@acme.com','<PEGA_AQUI_EL_HASH>');"
```

- O abriendo la consola `SQL Shell (psql)` y ejecutando:

```
Host: localhost
Database: CR
Port: 5432
Username: postgres
Password: (tu contraseña)

CR=# INSERT INTO users (name, email, password_hash) VALUES ('Usuario Demo','demo@acme.com','<PEGA_AQUI_EL_HASH>');
```

También puedes usar pgAdmin para insertar el registro manualmente.

10) Ejecutar en desarrollo

```
npm run dev
```

Abre `http://localhost:3000`.

11) Probar login

- Ve a `http://localhost:3000/auth/login`.
- Usa el email `demo@acme.com` y la contraseña que hasheaste (por ejemplo `123456`).
- Si es correcto, verás el dashboard con el saludo y el email de sesión.

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

- `DATABASE_URL`: cadena de conexión de Postgres, por ejemplo: `postgres://usuario:password@localhost:5432/CR`
- `SESSION_SECRET`: secreto para firmar el JWT de sesión.
- `SESSION_COOKIE_NAME`: nombre de la cookie de sesión (opcional, por defecto `app_sesion`).
- `SESSION_COOKIE_MAX_AGE_DAYS`: días de duración de la cookie (por defecto `7`).

## Comandos útiles

- `npm run db:create`: crea la base `CR` si no existe (usa `TARGET_DB_NAME` para cambiar nombre).
- `npm run db:apply`: aplica `schema.sql` contra `DATABASE_URL`.
- `npm run user:hash`: genera un hash `bcrypt` para contraseñas de prueba.
- `npm run dev`: inicia el servidor de desarrollo en `http://localhost:3000`.

## Solución de problemas (Windows)

- `Error: connect ECONNREFUSED 127.0.0.1:5432` → PostgreSQL no está iniciado o el puerto es distinto. Abre “Servicios” y verifica “postgresql-x64-XX” esté en ejecución. Confirma el puerto en el instalador (por defecto 5432).
- `psql: not recognized` → usa la ruta completa a `psql.exe` o agrega `C:\Program Files\PostgreSQL\XX\bin` al PATH del sistema.
- `Fallo al iniciar sesión (401)` → verifica que el correo exista en `users` y que el `password_hash` corresponde a la contraseña. Vuelve a generar hash con `npm run user:hash`.
- Puerto 3000 en uso → inicia con otro puerto: `set PORT=3001 && npm run dev` (CMD) o `$env:PORT=3001; npm run dev` (PowerShell).
- Bases de datos en la nube que requieren SSL → agrega parámetros a `DATABASE_URL`, por ejemplo `?sslmode=require` (según tu proveedor).

## Notas

- No se usan ORMs ni migraciones automáticas; toda la DB se define en `schema.sql`.
- Para cambiar la DB, edita `schema.sql` y ejecuta `npm run db:apply`.
