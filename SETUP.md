# TechDesk - Instalación y Configuración

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+ (o usar Supabase gratis)
- npm o yarn

## 🚀 Instalación Rápida

### 1. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar Base de Datos

#### Opción A: PostgreSQL Local
```bash
# Crear base de datos
createdb techdesk

# Actualizar DATABASE_URL en backend/.env
DATABASE_URL="postgresql://user:password@localhost:5432/techdesk?schema=public"
```

#### Opción B: Supabase (Recomendado)
1. Ir a https://supabase.com
2. Crear nuevo proyecto
3. Copiar URL de conexión PostgreSQL
4. Actualizar `DATABASE_URL` en `backend/.env`

### 3. Ejecutar Migraciones Prisma

```bash
cd backend

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio para ver BD
npm run prisma:studio
```

### 4. Crear Usuario Admin de Demostración

Opción A: Usar Prisma Studio (Visual)
```bash
npm run prisma:studio
# Crear user manualmente en la interfaz
```

Opción B: Script SQL (en el archivo seed.sql)
```sql
INSERT INTO companies (id, name, slug, "maxUsers", "subscriptionPlan") VALUES
('550e8400-e29b-41d4-a716-446655440000'::uuid, 'TechDesk Demo', 'techdesk-demo', 50, 'professional');

INSERT INTO users (id, "companyId", email, "passwordHash", "fullName", role, status) VALUES
('660e8400-e29b-41d4-a716-446655440001'::uuid, 
 '550e8400-e29b-41d4-a716-446655440000'::uuid,
 'admin@techdesk.com',
 '$2a$10$mz4qQhg4WN9/MbKxe5TJb.Y0xW7k8g7P0J9h6T5.N3q.R2D4p7j2i', -- Admin@12345
 'Admin User',
 'ADMIN',
 'ACTIVE');
```

### 5. Iniciar Servidores

Terminal 1 - Backend:
```bash
cd backend
npm run dev
# ✅ Servidor en http://localhost:3000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
# ✅ Servidor en http://localhost:5173
```

## 🔐 Credenciales de Demo

```
Email: admin@techdesk.com
Password: Admin@12345
Role: ADMIN
```

## 📦 Estructura del Proyecto

```
Seminario_01/
├── backend/              # Node.js + Express + Prisma
│   ├── src/
│   │   ├── config/       # Configuración
│   │   ├── middleware/   # JWT, autorización, errores
│   │   ├── routes/       # Endpoints API
│   │   ├── controllers/  # Lógica de requests
│   │   ├── services/     # Lógica de negocio
│   │   ├── utils/        # Utilidades (JWT, contraseñas)
│   │   └── app.js        # Aplicación Express
│   ├── prisma/
│   │   └── schema.prisma # Modelo de BD
│   └── .env              # Variables de entorno
│
├── frontend/             # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/        # Páginas (Login, Dashboard, etc)
│   │   ├── components/   # Componentes reutilizables
│   │   ├── store/        # Zustand stores
│   │   ├── services/     # Servicios API
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utilidades
│   │   ├── styles/       # CSS global
│   │   ├── App.jsx       # Router principal
│   │   └── main.jsx      # Entry point
│   └── .env              # Variables de entorno
│
└── SETUP.md              # Este archivo
```

## 🔗 Endpoints API Disponibles (Fase 1)

```
POST   /api/v1/auth/login      - Iniciar sesión
POST   /api/v1/auth/refresh    - Renovar token
POST   /api/v1/auth/logout     - Cerrar sesión
GET    /api/v1/auth/me         - Perfil del usuario
```

## 🛠️ Desarrollo

### Hot Reload
- **Backend**: Nodemon reinicia automáticamente con cambios
- **Frontend**: Vite HMR instantáneo

### Herramientas Útiles
```bash
# Backend - Abrir Prisma Studio (gestor visual de BD)
npm run prisma:studio

# Frontend - Ejecutar linter
npm run lint

# Ver migraciones pendientes
npm run prisma:migrate
```

## 📋 Roadmap de Fases

### ✅ Fase 1: Fundamentos (ACTUAL)
- [x] Estructura de carpetas
- [x] Autenticación JWT
- [x] Login y Dashboard básico
- [ ] Crear usuarios (CRUD)
- [ ] Middleware de autorización

### 🟡 Fase 2: Operaciones Core
- [ ] CRUD tareas
- [ ] CRUD formularios dinámicos
- [ ] Asignación de técnicos

### 🟡 Fase 3: Reportes & Analytics
- [ ] Upload de evidencias
- [ ] Generación de PDFs
- [ ] Estadísticas en dashboard

### 🟡 Fase 4: Escalabilidad & Deploy
- [ ] Tests unitarios
- [ ] Optimizaciones
- [ ] Deploy a Vercel + Railway

## ⚠️ Problemas Comunes

### Error: "database connection failed"
- Verificar PostgreSQL está corriendo
- Verificar DATABASE_URL en `.env`
- Ejecutar migraciones: `npm run prisma:migrate`

### Error: "Cannot find module 'zustand'"
- Ejecutar: `cd frontend && npm install`

### CORS error en login
- Verificar CORS_ORIGIN en `backend/.env`
- Debe incluir `http://localhost:5173`

### Puerto 3000/5173 en uso
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📚 Documentación Adicional

- Swagger (Fase 2): Auto-generado en `/api/v1/docs`
- Prisma Docs: https://www.prisma.io/docs/
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com/docs

## 🤝 Contribuir

Por favor sigue el patrón de estructura establecido en Fase 1 para nuevas features.

## 📄 Licencia

MIT
