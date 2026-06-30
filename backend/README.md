# TechDesk Backend

API REST para la demo de TechDesk, una plataforma de gestion de tecnicos, clientes y tareas de servicio.

El backend esta construido con Node.js, Express, Prisma y PostgreSQL. En desarrollo puede usar PostgreSQL local, pero el flujo recomendado para esta demo es Supabase, usando su base PostgreSQL administrada.

## Stack

- Node.js 18+
- Express 4
- Prisma ORM
- PostgreSQL / Supabase
- JWT con access token y refresh token
- bcrypt para contrasenas
- express-validator para validacion de entrada
- Helmet y CORS para seguridad basica

## Inicio Rapido

```bash
cd backend
npm install
```

Copia el archivo de entorno y configura tus credenciales:

```bash
cp .env.example .env
```

En Windows PowerShell puedes usar:

```powershell
Copy-Item .env.example .env
```

Configura al menos estas variables en `backend/.env`:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

JWT_SECRET="una-clave-larga-de-al-menos-32-caracteres"
JWT_REFRESH_SECRET="otra-clave-larga-de-al-menos-32-caracteres"

CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
```

Luego ejecuta Prisma:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Inicia el servidor:

```bash
npm run dev
```

La API queda disponible en:

```txt
http://localhost:3000
```

Health check:

```txt
GET /health
```

## Supabase

El proyecto usa Prisma contra PostgreSQL. Supabase funciona como proveedor de la base de datos.

En Supabase, usa:

- `DATABASE_URL`: cadena pooled/transaction para la app.
- `DIRECT_URL`: cadena directa para migraciones de Prisma.

El schema ya incluye:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## Credenciales Demo

El seed crea estos usuarios:

```txt
Admin:
email: admin@techdesk.com
password: Admin@12345

Tecnico:
email: tecnico@techdesk.com
password: Tecnico@12345
```

Tambien crea una compania demo, un cliente demo y una tarea inicial.

## Scripts

```bash
npm run dev              # Servidor con nodemon
npm start                # Servidor en modo normal
npm run prisma:generate  # Genera Prisma Client
npm run prisma:migrate   # Crea/aplica migraciones en desarrollo
npm run prisma:seed      # Inserta datos demo
npm run prisma:studio    # Abre Prisma Studio
npm run lint             # ESLint con autofix
npm run test             # Jest
npm run test:watch       # Jest en modo watch
```

Nota: no hay script `build` para el backend porque este servicio usa CommonJS y se ejecuta directamente con Node.

## Estructura

```txt
backend/
  prisma/
    schema.prisma
    seed.js
    migrations/
  src/
    app.js
    server.js
    config/
      database.js
      env.js
    controllers/
      authController.js
      clientController.js
      taskController.js
      userController.js
    middleware/
      auth.js
      authorize.js
      errorHandler.js
    routes/
      auth.js
      clients.js
      tasks.js
      users.js
    services/
      authService.js
      clientService.js
      taskService.js
      userService.js
    utils/
      jwt.js
      password.js
```

Algunos archivos antiguos con nombres en espanol (`usuario*`, `tarea*`) permanecen en el repositorio, pero la API principal actual usa las rutas en ingles montadas en `src/app.js`.

## Autenticacion

### Login

```txt
POST /api/v1/auth/login
```

Body:

```json
{
  "email": "admin@techdesk.com",
  "password": "Admin@12345"
}
```

Respuesta:

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "...",
      "email": "admin@techdesk.com",
      "fullName": "Admin Demo",
      "role": "ADMIN",
      "companyId": "..."
    }
  }
}
```

### Requests protegidos

Enviar el access token:

```txt
Authorization: Bearer <accessToken>
```

### Refresh token

```txt
POST /api/v1/auth/refresh
```

Body:

```json
{
  "refreshToken": "..."
}
```

### Logout

```txt
POST /api/v1/auth/logout
```

Requiere token. Actualmente responde OK y el frontend borra los tokens del cliente.

## Endpoints

### Sistema

```txt
GET /health
GET /
```

### Auth

```txt
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Usuarios

Todas las rutas requieren autenticacion. La gestion de usuarios requiere rol `ADMIN`.

```txt
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
```

### Clientes

Todas las rutas requieren autenticacion. Crear, editar y eliminar requiere rol `ADMIN`.

```txt
GET    /api/v1/clients
POST   /api/v1/clients
GET    /api/v1/clients/:id
PUT    /api/v1/clients/:id
DELETE /api/v1/clients/:id
```

### Tareas

Todas las rutas requieren autenticacion.

```txt
GET    /api/v1/tasks
POST   /api/v1/tasks
GET    /api/v1/tasks/:id
PUT    /api/v1/tasks/:id
PATCH  /api/v1/tasks/:id/status
DELETE /api/v1/tasks/:id
```

Reglas actuales:

- `ADMIN`: puede crear, editar y eliminar tareas.
- `TECHNICIAN`: puede ver sus tareas asignadas y editar/actualizar estado.
- `CLIENT`: actualmente puede consultar tareas segun las reglas del backend existente.

### Reportes

La tabla `Report` ya existe en Prisma, pero los endpoints de reportes se implementaran por partes para mantener commits pequenos y faciles de revisar.

Plan recomendado:

```txt
GET  /api/v1/reports
POST /api/v1/reports/task/:taskId
GET  /api/v1/reports/:id
GET  /api/v1/reports/:id/download
```

Flujo esperado:

```txt
Tarea existente
  -> Backend consulta tarea, cliente, tecnico y compania
  -> Backend genera un PDF
  -> Backend guarda el archivo
  -> Backend crea un registro en Report
  -> Frontend lista y descarga el reporte
```

Primera version:

- Generar PDF basico de una tarea.
- Guardar archivo localmente en `REPORTS_STORAGE_DIR`.
- Crear registro en `Report` con `fileUrl` y `format = "pdf"`.
- Permitir listar y descargar reportes.

Version posterior:

- Guardar PDFs en Supabase Storage.
- Agregar evidencias/fotos.
- Agregar firma, checklist y logo de compania.
- Crear plantillas de reporte.

## Modelo de Datos

Tablas principales:

- `Company`: compania/tenant.
- `User`: usuarios con roles `ADMIN`, `TECHNICIAN` y `CLIENT`.
- `Client`: clientes de la compania.
- `Task`: tareas de servicio.
- `Form` y `FormResponse`: base para formularios dinamicos.
- `Report`: base para reportes.
- `Evidence`: evidencias asociadas a tareas.
- `AuditLog`: registro futuro de actividad.

El proyecto ya esta preparado para multi-tenant usando `companyId` en usuarios, clientes, tareas, formularios, reportes y auditoria.

## Migraciones y Datos Demo

Aplicar migraciones:

```bash
npm run prisma:migrate
```

Regenerar cliente Prisma:

```bash
npm run prisma:generate
```

Insertar datos demo:

```bash
npm run prisma:seed
```

Abrir Prisma Studio:

```bash
npm run prisma:studio
```

## Seguridad

Implementado:

- Passwords hasheadas con bcrypt.
- JWT access token y refresh token.
- Middleware de autenticacion.
- Autorizacion por rol.
- CORS configurable.
- Helmet para headers de seguridad.
- Validacion de entrada con express-validator.
- Separacion por `companyId` en servicios principales.

Pendiente recomendado:

- Rate limiting.
- Registro real en `AuditLog`.
- Rotacion/revocacion persistente de refresh tokens.
- Politicas de almacenamiento para evidencias.
- Tests automatizados para endpoints principales.

## Integracion con Frontend

El frontend debe apuntar a:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

El backend debe permitir ese origen en:

```env
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
```

Reportes locales:

```env
REPORTS_STORAGE_DIR="uploads/reports"
```

## Troubleshooting

### Prisma no conecta con Supabase

Revisa:

- `DATABASE_URL` y `DIRECT_URL`.
- Password de Supabase.
- Que la URL tenga `sslmode=require` si Supabase la entrega asi.
- Que hayas ejecutado `npm run prisma:generate`.

### Error de CORS

Agrega la URL del frontend en `CORS_ORIGIN`.

### Login falla

Ejecuta:

```bash
npm run prisma:seed
```

Luego usa las credenciales demo.

### PowerShell bloquea npm/npx

En Windows puedes usar:

```powershell
npm.cmd run dev
npx.cmd prisma validate
```

## Estado Actual

La demo backend ya soporta:

- Autenticacion JWT.
- CRUD basico de usuarios.
- CRUD basico de clientes.
- CRUD basico de tareas.
- Conexion PostgreSQL/Supabase con Prisma.
- Datos demo por seed.

Siguientes mejoras naturales:

- Formularios dinamicos reales.
- Evidencias con subida de archivos.
- Reportes PDF.
- Dashboard analytics desde endpoints dedicados.
- Tests de integracion.
